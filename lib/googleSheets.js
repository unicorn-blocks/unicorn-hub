// Google Sheets 邮箱收集工具函数
// 统一处理所有邮箱提交到Google Sheets的逻辑

// 在开发环境使用API代理，生产环境直接调用Google Apps Script
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
const API_PROXY_URL = "/api/submit-email";

/**
 * 提交邮箱到Google Sheets
 * @param {string} email - 邮箱地址
 * @param {string} source - 来源标识 (如: "hero-section", "footer", "popup", "floating-box")
 * @param {string} note - 备注信息 (如: "notify-at-launch", "vip-reservation")
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitEmailToGoogleSheets(email, source = "website", note = "notify-at-launch") {
  try {
    // 验证邮箱格式
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: '请提供有效的邮箱地址'
      };
    }

    // 检测是否在开发环境（localhost）
    const isDevelopment = typeof window !== 'undefined' && 
                         (window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('localhost'));

    console.log('提交邮箱:', { email, source, note, isDevelopment, hostname: typeof window !== 'undefined' ? window.location.hostname : 'server' });

    // 始终使用API代理，因为它更可靠
    const response = await fetch(API_PROXY_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        email: email.trim().toLowerCase(), 
        source, 
        note
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('API代理响应:', result);
    return result;
    
  } catch (error) {
    console.error('邮箱提交错误:', error);
    
    let errorMessage = '网络错误';
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = '无法连接到服务器，请检查网络连接';
    } else if (error.message.includes('CORS')) {
      errorMessage = '跨域请求被阻止，请检查配置';
    } else if (error.message.includes('HTTP')) {
      errorMessage = `服务器错误: ${error.message}`;
    } else {
      errorMessage = `提交失败: ${error.message}`;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}