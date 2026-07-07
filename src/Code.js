/**
 * サーブレットのGETリクエスト処理
 * @param {Object} e - イベントオブジェクト
 * @returns {HtmlOutput} - index.htmlの評価結果
 */
function doGet(e) {
  // index.html ファイルを評価して HTML を生成
  var htmlOutput = HtmlService.createTemplateFromFile('index').evaluate();
  
  // モバイル端末での表示を最適化するための viewport メタタグを設定
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
  // X-Frame-Options ヘッダーを設定して iframe での埋め込みを制御（オプション）
  htmlOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  
  return htmlOutput;
}

/**
 * フロントエンドからのアンケートデータを受け取り、スプレッドシートに記録する
 * @param {Object} data - アンケートの回答データ {q1: number, q2: number, q3: number, comment: string}
 * @returns {boolean} - 処理が成功したかどうか
 */
function submitSurvey(data) {
  try {
    // スクリプトに紐づいたスプレッドシート（Active Spreadsheet）を取得
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 現在の日時を取得（タイムスタンプ）
    var timestamp = new Date();
    
    // 追加する行のデータを作成
    var rowData = [
      timestamp,
      data.q1,
      data.q2,
      data.q3,
      data.comment
    ];
    
    // スプレッドシートの末尾に行を追加
    sheet.appendRow(rowData);
    
    return true;
  } catch (error) {
    // エラー時はログに記録してフロントエンドにも例外を投げる
    console.error('Error submitting survey: ' + error.message);
    throw new Error('アンケートの送信に失敗しました。');
  }
}
