/*
 * RSVP form submission.
 *
 * Submissions are sent to a Google Apps Script web app, which appends each
 * RSVP as a row in a Google Sheet you own. See /apps-script/README.md for the
 * one-time setup, then paste your deployed web-app URL below.
 */

// 1. Paste your Apps Script web-app URL here after deploying (see apps-script/README.md).
//    It looks like: https://script.google.com/macros/s/AKfy.../exec
const RSVP_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

const form = document.getElementById("rsvp-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("rsvp-submit");

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form-status" + (type ? " is-" + type : "");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Native validation (required fields, email format).
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (RSVP_ENDPOINT.startsWith("PASTE_")) {
    setStatus(
      "RSVP backend not configured yet. Add your Apps Script URL in assets/js/rsvp.js.",
      "error"
    );
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  submitBtn.disabled = true;
  setStatus("Sending…");

  try {
    // text/plain keeps this a "simple" CORS request (no preflight),
    // which Apps Script handles cleanly.
    const response = await fetch(RSVP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || result.status !== "ok") {
      throw new Error(result.message || "Request failed");
    }

    form.reset();
    setStatus("Thank you! Your RSVP has been received. 💛", "success");
  } catch (err) {
    console.error(err);
    setStatus(
      "Sorry, something went wrong sending your RSVP. Please try again, or contact us directly.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
  }
});
