#!/usr/bin/env python3
"""Extract the website artwork from the printed invitation (400 dpi JPGs).

The invitation is printed on cream paper without a background colour, so its
artwork sits on pure white. This script cuts out the watercolour washes, the
venue illustration, the hand-drawn icons and the five colour dots and turns
the white into transparency, so they can be placed on the website's cream
background exactly like ink on cream paper.

Only artwork regions are cropped, never any text (the printed contact strip
contains private phone numbers and must not end up on the website).

Usage (from the repository root):
    python3 tools/extract_invitation_art.py
"""
import pathlib
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "invitation/v5_pocketfold_A6/01_Druckdaten_Onlineprinters/B_cremefarbenes_Papier__ohne_Cremeton/bilder"
OUT = ROOT / "assets/img"
ICONS = OUT / "icons"

FRONT = "C2_Hauptkarte_vorne_mit_2mm_Beschnitt_400dpi.jpg"
BACK = "C2_Hauptkarte_hinten_mit_2mm_Beschnitt_400dpi.jpg"
STRIP_FRONT = "C4_Streifen_vorne_mit_2mm_Beschnitt_400dpi.jpg"
STRIP_BACK = "C4_Streifen_hinten_mit_2mm_Beschnitt_400dpi.jpg"

# Icon file names, in the order they appear on the "Ablauf" strip (top to bottom).
ICON_NAMES = ["kirche", "ringe", "sekt", "schluessel", "shuttle", "kamera", "abendessen", "party", "mond"]


def load(name):
    return Image.open(SRC / name).convert("RGB")


def unwhite(img, noise=0.035, drop_text=False):
    """Ink-on-white -> RGBA. Alpha is how far a pixel is from white; colour is
    recovered so that compositing over cream looks like printing on cream.
    drop_text=True additionally erases dark ink (printed text, QR code) plus a
    margin around it - watercolour washes never contain dark pixels."""
    a = np.asarray(img).astype(np.float32) / 255.0
    raw = np.maximum(1.0 - a.min(axis=2), 1e-4)
    rgb = np.clip((a - (1.0 - raw)[..., None]) / raw[..., None], 0, 1)
    alpha = np.clip((raw - noise) / (1.0 - noise), 0, 1)  # drop JPEG noise near white
    if drop_text:
        lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
        dark = Image.fromarray(((lum < 0.62) * 255).astype("uint8"))
        dark = np.asarray(dark.filter(ImageFilter.MaxFilter(15))) > 0  # grow by ~7 px
        alpha = np.where(dark, 0.0, alpha)
    out = np.dstack([rgb, alpha])
    return Image.fromarray((out * 255 + 0.5).astype("uint8"), "RGBA")


def fade_top(img, px):
    """Dissolve the top edge over `px` rows (hides a straight crop line through a soft wash)."""
    arr = np.asarray(img).copy()
    ramp = np.clip(np.arange(arr.shape[0], dtype=np.float32) / px, 0, 1)
    arr[..., 3] = (arr[..., 3] * ramp[:, None]).astype("uint8")
    return Image.fromarray(arr, "RGBA")


def trim(img, pad=0):
    """Crop to the visible (non-transparent) area plus padding."""
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def save(img, path, max_w=None, quality=86):
    if max_w and img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, alpha_quality=92, method=6)
    print(f"  {path.relative_to(ROOT)}  {img.width}x{img.height}  {path.stat().st_size // 1024} KB")


def find_bands(mask_rows, min_gap):
    """Group consecutive True rows into (start, end) bands, merging gaps < min_gap."""
    ys = np.where(mask_rows)[0]
    bands, start, prev = [], ys[0], ys[0]
    for y in ys[1:]:
        if y - prev > min_gap:
            bands.append((start, prev))
            start = y
        prev = y
    bands.append((start, prev))
    return bands


def main():
    if not SRC.exists():
        sys.exit(f"Invitation images not found: {SRC}")

    front, back = load(FRONT), load(BACK)
    strip_front, strip_back = load(STRIP_FRONT), load(STRIP_BACK)

    print("Watercolour washes")
    save(trim(unwhite(front.crop((900, 0, 1717, 465)), drop_text=True)), OUT / "wash-pfirsich.webp", max_w=740)
    save(trim(unwhite(front.crop((0, 1740, 530, 2394)), drop_text=True)), OUT / "wash-salbei.webp", max_w=560)

    # Footer band from the bottom of the contact strip: art only (text ends at y=1843; the wash itself starts at y~2020).
    # Mirrored once so it is wide enough for desktop screens (seam is soft, no visible join).
    band = fade_top(unwhite(strip_back.crop((0, 2000, 851, 2394)), drop_text=True), 24)
    wide = Image.new("RGBA", (band.width * 2, band.height))
    wide.paste(band, (0, 0))
    wide.paste(band.transpose(Image.FLIP_LEFT_RIGHT), (band.width, 0))
    save(wide, OUT / "wash-band.webp", max_w=1700, quality=70)

    print("Venue illustration")
    save(trim(unwhite(back.crop((300, 1740, 1400, 2340))), pad=8), OUT / "landhaus-aquarell.webp", max_w=820, quality=80)

    print("Colour dots")
    dots = unwhite(strip_front.crop((200, 2190, 650, 2320)))
    save(trim(dots, pad=6), OUT / "punkte.webp", max_w=420)

    print("Icons")
    # Left column of the strip, below the "Ablauf" heading and above the dots.
    col = strip_front.crop((80, 400, 300, 2180))
    ink = np.asarray(col).min(axis=2) < 232
    bands = find_bands(ink.any(axis=1), min_gap=22)
    if len(bands) != len(ICON_NAMES):
        sys.exit(f"Expected {len(ICON_NAMES)} icons, found {len(bands)}: {bands}")
    for name, (y0, y1) in zip(ICON_NAMES, bands):
        tile = col.crop((0, max(0, y0 - 14), col.width, min(col.height, y1 + 14)))
        icon = trim(unwhite(tile), pad=6)
        save(icon, ICONS / f"{name}.webp", max_w=230, quality=90)


if __name__ == "__main__":
    main()
