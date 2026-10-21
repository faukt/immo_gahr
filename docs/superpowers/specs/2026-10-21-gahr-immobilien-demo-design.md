# Gahr Immobilien — Moderne Single-File Demo

**Datum:** 2026-10-21
**Ziel:** Redesign der veralteten FrontPage-Frameset-Seite `gahr-immobilien.at` als
**eine** lokal per Doppelklick lauffähige, 100 % offline funktionierende HTML-Datei.
Zweck: Verkaufs-Demo, die der Kunde (Johann Gahr Immobilien Ges.m.b.H.) per E-Mail
erhält und lokal öffnet.

## Harte Anforderungen (aus Brainstorming bestätigt)

1. **Eine Datei** `gahr-immobilien.html` — reines HTML/CSS/JS, keine externen Libs,
   keine CDN-Links, kein Build-Runtime beim Nutzer. Doppelklick → läuft.
2. **100 % offline** — alle Bilder als Base64 eingebettet. Zielgröße < ~6 MB
   (per E-Mail versendbar).
3. **Objektsuche & Filter** (Kern des Auftrags), **Objekt-Detailansicht**,
   **Kontaktformular** (mailto, serverlos), **Über uns / Leistungen / Impressum**.
4. Stil: **edel & vertrauensvoll** — tiefes Grün/Anthrazit + Gold-Akzent,
   Serifen-Headlines, große Fotos.
5. Objektbestand: **Mischung** aus echten Alt-Objekten + fiktiven Musterobjekten
   (fiktive klar als „Musterobjekt" gekennzeichnet).
6. **Nur belegte Personen-/Rechtsdaten** verwenden — nichts über reale Personen erfinden.

## Belegte Stammdaten (aus Altseite extrahiert)

- Firma: **Johann Gahr Immobilien Ges.m.b.H.**
- Adresse: A-2231 Strasshof, Hauptstraße 10 (Marchfeld / Weinviertel, NÖ)
- Tel +43 2287 200 50 · Fax +43 2287 211 55 · Mobil +43 676 326 77 33
- E-Mail: office@gahr-immobilien.at · Web: www.gahr-immobilien.at
- GF: **J.F.K. Gahr** — Immobilientreuhänder, Spreng-/Werkmeister für das Baugewerbe
- Recht: FN 72061 y LGR Korneuburg · UID ATU17841101 · Gerichtsstand Gänserndorf
- Mitglied WKNÖ — Fachgruppe Immobilien- und Vermögenstreuhänder
- Leistungen: konzess. Makler · Beratung · Wertermittlung · Vermittlung aller
  Objektarten · Vertragsabwicklung mit Notaren/RA · Spreng-/Werkmeister ·
  Hypothekar-Finanzierungen
- Echte Alt-Objekte: Mistelbach 149 T€/140 m² · Hausbrunn 29 T€/50 m² ·
  Klosterneuburg 1,95 Mio/340 m² · Büros Strasshof (Miete) ·
  Wald-/Ackerland Rumänien/Slowakei/Ukraine

## Architektur

- **Datenschicht:** `const PROPERTIES = [...]` als JS-Array im `<script>`. Erweiterbar
  durch Kopieren eines Blocks. Keine DB.
- **Bilder:** kuratierter Foto-Pool (lizenzfrei, Unsplash), herunterskaliert
  (Hero ~1400px, Karten ~800px, JPEG q≈70), als `data:`-URI eingebettet. Pool wird
  über Objekte geteilt, um Größe zu begrenzen.
- **Build:** Node-Skript `build/fetch-and-build.js` holt Fotos, encodet Base64 und
  injiziert sie per Token in `template.html` → schreibt finale `gahr-immobilien.html`.
  (Große Base64-Strings landen nie im Agent-Kontext.)
- **Fonts:** System-Serif (Georgia/„Times" Headlines) + System-Sans (Fließtext).
  Kein Download.

## Seitenstruktur (One-Page, Sprungnavigation)

1. Sticky Header — Logo, Nav (Objekte · Leistungen · Über uns · Kontakt), Telefon-CTA
2. Hero — Großbild, Headline „Der sichere Weg zu Ihrem Zuhause", Schnellsuche
3. Objekte — Filterleiste + Karten-Raster, Live-Filter, Status-Badges
4. Objekt-Detail — Modal: Galerie, Eckdaten, Beschreibung, Anfrage-Button
5. Leistungen — Icon-Raster der 7 belegten Leistungen
6. Über uns — Firmenprofil, Ansprechpartner J.F.K. Gahr, Vertrauenssignale
7. Kontakt — Anfrageformular (mailto, vorausgefüllt) + Kontaktdaten + Karte(statisch)
8. Footer/Impressum — Pflichtangaben (FN, UID, Gerichtsstand)

## Datenmodell je Objekt

`id · titel · typ (haus|wohnung|grundstueck|gewerbe|ausland) ·
angebot (kauf|miete) · ort · preis (Zahl) · preisText · flaeche (Zahl, m²) ·
zimmer · status (neu|verfuegbar|verkauft) · musterobjekt (bool) ·
beschreibung · merkmale[] · bilder[] (Token-Referenzen)`

## Filter

Textsuche (Titel + Ort) · Typ · Angebot (Kauf/Miete) · Preis-Range ·
Mindestfläche · Status · Sortierung (Preis auf/ab, Fläche, neueste). Live, ohne Reload.

## Nicht-Ziele (YAGNI)

- Kein echtes Backend, keine Formular-Zustellung über Server.
- Keine Karten-API (statische Karte/Adressblock genügt).
- Keine Mehrsprachigkeit (nur Deutsch).
- Kein CMS / Admin.

## Erfolgskriterien

- Doppelklick öffnet eine vollständige, moderne Seite — ohne Internet.
- Suche/Filter funktionieren flüssig über alle Objekte.
- Detailansicht, Kontaktformular (mailto), Impressum vorhanden.
- Datei < ~6 MB, per E-Mail versendbar.
- Optik wirkt „state of the art" und seriös (Verkaufstauglich).
