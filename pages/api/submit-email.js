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
const ADSET_NAME_STORAGE_KEY = "ub_meta_adset_name";
const ADSET_QUERY_KEYS = ["adset_name", "adsetName", "adset", "utm_content"];

function decodeJsEscapes(value = "") {
  return String(value)
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractAppsScriptUserHtml(text = "") {
  if (!text) return "";

  const patterns = [
    /"userHtml"\s*:\s*"([^"]*)"/i,
    /\\x22userHtml\\x22:\\x22([\s\S]*?)\\x22/i,
    /\\\\x22userHtml\\\\x22:\\\\x22([\s\S]*?)\\\\x22/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return decodeJsEscapes(match[1]).trim();
    }
  }

  return "";
}

function parseAppsScriptResult(text = "") {
  if (!text) return { ok: true, code: "OK", error: "" };

  const trimmed = String(text).trim();
  const userHtml = extractAppsScriptUserHtml(text);
  const isHtmlWrapper = /<!doctype html>|<html[\s>]/i.test(trimmed);
  const candidates = [];
  if (userHtml) candidates.push(userHtml);
  // Only treat full body as payload when it is not an HTML wrapper.
  if (!isHtmlWrapper) candidates.push(trimmed);

  for (const candidate of candidates) {
    const normalized = candidate.trim();
    if (/^OK_NO_ROW$/i.test(normalized)) {
      return { ok: true, code: "OK_NO_ROW", error: "" };
    }
    if (/^OK$/i.test(normalized)) {
      return { ok: true, code: "OK", error: "" };
    }
    if (/^ERROR:/i.test(normalized)) {
      return { ok: false, code: "", error: normalized };
    }
    // Only inspect actual payloads (userHtml / direct text).
    if (/Exception:|TypeError|ReferenceError/i.test(normalized)) {
      return { ok: false, code: "", error: `Apps Script runtime exception: ${normalized}` };
    }
  }

  // Specific document-access error from Apps Script wrapper.
  const docMissing = text.match(
    /Document\s+([a-zA-Z0-9_-]+)\s+is missing[^<\n"]*/i
  );
  if (docMissing) {
    return {
      ok: false,
      code: "",
      error: `Spreadsheet access error: ${docMissing[0]}. Check SPREADSHEET_ID and sharing permissions for the Apps Script owner.`,
    };
  }

  const genericError = text.match(/ERROR:\s*([^<\n"]+)/i);
  if (genericError) {
    return { ok: false, code: "", error: genericError[0].trim() };
  }

  // Unknown HTML wrapper but no explicit error marker: treat as success.
  return { ok: true, code: "OK", error: "" };
}

function normalizeAdsetName(value = "") {
  const normalized = String(value || "").trim();
  return normalized || "none";
}

function extractAdsetNameFromUrl(rawUrl = "") {
  if (!rawUrl) return "";
  try {
    const parsed = new URL(rawUrl, "http://localhost");
    for (const key of ADSET_QUERY_KEYS) {
      const value = (parsed.searchParams.get(key) || "").trim();
      if (value) return value;
    }
  } catch {}
  return "";
}

function resolveAdsetNameFromRequest(req, bodyValue) {
  const explicit = normalizeAdsetName(bodyValue);
  if (explicit !== "none") return explicit;

  const fromReferer = extractAdsetNameFromUrl(req.headers.referer || req.headers.referrer || "");
  if (fromReferer) return normalizeAdsetName(fromReferer);

  const fromCookie = req.cookies?.[ADSET_NAME_STORAGE_KEY] || "";
  if (fromCookie && String(fromCookie).trim()) {
    return normalizeAdsetName(decodeURIComponent(String(fromCookie)));
  }

  return "none";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, source, note, postLeadView, updateMode, leadAction, adsetName, adset_name } = req.body;
    const resolvedAdsetName = resolveAdsetNameFromRequest(req, adset_name || adsetName);

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
      adset_name: resolvedAdsetName,
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

    const parsed = parseAppsScriptResult(text);
    if (parsed.ok) {
      const successMessage =
        parsed.code === "OK_NO_ROW" ? "OK_NO_ROW" : "您已成功加入我们的通知列表！🎉";
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    return res.status(400).json({
      success: false,
      message: `提交失败: ${parsed.error || "Apps Script error"}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `服务器错误: ${error.message}`,
    });
  }
}
