import { stripe } from '../../../../lib/stripe'

/**
 * POST /api/payment/stripe/checkout-session
 * 创建 Stripe Checkout Session
 * 
 * 请求体:
 * {
 *   amount: number,           // 金额（美元）
 *   currency: string,         // 'usd'
 *   customer: {
 *     email: string,
 *     firstName: string,
 *     lastName: string
 *   },
 *   shipping: {
 *     country: string,
 *     firstName: string,
 *     lastName: string,
 *     address: string,
 *     city: string,
 *     state: string,
 *     zipCode: string,
 *     phone: string
 *   },
 *   metadata: {
 *     paymentType: string,    // 'reserve_vip_spot'
 *     orderId: string
 *   },
 *   language: string          // 'en' 或 'zh'
 * }
 */
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' })
  }

  try {
    const {
      amount,
      currency = 'usd',
      customer,
      shipping,
      metadata,
      language = 'en'
    } = req.body

    // 验证必需字段
    if (!amount || !customer?.email || !shipping?.country) {
      return res.status(400).json({
        success: false,
        error: '缺少必需字段'
      })
    }

    // 获取应用 URL
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: '独角兽积木 VIP 名额预订',
              description: '$5 订金锁定 $129 VIP 价格',
              images: [
                'https://unicornblocks.com/logo.png' // 替换为实际 Logo URL
              ]
            },
            unit_amount: Math.round(amount * 100) // 转换为美分
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      customer_email: customer.email,
      
      // 设置 billing address 为 auto（自动从支付方式获取）
      billing_address_collection: 'auto',
      
      // 配送地址收集（如果需要实体商品配送）
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'CN', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG', 'HK']
      },
      
      // 不启用税务计算（因为 Stripe Tax 未开启）
      automatic_tax: {
        enabled: false
      },
      
      metadata: {
        paymentType: metadata?.paymentType || 'reserve_vip_spot',
        orderId: metadata?.orderId || '',
        customerFirstName: customer.firstName || '',
        customerLastName: customer.lastName || '',
        language: language,
        productType: 'coupon' // 标记当前购买的是优惠券
      },
      locale: language === 'zh' ? 'zh' : 'en'
    })

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Stripe Checkout Session 错误:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || '创建支付会话失败'
    })
  }
}
