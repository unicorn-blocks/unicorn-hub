import { stripe } from '../../../../lib/stripe'

/**
 * POST /api/payment/stripe/checkout-session
 * 创建 Stripe Checkout Session - 极简版本
 * 
 * 请求体:
 * {
 *   email: string,        // 用户邮箱（可选）
 *   firstName: string,    // 名字（可选）
 *   lastName: string,     // 姓氏（可选）
 *   zip: string,          // 邮编（可选）
 *   leadId: string,       // 追踪ID（可选）
 *   amount: number,       // 金额（美元，默认5）
 *   currency: string      // 货币（默认usd）
 * }
 */
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' })
  }

  try {
    const {
      email,
      firstName,
      lastName,
      zip,
      leadId = '',
      amount = 5,
      currency = 'usd'
    } = req.body

    // 获取应用 URL
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // 图片URL - 必须是公开可访问的HTTPS URL
    // 在生产环境使用实际域名，本地开发时Stripe无法访问localhost图片
    const productImageUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/assets/checkout/sparky.jpg`
      : null; // 本地开发时不设置图片（Stripe无法访问localhost）

    // 构建 session 配置
    const sessionConfig = {
      mode: 'payment',
      payment_method_types: ['card'],
      
      // 产品信息 - 使用与 checkout 页面相同的产品信息
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'VIP Spot Reservation',
              description: 'Sparky First Adventure',
              // 只在生产环境设置图片（本地开发时Stripe无法访问localhost）
              ...(productImageUrl && { images: [productImageUrl] }),
            },
            unit_amount: Math.round(amount * 100) // 转换为美分
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10
          }
        }
      ],
      
      // 重定向URL
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      
      // 极简配置 - 只在必要时要求billing地址
      // 'auto' = Stripe根据风险和合规需要动态决定是否显示
      // 对于$5的小额交易，大多数用户不会看到地址字段
      billing_address_collection: 'auto',
      // 不设置 shipping_address_collection（默认不启用）
      // 不设置 phone_number_collection（默认不启用）
      // 不传 allow_promotion_codes（默认不开）
      
      // 追踪数据
      client_reference_id: leadId || email || 'anonymous',
      metadata: {
        leadId: leadId || '',
        firstName: firstName || '',
        lastName: lastName || '',
        zip: zip || '',
        email: email || ''
      },
      payment_intent_data: {
        metadata: {
          leadId: leadId || '',
          firstName: firstName || '',
          lastName: lastName || '',
          zip: zip || '',
          email: email || ''
        }
      }
    }

    // 如果有 email，预填充到 Stripe Checkout
    if (email) {
      sessionConfig.customer_email = email
    }

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig)

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
