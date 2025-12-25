/**
 * Google Apps Script - 订单数据处理器
 * 处理来自 Unicorn Blocks 应用的订单数据和邮件通知
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { email, source, note } = data;
    
    console.log('收到请求:', { email, source, note });
    
    // 获取当前活动的电子表格
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // 根据不同的数据类型处理
    switch (source) {
      case 'order-data-storage':
        handleOrderCreation(spreadsheet, email, note);
        break;
        
      case 'order-status-update':
        handleOrderUpdate(spreadsheet, email, note);
        break;
        
      case 'admin-order-notification':
        handleAdminNotification(spreadsheet, email, note);
        break;
        
      case 'admin-refund-notification':
        handleRefundNotification(spreadsheet, email, note);
        break;
        
      case 'refund-notification':
        handleCustomerRefund(spreadsheet, email, note);
        break;
        
      case 'stripe-payment-confirmed':
        handlePaymentConfirmation(spreadsheet, email, note);
        break;
        
      default:
        // 处理其他邮件通知
        handleEmailNotification(spreadsheet, email, source, note);
        break;
    }
    
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return ContentService.createTextOutput('ERROR: ' + error.toString());
  }
}

/**
 * 处理订单创建
 */
function handleOrderCreation(spreadsheet, email, note) {
  const parts = note.split('|');
  if (parts[0] !== 'ORDER_CREATE') return;
  
  const [, orderId, customerEmail, amount, currency, paymentType, status, createdAt, sessionId] = parts;
  
  // 获取或创建订单表
  let ordersSheet = spreadsheet.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = spreadsheet.insertSheet('Orders');
    // 添加表头
    ordersSheet.getRange(1, 1, 1, 10).setValues([[
      'Order ID', 'Customer Email', 'Amount', 'Currency', 'Payment Type', 
      'Status', 'Created At', 'Updated At', 'Session ID', 'Notes'
    ]]);
  }
  
  // 添加订单数据
  ordersSheet.appendRow([
    orderId,
    customerEmail,
    parseFloat(amount),
    currency,
    paymentType,
    status,
    createdAt,
    createdAt,
    sessionId,
    '订单已创建'
  ]);
  
  console.log('订单已记录:', orderId);
}

/**
 * 处理订单状态更新
 */
function handleOrderUpdate(spreadsheet, email, note) {
  const parts = note.split('|');
  if (parts[0] !== 'ORDER_UPDATE') return;
  
  const [, orderId, status, updatedAt, additionalDataJson] = parts;
  
  // 获取订单表
  const ordersSheet = spreadsheet.getSheetByName('Orders');
  if (!ordersSheet) return;
  
  // 查找订单行
  const data = ordersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      // 更新状态和时间
      ordersSheet.getRange(i + 1, 6).setValue(status); // Status
      ordersSheet.getRange(i + 1, 8).setValue(updatedAt); // Updated At
      
      // 添加额外信息到备注
      let additionalInfo = '';
      try {
        const additionalData = JSON.parse(additionalDataJson);
        additionalInfo = Object.entries(additionalData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } catch (e) {
        additionalInfo = additionalDataJson;
      }
      
      ordersSheet.getRange(i + 1, 10).setValue(`状态更新为: ${status}. ${additionalInfo}`);
      break;
    }
  }
  
  console.log('订单状态已更新:', orderId, status);
}

/**
 * 处理管理员通知
 */
function handleAdminNotification(spreadsheet, email, note) {
  // 获取或创建管理员通知表
  let adminSheet = spreadsheet.getSheetByName('Admin Notifications');
  if (!adminSheet) {
    adminSheet = spreadsheet.insertSheet('Admin Notifications');
    adminSheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Type', 'Email', 'Message'
    ]]);
  }
  
  adminSheet.appendRow([
    new Date().toISOString(),
    'Order Notification',
    email,
    note
  ]);
  
  console.log('管理员通知已记录');
}

/**
 * 处理退款通知
 */
function handleRefundNotification(spreadsheet, email, note) {
  // 获取或创建退款表
  let refundsSheet = spreadsheet.getSheetByName('Refunds');
  if (!refundsSheet) {
    refundsSheet = spreadsheet.insertSheet('Refunds');
    refundsSheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp', 'Type', 'Email', 'Order ID', 'Amount', 'Message'
    ]]);
  }
  
  const parts = note.split('|');
  const orderId = parts[1] || 'N/A';
  const amount = parts[3] || 'N/A';
  
  refundsSheet.appendRow([
    new Date().toISOString(),
    'Refund',
    email,
    orderId,
    amount,
    note
  ]);
  
  console.log('退款通知已记录');
}

/**
 * 处理客户退款确认
 */
function handleCustomerRefund(spreadsheet, email, note) {
  handleRefundNotification(spreadsheet, email, note);
}

/**
 * 处理支付确认
 */
function handlePaymentConfirmation(spreadsheet, email, note) {
  // 获取或创建支付确认表
  let paymentsSheet = spreadsheet.getSheetByName('Payment Confirmations');
  if (!paymentsSheet) {
    paymentsSheet = spreadsheet.insertSheet('Payment Confirmations');
    paymentsSheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Customer Email', 'Message', 'Status'
    ]]);
  }
  
  paymentsSheet.appendRow([
    new Date().toISOString(),
    email,
    note,
    'Confirmed'
  ]);
  
  console.log('支付确认已记录');
}

/**
 * 处理其他邮件通知
 */
function handleEmailNotification(spreadsheet, email, source, note) {
  // 获取或创建邮件通知表
  let emailSheet = spreadsheet.getSheetByName('Email Notifications');
  if (!emailSheet) {
    emailSheet = spreadsheet.insertSheet('Email Notifications');
    emailSheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Email', 'Source', 'Message'
    ]]);
  }
  
  emailSheet.appendRow([
    new Date().toISOString(),
    email,
    source,
    note
  ]);
  
  console.log('邮件通知已记录:', source);
}

/**
 * 测试函数
 */
function testOrderCreation() {
  const testData = {
    email: 'orders@system.internal',
    source: 'order-data-storage',
    note: 'ORDER_CREATE|order_123456|test@example.com|5.00|USD|stripe|pending|2023-12-26T10:00:00.000Z|cs_test_123'
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  return doPost(e);
}