# open:heart

An early-stage vegetarian food and coffee place that could open in Copenhagen.

This project is a space for shaping the idea, testing its appeal, and eventually presenting it through a simple, memorable landing page. The concept is intentionally open at this stage: the name, location, menu, visual identity, business model, and opening plan still need to be explored.

## Project goals

- Define a distinctive vegetarian food and coffee concept with a clear reason to exist.
- Understand which Copenhagen audience and neighborhood could be the best fit.
- Develop a warm, credible brand direction before committing to a full identity.
- Build a landing page that communicates the feeling of the place and captures interest.
- Use lightweight research, structured brainstorming, and fast iterations to reduce uncertainty.

## Working idea

Create a place where people encounter plant-based food they did not expect to love. Vegan eggs Benedict is a first proof point: a familiar form remade with imagination, care, and enough deliciousness to make the idea memorable.

The product is not only the food and coffee. It is the experience of meeting an original creation, feeling connected to the act of making, and sharing that discovery with other people. The room, the pace of service, the welcome, and the visual language should all make that feeling tangible.

## Belief at the centre

open:heart is for people who want to stay open to surprise. It is built on the belief that human creativity can connect us with something deeper, and that love for creation can be expressed through a plate that did not exist before someone imagined it.

## Likely first audience hypotheses

These are starting hypotheses, not decisions:

- Curious eaters who want to taste an idea they have not encountered before.
- People who are open to vegetarian food but do not want to feel they are choosing a compromise.
- Copenhagen residents and visitors looking for a distinctive, generous experience.
- Small groups, couples, and solo guests who value imagination and atmosphere as much as the menu.

## Landing page direction

The first landing page should be a focused concept test rather than a complete restaurant website. It should help someone understand the idea within a few seconds and leave with a reason to remember it.

Potential sections:

- A clear hero statement that captures the place in one sentence.
- A short explanation of the creative, plant-based experience.
- A small set of signature menu or ritual ideas.
- Visual references for the atmosphere, materials, colors, and pace.
- A Copenhagen point of view, including the kind of neighborhood or morning it belongs to.
- A simple call to action, such as joining an interest list, sharing feedback, or following the concept.

The landing page will most likely be created and hosted with ChatGPT Sites once the concept has enough shape to present.

## Exploration themes

- Concept and positioning
- Name, language, and tone of voice
- Menu principles and signature items
- Coffee approach and service model
- Space, interiors, music, and guest experience
- Neighborhood and site selection in Copenhagen
- Pricing, capacity, operating hours, and staffing assumptions
- Brand identity and visual references
- Landing page content, conversion, and feedback capture

## Current status

The project is at the concept exploration stage. No final name, location, menu, visual identity, or business case has been selected.

## Suggested next steps

1. Write a one-paragraph concept statement and a short list of non-negotiable principles.
2. Generate several distinct concept directions instead of prematurely polishing one idea.
3. Compare likely Copenhagen neighborhoods and customer use cases.
4. Choose one direction to express through a lightweight landing page.
5. Put the page in front of a small number of people and record what they remember, want, and question.
6. Refine the concept based on evidence before investing in a more complete brand or operating plan.

## Project files

The site is intentionally lightweight and framework-free:

- `index.html` contains the six semantic page faces and the concept copy.
- `styles.css` contains the print system, palette recipes, responsive layout, and CSS 3D prism.
- `app.js` maps scroll position to prism poses and powers the developer controls.
- `assets/` contains original SVG plates plus generated exploration assets.

Add research notes, concept explorations, copy drafts, visual references, and site assets as the idea develops. Keep temporary experiments separate from decisions that should guide future work.

## Run locally

From the project directory:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

The page works as a normal vertical document when JavaScript is disabled, when reduced motion is requested, or when Developer view > Simple scroll (no 3D) is enabled. Default scrolling connects pairs of full-viewport pages with CSS 3D transforms: pages 1 through 4 turn upward, then pages 5 and 6 enter with rightward turns. Each transition shares a physical edge, uses face-local shading, and lands flat. Geometry resets between transitions rather than forcing six rectangular viewports into a fixed prism.

## GitHub Pages

The repository includes a GitHub Actions workflow for the static site. Once the repository is pushed and Pages is configured to use GitHub Actions, each push to `main` publishes the current site.

## Working principles

- Start with the act of discovery, then work backward to the guest experience, brand, and page.
- Treat vegan eggs Benedict as a signature proof of the concept, not as the entire concept.
- Keep hypotheses clearly labeled as hypotheses.
- Prefer a few strong, testable ideas over a large collection of vague possibilities.
- Make the concept feel Copenhagen-aware without relying on stereotypes.
- Treat the landing page as a learning tool, not only as a polished presentation.
- Keep decisions and open questions visible so the project can evolve without losing context.
