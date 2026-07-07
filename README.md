# Quick Feedback Survey

QRコードなどからアクセスして匿名で回答できる簡易アンケート用Webアプリケーションです。バックエンドにはGoogle Apps Script (GAS) を採用し、フロントエンドはモバイル端末からの操作に最適化されたシンプルなHTML/CSS/JS構成となっています。

## 特徴 (Features)

*   **モバイルファーストなデザイン**: レスポンシブ対応のシンプルなUI。
*   **直感的な星評価**: CSSのみで実装された軽量かつタップしやすい5段階評価システム。
*   **重複回答の防止**: ブラウザの `localStorage` を利用し、一度回答した端末からは再送信できないように制御。
*   **GASバックエンド**: 集まったデータは紐付いたGoogle スプレッドシートにリアルタイムで自動記録されます。
*   **CI/CD対応**: GitHub Actionsを利用して、`main` ブランチへのプッシュ時に自動的にGAS環境へデプロイされます。

## ディレクトリ構成

```
quick-feedback/
├── src/
│   ├── Code.js        # GASのバックエンド処理（doGet, submitSurvey）
│   └── index.html     # フロントエンド（HTML / CSS / JavaScript）
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions設定ファイル
├── package.json       # プロジェクト情報と依存関係（clasp等）
└── .clasp.json.sample # claspの設定ファイル（ローカル開発時のテンプレート）
```

## セットアップ手順 (Setup Instructions)

### 1. Google スプレッドシートと GAS プロジェクトの準備

1.  Google ドライブ上で新規スプレッドシートを作成し、1行目に任意のヘッダー（例: `タイムスタンプ`, `サービスの質`, `雰囲気`, `コスパ`, `コメント`）を設定します。
2.  メニューから **「拡張機能」>「Apps Script」** を選択し、エディタを開きます。
3.  エディタのURLから **スクリプトID** をコピーします。（`https://script.google.com/home/projects/【スクリプトID】/edit`）
4.  GASエディタ右上の **「デプロイ」>「新しいデプロイ」** から、種類「ウェブアプリ」を選択して初期デプロイを行います。
    *   **アクセスできるユーザー**: `全員`（匿名回答を許可するため）

### 2. GitHub Actions (自動デプロイ) の設定

1.  ローカルのターミナルで以下のコマンドを実行し、Googleアカウントを認証します。
    ```bash
    npx @google/clasp login
    ```
2.  認証成功後、ホームディレクトリ（`~/.clasprc.json`）に生成される認証情報ファイルの中身をすべてコピーします。
3.  GitHubのこのリポジトリの **Settings > Secrets and variables > Actions** に移動し、以下の2つの **「New repository secret」** を作成します。
    *   `CLASPRC_JSON`: 先ほどコピーした `.clasprc.json` の中身を貼り付けます。
    *   `SCRIPT_ID`: 手順1-3でコピーした **スクリプトID** を貼り付けます。

これで準備完了です。以降、`main` ブランチに変更を Push すると、GitHub Actionsが自動的に最新のコードをGASへ反映します。

## 開発と実行 (Development)

ローカルで手動プッシュする場合は、テンプレート `.clasp.json.sample` を `.clasp.json` にリネーム（またはコピー）し、`scriptId` を書き換えてから使用してください。（`.clasp.json` は Git で無視されるよう設定済みです）

```bash
cp .clasp.json.sample .clasp.json
# .clasp.json の "YOUR_SCRIPT_ID_HERE" を実際のスクリプトIDに書き換える

npm install
npx clasp push
```

## 動作確認 (Verification)

構築した環境が正しく動作するかは、以下の手順で確認できます。

1. **GitHub Actions のデプロイ確認**
   - GitHubリポジトリの **「Actions」** タブを開き、最新のワークフローが緑色のチェックマーク（✅）で成功しているか確認します。
2. **Webアプリの表示確認**
   - 発行されたウェブアプリのURL（`https://script.google.com/macros/s/.../exec`）をブラウザで開きます。（GASエディタの「デプロイを管理」からURLを再取得可能）
   - スマートフォン等からアクセスし、レイアウトが崩れていないか確認します。
3. **データ送信とスプレッドシートの記録確認**
   - ブラウザ上で星評価とコメントを入力し、「送信する」ボタンを押します。
   - 「回答済みです」画面に切り替わることを確認後、紐づいているGoogleスプレッドシートを開き、新しい行にデータが追記されていることを確認します。
4. **重複回答防止機能のテスト**
   - 送信完了画面のままブラウザを再読み込み（リロード）し、再度アンケートフォームではなく「回答済みです」のメッセージが表示されれば正常です。

## ライセンス

MIT License
