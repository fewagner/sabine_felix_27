# Sabine & Felix — Wedding Website

A static wedding website hosted on **GitHub Pages**, with an RSVP form that
collects responses into a Google Sheet.

## Project structure

```
.
├── index.html              # Landing page + RSVP form (German)
├── assets/
│   ├── css/styles.css      # Styling / theme (matches the printed invitation)
│   ├── js/rsvp.js          # RSVP form submission logic
│   ├── fonts/              # Self-hosted fonts (Cormorant Garamond, Alex Brush; OFL)
│   └── img/                # Watercolour art, icons, venue illustration (from the invitation)
├── tools/
│   └── extract_invitation_art.py   # re-creates assets/img from the invitation print files
├── invitation/             # Printed invitation (print data) + PowerPoint draft
├── apps-script/            # RSVP backend (Google Apps Script → Google Sheet)
│   ├── Code.gs
│   └── README.md           # ← setup steps for the form backend
├── inputs/                 # Original design inputs (mood board, palette, drawing)
├── .nojekyll               # Serve files as-is (no Jekyll processing)
└── .gitignore
```

> **Heads-up:** GitHub Pages publishes *every* file in the published branch, and this
> repository is public. Do not commit anything private (e.g. phone numbers on print
> files) under `invitation/` or elsewhere.

## Going live on GitHub Pages

1. Push to GitHub (this repo: `fewagner/sabine_felix_27`).
2. Repo **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the **`main`** branch and **`/ (root)`** folder, then **Save**.
5. After a minute the site is live at:

   **https://fewagner.github.io/sabine_felix_27/**
   (the printed invitation / QR code uses `https://fewagner.com/sabine_felix_27/`)

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

## Design

The site mirrors the printed invitation (`invitation/v5_pocketfold_A6/…`):

| Element | Value |
|---|---|
| Script headings | Alex Brush, `#546382` (slate blue) |
| Body text | Cormorant Garamond 500, `#3b4355` (navy), lining numerals |
| Small-caps labels | Cormorant Garamond 700, letter-spaced, `#4c5b76` |
| Times / accents | `#984f22` (terracotta) |
| Paper | `#f6f0e4` (cream) |
| Watercolour dots | `#e7c46c` `#f0a467` `#dfb3b7` `#c3d4eb` `#b7c796` |

All colours were measured from the print files. The artwork in `assets/img/` is cut
out of the invitation JPGs by `python3 tools/extract_invitation_art.py` (white →
transparent, so it sits on the cream background like ink on cream paper). The script
only crops artwork, never text.

Preview locally: `python3 -m http.server 8000` and open <http://localhost:8000>.
(After changing CSS/JS, bump the `?v=` number in `index.html` so browsers reload it.)

## Editing content

All texts are plain German HTML in `index.html` (schedule, accommodation, FAQ, dress code, …).
The schedule and details should always match the printed invitation.

## How the RSVP data is organized

Each guest fills the form once (one row per person), appended to the `RSVPs`
tab of your Google Sheet, with columns: `timestamp, name, email, attending,
shuttle_kirche, shuttle_nacht, uebernachtung, apartment_mit, dietary, message`
(an older `hotel` column may still exist from earlier test entries – it is simply left empty now). From there you can sort,
filter, count attendees, tally each shuttle, build a pivot table for catering,
or export to CSV — all the usual spreadsheet tools.
