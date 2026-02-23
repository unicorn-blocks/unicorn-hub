// pages/api/submit-email.js  (或你现在实际的 api 路径)

const DEFAULT_GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyn8MOU7baUKZ2exFQsLZD6hGs8poE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";

function resolveGoogleSheetUrl() {
  const candidates = [
    process.env.GOOGLE_SHEETS_WEB_APP_URL,
    process.env.GOOGLE_SHEETS_URL,
    DEFAULT_GOOGLE_SHEET_URL,
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === "string" &&
      candidate.trim() &&
      !candidate.includes("YOUR_SCRIPT_ID")
    ) {
      return candidate.trim();
    }
  }

  return DEFAULT_GOOGLE_SHEET_URL;
}

const GOOGLE_SHEET_URL = resolveGoogleSheetUrl();

function extractAppsScriptError(text = "") {
  if (!text) return "";

  const docMissing = text.match(
    /Document\s+([a-zA-Z0-9_-]+)\s+is missing[^<\n"]*/i
  );
  if (docMissing) {
    return `Spreadsheet access error: ${docMissing[0]}. Check SPREADSHEET_ID and sharing permissions for the Apps Script owner.`;
  }

  const genericError = text.match(/ERROR:\s*([^<\n"]+)/i);
  if (genericError) {
    return genericError[0].trim();
  }

  if (/Exception:|TypeError|ReferenceError/i.test(text)) {
    return "Apps Script runtime exception";
  }

  return "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, source, note, postLeadView, updateMode, leadAction } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "请提供有效的邮箱地址" });
    }

    // ✅ 可选：本地开发时用模拟（避免你本机网络/代理问题影响开发）
    // 你可以在本机运行：MOCK_SHEETS=1 npm run dev
    const isMock = process.env.MOCK_SHEETS === "1";
    if (isMock) {
      await new Promise((r) => setTimeout(r, 300));
      return res.status(200).json({
        success: true,
        message: "您已成功加入我们的通知列表！🎉 (mock)",
      });
    }

    const body = new URLSearchParams({
      email: email.trim().toLowerCase(),
      source: source || "api-proxy",
      note: note || "notify-at-launch",
      timestamp: new Date().toISOString(),
      ...(postLeadView ? { post_lead_view: String(postLeadView) } : {}),
      ...(updateMode ? { update_mode: String(updateMode) } : {}),
      ...(leadAction ? { lead_action: String(leadAction) } : {}),
    }).toString();

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      redirect: "follow",
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const appsScriptError = extractAppsScriptError(text);
    if (!appsScriptError) {
      return res.status(200).json({
        success: true,
        message: "您已成功加入我们的通知列表！🎉",
      });
    }

    return res.status(400).json({
      success: false,
      message: `提交失败: ${appsScriptError}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `服务器错误: ${error.message}`,
    });
  }
}
