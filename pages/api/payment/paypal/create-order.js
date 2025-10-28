// PayPal创建订单API（Orders API v2）
// 官方文档：https://developer.paypal.com/docs/api/orders/v2/

/**
 * PayPal Orders API v2 - 创建订单
 * 
 * 此API用于创建PayPal订单，支持：
 * 1. PayPal账户支付
 * 2. 信用卡/借记卡支付（通过PayPal处理）
 * 3. reserve-vip-spot预定
 * 
 * @route POST /api/payment/paypal/create-order
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

    if (!shipping) {
      return res.status(400).json({
        success: false,
        error: { message: 'shipping information is required' }
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

    // 2. 构建订单描述
    let description = '';
    if (payment_type === 'reserve_vip_spot') {
      description = 'Unicorn Blocks VIP Spot Reservation - $5 deposit for $129 VIP price (Retail: $199)';
    } else {
      description = 'Unicorn Blocks Purchase';
    }

    // 3. 构建订单数据（Orders API v2格式）
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `${payment_type}_${Date.now()}`,
        description: description,
        custom_id: customer.email,
        soft_descriptor: 'UNICORN_BLOCKS',
        amount: {
          currency_code: currency,
          value: parseFloat(amount).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: parseFloat(amount).toFixed(2)
            }
          }
        },
        items: items || [{
          name: payment_type === 'reserve_vip_spot' 
            ? 'VIP Spot Reservation' 
            : 'Unicorn Blocks',
          description: description,
          quantity: '1',
          unit_amount: {
            currency_code: currency,
            value: parseFloat(amount).toFixed(2)
          },
          category: 'PHYSICAL_GOODS'
        }],
        shipping: {
          method: 'Standard Shipping',
          name: {
            full_name: `${shipping.firstName} ${shipping.lastName}`
          },
          address: {
            address_line_1: shipping.address,
            address_line_2: shipping.address2 || '',
            admin_area_2: shipping.city,
            admin_area_1: shipping.state,
            postal_code: shipping.zipCode,
            country_code: shipping.country || 'US'
          }
        }
      }],
      application_context: {
        brand_name: 'Unicorn Blocks',
        locale: language === 'zh' ? 'zh-CN' : 'en-US',
        landing_page: 'BILLING',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        return_url: return_url || `${req.headers.origin || 'http://localhost:3000'}/payment/success`,
        cancel_url: cancel_url || `${req.headers.origin || 'http://localhost:3000'}/payment/cancel`
      },
      payer: {
        email_address: customer.email,
        name: {
          given_name: customer.firstName || shipping.firstName,
          surname: customer.lastName || shipping.lastName
        }
      }
    };

    // 4. 创建PayPal订单
    const createOrderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'PayPal-Request-Id': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(orderData)
    });

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.json();
      console.error('PayPal order creation failed:', errorData);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create PayPal order',
          details: errorData
        }
      });
    }

    const order = await createOrderResponse.json();

    // 5. 提取approval_url
    const approvalLink = order.links?.find(link => link.rel === 'approve');

    // 6. 返回成功响应
    return res.status(200).json({
      success: true,
      order_id: order.id,
      status: order.status,
      approval_url: approvalLink?.href,
      order: order
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create PayPal order',
        details: error.message
      }
    });
  }
}


