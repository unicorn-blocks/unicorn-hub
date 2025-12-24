// 改进版的Google Apps Script代码
// 基于你提供的代码进行优化

const SPREADSHEET_ID = "1B6HehcxI3-g_Zq_UQWmnPvHzhylzapfM6tiLWPBVWw";
const SHEET_NAME = "UnicornBlocksEmail"; // 确保这个工作表存在，或改为"Sheet1"

function doPost(e) {
  try {
    // 打开指定的电子表格
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，创建一个新的
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // 添加表头
      sheet.getRange(1, 1, 1, 5).setValues([['Email', 'Source', 'Note', 'Timestamp', 'Status']]);
      // 设置表头格式
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
    }
    
    // 获取POST参数
    const p = (e && e.parameter) ? e.parameter : {};
    const email = (p.email || "").toString().trim();
    const source = (p.source || "unknown").toString().trim();
    const note = (p.note || "").toString().trim();
    
    // 验证邮箱
    if (!email) {
      return HtmlService.createHtmlOutput("ERROR: No email provided");
    }
    
    // 检查邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return HtmlService.createHtmlOutput("ERROR: Invalid email format");
    }
    
    // 检查是否已存在该邮箱
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) { // 从第2行开始（跳过表头）
      if (data[i][0] && data[i][0].toString().toLowerCase() === email.toLowerCase()) {
        // 邮箱已存在，更新时间戳和来源
        sheet.getRange(i + 1, 2).setValue(source + ' (updated)');
        sheet.getRange(i + 1, 4).setValue(Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));
        console.log('邮箱已存在，已更新:', email);
        return HtmlService.createHtmlOutput("OK");
      }
    }
    
    // 添加新邮箱记录
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([email, source, note, timestamp, 'active']);
    
    console.log('新邮箱已添加:', email);
    return HtmlService.createHtmlOutput("OK");
    
  } catch (err) {
    console.error('处理POST请求时出错:', err);
    return HtmlService.createHtmlOutput("ERROR: " + err.toString());
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("OK");
}

// 测试函数
function testEmailSubmission() {
  const testEvent = {
    parameter: {
      email: 'test@example.com',
      source: 'test',
      note: 'test-submission'
    }
  };
  
  const result = doPost(testEvent);
  console.log('测试结果:', result.getContent());
}

// 获取所有邮箱数据
function getAllEmails() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('工作表不存在:', SHEET_NAME);
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    console.log('所有邮箱数据:');
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
    }
    
    return data;
  } catch (error) {
    console.error('获取邮箱数据时出错:', error);
    return [];
  }
}