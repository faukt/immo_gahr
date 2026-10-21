/* ============================================================
   Build: lädt themenpassende Fotos (Unsplash, serverseitig
   skaliert), encodet sie als Base64 und injiziert sie in
   template.html -> schreibt die finale, offline-fähige
   gahr-immobilien.html.
   Aufruf:  node build/fetch-and-build.js
   ============================================================ */
const https = require("https");
const fs = require("fs");
const path = require("path");

// key -> Unsplash photo id. Thematik: Weinviertel/Marchfeld,
// Häuser, Interieur, Wohnungen, Gewerbe, Land/Weingarten.
const PHOTOS = {
  hero:              "1600585154340-be6161a56a0c", // ruhiges Haus, warm
  house_classic:     "1564013799919-ab600027ffc6",
  house_white:       "1512917774080-9991f1c4c750",
  house_lux_1:       "1600596542815-ffad4c1539a9",
  house_lux_2:       "1600585154340-be6161a56a0c",
  house_modern_1:    "1568605114967-8130f3a36994",
  house_modern_2:    "1570129477492-45c003edd2be",
  house_country:     "1605276374104-dee2a0ed3cd6",
  interior_living_1: "1600607687939-ce8a6c25118c",
  interior_living_2: "1600566753086-00f18fb6b3ea",
  interior_kitchen:  "1600489000022-c2086d79f9d4",
  apartment_1:       "1493809842364-78817add7ffb",
  apartment_2:       "1502672260266-1c1ef2d93688",
  field_1:           "1416331108676-a22ccb276e35",
  vineyard_1:        "1574323347407-f5e1ad6d020b",
  office_bldg:       "1486406146926-c627a92ad1ab",
  office_interior:   "1497366216548-37526070297c",
  hall_warehouse:    "1553413077-190dd305871c",
};

// Hero größer, Rest kompakt — hält Dateigröße niedrig.
const sizeFor = (key) => (key === "hero" ? { w: 1600, q: 68 } : { w: 900, q: 66 });

function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "build-script" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(download(res.headers.location));
      }
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode + " @ " + url));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

(async () => {
  const imgMap = {};
  let total = 0;
  for (const [key, id] of Object.entries(PHOTOS)) {
    const { w, q } = sizeFor(key);
    const url = `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&fm=jpg&fit=crop&auto=format`;
    process.stdout.write(`  ${key.padEnd(18)} … `);
    try {
      const buf = await download(url);
      imgMap[key] = "data:image/jpeg;base64," + buf.toString("base64");
      total += buf.length;
      console.log(`${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log("FEHLER: " + e.message + " (Platzhalter)");
    }
  }

  const tplPath = path.join(__dirname, "template.html");
  const outPath = path.join(__dirname, "..", "gahr-immobilien.html");
  const tpl = fs.readFileSync(tplPath, "utf8");

  // JSON ohne HTML-Sonderzeichen-Problem: </script> absichern
  const json = JSON.stringify(imgMap).replace(/<\//g, "<\\/");
  const out = tpl.replace("/*__IMAGES__*/ {}", json);

  if (out === tpl) { console.error("\n!! Marker /*__IMAGES__*/ nicht gefunden"); process.exit(1); }

  fs.writeFileSync(outPath, out, "utf8");
  const finalKB = Buffer.byteLength(out, "utf8") / 1024;
  console.log(`\n  Fotos gesamt (base64-roh): ${(total / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Finale Datei: ${outPath}`);
  console.log(`  Größe: ${(finalKB / 1024).toFixed(2)} MB`);
})();
