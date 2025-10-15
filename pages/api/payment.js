// Next.js API Route - /api/payment
// 处理支付请求，与Flask后端集成

// 多语言消息
const messages = {
  en: {
    success: {
      default: 'Great! Your payment is being processed.',
      redirecting: 'Taking you to PayPal...'
    },
    error: {
      methodNotAllowed: 'Sorry, that method isn\'t allowed',
      emailRequired: 'Please enter your email address',
      paymentMethodRequired: 'Please choose a payment method',
      amountRequired: 'Amount is missing',
      processingFailed: 'Something went wrong. Please try again.',
      serverConfig: 'Server configuration issue',
      invalidPaymentMethod: 'Please select a valid payment method'
    }
  },
  zh: {
    success: {
      default: '太好了！正在处理您的支付。',
      redirecting: '正在跳转到PayPal...'
    },
    error: {
      methodNotAllowed: '抱歉，这个方法不被允许',
      emailRequired: '请输入您的邮箱地址',
      paymentMethodRequired: '请选择支付方式',
      amountRequired: '缺少金额信息',
      processingFailed: '出了点问题，请重试一下。',
      serverConfig: '服务器配置有问题',
      invalidPaymentMethod: '请选择有效的支付方式'
    }
  }
};

// 获取Flask后端URL
function getFlaskBackendUrl() {
  // 从环境变量获取Flask后端URL，如果没有则使用默认值
  return process.env.FLASK_BACKEND_URL || 'http://localhost:5000';
}

// 验证支付方式
function isValidPaymentMethod(method) {
  const validMethods = ['Paypal', 'Payoneer'];
  return validMethods.includes(method);
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
    const { email, paymentMethod, amount, language: requestLanguage } = req.body;
    
    // 验证必需字段
    if (!email) {
      return res.status(400).json({
        success: false,
        message: msg.error.emailRequired
      });
    }
    
    if (!paymentMethod) {
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
    
    // Validate payment method
    if (!isValidPaymentMethod(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: msg.error.invalidPaymentMethod
      });
    }
    
    console.log(`Processing payment: ${email}, ${paymentMethod}, $${amount}`);
    
    // 准备发送给Flask后端的数据
    const paymentData = {
      email,
      payment_method: paymentMethod,
      amount: parseFloat(amount),
      currency: 'USD',
      language: requestLanguage || 'en',
      product_type: 'early_bird_discount',
      description: 'Unicorn Toy Early Bird Discount - $10 for $40 voucher'
    };
    
    // 调用Flask后端API
    const flaskUrl = getFlaskBackendUrl();

    const response = await fetch(`${flaskUrl}/api/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Flask API Error ${response.status}:`, errorText);
      throw new Error(`Flask API responded with status: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // 返回成功响应，包含支付URL（如果有）
      return res.status(200).json({
        success: true,
        message: msg.success.default,
        paymentUrl: result.payment_url,
        paymentId: result.payment_id,
        data: result
      });
    } else {
      // Flask API返回了错误
      return res.status(400).json({
        success: false,
        message: result.message || msg.error.processingFailed,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Payment processing failed:', error);
    
    // 检查是否是网络连接错误
    if (error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        message: msg.error.serverConfig,
        error: 'Cannot connect to payment server'
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
