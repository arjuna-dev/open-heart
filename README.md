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

The local prototype is a six-section story with a menu area, developer controls, palette experiments, and a print-room archive. The current page includes a first pass of the content and menu data, but it is still a design instrument rather than a finished restaurant website.

The intended information hierarchy is:

1. A clear invitation to discover a plant-based creation.
2. Vegan eggs Benedict as the memorable proof point.
3. A menu carousel whose slides are menu sections, rather than a separate page for every category.
4. Atmosphere and Copenhagen references used as visual context, not unsupported location claims.
5. Dummy opening hours, contact, find-us, and language sections for layout testing only.
6. A lightweight action such as feedback, an interest list, or following the concept.

## Image collection

The asset archive contains **41 files**:

- 25 current studies
- 1 study under review
- 10 rejected attempts retained for comparison
- 5 legacy files kept for historical reference

The current and review sets include menu studies for Benedict variations, sandwiches, salads, cauliflower wings, fries, desserts, michelada, hot drinks, Copenhagen architecture, and people or animals holding hands. The generated studies were made through both the ChatGPT and Gemini browser interfaces, with the supplied fish and rooster poster references used during the exploration.

Open the local print room at [`studio.html`](studio.html) to browse the catalog and see which studies are current, under review, rejected, or legacy. The machine-readable inventory is [`assets/catalog.json`](assets/catalog.json).

The weak legacy SVG experiments are intentionally not part of the current visual system:

- `assets/nyhavn.svg`
- `assets/menu-sheet.svg`
- `assets/dance.svg`

New image work should follow the mono-color rule: control the whole composition, not only the text color. Start from one ink or a deliberate two-ink recipe, keep the paper field visible, make the crop and type part of the composition, and reject uncontrolled color, fake product mockups, measurement rulers, and accidental generated labels.

## Historical comparison

The earlier, simpler alternating-section design is preserved on the branch [`archive/first-design`](https://github.com/arjuna-dev/open-heart/tree/archive/first-design). The Pages workflow also publishes it under `/comparisons/first-design/` when the workflow runs. This lets us compare the more restrained composition against the current exploratory system without losing either direction.

## Poem and interactive text

The poem idea remains an experiment, not approved landing-page copy. The candidate text is Swami Vivekananda's *To a Friend*, which speaks about love across humans, animals, and other living beings. The source and the exact edition or translation should be checked before publishing.

The likely technical experiment is to use [Pretext](https://pretextjs.dev/pretext-demo) for text measurement and reflow around an animated or shaped object. Pretext is a layout engine, so the shape, interaction, and motion would still belong to our own page layer. Keep the poem optional and subordinate to the food and place experience.

## Run locally

From the project directory:

```sh
python3 -m http.server 4173
```

Then open [http://localhost:4173/](http://localhost:4173/).

The page also remains readable as a normal document when JavaScript is disabled, when reduced motion is requested, or when **Developer view > Simple scroll (no 3D)** is enabled. CSS 3D mode connects adjacent full-viewport sections with shared physical edges, local shading, and separate poses for the final two sections.

## Repository map

- [`index.html`](index.html) contains the landing page faces, menu content, and developer controls.
- [`styles.css`](styles.css) contains the print system, palette recipes, responsive layout, and CSS 3D geometry.
- [`app.js`](app.js) handles scroll poses, simple-scroll mode, palette switching, asset switching, and menu controls.
- [`menu.json`](menu.json) is the working menu inventory and remains a hypothesis.
- [`EXPLORATION.md`](EXPLORATION.md) records the design and asset decisions from this pass.
- [`AGENTS.md`](AGENTS.md) is the project agent story and decision guardrail.
- [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publishes the static site and historical comparison.

## GitHub Pages

The repository includes a GitHub Actions workflow for the static site. A push to `main` triggers the deployment once GitHub Pages is configured to use GitHub Actions.

## Useful next decisions

1. Choose the strongest wordmark type direction while keeping the oversized O and H ratio.
2. Refactor the menu into one category carousel with a clear active-category cue.
3. Decide which current image studies deserve cleanup, redraw, or live HTML type over the generated artwork.
4. Test the short landing-page story with a few people and record what they remember.
5. Only then decide whether a hosted ChatGPT Sites version should replace or accompany the static prototype.

## Working principles

- Treat vegan eggs Benedict as a signature proof, not the entire concept.
- Keep facts, hypotheses, decisions, open questions, and experiments distinct.
- Use Copenhagen as a point of view without relying on stereotypes.
- Prefer a few strong, testable ideas over a large collection of vague hospitality language.
- Keep the difference between an appealing idea and an operationally viable business visible.
