# Quick Feedback Survey

QRコードなどからアクセスして匿名で回答できる簡易アンケート用Webアプリケーションです。
**画面は GitHub Pages で高速に配信し、バックエンド（データの保存）は Google Apps Script (GAS) のAPIとして動作する** セキュアでモダンな構成になっています。これにより、GAS特有の「警告バー」が表示されないスマートな独自URLでの公開が可能です。

## 特徴 (Features)

*   **完全動的なアンケート生成**: スプレッドシートの1行目（ヘッダー）を書き換えるだけで、プログラミング不要で質問内容や質問の数を自由に変更できます。
*   **警告バーなし・高速なレスポンス**: GitHub Pagesを利用することで、GAS単体でホスティングした際に出る警告バーを排除。
*   **モバイルファーストなデザイン**: レスポンシブ対応のシンプルなUI。
*   **直感的な星評価**: CSSのみで実装された軽量かつタップしやすい5段階評価システム。
*   **重複回答の防止**: ブラウザの `localStorage` を利用し、一度回答した端末からは再送信できないように制御。
*   **GASバックエンドAPI**: フロントエンドから `fetch` で送信されたデータは、紐付いたGoogle スプレッドシートにリアルタイムで自動記録されます。
*   **CI/CD対応**: GitHub Actionsを利用して、`main` ブランチへのプッシュ時に自動的にGAS環境（API）がデプロイされます。

## ディレクトリ構成

```
quick-feedback/
├── docs/
│   └── index.html     # フロントエンド（GitHub Pages 公開用HTML / CSS / JS）
├── src/
│   ├── Code.js        # GASのバックエンドAPI（doPostでデータを受信しスプレッドシートに追記）
│   └── appsscript.json# GASの設定ファイル
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions設定ファイル（GAS APIの自動デプロイ）
├── package.json       # プロジェクト情報と依存関係（clasp等）
└── .clasp.json.sample # claspの設定ファイル（ローカル開発時のテンプレート）
```

## セットアップ手順 (Setup Instructions)

### 1. バックエンド（Google スプレッドシートと GAS）の準備

1.  Google ドライブ上で新規スプレッドシートを作成し、1行目に任意のヘッダー（例: `タイムスタンプ`, `サービスの質`, `雰囲気`, `コスパ`, `コメント`）を設定します。
2.  メニューから **「拡張機能」>「Apps Script」** を選択し、エディタを開きます。
3.  [Google Apps Script のユーザー設定](https://script.google.com/home/usersettings) にアクセスし、**「Google Apps Script API」** をオンにします。（※claspからの自動デプロイに必須です）
4.  エディタのURLから **スクリプトID** をコピーします。（`https://script.google.com/home/projects/【スクリプトID】/edit`）
5.  GASエディタ右上の **「デプロイ」>「新しいデプロイ」** から、種類「ウェブアプリ」を選択して初期デプロイを行います。
    *   **アクセスできるユーザー**: `全員`（匿名からのAPIリクエストを許可するため）
6.  表示された **「ウェブアプリのURL（`/exec` で終わるURL）」** をコピーします。

### 2. フロントエンド（GitHub Pages）の設定

GitHub Actions を利用して、自動的にアンケート画面が生成・公開されます。

1. GitHubのこのリポジトリの **Settings > Secrets and variables > Actions** を開きます。
2. **「New repository secret」** をクリックし、以下のシークレットを作成します。
   * `GAS_WEBAPP_URL`: 手順1-6でコピーした **ウェブアプリのURL** を貼り付けます。
3. 次に、左側のメニューから **「Pages」** をクリックします。
4. **Build and deployment** の Source を `Deploy from a branch` から **「GitHub Actions」** に変更します。

### 3. GitHub Actions (GAS APIの自動デプロイ) の設定

1.  ローカルのターミナルで `npx @google/clasp login` を実行し、Googleアカウントを認証します。
2.  ホームディレクトリ（`~/.clasprc.json`）に生成される認証情報ファイルの中身をすべてコピーします。
3.  GitHubの **Settings > Secrets and variables > Actions** に移動し、以下の2つの **「New repository secret」** を作成します。
    *   `CLASPRC_JSON`: 先ほどコピーした `.clasprc.json` の中身を貼り付けます。
    *   `SCRIPT_ID`: 手順1-4でコピーした **スクリプトID** を貼り付けます。

これで準備完了です。以降、`main` ブランチに Push すると以下の2つが自動的に実行されます。
* **バックエンド**: `src/` 以下のGASコードが自動デプロイされます。
* **フロントエンド**: `docs/index.html` 内にURLが埋め込まれ、GitHub Pages に自動公開されます。

## 動作確認 (Verification)

1. **GitHub Pagesの表示確認**
   - Settings > Pages で発行されたURLにアクセスし、アンケート画面が崩れずに表示されるか確認します。
2. **データ送信とスプレッドシートの記録確認**
   - 画面上で評価とコメントを入力し「送信する」を押します。
   - 「回答済みです」画面が出たら、紐づいているGoogleスプレッドシートを開き、データが追記されていることを確認します。

## QRコードの生成方法

アンケートへ誘導するためのQRコードは、**GitHub Pagesで公開されたURL**（`https://[ユーザー名].github.io/...`）を使って作成してください。

1. **コマンドツール (qrencode)**
   - Mac環境なら `brew install qrencode` 後、`qrencode -o qrcode.png "公開用URL"` のコマンド一発で作成できます。
2. **ブラウザの標準機能（最も手軽）**
   - Google Chrome や Edge で公開用URLを開き、右クリックメニューから「このページのQRコードを作成」を選ぶだけでダウンロードできます。
3. **Webサービスの利用**
   - [QRのススメ](https://qr.quel.jp/) や [Adobe Express](https://www.adobe.com/jp/express/feature/image/qr-code-generator) 等のサイトを利用すると、色やロゴを入れるなどのカスタマイズが可能です。

## よくあるトラブルと解決策 (Troubleshooting)

### 1. 「通信に失敗しました」またはCORSエラーが出る
GitHub PagesからGASへ送信する際、GASのURLが間違っているか、GAS側のデプロイが正しく行われていない可能性があります。
GitHubの **Settings > Secrets and variables > Actions** に登録した `GAS_WEBAPP_URL` が正しいか確認し、GAS側で「アクセスできるユーザー：全員」としてデプロイされているか見直してください。

また、`src/Code.js` を変更した場合は、単に `clasp push` するだけでなく、以下のコマンドでAPIのバージョンを更新しないと本番環境に反映されません。
```bash
npx clasp deploy -i 【デプロイID】 -d "API更新"
```

### 2. 「無題のプロジェクト (Unverified) needs your permission...」という警告画面が出る
スクリプトにスプレッドシートへの書き込み権限を与えるための、開発者の初回実行時のみ表示されるセキュリティ画面です。（一般ユーザーには表示されません）
1. `REVIEW PERMISSIONS` をクリックし、自身のアカウントを選択。
2. 左下の **「詳細 (Advanced)」** をクリック。
3. 一番下の **「無題のプロジェクト（安全ではないページ）に移動」** をクリックし、**「許可 (Allow)」** します。

## アンケートの受付を終了・停止する方法

イベントや期間が終了し、これ以上アンケートの回答を受け付けたくない場合は、以下の手順でシステムを停止できます。

1. **GASのAPIを停止する（データの受付停止）**
   - GASエディタを開き、右上の **「デプロイ」>「デプロイを管理」** をクリックします。
   - 現在のデプロイ（ウェブアプリ）の右側にあるアーカイブアイコン（またはゴミ箱アイコン）をクリックしてデプロイをアーカイブ（削除）します。
   - これで、誰かがアクセスしようとしてもAPIがエラーを返し、スプレッドシートに書き込まれなくなります。

2. **GitHub Pagesを非公開にする（画面のアクセス停止）**
   - GitHubリポジトリの **Settings > Pages** を開きます。
   - 画面右上にある **「...」** メニューをクリックし、**「Unpublish site」** を選択します。
   - これで、アンケート画面のURL（`hyugma.github.io/...`）にアクセスしても 404 Not Found になり、画面が表示されなくなります。

## ライセンス

MIT License
