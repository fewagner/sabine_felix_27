/**
 * Google Apps Script backend for the wedding RSVP form.
 *
 * It receives a POST from the website and appends one row per RSVP to the
 * bound Google Sheet. See README.md in this folder for deployment steps.
 */

// Name of the sheet/tab that RSVPs are written to (created automatically).
const SHEET_NAME = 'RSVPs';

// Column order written to the sheet. Add fields here AND in the form to extend.
const COLUMNS = ['timestamp', 'name', 'email', 'attending', 'guests', 'dietary', 'message'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid two submissions writing to the same row

  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();

    const row = COLUMNS.map(function (key) {
      if (key === 'timestamp') return new Date();
      return data[key] !== undefined ? data[key] : '';
    });

    sheet.appendRow(row);
    return jsonResponse_({ status: 'ok' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm the script is deployed.
function doGet() {
  return jsonResponse_({ status: 'ok', message: 'RSVP endpoint is live.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS); // header row
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
