/**
 * Google Apps Script - PaidCoupon 表处理器
 * 处理来自 Stripe webhook 的支付用户数据
 * 
 * 表头: Email | Units | Amount_Paid | State | Created_at | Stripe_Session_ID | Source | Zipcode
 */

const SPREADSHEET_ID = "xxx";
const PAID_COUPON_SHEET_NAME = "PaidCoupon"; // 支付用户表

function doPost(e) {
  try {
    // 解析请求数据
    const data = JSON.parse(e.postData.contents);
    const { email, units, amount_paid, state, stripe_session_id, source, zipcode } = data;
    
    console.log('收到PaidCoupon数据:', { email, units, amount_paid, state, stripe_session_id, source, zipcode });
    
    // 获取或创建 PaidCoupon 表
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(PAID_COUPON_SHEET_NAME);
    
    if (!sheet) {
      // 创建新表
      sheet = ss.insertSheet(PAID_COUPON_SHEET_NAME);
      
      // 添加表头
      const headers = ['Email', 'Units', 'Amount_Paid', 'State', 'Created_at', 'Stripe_Session_ID', 'Source', 'Zipcode'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 设置表头格式
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285F4');
      headerRange.setFontColor('#FFFFFF');
      
      console.log('已创建新的PaidCoupon表');
    }
    
    // 验证邮箱
    if (!email || !isValidEmail(email)) {
      return ContentService.createTextOutput('ERROR: Invalid email');
    }
    
    // 检查邮箱是否已存在
    const data_rows = sheet.getDataRange().getValues();
    for (let i = 1; i < data_rows.length; i++) {
      if (data_rows[i][0] && data_rows[i][0].toString().toLowerCase() === email.toLowerCase()) {
        // 邮箱已存在，更新记录
        sheet.getRange(i + 1, 2).setValue(units || '');
        sheet.getRange(i + 1, 3).setValue(amount_paid || '');
        sheet.getRange(i + 1, 4).setValue(state || '');
        sheet.getRange(i + 1, 5).setValue(Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));
        sheet.getRange(i + 1, 6).setValue(stripe_session_id || '');
        sheet.getRange(i + 1, 7).setValue(source || '');
        sheet.getRange(i + 1, 8).setValue(zipcode || '');
        
        console.log('PaidCoupon记录已更新:', email);
        return ContentService.createTextOutput('OK');
      }
    }
    
    // 添加新记录
    const timestamp = Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([
      email,
      units || '',
      amount_paid || '',
      state || '',
      timestamp,
      stripe_session_id || '',
      source || 'stripe',
      zipcode || ''
    ]);
    
    console.log('新PaidCoupon记录已添加:', email);
    return ContentService.createTextOutput('OK');
    
  } catch (err) {
    console.error('处理PaidCoupon请求时出错:', err);
    return ContentService.createTextOutput('ERROR: ' + err.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput('OK');
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 测试函数 - 在Google Apps Script编辑器中运行
 */
function testPaidCouponSubmission() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        email: 'test@example.com',
        units: 1,
        amount_paid: 5.00,
        state: 'CA',
        stripe_session_id: 'cs_test_123456',
        source: 'stripe',
        zipcode: '94105'
      })
    }
  };
  
  const result = doPost(testEvent);
  console.log('测试结果:', result.getContent());
}

/**
 * 获取所有PaidCoupon数据
 */
function getAllPaidCoupons() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(PAID_COUPON_SHEET_NAME);
    
    if (!sheet) {
      console.log('PaidCoupon表不存在');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    console.log('所有PaidCoupon数据:');
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
    }
    
    return data;
  } catch (error) {
    console.error('获取PaidCoupon数据时出错:', error);
    return [];
  }
}

/**
 * 诊断函数 - 检查 Google Sheet 的状态
 * 用于排查问题
 */
function diagnoseSheet() {
  try {
    console.log('========== 诊断开始 ==========');
    
    // 1. 检查 Spreadsheet 是否存在
    console.log('\n1. 检查 Spreadsheet...');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet 已打开，ID:', SPREADSHEET_ID);
    
    // 2. 列出所有表
    console.log('\n2. 所有表列表:');
    const sheets = ss.getSheets();
    console.log('总表数:', sheets.length);
    for (let i = 0; i < sheets.length; i++) {
      console.log(`  表 ${i + 1}: "${sheets[i].getName()}"`);
    }
    
    // 3. 检查 PaidCoupon 表
    console.log('\n3. 检查 PaidCoupon 表...');
    const sheet = ss.getSheetByName(PAID_COUPON_SHEET_NAME);
    if (sheet) {
      console.log('✅ PaidCoupon 表存在');
      console.log('  行数:', sheet.getLastRow());
      console.log('  列数:', sheet.getLastColumn());
      
      // 获取表头
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      console.log('  表头:', headers);
      
      // 获取数据行数
      const dataRows = sheet.getLastRow() - 1;
      console.log('  数据行数:', dataRows);
      
      if (dataRows > 0) {
        console.log('  最后一行数据:', sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn()).getValues()[0]);
      }
    } else {
      console.log('❌ PaidCoupon 表不存在');
    }
    
    // 4. 检查权限
    console.log('\n4. 检查权限...');
    try {
      const testSheet = ss.getSheets()[0];
      testSheet.getRange(1, 1).getValue();
      console.log('✅ 有读取权限');
    } catch (e) {
      console.log('❌ 无读取权限:', e.toString());
    }
    
    console.log('\n========== 诊断完成 ==========');
    
  } catch (error) {
    console.error('诊断出错:', error);
  }
}

/**
 * 根据ZIP码自动填充State（州/省）
 * 使用 Zippopotam.us API 查询ZIP码对应的州
 * 
 * 使用方法：
 * 1. 在Google Sheet中手动运行此函数
 * 2. 或者在doPost中自动调用
 */
function fillStateFromZip() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const zip = data[i][7];   // H 列 Zipcode
    const state = data[i][3]; // D 列 State
    
    // 如果ZIP码存在但State为空，则查询并填充
    if (zip && !state) {
      try {
        console.log(`正在查询ZIP码: ${zip}`);
        
        // 调用Zippopotam.us API
        const res = UrlFetchApp.fetch(`https://api.zippopotam.us/us/${zip}`);
        const json = JSON.parse(res.getContentText());
        
        // 提取州缩写
        const stateAbbr = json.places[0]["state abbreviation"];
        
        // 写入State列
        sheet.getRange(i + 1, 4).setValue(stateAbbr);
        console.log(`ZIP码 ${zip} 对应州: ${stateAbbr}`);
        
      } catch (e) {
        // 忽略无效的ZIP码或API错误
        console.log(`无法查询ZIP码 ${zip}: ${e.toString()}`);
      }
    }
  }
  
  console.log('State填充完成');
}
