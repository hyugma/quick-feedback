/**
 * APIエンドポイント: GETリクエスト処理 (質問の動的取得)
 * スプレッドシートの1行目（ヘッダー）を読み込み、質問リストを返します。
 */
function doGet(e) {
  var output;
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastCol = sheet.getLastColumn();
    
    // ヘッダーが設定されていない場合のフォールバック
    if (lastCol < 3) {
      output = { questions: ["サービスの質はいかがでしたか？", "お店の雰囲気はいかがでしたか？", "コストパフォーマンスはいかがでしたか？"] };
    } else {
      // 1行目のデータをすべて取得
      var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      
      // 1列目(タイムスタンプ)と最終列(コメント)を除外して質問リストを作成
      var questions = [];
      for (var i = 1; i < headers.length - 1; i++) {
        questions.push(headers[i]);
      }
      
      output = { questions: questions };
    }
  } catch (error) {
    console.error('Error in doGet: ' + error.message);
    output = { error: error.message };
  }

  // JSONPリクエストへの対応（Google Apps Scriptがリダイレクトした際に安全に処理するため）
  // 実際には今回CORSで直接Fetch(GET)しますが、念のため標準的なCORSヘッダーを付与するContentServiceを使用
  return ContentService.createTextOutput(JSON.stringify(output))
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
    
    // 追加する行のデータを作成 (タイムスタンプ + 各質問の回答配列 + コメント)
    var rowData = [timestamp];
    
    // 回答配列を展開して追加
    if (data.answers && Array.isArray(data.answers)) {
      for (var i = 0; i < data.answers.length; i++) {
        rowData.push(data.answers[i]);
      }
    }
    
    // コメントを追加
    rowData.push(data.comment || '');
    
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
