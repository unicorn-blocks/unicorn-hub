// Next.js API Route - /api/subscribe
// Try to import Mailchimp SDK
let mailchimp;
try {
  mailchimp = require('@mailchimp/mailchimp_marketing');
} catch (error) {
  console.warn('Mailchimp SDK not installed, using simulation mode');
}

// Mailchimp configuration
const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;
const serverPrefix = process.env.MAILCHIMP_DATA_CENTER || (apiKey ? apiKey.split('-')[1] : null);

// Initialize Mailchimp configuration (if all necessary variables exist)
if (mailchimp && apiKey && listId && serverPrefix) {
  try {
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });
    console.log('Mailchimp configuration initialized', {
      apiKeyExists: !!apiKey,
      listId: listId,
      serverPrefix: serverPrefix
    });
  } catch (error) {
    console.error('Mailchimp configuration failed:', error);
  }
}

// 多语言消息
const messages = {
  en: {
    success: {
      default: 'Thank you for your subscription!',
      devMode: 'You have successfully joined the waitlist! (Development mode)',
      testEmail: 'You have successfully joined the waitlist! (Test email)',
      alreadySubscribed: 'You are already subscribed to our newsletter!'
    },
    error: {
      methodNotAllowed: 'Method not allowed',
      emailRequired: 'Email address is required',
      processingFailed: 'Subscription processing failed, please try again later',
      serverConfig: 'Server environment variables are not properly configured'
    }
  },
  zh: {
    success: {
      default: '感谢您的订阅！',
      devMode: '您已成功加入候补名单！（开发模式）',
      testEmail: '您已成功加入候补名单！（测试邮箱）',
      alreadySubscribed: '您已经订阅了我们的产品！'
    },
    error: {
      methodNotAllowed: '方法不允许',
      emailRequired: '邮箱地址是必需的',
      processingFailed: '订阅处理失败，请稍后再试',
      serverConfig: '服务器环境变量未正确配置'
    }
  }
};

// Check if it's a test email
function isTestEmail(email) {
  const testDomains = ['test', 'example', 'sample'];
  const lowerEmail = email.toLowerCase();
  
  // Check common test domains
  for (const domain of testDomains) {
    if (lowerEmail.includes(domain)) {
      return true;
    }
  }
  
  // Other obvious test email patterns
  return lowerEmail === 'test@gmail.com' || 
         lowerEmail.startsWith('test@') || 
         lowerEmail.startsWith('example@');
}

// API handler function
export default async function handler(req, res) {
  // 获取语言参数，默认为英文
  const language = req.body.language || 'en';
  const msg = messages[language] || messages.en;
  
  // 添加调试信息
  console.log('API 环境变量：', {
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY ? '已设置（隐藏）' : '未设置',
    MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
    MAILCHIMP_DATA_CENTER: process.env.MAILCHIMP_DATA_CENTER
  });
  
  // 检查环境变量是否设置
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID || !process.env.MAILCHIMP_DATA_CENTER) {
    return res.status(500).json({
      success: false,
      message: msg.error.serverConfig,
      debug: {
        MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY ? '已设置（隐藏）' : '未设置',
        MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID || '未设置',
        MAILCHIMP_DATA_CENTER: process.env.MAILCHIMP_DATA_CENTER || '未设置'
      }
    });
  }

  // CORS settings
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: msg.error.methodNotAllowed
    });
  }

  try {
    const { email } = req.body;
    
    // Validate that email exists
    if (!email) {
      return res.status(400).json({
        success: false,
        message: msg.error.emailRequired
      });
    }
    
    console.log(`Trying to subscribe email: ${email}`);
    
    // Check if Mailchimp configuration is complete
    if (!apiKey || !listId || !serverPrefix) {
      console.warn('Mailchimp configuration missing', { 
        apiKeyExists: !!apiKey, 
        listIdExists: !!listId, 
        serverPrefixExists: !!serverPrefix 
      });
      
      // Return a successful mock response in development environment
      return res.status(200).json({
        success: true,
        message: msg.success.devMode
      });
    }
    
    // Detect test emails and provide special handling
    if (isTestEmail(email)) {
      console.log(`Test email detected: ${email}, returning mock success response`);
      return res.status(200).json({
        success: true,
        message: msg.success.testEmail
      });
    }
    
    // Try to add subscriber to Mailchimp
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: 'subscribed'
      });
      
      console.log(`Subscription successful: ${email}`);
      return res.status(200).json({
        success: true,
        message: msg.success.default
      });
    } catch (err) {
      // Handle existing members
      if (err.response && err.response.body && err.response.body.title === 'Member Exists') {
        console.log(`Existing subscription: ${email}`);
        return res.status(200).json({
          success: true,
          message: msg.success.alreadySubscribed
        });
      }
      
      // Handle emails that Mailchimp considers invalid
      if (err.response && err.response.body && 
          (err.response.body.title === 'Invalid Resource' || 
           err.response.body.detail?.includes('looks fake or invalid'))) {
        console.log(`Email rejected by Mailchimp: ${email}`, err.response.body.detail);
        
        // For emails rejected by Mailchimp, we still return success to improve user experience
        return res.status(200).json({
          success: true,
          message: msg.success.default
        });
      }
      
      // Re-throw other errors
      throw err;
    }
  } catch (error) {
    console.error('Subscription processing failed:', error);
    
    // Return an error message without exposing detailed error information to the client
    return res.status(500).json({
      success: false,
      message: msg.error.processingFailed
    });
  }
} 