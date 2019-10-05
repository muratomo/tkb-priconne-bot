'use strict';

const {
  TOKEN,
  LIMITED_CHANNEL,
  BOT_NAME,
  FIRST_ATTACK,
  SECOND_ATTACK,
  THIRD_ATTACK
} = require('./config');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const Discord = require('discord.js');
const client = new Discord.Client();

// 凸管理モード
let isActive = false;
// 凸管理投稿ID
let attackMessageId = '';
// 待ち投稿ID
let waitingMessageId = '';
// メンバーの状況
let memberStatusMap = new Map();
// 随時編集するため、メンバー状態の投稿情報を保持
let memberStatusMessage;

// メンバーの状況投稿用テキスト生成関数
const getMembersStatusText = () => {
  let text = '>>> ';
  for (const [member, statusValues] of memberStatusMap.entries()) {
    let status = '';
    for (const value of statusValues) {
      status += `${value} `;
    }
    text += `${member} ${status}\n`;
  }
  return text;
}

// readyイベント監視
client.on('ready', () => {
  console.log('...Connected Discord');
});

// メッセージ監視
client.on('message', async (message) => {
  // botの発言は除外
  if (message.author.bot) {
    return;
  }
  // チャンネル制限を掛けている場合、チャンネルを確認
  if (LIMITED_CHANNEL.length > 0 && message.channel.name !== LIMITED_CHANNEL) {
    return;
  }

  const postedMessage = message.cleanContent.toString();
  // 凸管理モード
  if (postedMessage.startsWith(`@${BOT_NAME}`) && postedMessage.includes('凸管理')) {
    if (isActive) {
      await message.channel.send('起動中です。');
    }
    isActive = true;
    const today = moment().format('YYYY/MM/DD');
    const attackGuide = today + '\n' +
      '進捗管理を行います。\n' +
      '以下のリアクションをお願いします。\n' +
      `  - 1凸: ${FIRST_ATTACK}, 2凸:${SECOND_ATTACK}, 3凸: ${THIRD_ATTACK}`;
    const attackMessage = await message.channel.send(attackGuide);
    await attackMessage.react(FIRST_ATTACK);
    await attackMessage.react(SECOND_ATTACK);
    await attackMessage.react(THIRD_ATTACK);
    attackMessageId = attackMessage.id;
    // 待ち管理
    const waiting = '待っているボスの番号をリアクションして下さい。(例 :one:';
    const waitingRes = await message.channel.send(waiting);
    waitingMessageId = waitingRes.id;
    // メンバーステータス管理
    let memberStatus = '';
    const members = [...message.channel.members.values()].forEach((guildMember) => {
      const name = guildMember.user.username
      if (name && name !== BOT_NAME) {
        memberStatusMap.set(name, new Set());
      }
    });
    memberStatusMessage = await message.channel.send(getMembersStatusText());
  }

  if (postedMessage.startsWith(`@${BOT_NAME}`)) {
    // サービスストップ
    if (postedMessage.includes('stop') || postedMessage.includes('reset')) {
      isActive = false;
      attackMessageId = '';
      waitingMessageId = '';
      memberStatusMap = new Map();
      memberStatusMessage = null;
      await message.channel.send('リセットしました。');
    }
  }
});

// リアクション追加監視
client.on('messageReactionAdd', async (messageReaction, user) => {
  if (!isActive) {
    return;
  } else if(user.username === BOT_NAME) {
    return;
  }

  // チャンネル制限を掛けている場合、チャンネルを確認
  if (LIMITED_CHANNEL.length > 0 && messageReaction.message.channel.name !== LIMITED_CHANNEL) {
    return;
  }

  const emoji = messageReaction._emoji.name;
  const userName = user.username;
  const memberStatus = memberStatusMap.get(userName);

  // 凸管理
  if (messageReaction.message.id === attackMessageId) {
    if (emoji === FIRST_ATTACK) {
      memberStatus.add(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else if (emoji === SECOND_ATTACK && memberStatus.has(FIRST_ATTACK)) {
      memberStatus.add(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else if (emoji === THIRD_ATTACK && memberStatus.has(SECOND_ATTACK)) {
      memberStatus.add(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else {
      return;
    }
    await memberStatusMessage.edit(getMembersStatusText());
  }

  // 待ち管理
  if (messageReaction.message.id === waitingMessageId) {
    // 数字の制限が付けられるならつける
    memberStatus.add(emoji);
    memberStatusMap.set(userName, memberStatus);
    await memberStatusMessage.edit(getMembersStatusText());
  }
});

// リアクション削除監視
client.on('messageReactionRemove', async (messageReaction, user) => {
  if (!isActive) {
    return;
  } else if(user.username === BOT_NAME) {
    return;
  }

  // チャンネル制限を掛けている場合、チャンネルを確認
  if (LIMITED_CHANNEL.length > 0 && messageReaction.message.channel.name !== LIMITED_CHANNEL) {
    return;
  }

  const emoji = messageReaction._emoji.name;
  const userName = user.username;
  const memberStatus = memberStatusMap.get(userName);

  // 凸管理
  if (messageReaction.message.id === attackMessageId) {
    if (emoji === FIRST_ATTACK && !memberStatus.has(SECOND_ATTACK) && !memberStatus.has(THIRD_ATTACK)) {
      memberStatus.delete(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else if (emoji === SECOND_ATTACK && !memberStatus.has(THIRD_ATTACK)) {
      memberStatus.delete(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else if (emoji === THIRD_ATTACK) {
      memberStatus.delete(emoji);
      memberStatusMap.set(userName, memberStatus);
    } else {
      return;
    }
    await memberStatusMessage.edit(getMembersStatusText());
  }

  // 待ち管理
  if (messageReaction.message.id === waitingMessageId) {
    // 数字の制限が付けられるならつける
    if (memberStatus.has(emoji)) {
      memberStatus.delete(emoji);
      memberStatusMap.set(userName, memberStatus);
      await memberStatusMessage.edit(getMembersStatusText());
    }
  }
});

client.login(TOKEN);
