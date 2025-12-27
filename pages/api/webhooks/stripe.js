import { stripe } from '../../../lib/stripe'
import { updateOrderStatus } from '../../../lib/orders'
import { submitEmailToGoogleSheets } from '../../../lib/googleSheets'

/**
 * 禁用 Next.js 自动 body 解析
 * Stripe webhook 签名验证需要原始请求体（raw body）
 * 如果 Next.js 自动解析为对象，签名验证会失败
 */
export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * POST /api/webhooks/stripe
 * 处理 Stripe webhook 事件
 * 
 * 支持的事件:
 * - checkout.session.completed: 支付完成
 * - charge.refunded: 退款
 */
export default async function handler(req, res) {
  console.log('\n========== WEBHOOK 处理器被调用 ==========')
  console.log('时间:', new Date().toISOString())
  console.log('方法:', req.method)
  console.log('URL:', req.url)
  
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    console.log('❌ 方法不是 POST，返回 405')
    return res.status(405).json({ error: '方法不允许' })
  }

  const sig = req.headers['stripe-signature']
  console.log('签名密钥存在:', !!sig)
  console.log('环境变量 STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ 有' : '❌ 无')

  let event

  try {
    // 获取 raw body
    // 由于禁用了 bodyParser，需要从流中读取原始数据
    let body

    if (typeof req.body === 'string') {
      // 如果已经是 string，直接使用
      body = req.body
      console.log('body 已经是 string')
    } else if (Buffer.isBuffer(req.body)) {
      // 如果是 Buffer，转换为 string
      body = req.body.toString('utf-8')
      console.log('body 是 Buffer，已转换为 string')
    } else {
      // req.body 是 undefined，需要从流中读取
      console.log('⚠️ req.body 是 undefined，从流中读取原始数据')
      body = await getRawBody(req)
      console.log('从流中读取完成，长度:', body.length)
    }
    
    console.log('Webhook 请求接收:', {
      signature: sig ? '有' : '无',
      bodyType: typeof body,
      bodyLength: body.length
    })
    
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    
    console.log('✅ Webhook 签名验证成功，事件类型:', event.type)
  } catch (err) {
    console.error('❌ Webhook 签名验证失败:', err.message)
    console.error('错误详情:', err)
    return res.status(400).send(`Webhook 错误: ${err.message}`)
  }

  // 处理事件
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object)
        break

      case 'charge.updated':
        // charge.updated 事件通常在支付完成时触发
        // 如果需要处理，可以在这里添加逻辑
        console.log('收到 charge.updated 事件，暂不处理')
        break

      default:
        console.log(`未处理的事件类型: ${event.type}`)
    }

    // 返回 200 确认接收
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('处理 webhook 事件时出错:', error)
    res.status(500).json({ error: '处理事件失败' })
  }
}

/**
 * 从请求流中读取原始数据
 */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    
    req.on('data', chunk => {
      data += chunk.toString('utf-8')
    })
    
    req.on('end', () => {
      resolve(data)
    })
    
    req.on('error', reject)
  })
}

/**
 * 处理 checkout.session.completed 事件
 * 支付完成时调用
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('=== Stripe Webhook: 支付完成 ===')
  console.log('Session ID:', session.id)
  console.log('客户邮箱:', session.customer_email)
  console.log('支付金额:', session.amount_total / 100, session.currency.toUpperCase())

  try {
    // 1. 提取订单元数据
    const { paymentType, orderId, language } = session.metadata || {}
    const customerEmail = session.customer_email
    const amount = session.amount_total / 100 // 转换为美元
    const currency = session.currency.toUpperCase()

    console.log('订单元数据:', {
      paymentType,
      orderId,
      language,
      amount,
      currency
    })

    // 2. 更新订单状态为"已支付"
    const updatedOrder = await updateOrderStatus(orderId, 'paid', {
      stripeCheckoutSessionId: session.id,
      amount,
      currency,
      paidAt: new Date().toISOString()
    })

    console.log('订单状态已更新为已支付:', updatedOrder)

    // 3. 发送确认邮件给客户
    try {
      const confirmationMessage = language === 'zh'
        ? `VIP预订确认|${orderId}|${amount}|${currency}|已支付`
        : `VIP Reservation Confirmed|${orderId}|${amount}|${currency}|Paid`

      await submitEmailToGoogleSheets(
        customerEmail,
        'stripe-payment-confirmed',
        confirmationMessage
      )

      console.log('确认邮件已发送至:', customerEmail)
    } catch (emailError) {
      console.error('发送确认邮件失败:', emailError)
      // 不中断流程，继续处理其他逻辑
    }

    // 4. 发送管理员通知邮件
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@unicornblocks.com'
      const shippingInfo = session.shipping_details?.address
      const shippingAddress = shippingInfo 
        ? `${shippingInfo.country || 'N/A'}, ${shippingInfo.city || 'N/A'}, ${shippingInfo.line1 || 'N/A'}`
        : 'N/A'
      
      const adminNotificationMessage = language === 'zh'
        ? `新订单通知|${orderId}|${customerEmail}|${amount}|${currency}|${new Date().toISOString()}|配送地址: ${shippingAddress}|支付方式: Stripe`
        : `New Order Notification|${orderId}|${customerEmail}|${amount}|${currency}|${new Date().toISOString()}|Shipping: ${shippingAddress}|Payment: Stripe`

      await submitEmailToGoogleSheets(
        adminEmail,
        'admin-order-notification',
        adminNotificationMessage
      )

      console.log('管理员通知邮件已发送至:', adminEmail)
    } catch (adminError) {
      console.error('发送管理员通知失败:', adminError)
      // 不中断流程，继续处理其他逻辑
    }

    // 5. 更新 VIP 预订状态（如果需要）
    try {
      const vipUpdateMessage = language === 'zh'
        ? `VIP预订已激活|${orderId}|${customerEmail}|${new Date().toISOString()}`
        : `VIP Reservation Activated|${orderId}|${customerEmail}|${new Date().toISOString()}`

      await submitEmailToGoogleSheets(
        customerEmail,
        'vip-reservation-activated',
        vipUpdateMessage
      )

      console.log('VIP 预订状态已更新')
    } catch (vipError) {
      console.error('更新 VIP 预订状态失败:', vipError)
      // 不中断流程
    }

    // 6. 添加到PaidCoupon表（支付用户记录）
    // 将支付用户数据发送到Google Apps Script处理
    // 这样可以自动更新PaidCoupon表，用于Meta广告追踪和用户管理
    try {
      const amount = session.amount_total / 100
      const shippingInfo = session.shipping_details?.address
      const state = shippingInfo?.state || ''
      const zipcode = shippingInfo?.postal_code || ''
      
      // 准备PaidCoupon数据
      // 表结构: Email | Units | Amount_Paid | State | Created_at | Stripe_Session_ID | Source | Zipcode
      const paidCouponData = {
        email: customerEmail,
        units: 1, // 默认1个单位
        amount_paid: amount,
        state: state,
        stripe_session_id: session.id,
        source: 'stripe',
        zipcode: zipcode
      }
      
      // 检查环境变量是否配置
      if (!process.env.PAID_COUPON_WEBHOOK_URL) {
        console.warn('⚠️ PAID_COUPON_WEBHOOK_URL 未配置，无法更新PaidCoupon表')
        console.warn('请在 .env.production 中添加: PAID_COUPON_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec')
      } else {
        // 发送到Google Apps Script处理PaidCoupon表
        const paidCouponResponse = await fetch(process.env.PAID_COUPON_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paidCouponData)
        })
        
        const paidCouponText = await paidCouponResponse.text()
        console.log('✅ PaidCoupon表更新响应:', paidCouponText)
        console.log('用户已添加到PaidCoupon表:', customerEmail, '金额:', amount)
      }
    } catch (paidCouponError) {
      console.error('❌ 添加PaidCoupon记录失败:', paidCouponError)
      // 不中断流程，继续处理其他逻辑
    }

    // 7. 记录完整的支付信息
    console.log('=== 支付处理完成 ===')
    console.log('订单 ID:', orderId)
    console.log('客户邮箱:', customerEmail)
    console.log('支付金额:', amount, currency)
    console.log('支付时间:', new Date().toISOString())
    console.log('配送信息:', {
      country: session.shipping_details?.address?.country,
      city: session.shipping_details?.address?.city,
      line1: session.shipping_details?.address?.line1,
      postal_code: session.shipping_details?.address?.postal_code
    })

  } catch (error) {
    console.error('处理支付完成事件时出错:', error)
    throw error
  }
}

/**
 * 处理 charge.refunded 事件
 * 退款时调用（可选）
 */
async function handleChargeRefunded(charge) {
  console.log('=== Stripe Webhook: 退款处理 ===')
  console.log('Charge ID:', charge.id)
  console.log('退款金额:', charge.amount / 100, charge.currency.toUpperCase())

  try {
    const { orderId, language } = charge.metadata || {}
    const amount = charge.amount / 100
    const currency = charge.currency.toUpperCase()

    // 1. 更新订单状态为"已退款"
    const updatedOrder = await updateOrderStatus(orderId, 'refunded', {
      chargeId: charge.id,
      refundAmount: amount,
      refundCurrency: currency,
      refundedAt: new Date().toISOString()
    })

    console.log('订单状态已更新为已退款:', updatedOrder)

    // 2. 发送退款确认邮件给客户
    try {
      const refundMessage = language === 'zh'
        ? `退款已处理|${orderId}|${amount}|${currency}|${new Date().toISOString()}|预计 3-5 个工作日到账`
        : `Refund Processed|${orderId}|${amount}|${currency}|${new Date().toISOString()}|Expected in 3-5 business days`

      await submitEmailToGoogleSheets(
        charge.billing_details?.email || 'unknown@example.com',
        'refund-notification',
        refundMessage
      )

      console.log('退款确认邮件已发送至客户')
    } catch (emailError) {
      console.error('发送退款邮件失败:', emailError)
    }

    // 3. 发送管理员退款通知
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@unicornblocks.com'
      const adminRefundMessage = language === 'zh'
        ? `退款通知|${orderId}|${charge.billing_details?.email || 'unknown'}|${amount}|${currency}|${new Date().toISOString()}|原因: 客户申请`
        : `Refund Notification|${orderId}|${charge.billing_details?.email || 'unknown'}|${amount}|${currency}|${new Date().toISOString()}|Reason: Customer request`

      await submitEmailToGoogleSheets(
        adminEmail,
        'admin-refund-notification',
        adminRefundMessage
      )

      console.log('管理员退款通知已发送至:', adminEmail)
    } catch (adminError) {
      console.error('发送管理员退款通知失败:', adminError)
    }

    console.log('=== 退款处理完成 ===')

  } catch (error) {
    console.error('处理退款事件时出错:', error)
    throw error
  }
}
