// Next.js API Route - /api/payment/validate-coupon
// 验证优惠券码

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { coupon_code, customer_email } = req.body;

    if (!coupon_code || !customer_email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: coupon_code and customer_email'
      });
    }

    // 获取后端API URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';

    // 调用后端API验证优惠券
    const response = await fetch(`${backendUrl}/api/payment/coupon/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': '2.0'
      },
      body: JSON.stringify({
        coupon_code,
        customer_email
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend API Error ${response.status}:`, errorText);
      
      return res.status(response.status).json({
        success: false,
        error: 'Failed to validate coupon'
      });
    }

    const result = await response.json();
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Coupon validation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to validate coupon'
    });
  }
}

