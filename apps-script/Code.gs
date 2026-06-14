/**
 * Google Apps Script backend for the wedding RSVP form.
 * TEMPORARY DEBUG BUILD — records the raw payload so we can see what arrives.
 * We'll strip the _debug_* fields once it's working.
 */

const SHEET_NAME = 'RSVPs';
const SCRIPT_VERSION = 'debug-1'; // bump proves which code the /exec URL runs

const COLUMNS = [
  'timestamp', 'name', 'email', 'attending',
  'shuttle_kirche', 'shuttle_nacht', 'dietary', 'message'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    const data = JSON.parse(raw || '{}');
    data.timestamp = new Date();

    // --- DEBUG: capture exactly what the server received ---
    data._debug_raw = raw;
    data._debug_version = SCRIPT_VERSION;

    const sheet = getSheet_();
    let header = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];

    let headerChanged = false;
    Object.keys(data).forEach(function (key) {
      if (header.indexOf(key) === -1) {
        header.push(key);
        headerChanged = true;
      }
    });
    if (headerChanged) {
      sheet.getRange(1, 1, 1, header.length).setValues([header]);
      sheet.setFrozenRows(1);
    }

    const row = header.map(function (key) {
      return data[key] !== undefined ? data[key] : '';
    });
    sheet.appendRow(row);

    return jsonResponse_({ status: 'ok', version: SCRIPT_VERSION });
  } catch (err) {
    return jsonResponse_({ status: 'error', version: SCRIPT_VERSION, message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({ status: 'ok', version: SCRIPT_VERSION, message: 'RSVP endpoint is live.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
