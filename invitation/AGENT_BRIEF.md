# Brief for the next agent: wedding invitation (print, PowerPoint)

## Goal
Design a postal wedding invitation for **Felix & Sabine**, delivered as an **editable PowerPoint (.pptx)** the couple can open and change themselves. All guests speak **German only**, so all card text is German. Keep this brief and your messages to the couple in whatever language they use (they write English to the agent, German on the card).

A first draft exists (`Einladung_Felix_Sabine.pptx`, built by `build.js`). The couple wants to try again with a different agent and locally, so treat the draft as a starting point, not a constraint. You can restyle freely, but do not change the facts below.

## Reference style (what the couple liked)
They received a gatefold invitation from another wedding and want something similar:
- **Outside:** A4 landscape card folded once in the middle (gatefold / "Flügelfalz"). Two "doors": left door = bride/groom name 1 + date, right door = name 2 + location. Botanical corner illustrations (watercolour lemons, olive leaves). Script names in muted blue.
- **Inside:** One landscape sheet. Left/centre: personal letter inside an arched frame on a light blue striped watercolour background, with a lemon branch overlapping the frame corner. Handwritten-style greeting. Right: "Unser Tag" timeline with small line-art icons (glasses, rings, cake, camera, plate, disco ball, clock). Left strip: "Location" (photo + address) and "Übernachtung" (hotel advice, shuttle).
- Overall feel: light, airy, handwritten script + serif body, soft watercolour, blue accent.

The couple's own palette is warmer than the reference (see below). The original reference photos were shared in chat only, not stored in the repo.

## Facts (do not invent beyond these)
- **Couple:** Felix & Sabine. Mood board and palette use the order "Felix & Sabine".
- **Date:** Saturday, 10 July 2027.
- **Ceremony:** Pfarrkirche Ybbsitz (Austria). Probably a Wortgottesdienst, so **never write "Messe"**; say "Trauung".
- **Reception / evening:** Landhaus Obersteinriegl, https://www.landhaus-obersteinriegl.at/ (on a hill, few parking spots; no street address known yet, ask the couple).
- **Schedule:**
  - 12.00 Treffpunkt vor der Kirche in Ybbsitz
  - 12.30 Trauung
  - 13.30 Agape am Marktplatz Ybbsitz
  - 14.30 Zeit zum selbständigen Einchecken im Hotel
  - 15.00 Shuttle Ybbsitz – Waidhofen – Obersteinriegl
  - 16.00 Landhaus Obersteinriegl: Gruppenfotos & Glückwünsche
  - 19.00 Abendessen
  - 21.00 Party
  - ab Mitternacht: Shuttles zurück nach Waidhofen
- **Dresscode:** "gemütlich, sommerlich, hochzeitlich". Longer text: summery, gladly colourful and festive; dresses, jumpsuits, elegant two-pieces or suits, light fabrics/light colours welcome; tie optional; no colour rules, guests may take inspiration from the palette.
- **Hotels (guests book themselves, all in Waidhofen an der Ybbs):** Schloss an der Eisenstraße (https://www.schlosseisenstrasse.at/de/), Hotel Leopold (https://leopold-ybbs.at/willkommen), Hotel Moshammer (https://hotel-moshammer.at/zimmer-suiten/). Guests must tell the couple whether and where they booked, because shuttles (from church/Agape/hotels to the venue and back after midnight) are planned from that.
- **RSVP:** via the website, **one form per person** (+1s register separately). Deadline is **not decided yet**; the draft uses the placeholder `[TT.MM.JJJJ]`. Ask the couple, do not guess.
- **Website:** project URL https://fewagner.github.io/sabine_felix_27/ (the QR code in the draft points here; regenerate it if the URL changes). The site itself is in the repo root (`index.html`, `assets/`); its palette and wording are the source of truth.

## Palette (from the website / mood board)
Sunflower `#E0B451`, Perfect Peach `#EE9452`, Softest Pink `#D39BA0`, Velvet Blue `#777E88`, Sage Green `#9CB173`, Light Blue `#B9CDE8`, paper cream `#F3EDDE`, ink `#4C473F`.

## Available assets
- `inputs/venue-drawing.png`: line drawing of the venue (black on white). `assets/venue.png` / `../assets/img/venue-bg.png` are transparent, ink-tinted versions.
- `inputs/style-moodboard.jpeg`, `inputs/style-palette.jpeg`: style references.
- `assets/corner.png`: generated abstract watercolour corner (placeholder, can be replaced by real botanical art), `assets/qr.png`: QR code for the website.
- **Couple's own photos:** in a Mega folder (https://mega.nz/folder/RGYxmYBA#Pr6bzhWAKW198d3t9iMTRg). The previous (cloud) agent could not reach mega.nz, so the photos are **not used yet**. If you can access them locally, use them (cover, inside photo) and ask the couple which one for which place.

## Tooling notes (learned the hard way)
- Build with **pptxgenjs** (`npm install && node build.js`). Page size is a custom A4 landscape layout (11.69 x 8.27 in). Hex colours without `#`; never share option objects between calls.
- If you use the Claude `pptx` skill's `apply_theme.js`, run node with `NODE_PATH=$PWD/node_modules`.
- **Render to check your work:** LibreOffice needs the *Impress* component (`libreoffice-impress`) to convert pptx to pdf; then rasterize the PDF (e.g. PyMuPDF). Look at every slide.
- Fonts: the draft uses **Cambria + Calibri** (installed with Office). The previewer substitutes a wider font, so real PowerPoint will look roomier. Script fonts like Pinyon Script or Cormorant Garamond (used on the website) are not in Office; use them only if the couple installs them, or ship them as images for headings.
- Keep all text as real, editable text boxes (no flattened images of text), icons as images, and give shapes meaningful `objectName`s.
- Print: leave a safe margin of about 0.5 in (about 1.3 cm) for text; if you add full-bleed art, extend it beyond the page edge or tell the couple to print "fit to page" and mind the white border.

## Open items / ideas
1. Fill the RSVP deadline once chosen.
2. Replace the abstract corner art with real watercolour botanicals (and the couple's photos if available).
3. Add the venue address and optionally a small map.
4. Consider a separate small RSVP/info card or an envelope/label template.
5. Export a print-ready PDF in addition to the editable pptx.

## Working rules for this repo
- Branch: `claude/jolly-gates-60w888`. Commit with clear messages and push to that branch. Do **not** open a PR unless the couple asks.
- Do not commit `node_modules` (already gitignored). Do not commit personal data.
