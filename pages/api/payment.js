// Next.js API Route - /api/payment
// 处理支付请求，与后端API集成
// 版本: 2.0 - 支持pre-order和regular_payment

// 多语言消息
const messages = {
  en: {
    success: {
      default: 'Great! Your payment is being processed.',
      redirecting: 'Taking you to the payment page...'
    },
    error: {
      methodNotAllowed: 'Sorry, that method isn\'t allowed',
      emailRequired: 'Please enter your email address',
      paymentMethodRequired: 'Please choose a payment method',
      amountRequired: 'Amount is missing',
      paymentTypeRequired: 'Payment type is missing',
      shippingRequired: 'Shipping information is required',
      processingFailed: 'Something went wrong. Please try again.',
      serverConfig: 'Server configuration issue',
      invalidPaymentMethod: 'Please select a valid payment method',
      invalidPaymentType: 'Invalid payment type',
      invalidCoupon: 'Invalid coupon code'
    }
  },
  zh: {
    success: {
      default: '太好了！正在处理您的支付。',
      redirecting: '正在跳转到支付页面...'
    },
    error: {
      methodNotAllowed: '抱歉，这个方法不被允许',
      emailRequired: '请输入您的邮箱地址',
      paymentMethodRequired: '请选择支付方式',
      amountRequired: '缺少金额信息',
      paymentTypeRequired: '缺少支付类型',
      shippingRequired: '需要配送信息',
      processingFailed: '出了点问题，请重试一下。',
      serverConfig: '服务器配置有问题',
      invalidPaymentMethod: '请选择有效的支付方式',
      invalidPaymentType: '无效的支付类型',
      invalidCoupon: '无效的优惠券代码'
    }
  }
};

// 获取后端API URL
function getBackendApiUrl() {
  // 从环境变量获取后端URL，如果没有则使用默认值
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';
}

// 验证支付方式
function isValidPaymentMethod(method) {
  const validMethods = ['paypal', 'card', 'payoneer'];
  return validMethods.includes(method.toLowerCase());
}

// 验证支付类型
function isValidPaymentType(type) {
  const validTypes = ['pre_order', 'regular_payment'];
  return validTypes.includes(type);
}

// API handler function
export default async function handler(req, res) {
  // 获取语言参数，默认为英文
  const language = req.body.language || 'en';
  const msg = messages[language] || messages.en;
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: msg.error.methodNotAllowed
    });
  }

  try {
    const { 
      payment_type,     // 新增：pre_order 或 regular_payment
      payment_method,   // paypal, card, payoneer
      amount, 
      currency,
      customer,         // { email, firstName, lastName }
      shipping,
      billing_address,  // 信用卡支付需要
      items,           // 商品列表
      coupon_code,     // 优惠券码（仅regular_payment）
      language: requestLanguage,
      return_url,
      cancel_url,
      // 兼容旧版本的字段
      email,
      paymentMethod,
      productType
    } = req.body;
    
    // 兼容旧版本API
    const finalPaymentType = payment_type || (productType === 'early_bird_discount' ? 'pre_order' : 'regular_payment');
    const finalPaymentMethod = (payment_method || paymentMethod || '').toLowerCase();
    const finalCustomer = customer || { 
      email: email, 
      firstName: shipping?.firstName || '', 
      lastName: shipping?.lastName || '' 
    };
    
    // 验证必需字段
    if (!finalCustomer.email) {
      return res.status(400).json({
        success: false,
        message: msg.error.emailRequired
      });
    }
    
    if (!finalPaymentMethod) {
      return res.status(400).json({
        success: false,
        message: msg.error.paymentMethodRequired
      });
    }
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: msg.error.amountRequired
      });
    }
    
    if (!finalPaymentType) {
      return res.status(400).json({
        success: false,
        message: msg.error.paymentTypeRequired
      });
    }
    
    if (!shipping) {
      return res.status(400).json({
        success: false,
        message: msg.error.shippingRequired
      });
    }
    
    // 验证支付方式和支付类型
    if (!isValidPaymentMethod(finalPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: msg.error.invalidPaymentMethod
      });
    }
    
    if (!isValidPaymentType(finalPaymentType)) {
      return res.status(400).json({
        success: false,
        message: msg.error.invalidPaymentType
      });
    }
    
    // 构建商品列表
        const finalItems = items || [{
          name: finalPaymentType === 'pre_order' 
            ? 'Unicorn Blocks VIP Spot Reservation' 
            : 'Unicorn Blocks',
          description: finalPaymentType === 'pre_order'
            ? '$5 deposit for $129 VIP price'
            : 'Unicorn Blocks Purchase',
      quantity: '1',
      unit_amount: {
        currency_code: currency || 'USD',
        value: amount.toString()
      }
    }];
    
    console.log(`Processing ${finalPaymentType} payment: ${finalCustomer.email}, ${finalPaymentMethod}, $${amount}`);
    
    // 获取后端URL
    const backendUrl = getBackendApiUrl();
    const baseUrl = return_url ? new URL(return_url).origin : (req.headers.origin || 'http://localhost:3000');
    
    // 准备发送给后端的数据
    const paymentData = {
      payment_type: finalPaymentType,
      amount: amount.toString(),
      currency: currency || 'USD',
      customer: finalCustomer,
      shipping: shipping,
      items: finalItems,
      language: requestLanguage || 'en',
      return_url: return_url || `${baseUrl}/payment/success`,
      cancel_url: cancel_url || `${baseUrl}/payment/cancel`
    };
    
    // 如果是正式支付且有优惠券，添加优惠券信息
    if (finalPaymentType === 'regular_payment' && coupon_code) {
      paymentData.coupon_code = coupon_code;
    }
    
    // 如果是信用卡支付，添加账单地址
    if (finalPaymentMethod === 'card' && billing_address) {
      paymentData.billing_address = billing_address;
    }
    
    // 根据支付方式调用不同的后端端点
    let endpoint;
    switch (finalPaymentMethod) {
      case 'paypal':
        endpoint = '/api/payment/paypal/create-order';
        break;
      case 'card':
        // 注意：信用卡支付应该在前端通过PayPal SDK直接处理
        // 这里只是为了兼容性保留
        endpoint = '/api/payment/card/process';
        break;
      case 'payoneer':
        endpoint = '/api/payment/payoneer/create-checkout';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: msg.error.invalidPaymentMethod
        });
    }
    
    // 调用后端API
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': '2.0'
      },
      body: JSON.stringify(paymentData)
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
        message: errorData.error?.message || errorData.message || msg.error.processingFailed,
        error: errorData
      });
    }
    
    const result = await response.json();
    
    if (result.success) {
      // 返回成功响应
      return res.status(200).json({
        success: true,
        message: msg.success.default,
        order_id: result.order_id,
        internal_order_id: result.internal_order_id,
        approval_url: result.approval_url || result.payment_url,
        checkout_id: result.checkout_id,
        data: result
      });
    } else {
      // 后端API返回了错误
      return res.status(400).json({
        success: false,
        message: result.error?.message || result.message || msg.error.processingFailed,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Payment processing failed:', error);
    
    // 检查是否是网络连接错误
    if (error.message.includes('fetch') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: msg.error.serverConfig,
        error: 'Cannot connect to payment server. Please try again later.'
      });
    }
    
    // 其他错误
    return res.status(500).json({
      success: false,
      message: msg.error.processingFailed,
      error: error.message
    });
  }
}
