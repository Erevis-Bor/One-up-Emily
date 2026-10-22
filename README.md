# CASE 001 — The Institute of Unnecessary Complexity

An interactive, cinematic investigation into the apparently profound relationship between a ham-and-cheese toastie and pension member communications.

## What this is

A **single coherent experience**, not a dashboard or a collection of pretend tools:

- **Threshold:** an original shader-rendered sci-fi research artefact, responsive to pointer movement.
- **Information:** drag the density control and watch a literal field of communication jargon give way to one useful message.
- **Timing:** rotate through five delivery moments and observe why the same message lands differently.
- **Action:** remove competing calls to action in a functional editing experiment.
- **The artefact:** a cinematic, photorealistic reveal of the original inspiration.
- **Findings:** a deliberately plain conclusion and a working copy-to-clipboard action.

Optional synthesised ambient audio, native scrolling, reduced-motion support, keyboard focus styles, original WebGL shader graphics and responsive layouts down to 320px.

## GitHub Pages (no build step)

1. Upload all the files **inside this folder** to the root of a public GitHub repository. Keep the `assets` directory beside `index.html`.
2. On GitHub choose **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Select **main** and **/(root)**. Save.
4. Open the published `https://YOUR-USERNAME.github.io/YOUR-REPO/` URL.

You can also preview locally with `python -m http.server 8000` in this folder and open `http://localhost:8000`.

No npm dependencies, CDNs, trackers, service workers, accounts, APIs or backend. Everything uses local source files and system typography. Compatible browsers use original WebGL2 shaders; others receive an atmospheric CSS fallback. The site works on HTTPS GitHub Pages, including subpath deployments (all links are relative).

## Structure

```
index.html              Narrative, semantic content and controls
assets/style.css        Design system, layouts, motion, mobile breakpoints
assets/world.js         Original GPU-rendered procedural 3D world
assets/app.js           Story state, interactions, accessibility and audio
assets/reveal.webp      Original AI-generated cinematic image
assets/reveal.png       High-quality fallback/source image
assets/noise.svg        Procedural grain overlay
assets/mark.svg         Favicon
```

## Approach and claims

The experience is **satirical**. The experiments illustrate qualitative communication principles; they are not calibrated to actual member data or behavioural evidence. No fake KPIs, probability scores, predictive models, or statistical claims. No member data is collected. There are no cookies, analytics or outbound network requests.

The visual system uses browser-native WebGL2 rather than scroll-hijacking plugins. The story follows the normal document scroll, with a shader layer transitioning between chapters and native range inputs for touch, mouse and keyboard control.

## Accessibility / performance

- `prefers-reduced-motion` disables nonessential CSS motion and shader time progression.
- All actions are native buttons, links or labelled range inputs.
- Ambient sound starts **only** after explicit opt-in.
- Shader resolution caps device pixel ratio to prioritise mobile GPUs.
- On devices without WebGL2, narrative and interactions remain functional.

## Acknowledgement

Image asset commissioned for this project. All source code and CSS are original. Typography uses the visitor’s native system fonts.
