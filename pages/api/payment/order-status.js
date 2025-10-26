// Next.js API Route - /api/payment/order-status
// 查询订单状态

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: order_id'
      });
    }

    // 获取后端API URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

    // 调用后端API查询订单状态
    const response = await fetch(`${backendUrl}/api/payment/order/${order_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Version': '2.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend API Error ${response.status}:`, errorText);
      
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }
      
      return res.status(response.status).json({
        success: false,
        error: 'Failed to fetch order status'
      });
    }

    const result = await response.json();
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Order status query error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order status'
    });
  }
}

