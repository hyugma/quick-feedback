/**
 * APIエンドポイント: GETリクエスト処理 (稼働確認用)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "API is running", message: "POSTリクエストでデータを送信してください。" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * APIエンドポイント: POSTリクエスト処理 (データ受信とスプレッドシート保存)
 */
function doPost(e) {
  var output;
  try {
    // text/plainとして送られてきたJSON文字列をパース
    var data = JSON.parse(e.postData.contents);
    
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
    
    // 成功レスポンス
    output = { success: true };
  } catch (error) {
    // 失敗レスポンス
    console.error('Error in doPost: ' + error.message);
    output = { success: false, error: error.message };
  }
  
  // JSON形式でレスポンスを返す（CORS対応）
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
