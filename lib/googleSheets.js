// Google Sheets 邮箱收集工具函数 (兼容 Browser + Netlify Function)

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
const API_PROXY_URL = "/api/submit-email";

// Survey Google Apps Script URL
const SURVEY_GAS_URL = "https://script.google.com/macros/s/AKfycbzrV2ZNIX8CkBxmdkMAkUiTvuCZDHN6Vv_C4g4VuH9DNzbB6MdlDpYo-RuOT_ZJ6El2/exec";
// Survey 安全 Token - 请替换为随机字符串，并在 Google Apps Script 中设置相同的值
const SURVEY_TOKEN = "UB_SURVEY_2024_SECURE_TOKEN";

async function submitEmailToGoogleSheets(email, source = "website", note = "notify-at-launch") {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, message: "请提供有效的邮箱地址" };
    }

    const isServer = typeof window === "undefined";
    const url = isServer ? GOOGLE_SHEET_URL : API_PROXY_URL;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source,
        note,
      }),
    });

    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${text}`);

    // 兼容 text / json
    try {
      return JSON.parse(text);
    } catch {
      return { success: true, message: text || "ok" };
    }
  } catch (error) {
    console.error("邮箱提交错误:", error);
    return { success: false, message: `提交失败: ${error.message}` };
  }
}

async function submitPaidCouponEmailToGoogleSheets({
  email,
  amount_paid,
  stripe_session_id,
  zipcode,
  source = "stripe",
}) {
  try {
    const base = process.env.PAID_COUPON_GAS_URL;
    if (!base) throw new Error("Missing env: PAID_COUPON_GAS_URL");
    if (!email || !email.includes("@")) throw new Error("Invalid email");

    const u = new URL(base);
    u.searchParams.set("email", email.trim().toLowerCase());
    u.searchParams.set("amount_paid", String(amount_paid ?? ""));
    u.searchParams.set("stripe_session_id", stripe_session_id || "");
    u.searchParams.set("zip", zipcode || "");      // ✅ 兼容 GAS 读 zip
    u.searchParams.set("zipcode", zipcode || "");  // ✅ 兼容 GAS 读 zipcode
    u.searchParams.set("source", source);

    console.log("PAID GAS final url:", u.toString());

    const resp = await fetch(u.toString(), { method: "GET" });
    const text = await resp.text();

    console.log("PAID GAS status:", resp.status);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${text}`);

    return { ok: true, text };
  } catch (e) {
    console.error("PAID 邮箱提交错误:", e);
    throw e; // ✅ 关键：抛出去，让 webhook return 500，从而 Stripe 自动重试
  }
}

async function submitOrderLogToGoogleSheets({ channel, message }) {
  const base = process.env.PAID_COUPON_GAS_URL;
  // ✅ 先用你现成能工作的这个 /exec（不新增 env 也能跑通）
  // 后面你想更干净，可以换成 ORDER_LOG_GAS_URL（可选）

  if (!base) throw new Error("Missing env: PAID_COUPON_GAS_URL");

  const u = new URL(base);
  u.searchParams.set("source", "order-log");
  u.searchParams.set("channel", channel || "unknown");
  u.searchParams.set("message", message || "");
  u.searchParams.set("email", "orders@system.internal"); // 保持脚本如果要求 email 字段也能写

  const resp = await fetch(u.toString(), { method: "GET" });
  const text = await resp.text();
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${text}`);
  return { ok: true, text };
}

async function submitSurveyResponse(surveyData) {
  try {
    // Check if survey URL is configured (not placeholder)
    if (!SURVEY_GAS_URL || SURVEY_GAS_URL === "YOUR_SURVEY_GAS_URL_HERE") {
      console.warn("SURVEY_GAS_URL not configured, falling back to order log");
      const surveyJson = JSON.stringify(surveyData);
      return await submitOrderLogToGoogleSheets({
        channel: 'survey-response',
        message: surveyJson
      });
    }

    // Send to dedicated survey endpoint with token for security
    const response = await fetch(SURVEY_GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...surveyData, token: SURVEY_TOKEN })
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return { ok: true, success: true, message: text };
    }
  } catch (error) {
    console.error("Survey submission error:", error);
    return { ok: false, success: false, error: error.message };
  }
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

module.exports = {
  submitEmailToGoogleSheets,
  submitPaidCouponEmailToGoogleSheets,
  submitOrderLogToGoogleSheets,
  submitSurveyResponse,
  isValidEmail
};
