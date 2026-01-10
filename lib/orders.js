/**
 * 订单管理模块 (CommonJS for Netlify Functions)
 * 使用 Google Sheets 存储订单数据（通过 submitOrderLogToGoogleSheets 写入）
 */

const { submitOrderLogToGoogleSheets } = require('./googleSheets');

async function createOrder(orderData) {
  try {
    const {
      stripeCheckoutSessionId,
      amount,
      currency,
      paymentType,
      customerEmail,
      customerFirstName,
      customerLastName,
      shippingCountry,
      shippingCity,
      shippingAddress,
      language
    } = orderData;

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const order = {
      id: orderId,
      stripeCheckoutSessionId,
      amount,
      currency,
      paymentType,
      status: 'pending',
      customerEmail,
      customerFirstName,
      customerLastName,
      shippingCountry,
      shippingCity,
      shippingAddress,
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: null
    };

    const orderMessage =
      `ORDER_CREATE|${orderId}|${customerEmail}|${amount}|${currency}|${paymentType}|pending|${new Date().toISOString()}|${stripeCheckoutSessionId || 'N/A'}`;

    // ✅ 修复：传入正确的 message
    await submitOrderLogToGoogleSheets({
      channel: 'order-create',
      message: orderMessage
    });

    console.log('订单已创建并存储:', order);
    return order;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
}

async function updateOrderStatus(orderId, status, additionalData = {}) {
  try {
    const timestamp = new Date().toISOString();

    const updatedOrder = {
      id: orderId,
      status,
      updatedAt: timestamp,
      ...additionalData
    };

    if (status === 'paid') {
      updatedOrder.paidAt = timestamp;
    }

    const updateMessage =
      `ORDER_UPDATE|${orderId}|${status}|${timestamp}|${JSON.stringify(additionalData)}`;

    // ✅ 修复：传入正确的 message
    await submitOrderLogToGoogleSheets({
      channel: 'order-status-update',
      message: updateMessage
    });

    console.log('订单状态已更新并存储:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('更新订单状态失败:', error);
    throw error;
  }
}

async function getOrder(orderId) {
  try {
    const queryMessage = `ORDER_QUERY|${orderId}|${new Date().toISOString()}`;

    await submitOrderLogToGoogleSheets({
      channel: 'order-query-log',
      message: queryMessage
    });

    console.log('查询订单:', orderId);
    return {
      id: orderId,
      note: '订单数据已存储在 Google Sheets 中，请查看管理后台'
    };
  } catch (error) {
    console.error('查询订单失败:', error);
    throw error;
  }
}

async function getOrderBySessionId(sessionId) {
  try {
    const queryMessage = `ORDER_QUERY_BY_SESSION|${sessionId}|${new Date().toISOString()}`;

    await submitOrderLogToGoogleSheets({
      channel: 'order-session-query-log',
      message: queryMessage
    });

    console.log('通过 Session ID 查询订单:', sessionId);
    return {
      stripeCheckoutSessionId: sessionId,
      note: '订单数据已存储在 Google Sheets 中，请查看管理后台'
    };
  } catch (error) {
    console.error('查询订单失败:', error);
    throw error;
  }
}

module.exports = {
  createOrder,
  updateOrderStatus,
  getOrder,
  getOrderBySessionId
};
