# TOASTIE / OS

**One toastie. Infinite synergy.** An unnecessarily advanced interactive communications platform that grew out of a ham-and-cheese-toastie pension communications joke.

## Open / deploy

No build tools or account are required. Everything is plain HTML, CSS, SVG and JavaScript modules.

### Publish on GitHub Pages

1. Create a GitHub repository (for example `toastie-os`).
2. Upload **all of the files inside this folder** to the repository root, retaining `assets/`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, `main`, `/ (root)`, then **Save**.
5. Visit `https://YOUR-USERNAME.github.io/toastie-os/` after GitHub deploys it.

`index.html` is the entry point, and all links use relative paths so the app works from project subpaths on GitHub Pages. The `.nojekyll` file prevents Jekyll interfering with assets.

### Preview locally

Because browsers often restrict JavaScript module imports from `file://` URLs, use a minimal local server:

```bash
cd TOASTIE-OS
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Pages

- `index.html` — Cinematic experience with a native-scroll, four-part sandwich/communication narrative.
- `model.html` — Live scenario modelling for cohort, message clarity, relevance, timing, CTA, channel and frequency; export & baseline comparisons.
- `journey.html` — Editable member communication journey with stage reorder, playback, local persistence, JSON import/export and SVG diagram export.
- `signals.html` — CSV import/drop/paste, schema validation, filters, breakdowns and CSV export; fictional sample data.
- `foundry.html` — Local text diagnostics, jargon dictionary, writing hints, and the corporate jargon reactor.

## Data / privacy

No tracking, analytics API calls, database or server uploads. User inputs are processed client-side. Some settings and edits use localStorage in your browser. Google Fonts is requested when online, but system fonts provide a fallback. The included PWA manifest and service worker support installation and offline revisits over HTTPS after the first successful visit. Delete the font `@import` line if you want an entirely network-isolated site.

## Model caveats

The modeller is **illustrative and uncalibrated**, not a validated forecast. The numbers, coefficients, sample analytics and dashboard are demonstrative. Message Foundry uses simple rule-based heuristics, not AI or a verified reading-age test. Do not use these outputs as financial advice, actuarial evidence, member research or scheme communications without review.

## Project structure

```
TOASTIE-OS/
  index.html
  manifest.webmanifest
  sw.js
  model.html
  journey.html
  signals.html
  foundry.html
  assets/
    css/main.css
    js/shared.js
    js/home.js
    js/model.js
    js/journey.js
    js/signals.js
    js/foundry.js
    img/toastie.svg
    img/favicon.svg
    img/*-layer.svg
    img/icon-{192,512}.png
    data/demo-communications.csv
  docs/MODEL-ASSUMPTIONS.md
  .nojekyll
  README.md
```

## Modifying

Global tokens and responsive layouts are in `assets/css/main.css`. The header/footer are rendered by `initShell()` in `assets/js/shared.js`. Each page has its own JavaScript module. No framework required.
