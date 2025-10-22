// PayPal订单创建API端点
// 用于PayPal Hosted Fields

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { amount, currency, ...orderData } = req.body;
    
    // 验证必需字段
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    // 创建PayPal订单
    const order = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency || 'USD',
          value: amount.toString()
        },
        description: 'Unicorn Blocks Early Bird Discount - $10 for $40 voucher'
      }],
      application_context: {
        return_url: `${req.headers.origin || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${req.headers.origin || 'http://localhost:3000'}/payment/cancel`
      }
    };

    // 这里应该调用PayPal API创建订单
    // 由于没有配置PayPal Client ID，我们返回一个模拟的订单ID
    const orderID = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return res.status(200).json({
      success: true,
      orderID: orderID,
      order: order
    });

  } catch (error) {
    console.error('PayPal order creation failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      error: error.message
    });
  }
}
