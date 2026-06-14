# Sabine & Felix — Wedding Website

A static wedding website hosted on **GitHub Pages**, with an RSVP form that
collects responses into a Google Sheet.

## Project structure

```
.
├── index.html              # Landing page + RSVP form
├── assets/
│   ├── css/styles.css      # Styling / theme
│   └── js/rsvp.js          # RSVP form submission logic
├── apps-script/            # RSVP backend (Google Apps Script → Google Sheet)
│   ├── Code.gs
│   └── README.md           # ← setup steps for the form backend
├── .nojekyll               # Serve files as-is (no Jekyll processing)
└── .gitignore
```

## Going live on GitHub Pages

1. Push to GitHub (this repo: `fewagner/sabine_felix_27`).
2. Repo **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the **`main`** branch and **`/ (root)`** folder, then **Save**.
5. After a minute the site is live at:

   **https://fewagner.github.io/sabine_felix_27/**

> **About the URL:** a bare `something.github.io` address requires a GitHub
> account/organization literally named `something` — and GitHub usernames
> can't contain underscores, so `felix_sabine_27.github.io` isn't possible.
> Options:
> - Use the project URL above (zero extra setup), **or**
> - create a new GitHub account/org named e.g. `felixsabine27` and a repo
>   `felixsabine27.github.io` to get `https://felixsabine27.github.io/`, **or**
> - buy a custom domain (e.g. `sabineandfelix.com`) and point it at Pages via
>   a `CNAME` file.

## Connecting the RSVP form

The form won't store anything until you connect the backend. Follow
[`apps-script/README.md`](./apps-script/README.md) (~5 minutes), then paste
your deployed URL into `assets/js/rsvp.js`.

## Editing content

Look for `TODO` comments in `index.html` to fill in the date, venue, and dress
code as those details are confirmed.

## How the RSVP data is organized

Each guest fills the form once (one row per person), appended to the `RSVPs`
tab of your Google Sheet, with columns: `timestamp, name, email, attending,
shuttle_kirche, shuttle_nacht, dietary, message`. From there you can sort,
filter, count attendees, tally each shuttle, build a pivot table for catering,
or export to CSV — all the usual spreadsheet tools.
