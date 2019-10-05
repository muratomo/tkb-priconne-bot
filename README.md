# tkb-priconne-bot

## 始め方

1. Botユーザー準備
    1. `https://discordapp.com/developers/applications/` へアクセス
    2. `NewApplication`からBot作成
    3. 左側のサイドメニューから`Bot`をクリック
    4. `Add Bot`を押して作成
    5. `TOKEN`セクションの`Copy`からTOKENをコピー
2. Bot招待
    1. サイドメニューの`OAuth2`をクリック
    2. `SCOPES`セクションから`bot`のチェックボックスを選択
    3. 表示されるURLをコピーしてアクセス
    4. 招待したいサーバを選択
3. Node.jsの準備
    1. いれます。
4. 環境変数のセット
    1. このプロジェクトディレクトリにある`.env.sample`のように、`env`ファイルを作成します
    2. 先ほどコピーした`TOKEN`を`.env`に貼り付けます
    3. また作成したBOTの名前を`BOT_NAME`にセットします
    4. 以下項目は必要に応じて同様にカスタマイズできます
        * `LIMITED_CHANNEL`: botを動かすチャンネルを制限します
        * `FIRST_ATTACK`: 1凸目の絵文字
        * `SECOND_ATTACK`: 2凸目の絵文字
        * `THIRD_ATTACK`: 3凸目の絵文字
5. 以下コマンドを実行

```
npm install
npm run start
```

6. discordにて `@ボット名 凸管理` と送ると実行できます
7. リセットしたいときは、 `@ボット名 stop` または `@ボット名 reset` にて状態をリセットします