# Textalk — website & CMS

De website van **Stichting Textalk** (Tilburg): een platform, dialoog en beweging dat
de kledingindustrie uitpluist en gebruikt als lens op de samenleving.

Dit is een **no-build statische site** (HTML + CSS + een beetje JavaScript) met een
**Git-gebaseerd CMS** (Decap CMS). Er is geen framework en geen buildstap — je kunt
de map op elke statische host zetten en het werkt.

Merkrichting: **V3 (pill-lens)**. Zie de merkdocumenten (Positionering, Brand Identity,
Informatiestructuur, Designsysteem) voor de achtergrond.

---

## Snel lokaal draaien

Geen dependencies nodig. Start een statische server in de repo-root:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Elke statische server werkt: `npx serve`, `caddy file-server`, enz.)

---

## Deployen

De site staat volledig in de **repo-root**; de publish-map is dus `.` (de root).

### Netlify
`netlify.toml` in de root zet de publish-map al goed. Verbind de repo met Netlify en
klaar. Voor het CMS (`/admin`) zet je in het Netlify-dashboard aan:

1. **Site settings → Identity → Enable Identity**
2. **Identity → Services → Git Gateway → Enable**
3. Nodig jezelf uit onder **Identity → Invite users** en stel je wachtwoord in.

Daarna log je op `/admin` in en bewerk je content; wijzigingen komen als commits in
deze repo (branch `main`) en de site deployt opnieuw.

### Eigen server (Caddy / Nginx / Apache)
Serveer de repo-root als document-root. Voorbeeld met Caddy:

```
textalk.nl {
    root * /pad/naar/textalk-site
    file_server
    encode gzip
}
```

Let op: `/admin` (Decap CMS) leunt op **Netlify Identity + Git Gateway**. Host je
volledig zelf zonder Netlify, dan werkt het publieke gedeelte van de site gewoon,
maar heeft het CMS een alternatieve auth-backend nodig (bijv. Decap met een eigen
OAuth-provider / GitHub-backend). Het tonen van content werkt sowieso, want de site
leest de markdown rechtstreeks uit `content/`.

---

## Hoe het CMS werkt

- **`/admin`** — Decap CMS, geladen vanaf CDN. `admin/config.yml` bepaalt de
  bewerkvelden. Collecties: **shows, experts, nieuws, mensen (team), agenda**.
- **Content** — markdown met YAML-frontmatter in `content/<collectie>/`.
- **Tonen** — `assets/cms.js` leest de content op de pagina's. Het bepaalt de
  bestandslijst zo:
  - **lokaal** (localhost): eerst `content/<collectie>/manifest.json` (zodat nog niet
    gepushte content zichtbaar is);
  - **productie**: eerst de **GitHub API** (zodat nieuwe /admin-content automatisch
    verschijnt), met `manifest.json` als reserve.
  - De repo staat ingesteld in `assets/cms-config.js` (`HqHu229` / `textalk-site`).

> **Manifests:** als je content bewerkt via `/admin` verschijnt die in productie
> automatisch via de GitHub API. Voeg je handmatig markdown toe, werk dan ook
> `content/<collectie>/manifest.json` bij (dat is de reserve-lijst en de lokale bron).

---

## Content-status

De content is op dit moment **placeholder** (herkenbaar aan `[...]`-teksten en het
badge "placeholderinhoud" linksonder). Titels, datums, themakleuren en kernvragen van
de acht shows zijn echt; omschrijvingen, sprekers, bio's en artikelen zijn nog in te
vullen — via `/admin` of extern.

---

## Structuur

```
index.html                              Home (pill-lens hero, primaire beeldtaal)
show.html?slug=<slug>                    Showdetail (secundaire beeldtaal: themakleur + behandeling)
textalk-talkshows-overzicht.html         Alle shows (primair, rustig grid)
textalk-expert-profiel.html              Experts (overzicht + voorbeeldprofiel)
textalk-project-tilburg-weeft-verder.html  Project (eigen sub-beeldtaal)
admin/                                    Decap CMS
assets/cms.js, cms-config.js             CMS-loader + repo-instellingen
content/<collectie>/                      Markdown-content + manifest.json
netlify.toml                              Publish-map + caching
```

De hero, de pill-lens en de motion-taal (harde cuts, mechanische easing) volgen
Designsysteem V3.
