// Next.js API Route - /api/payment/capture-paypal
// 捕获PayPal订单（完成支付）

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { order_id, payer_id, internal_order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: order_id'
      });
    }

    // 获取后端API URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

    // 调用后端API捕获订单
    const response = await fetch(`${backendUrl}/api/payment/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': '2.0'
      },
      body: JSON.stringify({
        order_id,
        payer_id,
        internal_order_id
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend API Error ${response.status}:`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || errorData.message || 'Failed to capture payment'
      });
    }

    const result = await response.json();
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('PayPal capture error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to capture payment'
    });
  }
}

