// Improved Google Apps Script for UnicornBlocksEmail writes
// Notes:
// 1) SPREADSHEET_ID must be accessible by the account executing this web app.
// 2) You can override SPREADSHEET_ID using Script Properties key: SPREADSHEET_ID.

const SPREADSHEET_ID = "1B6HehcxI3-g_Zq_UQWmnPvHzhylzapfM6tiLWPBVWw";
const SHEET_NAME = "UnicornBlocksEmail";
const TIMEZONE = "America/New_York";
const HEADERS = ["Email", "Source", "Created_at", "Note", "Status", "PostLeadView", "AdsetName"];
const COL_EMAIL = 1;
const COL_SOURCE = 2;
const COL_CREATED_AT = 3;
const COL_NOTE = 4;
const COL_STATUS = 5;
const COL_POST_LEAD_VIEW = 6;
const COL_ADSET_NAME = 7;

function textOutput_(value) {
  return ContentService.createTextOutput(String(value)).setMimeType(ContentService.MimeType.TEXT);
}

function nowTimestamp_() {
  return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
}

function resolveSpreadsheetId_() {
  const fromProps = (PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "").trim();
  if (fromProps) return fromProps;
  return (SPREADSHEET_ID || "").trim();
}

function getOrCreateSheet_() {
  const spreadsheetId = resolveSpreadsheetId_();
  if (!spreadsheetId) {
    throw new Error("SPREADSHEET_ID_NOT_SET");
  }

  let ss;
  try {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } catch (err) {
    throw new Error(
      "SPREADSHEET_ACCESS_DENIED: " +
        spreadsheetId +
        " (share the sheet with script owner or fix SPREADSHEET_ID). " +
        err
    );
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  const currentCols = Math.max(sheet.getLastColumn(), HEADERS.length);
  const row = sheet.getRange(1, 1, 1, currentCols).getValues()[0];
  let changed = false;

  for (let i = 0; i < HEADERS.length; i++) {
    if (String(row[i] || "").trim() !== HEADERS[i]) {
      sheet.getRange(1, i + 1).setValue(HEADERS[i]);
      changed = true;
    }
  }

  if (changed) {
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#f0f0f0");
  }
}

function findEmailRow_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const values = sheet.getRange(2, COL_EMAIL, lastRow - 1, 1).getValues();
  const target = email.toLowerCase();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0] || "").toLowerCase() === target) {
      return i + 2;
    }
  }
  return -1;
}

function normalizeAdsetName_(value) {
  const v = (value || "").toString().trim();
  return v || "none";
}

function updateAdsetNameIfNeeded_(sheet, rowIndex, incomingAdsetName) {
  const incoming = normalizeAdsetName_(incomingAdsetName);
  if (incoming === "none") return;

  const current = String(sheet.getRange(rowIndex, COL_ADSET_NAME).getValue() || "").trim();
  if (!current || current.toLowerCase() === "none") {
    sheet.getRange(rowIndex, COL_ADSET_NAME).setValue(incoming);
  }
}

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const p = (e && e.parameter) ? e.parameter : {};

    const email = (p.email || "").toString().trim().toLowerCase();
    const source = (p.source || "unknown").toString().trim();
    const note = (p.note || "").toString().trim();
    const postLeadView = (p.post_lead_view || p.postLeadView || "").toString().trim();
    const updateMode = (p.update_mode || p.updateMode || "").toString().trim();
    const leadAction = (p.lead_action || p.leadAction || "").toString().trim();
    const adsetName = normalizeAdsetName_(p.adset_name || p.adsetName || "");

    if (!email) {
      return textOutput_("ERROR: No email provided");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return textOutput_("ERROR: Invalid email format");
    }

    const rowIndex = findEmailRow_(sheet, email);
    const nowTs = nowTimestamp_();

    if (rowIndex > 0) {
      if (updateMode === "postlead-action-only") {
        if (leadAction) {
          sheet.getRange(rowIndex, COL_CREATED_AT).setValue(leadAction);
        }
        return textOutput_("OK");
      }

      if (updateMode === "postlead-only") {
        if (postLeadView) {
          sheet.getRange(rowIndex, COL_POST_LEAD_VIEW).setValue(postLeadView);
        }
        sheet.getRange(rowIndex, COL_CREATED_AT).setValue(nowTs);
        updateAdsetNameIfNeeded_(sheet, rowIndex, adsetName);
        return textOutput_("OK");
      }

      sheet.getRange(rowIndex, COL_SOURCE).setValue(source + " (updated)");
      sheet.getRange(rowIndex, COL_CREATED_AT).setValue(nowTs);
      if (postLeadView) {
        sheet.getRange(rowIndex, COL_POST_LEAD_VIEW).setValue(postLeadView);
      }
      updateAdsetNameIfNeeded_(sheet, rowIndex, adsetName);
      return textOutput_("OK");
    }

    if (updateMode === "postlead-action-only") {
      return textOutput_("OK_NO_ROW");
    }

    let finalNote = note;
    if (source === "paid-user-coupon") {
      finalNote = note;
    } else if (source === "pop-modal") {
      finalNote = "reserve-pop-modal";
    } else if (!finalNote) {
      finalNote = "";
    }

    sheet.appendRow([email, source, nowTs, finalNote, "active", postLeadView || "", adsetName]);
    return textOutput_("OK");
  } catch (err) {
    return textOutput_("ERROR: " + err);
  }
}

function doGet(e) {
  return textOutput_("OK");
}

function testEmailSubmission() {
  const testEvent = {
    parameter: {
      email: "test@example.com",
      source: "test",
      note: "test-submission",
    },
  };

  const result = doPost(testEvent);
  Logger.log("Test result: " + result.getContent());
}

function getAllEmails() {
  try {
    const sheet = getOrCreateSheet_();
    return sheet.getDataRange().getValues();
  } catch (error) {
    Logger.log("getAllEmails error: " + error);
    return [];
  }
}
