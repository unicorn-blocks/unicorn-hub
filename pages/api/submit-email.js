// Next.js API路由 - 代理Google Sheets请求以避免CORS问题

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyn8MOU7baUKZ2exFQsLZD6hGs8poE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, source, note } = req.body;

    // 验证邮箱
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: '请提供有效的邮箱地址' 
      });
    }

    console.log('代理请求到Google Sheets:', { email, source, note });

    // 发送请求到Google Apps Script
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" 
      },
      body: new URLSearchParams({ 
        email: email.trim().toLowerCase(), 
        source: source || 'api-proxy',
        note: note || 'notify-at-launch',
        timestamp: new Date().toISOString()
      }),
    });

    const text = await response.text();
    console.log('Google Sheets响应:', { status: response.status, text });

    if (!response.ok) {
      console.error('Google Sheets请求失败:', response.status, text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    if (text.includes("OK")) {
      return res.status(200).json({
        success: true,
        message: '您已成功加入我们的通知列表！🎉'
      });
    } else {
      console.error('Google Sheets响应不包含OK:', text);
      return res.status(400).json({
        success: false,
        message: `提交失败: ${text}`
      });
    }

  } catch (error) {
    console.error('代理请求详细错误:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    let errorMessage = '服务器错误';
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = '无法连接到Google服务器，请检查网络连接';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'DNS解析失败，无法连接到Google服务器';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = '连接被拒绝，请检查网络设置';
    } else {
      errorMessage = `服务器错误: ${error.message}`;
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}