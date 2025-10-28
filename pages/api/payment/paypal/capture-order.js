// PayPal捕获订单API（完成支付）
// 官方文档：https://developer.paypal.com/docs/api/orders/v2/#orders_capture

/**
 * PayPal Orders API v2 - 捕获订单
 * 
 * 当用户在PayPal页面完成支付后，需要调用此API捕获订单以完成交易
 * 
 * @route POST /api/payment/paypal/capture-order
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
    const { order_id, payer_id } = req.body;

    // 验证必需字段
    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'order_id is required' }
      });
    }

    // 获取PayPal凭据
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials not configured');
      return res.status(500).json({
        success: false,
        error: { message: 'Payment service not configured' }
      });
    }

    // 1. 获取PayPal访问令牌
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('PayPal auth failed:', errorText);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to authenticate with PayPal' }
      });
    }

    const { access_token } = await tokenResponse.json();

    // 2. 捕获订单
    const captureResponse = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${order_id}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'PayPal-Request-Id': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal capture failed:', errorData);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to capture PayPal order',
          details: errorData
        }
      });
    }

    const captureData = await captureResponse.json();

    // 3. 提取交易信息
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    
    if (!capture) {
      return res.status(500).json({
        success: false,
        error: { message: 'No capture data found' }
      });
    }

    // 4. 返回成功响应
    return res.status(200).json({
      success: true,
      order_id: captureData.id,
      status: captureData.status,
      payer: {
        email: captureData.payer?.email_address,
        payer_id: captureData.payer?.payer_id,
        name: captureData.payer?.name
      },
      capture: {
        id: capture.id,
        status: capture.status,
        amount: capture.amount
      },
      order: captureData
    });

  } catch (error) {
    console.error('PayPal capture error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to capture PayPal order',
        details: error.message
      }
    });
  }
}


