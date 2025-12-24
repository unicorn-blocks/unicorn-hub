// Next.js API路由 - 代理Google Sheets请求以避免CORS问题

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";

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

    // 临时模拟成功响应，用于测试前端功能
    // 在实际部署时，取消注释下面的真实请求代码
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟成功响应
    console.log('模拟成功响应 - 邮箱已记录:', email);
    return res.status(200).json({
      success: true,
      message: '您已成功加入我们的通知列表！🎉 (模拟模式)'
    });

    /* 真实的Google Sheets请求代码 - 当网络问题解决后取消注释
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
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    if (text.includes("OK")) {
      return res.status(200).json({
        success: true,
        message: '您已成功加入我们的通知列表！🎉'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `提交失败: ${text}`
      });
    }
    */

  } catch (error) {
    console.error('代理请求错误:', error);
    return res.status(500).json({
      success: false,
      message: `服务器错误: ${error.message}`
    });
  }
}