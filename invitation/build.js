// Builds Einladung_Felix_Sabine.pptx  (run: node build.js)
// A4 landscape, 3 slides: 1 = Außenseite (Titel), 2 = Innenseite (Brief + Ablauf), 3 = Infoblatt.
const pptxgen = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const path = require("path");

const SKILL = "/root/.claude/skills/synced/764dda75-4e02-4932-ab7a-f150ab5d0e12_ae8df664-3f34-4921-8c79-fc6531fa94a1/pptx";
const { applyTheme } = require(path.join(SKILL, "scripts/apply_theme.js"));

const OUT = "Einladung_Felix_Sabine.pptx";
const W = 11.69, H = 8.27; // A4 landscape (inches)

// ---- Theme: palette from the couple's mood board / website ----
const THEME = {
  name: "Felix und Sabine",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "4C473F", lt1: "F7F2E8", dk2: "777E88", lt2: "ECE3D0",
    accent1: "EE9452", accent2: "E0B451", accent3: "D39BA0",
    accent4: "B9CDE8", accent5: "9CB173", accent6: "777E88",
    hlink: "777E88", folHlink: "9CB173",
  },
};

const pres = new pptxgen();
pres.defineLayout({ name: "A4_LANDSCAPE", width: W, height: H });
pres.layout = "A4_LANDSCAPE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Einladung Felix & Sabine";
pres.author = "Felix & Sabine";
const C = pres.SchemeColor;

pres.defineSlideMaster({
  title: "KARTE",
  background: { color: THEME.colors.lt1 }, // Papier-Creme
  objects: [],
});

// ---- helpers ----
async function icon(Comp, color, px = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(px) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
const CORNER = "assets/corner.png";
function corners(slide, size, opts = {}) {
  // Aquarell-Ecken (wie die Zitronenzweige der Vorlage), an allen vier Ecken gespiegelt
  const o = { w: size, h: size, transparency: opts.t ?? 0 };
  slide.addImage({ path: CORNER, x: 0, y: 0, ...o, objectName: "Ecke oben links" });
  slide.addImage({ path: CORNER, x: W - size, y: 0, flipH: true, ...o, objectName: "Ecke oben rechts" });
  slide.addImage({ path: CORNER, x: 0, y: H - size, flipV: true, ...o, objectName: "Ecke unten links" });
  slide.addImage({ path: CORNER, x: W - size, y: H - size, flipH: true, flipV: true, ...o, objectName: "Ecke unten rechts" });
}
const label = (slide, text, x, y, w, color = C.text2, align = "left") =>
  slide.addText(text.toUpperCase(), {
    x, y, w, h: 0.4, fontFace: THEME.headFontFace, fontSize: 16, bold: true, charSpacing: 4,
    color, align, margin: 0, valign: "middle", isTextBox: true, objectName: "Überschrift " + text,
  });

(async () => {
  const ink = THEME.colors.dk1, blue = THEME.colors.dk2;

  // =========================================================
  // Folie 1 – Außenseite: zwei Türen (Flügelfalz), links Felix, rechts Sabine
  // =========================================================
  const s1 = pres.addSlide({ masterName: "KARTE" });
  corners(s1, 3.3);
  // Falz in der Mitte
  s1.addShape(pres.ShapeType.line, { x: W / 2, y: 0.35, w: 0, h: H - 0.7, line: { color: THEME.colors.lt2, width: 1.25, dashType: "dash" }, objectName: "Falz" });
  // Venue-Zeichnung dezent als Fußmotiv über beide Türen
  s1.addImage({ path: "assets/venue.png", x: W / 2 - 2.6, y: H - 3.4, w: 5.2, h: 3.9, transparency: 78, objectName: "Zeichnung Location" });

  s1.addText("Felix", { x: 0.5, y: 2.55, w: W / 2 - 1, h: 1.3, fontFace: THEME.headFontFace, italic: true, fontSize: 66, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Name Felix" });
  s1.addText("10. Juli 2027", { x: 0.5, y: 3.95, w: W / 2 - 1, h: 0.5, fontFace: THEME.headFontFace, fontSize: 20, color: C.text1, align: "center", margin: 0, isTextBox: true, objectName: "Datum" });
  s1.addText("Sabine", { x: W / 2 + 0.5, y: 2.55, w: W / 2 - 1, h: 1.3, fontFace: THEME.headFontFace, italic: true, fontSize: 66, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Name Sabine" });
  s1.addText("Landhaus Obersteinriegl", { x: W / 2 + 0.5, y: 3.95, w: W / 2 - 1, h: 0.5, fontFace: THEME.headFontFace, fontSize: 20, color: C.text1, align: "center", margin: 0, isTextBox: true, objectName: "Ort" });
  s1.addNotes("Außenseite: A4 quer, einmal mittig gefaltet (Flügelfalz). Links Felix, rechts Sabine.");

  // =========================================================
  // Folie 2 – Innenseite: links Brief im Bogenrahmen, rechts „Unser Tag"
  // =========================================================
  const s2 = pres.addSlide({ masterName: "KARTE" });
  corners(s2, 1.7, { t: 25 });

  // Bogenrahmen (Brief)
  s2.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 0.7, w: 5.0, h: 6.85, rectRadius: 0.35, fill: { color: "FFFFFF", transparency: 35 }, line: { color: blue, width: 1.5 }, objectName: "Rahmen Brief" });
  s2.addText("Liebe Familie, liebe Freunde,", { x: 0.95, y: 1.0, w: 4.3, h: 0.6, fontFace: THEME.headFontFace, italic: true, fontSize: 20, valign: "middle", color: C.text2, margin: 0, isTextBox: true, objectName: "Anrede" });
  s2.addText(
    [
      { text: "wir heiraten – und möchten diesen besonderen Tag mit euch feiern!", options: { breakLine: true, paraSpaceAfter: 9 } },
      { text: "Am ", options: {} },
      { text: "Samstag, 10. Juli 2027", options: { bold: true } },
      { text: " sagen wir in der Pfarrkirche Ybbsitz Ja zueinander und feiern danach im ", options: {} },
      { text: "Landhaus Obersteinriegl", options: { bold: true } },
      { text: ".", options: { breakLine: true, paraSpaceAfter: 9 } },
      { text: "Euer Kommen ist unser größtes Geschenk. Wir freuen uns auf einen Tag voller Liebe, Lachen und Tanzen.", options: { breakLine: true, paraSpaceAfter: 9 } },
      { text: "Bitte meldet euch bis zum ", options: {} },
      { text: "[TT.MM.JJJJ]", options: { bold: true, color: THEME.colors.accent1 } },
      { text: " über unsere Website zurück – jede Person bitte einzeln, auch Begleitungen (+1).", options: { breakLine: true, paraSpaceAfter: 9 } },
      { text: "Mit großer Vorfreude", options: {} },
    ],
    { x: 0.95, y: 1.85, w: 4.3, h: 4.3, fontFace: THEME.bodyFontFace, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: "Brieftext" }
  );
  s2.addText("Felix & Sabine", { x: 0.95, y: 6.4, w: 4.3, h: 0.7, fontFace: THEME.headFontFace, italic: true, fontSize: 30, color: C.text2, margin: 0, valign: "middle", isTextBox: true, objectName: "Unterschrift" });

  // Ablauf
  label(s2, "Unser Tag", 6.4, 0.75, 4.5);
  const day = [
    [fa.FaMapMarkerAlt, "12.00", "Treffpunkt vor der Kirche in Ybbsitz", THEME.colors.accent3],
    [fa.FaRing, "12.30", "Trauung in der Pfarrkirche Ybbsitz", THEME.colors.accent2],
    [fa.FaGlassCheers, "13.30", "Agape am Marktplatz Ybbsitz", THEME.colors.accent1],
    [fa.FaBed, "14.30", "Zeit zum selbständigen Einchecken im Hotel", THEME.colors.accent5],
    [fa.FaBus, "15.00", "Shuttle Ybbsitz – Waidhofen – Obersteinriegl", THEME.colors.accent4],
    [fa.FaCamera, "16.00", "Gruppenfotos & Glückwünsche", THEME.colors.accent3],
    [fa.FaUtensils, "19.00", "Abendessen", THEME.colors.accent2],
    [fa.FaMusic, "21.00", "Party – wir tanzen bis in die Nacht", THEME.colors.accent1],
    [fa.FaMoon, "ab 24.00", "Shuttles zurück nach Waidhofen", THEME.colors.accent5],
  ];
  const y0 = 1.4, step = 0.68;
  for (let i = 0; i < day.length; i++) {
    const [Ic, time, text, col] = day[i];
    const y = y0 + i * step;
    s2.addShape(pres.ShapeType.ellipse, { x: 6.4, y, w: 0.52, h: 0.52, fill: { color: col }, line: { type: "none" }, objectName: `Kreis ${time}` });
    s2.addImage({ data: await icon(Ic, "FFFFFF"), x: 6.4 + 0.13, y: y + 0.13, w: 0.26, h: 0.26, objectName: `Icon ${time}`, altText: text });
    s2.addText(`${time} Uhr`, { x: 7.1, y, w: 1.55, h: 0.52, fontFace: THEME.headFontFace, fontSize: 15, bold: true, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: `Zeit ${time}` });
    s2.addText(text, { x: 8.7, y, w: 2.7, h: 0.52, fontFace: THEME.bodyFontFace, fontSize: 14, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: `Programmpunkt ${time}` });
  }
  s2.addNotes("Innenseite links: Brief. Rechts: Tagesablauf. Platzhalter [TT.MM.JJJJ] = Rückmeldefrist, bitte eintragen.");

  // =========================================================
  // Folie 3 – Infoblatt (Rückseite / Einlegeblatt)
  // =========================================================
  const s3 = pres.addSlide({ masterName: "KARTE" });
  corners(s3, 1.5, { t: 30 });
  const colW = 3.3, gap = 0.45, xs = [0.6, 0.6 + colW + gap, 0.6 + 2 * (colW + gap)];
  const body = { fontFace: THEME.bodyFontFace, fontSize: 13, color: C.text1, valign: "top", margin: 0, isTextBox: true };

  // Spalte 1 – Location & Anfahrt
  label(s3, "Location", xs[0], 0.8, colW);
  s3.addText("Landhaus Obersteinriegl", { x: xs[0], y: 1.3, w: colW, h: 0.45, fontFace: THEME.headFontFace, italic: true, fontSize: 20, color: C.text2, margin: 0, isTextBox: true, objectName: "Location Name" });
  s3.addText("www.landhaus-obersteinriegl.at", { x: xs[0], y: 1.8, w: colW, h: 0.35, fontFace: THEME.bodyFontFace, fontSize: 12, color: C.text2, margin: 0, isTextBox: true, hyperlink: { url: "https://www.landhaus-obersteinriegl.at/" }, objectName: "Location Website" });
  s3.addImage({ path: "assets/venue.png", x: xs[0] - 0.1, y: 2.3, w: colW + 0.2, h: (colW + 0.2) * 0.75, transparency: 15, objectName: "Zeichnung Location" });
  label(s3, "Dresscode", xs[0], 5.35, colW);
  s3.addText("Sommerlich, gerne farbenfroh und festlich – gemütlich, sommerlich, hochzeitlich. Kleider, Jumpsuits, elegante Zweiteiler oder Anzüge, gerne in leichten Stoffen. Eine Krawatte ist kein Muss. Farblich gibt es keine Vorgaben – wer Inspiration sucht, orientiert sich an den Farben dieser Karte.", { ...body, x: xs[0], y: 5.85, w: colW, h: 1.9, fontSize: 12, objectName: "Dresscode Text" });

  // Spalte 2 – Anreise, Shuttle, Übernachtung
  label(s3, "Shuttle", xs[1], 0.8, colW);
  s3.addText("Die Abendlocation liegt auf einem Hügel, vor Ort gibt es nur wenige Parkplätze. Wir organisieren deshalb Shuttles von Kirche, Agape und Hotels zur Location – und nach Mitternacht wieder zurück nach Waidhofen. Damit wir planen können, gebt uns bitte bekannt, wo ihr übernachtet.", { ...body, x: xs[1], y: 1.3, w: colW, h: 2.6, objectName: "Shuttle Text" });
  label(s3, "Übernachtung", xs[1], 4.15, colW);
  s3.addText(
    [
      { text: "Bitte reserviert euer Hotel in Waidhofen an der Ybbs selbstständig und gebt uns bekannt, ob und wo ihr reserviert habt.", options: { breakLine: true, paraSpaceAfter: 8 } },
      { text: "Schloss an der Eisenstraße", options: { bullet: true, breakLine: true } },
      { text: "Hotel Leopold", options: { bullet: true, breakLine: true } },
      { text: "Hotel Moshammer", options: { bullet: true } },
    ],
    { ...body, x: xs[1], y: 4.65, w: colW, h: 2.8, objectName: "Übernachtung Text" }
  );

  // Spalte 3 – Rückmeldung (QR)
  label(s3, "Rückmeldung", xs[2], 0.8, colW);
  s3.addText("Alle Infos und das Rückmeldeformular findet ihr auf unserer Website. Bitte meldet euch bis zum [TT.MM.JJJJ] zurück – jede Person einzeln.", { ...body, x: xs[2], y: 1.3, w: colW, h: 1.5, objectName: "Rückmeldung Text" });
  s3.addShape(pres.ShapeType.roundRect, { x: xs[2] + 0.35, y: 3.05, w: 2.6, h: 2.6, rectRadius: 0.15, fill: { color: "FFFFFF" }, line: { color: THEME.colors.lt2, width: 1 }, objectName: "QR Rahmen" });
  s3.addImage({ path: "assets/qr.png", x: xs[2] + 0.5, y: 3.2, w: 2.3, h: 2.3, objectName: "QR-Code Website", altText: "QR-Code zur Hochzeitswebsite" });
  s3.addText("fewagner.github.io/sabine_felix_27", { x: xs[2], y: 5.8, w: colW, h: 0.4, fontFace: THEME.bodyFontFace, fontSize: 11, color: C.text2, align: "center", margin: 0, isTextBox: true, hyperlink: { url: "https://fewagner.github.io/sabine_felix_27/" }, objectName: "Website URL" });
  s3.addText("Wir freuen uns auf euch!", { x: xs[2], y: 6.6, w: colW, h: 0.6, fontFace: THEME.headFontFace, italic: true, fontSize: 22, color: C.text2, align: "center", margin: 0, isTextBox: true, objectName: "Schlusssatz" });
  s3.addNotes("Infoblatt: Location, Dresscode, Shuttle, Übernachtung, Rückmeldung mit QR-Code.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("written", OUT);
})();
