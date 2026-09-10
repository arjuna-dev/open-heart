# Open Heart

Open Heart is an early-stage vegetarian food and coffee place that could open in Copenhagen.

The project is not selling breakfast as a category. It is exploring the experience of encountering an original plant-based creation, beginning with vegan eggs Benedict as a signature proof point. The landing page is a concept test for that feeling, not a claim that the address, opening date, menu, or business model is settled.

## Current working direction

- Working name: **Open Heart**. The repository slug remains `open:heart`.
- Offer: vegetarian food and coffee, with almost every menu item intended to be vegan.
- Signature invitation: vegan eggs Benedict in several distinct interpretations.
- Menu: sandwiches, eggs Benedict, salads, entrees, sauces, desserts, and beverages.
- Website behavior: normal scrolling is the default. CSS 3D exploration remains available as a developer mode.
- Visual language: editorial posters, restrained one-ink and two-ink studies, paper texture, oversized type, and bold compositions inspired by simple Japanese prints and woodblock work.
- Wordmark direction: capitalized Open Heart with oversized O and H. Font selection is still open.
- Project stage: concept exploration. No neighborhood, menu, supplier, price, opening date, or operating model is final.

## Landing page

The local prototype is a six-section story with a menu area, developer controls, palette experiments, and a print-led asset archive. Normal scrolling is the default. The page also includes a CSS 3D prism experiment for the six full-viewport faces.

The production hero is locked to the strongest ChatGPT menu artwork, and the developer menu exposes only four deliberate web recipes: Cyan + brick red, Electric blue + carbon, Mono / aubergine, and Mono / electric blue. The poster archive still preserves the paired ChatGPT and Gemini experiments for review, but the live page does not switch generated providers.

The intended information hierarchy is:

1. A clear invitation to discover a plant-based creation.
2. Vegan eggs Benedict as the memorable proof point.
3. One automatically rotating menu carousel whose slides are menu sections, rather than a separate page for every category. Each category has one poster image and a text carousel of dishes. Developer options can instead show either an ultra-minimal three-group text list or the active category inside the same centered-pair SMALL structure used by the rest of the page.
4. Atmosphere and Copenhagen references used as visual context, not unsupported location claims.
5. Opening hours, contact, find-us, and language areas that can be filled with final restaurant details.
6. A lightweight action such as feedback, an interest list, or following the concept.

## Image collection

The repository now contains a paired poster set of **20 accepted assets**:

- 10 ChatGPT posters in [`assets/posters/chatgpt/`](assets/posters/chatgpt/)
- 10 Gemini posters in [`assets/posters/gemini/`](assets/posters/gemini/)
- 2 rejected poster attempts in [`assets/posters/rejected/`](assets/posters/rejected/)

The poster subjects cover the signature Benedicts, sandwiches, salads, cauliflower wings, sauces, desserts, and drinks. Every poster in the accepted batch was generated through the integrated in-app Browser with a source image attached to the prompt. The paired set uses one or two intentional inks plus paper, consistent type direction, and no CSS recoloring. Earlier menu, Copenhagen, and human-animal studies remain in the wider catalog for comparison.

The wider catalog currently contains 45 current studies, one review item, five legacy references, and rejected comparison files. The poster count above refers only to the new accepted pair set.

Open the local print room at [`studio.html`](studio.html) to browse the catalog and see which studies are current, under review, rejected, or legacy. The machine-readable inventory is [`assets/catalog.json`](assets/catalog.json).
The generation brief and complete poster index are in [`assets/posters/README.md`](assets/posters/README.md).

The weak legacy SVG experiments are intentionally not part of the current visual system:

- `assets/nyhavn.svg`
- `assets/menu-sheet.svg`
- `assets/dance.svg`

New image work should follow the mono-color rule: control the whole composition, not only the text color. Start from one ink or a deliberate two-ink recipe, keep the paper field visible, make the crop and type part of the composition, and reject uncontrolled color, fake product mockups, measurement rulers, and accidental generated labels.

## Historical comparison

The earlier, simpler alternating-section design is preserved on the branch [`archive/first-design`](https://github.com/arjuna-dev/open-heart/tree/archive/first-design). The Pages workflow also publishes it under `/comparisons/first-design/` when the workflow runs. This lets us compare the more restrained composition against the current exploratory system without losing either direction.

## Poem and interactive text

The atmosphere section includes an optional interactive text study based on Swami Vivekananda's *To a Friend*, which speaks about love across humans, animals, and other living beings. The source and the exact edition or translation should be checked before publishing.

The page loads [Pretext](https://pretextjs.dev/pretext-demo) for line measurement and reflow inside a leaf-shaped composition, with a local fallback, pointer response, plain-reading toggle, and reduced-motion support. Pretext is a layout engine, so the shape and interaction belong to our own page layer. The poem remains optional and subordinate to the food and place experience.

## Run locally

From the project directory:

```sh
python3 -m http.server 4173
```

Then open [http://localhost:4173/](http://localhost:4173/).

The page also remains readable as a normal document when JavaScript is disabled, when reduced motion is requested, or when **Developer view > Simple scroll (no 3D)** is enabled. In the default centered-pair SMALL composition, every non-menu section uses the same 300-pixel text column and 300-pixel image column. CSS 3D mode connects every adjacent full-viewport section with the same vertical turn, shared physical edges, and local shading.

In CSS 3D mode, the first wheel or trackpad delta moves the turn immediately. There is no scroll-behavior queue and no artificial opening pause. Ten percent of the face span is the commit threshold: a smaller nudge settles back to the current face, while a larger nudge completes one smooth 720-millisecond vertical turn. A landed face leaves the transformed 3D scene and becomes a true flat reading surface, so links, controls, and text selection remain reliable. If a face is taller than the viewport, as the full menu can be, wheel input scrolls that face first and turns to the next face only after reaching its edge. The fixed **Turn the page** pager remains available in 3D and centered reference modes; it stays hidden in the default simple-scroll view.

## Repository map

- [`index.html`](index.html) contains the landing page faces, menu content, and developer controls.
- [`styles.css`](styles.css) contains the print system, palette recipes, responsive layout, and CSS 3D geometry.
- [`app.js`](app.js) handles scroll poses, simple-scroll mode, palette switching, the auto-rotating menu presentations, GSAP carousel experiments, composition switching, and the Pretext study.
- [`assets/vendor/gsap.min.js`](assets/vendor/gsap.min.js) is the vendored GSAP core used by the carousel studies, so local previews and GitHub Pages use the same animation engine.
- [`menu.json`](menu.json) is the working menu inventory and remains a hypothesis.
- [`EXPLORATION.md`](EXPLORATION.md) records the design and asset decisions from this pass.
- [`AGENTS.md`](AGENTS.md) is the project agent story and decision guardrail.
- [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publishes the static site and historical comparison.

## GitHub Pages

The repository includes a GitHub Actions workflow for the static site. A push to `main` triggers the deployment once GitHub Pages is configured to use GitHub Actions.

## Developer comparisons

The **Studio controls** menu can compare:

1. The four approved web ink recipes, including two-ink and strict mono-color directions.
2. A centered-pair SMALL composition against a visibly more open centered-pair reference composition based on the supplied sparse study. The distinction is preserved on desktop and mobile.
3. The baseline Open Heart wordmark with its oversized O and H.
4. The full category carousel against a much smaller ultra-minimal three-group menu or a menu constrained to the same centered-pair SMALL system as the other sections.
5. GSAP carousel motion: slide left and right, fade in and out, or no animation.
6. Normal scrolling against the CSS 3D experiment.

The previous full-editorial composition has been removed from both the controls and the stylesheet.

Useful next decisions are the final typeface, which poster pair leads each category, and which practical restaurant details replace the current concept fields. Only then should the hosted ChatGPT Sites version replace or accompany the static prototype.

## Working principles

- Treat vegan eggs Benedict as a signature proof, not the entire concept.
- Keep facts, hypotheses, decisions, open questions, and experiments distinct.
- Use Copenhagen as a point of view without relying on stereotypes.
- Prefer a few strong, testable ideas over a large collection of vague hospitality language.
- Keep the difference between an appealing idea and an operationally viable business visible.
