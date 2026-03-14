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
    if (/Exception:|TypeError|ReferenceError/i.test(normalized)) {
      return { ok: false, code: "", error: `Apps Script runtime exception: ${normalized}` };
    }
  }

  return { ok: true, code: "OK", error: "" };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateLeadActionToSheet(email, actionTag) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedActionTag = String(actionTag || "").trim();

  if (!normalizedEmail || !normalizedActionTag) {
    return { success: false, message: "Missing email or actionTag" };
  }

  const maxRetries = 12;
  const retryDelayMs = 400;
  const googleSheetUrl = resolveGoogleSheetUrl();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const body = new URLSearchParams({
        email: normalizedEmail,
        source: "postlead-action-marker",
        note: "",
        timestamp: new Date().toISOString(),
        update_mode: "postlead-action-only",
        lead_action: normalizedActionTag,
        adset_name: "none",
      }).toString();

      const response = await fetch(googleSheetUrl, {
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

      if (parsed.ok && parsed.code !== "OK_NO_ROW") {
        return { success: true, message: "ok" };
      }

      if (!parsed.ok) {
        return {
          success: false,
          message: parsed.error || "Apps Script error",
        };
      }

      if (attempt < maxRetries - 1) {
        await sleep(retryDelayMs);
      }
    } catch (error) {
      if (attempt < maxRetries - 1) {
        await sleep(retryDelayMs);
        continue;
      }

      return {
        success: false,
        message: error.message || "Unknown error",
      };
    }
  }

  return {
    success: false,
    message: "Lead action update skipped: row not ready after retries",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { email, actionTag } = body;

    const result = await updateLeadActionToSheet(email, actionTag);
    const statusCode = result.success ? 200 : 500;

    return res.status(statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
