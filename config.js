'use strict';

require('dotenv').config();

const TOKEN = process.env.TOKEN ? process.env.TOKEN : '';
exports.TOKEN = TOKEN;

const LIMITED_CHANNEL = process.env.CHANNEL ? process.env.CHANNEL : ''; 
exports.LIMITED_CHANNEL = LIMITED_CHANNEL;

const BOT_NAME = process.env.BOT_NAME ? process.env.BOT_NAME : 'sample-bot';
exports.BOT_NAME = BOT_NAME;

const FIRST_ATTACK = process.env.FIRST_ATTACK ? process.env.FIRST_ATTACK : '🥇';
const SECOND_ATTACK = process.env.SECOND_ATTACK ? process.env.SECOND_ATTACK : '🥈';
const THIRD_ATTACK = process.env.THIRD_ATTACK ? process.env.THIRD_ATTACK : '🥉';
exports.FIRST_ATTACK = FIRST_ATTACK;
exports.SECOND_ATTACK = SECOND_ATTACK;
exports.THIRD_ATTACK = THIRD_ATTACK;
