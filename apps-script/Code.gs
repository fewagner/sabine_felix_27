/**
 * Google Apps Script backend for the wedding RSVP form.
 *
 * It receives a POST from the website and appends one row per RSVP to the
 * bound Google Sheet. See README.md in this folder for deployment steps.
 *
 * The sheet is keyed by HEADER NAME, not column position, so adding or
 * removing form fields later never scrambles existing data: new fields are
 * appended as new columns automatically, removed fields simply stop being
 * filled.
 */

// Name of the sheet/tab that RSVPs are written to (created automatically).
const SHEET_NAME = 'RSVPs';

// Preferred column order for a brand-new sheet. Any field the form sends that
// isn't listed here is still saved — it gets appended as a new column.
const COLUMNS = [
  'timestamp', 'name', 'email', 'attending',
  'shuttle_kirche', 'shuttle_nacht', 'dietary', 'message'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid two submissions writing at once

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    data.timestamp = new Date();

    const sheet = getSheet_();
    let header = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];

    // Make sure every incoming field has a column; add new ones at the end.
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

    // Build the row in the exact order of the (possibly extended) header.
    const row = header.map(function (key) {
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
