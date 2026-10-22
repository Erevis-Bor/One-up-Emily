# I/U/C — CASE 001: THE COLLIDER

A deliberately excessive, cinematic research environment about an ordinary ham-and-cheese toastie and the problem of communicating pensions clearly.

## Deploy to GitHub Pages

1. Extract **the contents** of this folder into a repository (put `index.html` in its root).
2. Go to **Settings → Pages**.
3. Set **Deploy from a branch**, choose `main`, `/ (root)` and Save.
4. Open the published URL. No account credentials, build or backend required.

The app uses **ES modules**, so running it locally requires an HTTP server, not double-clicking `index.html` on `file://`:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## What's actually working

- **The Field:** a spatially projected, navigable universe of 1,440 deterministic synthetic member agents. Orbit by dragging, zoom by wheel or touch gestures, inspect individuals by clicking or tapping lights.
- **Transmission:** edit an actual message, compute word count and transparent language heuristics, choose channel, timing, audience, competing-message intensity and attention pressure. The simulation uses those specific settings.
- **Transmission wave:** a signal propagates through the field; individual agents actually transition through *encountered → read → understood → acted*, with seeded variation. The same people persist between experiments.
- **Observatory:** actual counts, per-cohort outcomes and funnel visualisation; replay and manual time scrubbing. Controlled counterfactual with exactly the same seeded population, and a side-by-side cosmic view. Export a reproducible JSON report, share a link encoding the input configuration, export a cinematic PNG poster, or capture an eight-second video of the live canvas in browsers supporting MediaRecorder.
- **The Artefact:** trigger the declassification sequence and reveal a high-quality toastie photograph. The final joke is the difference between the complexity of the investigation and the simplicity of its findings.
- **UX infrastructure:** responsive desktop/mobile layouts, portrait-mode navigation, accessible text equivalents, optional procedural Web Audio, command palette (`/` or Ctrl/⌘+K), keyboard shortcuts `1`–`4`, reduced-motion support, no cookies, no tracking, no external API calls.

## Important limitation

This is a **toy model**, not a calibrated predictive tool. The people are fictional agents. The behaviours, probabilities, cohort differences and interpretation are invented for an interactive thought experiment, not evidence-based estimates of pension members' behaviour. Do not use its outputs for real communications or investment decisions.

Text simplification uses explicit fixed rules. It is **not** an AI service or a general rewriting model. The web fonts are loaded from Google Fonts as progressive enhancement; system font fallbacks work when offline. Everything else is local.

## Technical layout

```
index.html             App structure / accessible controls
style.css              responsive design, glass, motion
js/app.js              navigation, interactions, exports and audio
js/simulation.js       seeded agents, transparent language heuristic and model
js/engine.js           canvas spatial renderer, camera and live signal physics
assets/artefact.webp   locally bundled original cinematic toastie photography
assets/icon.svg        I/U/C icon
.nojekyll              GitHub Pages static deployment convenience
```

### Tune the simulation

Open `js/simulation.js`: `SEGMENTS` defines archetypes; `makePopulation` generates the same 1,440 people from seed 71219; `analyseMessage` uses readable heuristics; `evaluate` contains all probability gates. `progressFor` drives each person’s wave-delayed visible state. Modelling and rendering deliberately remain separated.

© Fictional Institute of Unnecessary Complexity. No affiliation with any pension scheme or real research institution.
