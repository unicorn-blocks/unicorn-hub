// Google Sheets 邮箱收集工具函数 (兼容 Browser + Netlify Function)

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
const API_PROXY_URL = "/api/submit-email";

async function submitEmailToGoogleSheets(email, source = "website", note = "notify-at-launch") {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: '请提供有效的邮箱地址' };
    }

    const isServer = (typeof window === 'undefined');

    // ✅ 关键：server 环境别用 "/api/submit-email"
    const url = isServer ? GOOGLE_SHEET_URL : API_PROXY_URL;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // GAS 可能返回 text；保险起见
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { success: true, message: text || "ok" };
    }
  } catch (error) {
    console.error('邮箱提交错误:', error);
    return { success: false, message: `提交失败: ${error.message}` };
  }
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

module.exports = {
  submitEmailToGoogleSheets,
  isValidEmail
};