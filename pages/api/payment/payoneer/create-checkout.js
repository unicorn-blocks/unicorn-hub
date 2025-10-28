// Payoneer Checkout API
// 官方文档：https://developers.payoneer.com/

/**
 * Payoneer支付处理
 * 
 * 注意：Payoneer主要用于批量付款（Payouts），不是传统的支付网关
 * 如果您需要使用Payoneer进行收款，需要：
 * 1. 联系Payoneer商务团队开通Checkout功能
 * 2. 获取专门的Checkout API凭据
 * 
 * 此实现假设使用Payoneer的Checkout服务
 * 
 * @route POST /api/payment/payoneer/create-checkout
 */

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const {
      payment_type,     // reserve_vip_spot 或 regular_payment
      amount,
      currency = 'USD',
      customer,         // { email, firstName, lastName }
      shipping,
      items,
      language = 'en',
      return_url,
      cancel_url
    } = req.body;

    // 验证必需字段
    if (!payment_type) {
      return res.status(400).json({
        success: false,
        error: { message: 'payment_type is required' }
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: { message: 'amount is required' }
      });
    }

    if (!customer || !customer.email) {
      return res.status(400).json({
        success: false,
        error: { message: 'customer email is required' }
      });
    }

    // 获取Payoneer凭据
    const PAYONEER_PROGRAM_ID = process.env.PAYONEER_PROGRAM_ID;
    const PAYONEER_USERNAME = process.env.PAYONEER_USERNAME;
    const PAYONEER_PASSWORD = process.env.PAYONEER_PASSWORD;
    const PAYONEER_API_URL = process.env.PAYONEER_API_URL || 'https://api.sandbox.payoneer.com';

    if (!PAYONEER_PROGRAM_ID || !PAYONEER_USERNAME || !PAYONEER_PASSWORD) {
      console.error('Payoneer credentials not configured');
      return res.status(500).json({
        success: false,
        error: { message: 'Payment service not configured' }
      });
    }

    // ⚠️ 重要提示：
    // Payoneer的API和认证方式取决于您的具体集成类型
    // 以下是一个通用的实现示例，可能需要根据实际API调整

    // 1. 构建认证头
    const auth = Buffer.from(`${PAYONEER_USERNAME}:${PAYONEER_PASSWORD}`).toString('base64');

    // 2. 构建订单描述
    let description = '';
    if (payment_type === 'reserve_vip_spot') {
      description = 'Unicorn Blocks VIP Spot Reservation - $5 deposit';
    } else {
      description = 'Unicorn Blocks Purchase';
    }

    // 3. 构建Payoneer checkout请求
    // 注意：实际的API端点和参数需要根据Payoneer的文档调整
    const checkoutData = {
      program_id: PAYONEER_PROGRAM_ID,
      transaction_id: `${payment_type}_${Date.now()}`,
      amount: parseFloat(amount).toFixed(2),
      currency: currency,
      description: description,
      customer: {
        email: customer.email,
        first_name: customer.firstName || shipping?.firstName,
        last_name: customer.lastName || shipping?.lastName
      },
      callback_url: return_url || `${req.headers.origin || 'http://localhost:3000'}/payment/success`,
      cancel_url: cancel_url || `${req.headers.origin || 'http://localhost:3000'}/payment/cancel`,
      metadata: {
        payment_type: payment_type,
        customer_email: customer.email
      }
    };

    // 4. 调用Payoneer API
    // ⚠️ 实际端点需要根据Payoneer文档调整
    const checkoutResponse = await fetch(`${PAYONEER_API_URL}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Payoneer checkout creation failed:', errorText);
      
      // 尝试解析错误信息
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }

      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create Payoneer checkout',
          details: errorData
        }
      });
    }

    const checkoutResult = await checkoutResponse.json();

    // 5. 返回成功响应
    return res.status(200).json({
      success: true,
      checkout_id: checkoutResult.id || checkoutResult.session_id,
      checkout_url: checkoutResult.checkout_url || checkoutResult.payment_url,
      status: checkoutResult.status,
      data: checkoutResult
    });

  } catch (error) {
    console.error('Payoneer checkout error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create Payoneer checkout',
        details: error.message
      }
    });
  }
}


