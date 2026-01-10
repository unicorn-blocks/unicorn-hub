// Google Sheets 邮箱收集工具函数 (兼容 Browser + Netlify Function)

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
const API_PROXY_URL = "/api/submit-email";

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

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

module.exports = {
  submitEmailToGoogleSheets,
  submitPaidCouponEmailToGoogleSheets,
  isValidEmail,
};
