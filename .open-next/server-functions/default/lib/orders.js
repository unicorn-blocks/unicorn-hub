/**
 * 订单管理模块
 * 使用 Google Sheets 存储订单数据
 */

import { submitEmailToGoogleSheets } from './googleSheets'

/**
 * 创建订单记录
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} 创建的订单
 */
export async function createOrder(orderData) {
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
    } = orderData

    // 生成订单 ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 准备订单数据
    const order = {
      id: orderId,
      stripeCheckoutSessionId,
      amount,
      currency,
      paymentType,
      status: 'pending', // pending, paid, failed, refunded
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
    }

    // 存储到 Google Sheets
    const orderMessage = `ORDER_CREATE|${orderId}|${customerEmail}|${amount}|${currency}|${paymentType}|pending|${new Date().toISOString()}|${stripeCheckoutSessionId || 'N/A'}`
    
    await submitEmailToGoogleSheets(
      'orders@system.internal', // 系统内部邮箱，用于标识订单数据
      'order-data-storage',
      orderMessage
    )

    console.log('订单已创建并存储:', order)
    return order
  } catch (error) {
    console.error('创建订单失败:', error)
    throw error
  }
}

/**
 * 更新订单状态
 * @param {string} orderId - 订单 ID
 * @param {string} status - 新状态
 * @param {Object} additionalData - 额外数据
 * @returns {Promise<Object>} 更新后的订单
 */
export async function updateOrderStatus(orderId, status, additionalData = {}) {
  try {
    const timestamp = new Date().toISOString()
    
    const updatedOrder = {
      id: orderId,
      status,
      updatedAt: timestamp,
      ...additionalData
    }

    // 如果是支付完成，记录支付时间
    if (status === 'paid') {
      updatedOrder.paidAt = timestamp
    }

    // 存储更新到 Google Sheets
    const updateMessage = `ORDER_UPDATE|${orderId}|${status}|${timestamp}|${JSON.stringify(additionalData)}`
    
    await submitEmailToGoogleSheets(
      'orders@system.internal',
      'order-status-update',
      updateMessage
    )

    console.log('订单状态已更新并存储:', updatedOrder)
    return updatedOrder
  } catch (error) {
    console.error('更新订单状态失败:', error)
    throw error
  }
}

/**
 * 获取订单信息
 * @param {string} orderId - 订单 ID
 * @returns {Promise<Object>} 订单信息
 */
export async function getOrder(orderId) {
  try {
    // 记录查询请求
    const queryMessage = `ORDER_QUERY|${orderId}|${new Date().toISOString()}`
    
    await submitEmailToGoogleSheets(
      'orders@system.internal',
      'order-query-log',
      queryMessage
    )

    console.log('查询订单:', orderId)
    
    // 注意：这里返回的是查询日志，实际的订单数据需要从 Google Sheets 中手动查看
    // 在生产环境中，可以考虑使用 Google Sheets API 进行真正的查询
    return { 
      id: orderId,
      note: '订单数据已存储在 Google Sheets 中，请查看管理后台'
    }
  } catch (error) {
    console.error('查询订单失败:', error)
    throw error
  }
}

/**
 * 获取订单（通过 Stripe Session ID）
 * @param {string} sessionId - Stripe Checkout Session ID
 * @returns {Promise<Object>} 订单信息
 */
export async function getOrderBySessionId(sessionId) {
  try {
    // 记录查询请求
    const queryMessage = `ORDER_QUERY_BY_SESSION|${sessionId}|${new Date().toISOString()}`
    
    await submitEmailToGoogleSheets(
      'orders@system.internal',
      'order-session-query-log',
      queryMessage
    )

    console.log('通过 Session ID 查询订单:', sessionId)
    
    return { 
      stripeCheckoutSessionId: sessionId,
      note: '订单数据已存储在 Google Sheets 中，请查看管理后台'
    }
  } catch (error) {
    console.error('查询订单失败:', error)
    throw error
  }
}
