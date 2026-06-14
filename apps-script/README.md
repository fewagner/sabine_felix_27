# RSVP backend — Google Sheets via Apps Script

This connects the website's RSVP form to a Google Sheet you own. Every
submission becomes one row. No third-party service, free, and the data lives
in your own Google Drive.

## One-time setup (~5 minutes)

1. **Create the sheet.** Go to <https://sheets.new>, name it e.g.
   "Wedding RSVPs". (The `RSVPs` tab and header row are created automatically
   on the first submission — you don't need to add columns yourself.)

2. **Open the script editor.** In that sheet: **Extensions → Apps Script**.

3. **Paste the code.** Delete the default `function myFunction() {}` and paste
   the entire contents of [`Code.gs`](./Code.gs). Save (💾).

4. **Deploy as a web app.** Click **Deploy → New deployment** → gear icon →
   **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Click **Deploy**, authorize when prompted (it's your own account), and copy
   the **Web app URL** (ends in `/exec`).

5. **Wire up the site.** Open [`../assets/js/rsvp.js`](../assets/js/rsvp.js)
   and paste that URL as the value of `RSVP_ENDPOINT`. Commit and push.

6. **Test.** Open the live site, submit a test RSVP, and confirm a new row
   appears in the sheet. You can also open the `/exec` URL directly in a
   browser — it should return `{"status":"ok",...}`.

## Updating the code later

If you change `Code.gs`, redeploy via **Deploy → Manage deployments → edit
(pencil) → Version: New version → Deploy**. The URL stays the same.

## Adding or removing form fields

Keep three places in sync:
- the `<input>` in `index.html` (its `name` attribute),
- the `COLUMNS` array in `Code.gs`.

The JS sends every form field automatically, so no change is needed there.
