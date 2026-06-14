# inputs/

Design source material for the wedding website.

> **Action needed:** the three images can't be saved automatically from chat.
> Please add them here yourself — easiest via GitHub:
> open the repo on branch `claude/jolly-gates-60w888` →
> **Add file → Upload files** → drop them into this `inputs/` folder.
> Use these **exact filenames** so the site picks them up:

| File                        | What it is                          | Used for |
|-----------------------------|-------------------------------------|----------|
| `style-moodboard.jpg`       | Mood board (flowers, venue, palette) | Design reference only |
| `style-palette.png`         | "Hochzeit Felix & Sabine" colour palette | Design reference only |
| `venue-drawing.png`         | Line drawing of the venue            | **Background of the website** |

Once `venue-drawing.png` is uploaded, it appears automatically as a faint
watermark behind the whole page (wired up in `assets/css/styles.css`).
If you'd rather name it differently, update the `body::before` rule there.

## Palette in use (read from the images)

| Name          | Hex       |
|---------------|-----------|
| Sunflower     | `#E0B451` |
| Perfect Peach | `#EE9452` |
| Softest Pink  | `#D39BA0` |
| Velvet Blue   | `#777E88` |
| Sage Green    | `#9CB173` |
| Light Blue    | `#B9CDE8` |
| Cream paper   | `#F3EDDE` |
