# Open Heart poster set

This folder contains the accepted poster batch for the Open Heart landing page.

## Count

- 20 accepted posters in total
- 10 generated with ChatGPT
- 10 generated with Gemini
- 2 versions for each of 10 subjects

The accepted files are grouped by generator:

- [`chatgpt/`](chatgpt/) contains PNG exports
- [`gemini/`](gemini/) contains JPEG exports
- [`rejected/`](rejected/) contains experiments that drifted from the brief

## Subjects

1. Avocado Benedict
2. Lime pickle Benedict
3. Vegan salmon open sandwich
4. Pulled mushroom sandwich
5. Avocado and mango salad
6. Vegan Caesar
7. BBQ cauliflower wings
8. Five sauces
9. Avocado key-lime pie
10. Something warm, a drinks study

## Generation rules

Each accepted poster was generated through the integrated in-app Browser with a source image attached to the prompt. ChatGPT and Gemini received the same subject, the same requested headline, the same typography direction, and a deliberate palette assignment.

The visual recipe is strict:

- one or two exact ink colors plus a neutral paper field
- no uncontrolled rainbow color
- no CSS recoloring or shared-image overlay treatment
- readable, consistent editorial typography
- a dominant subject with generous exposed paper
- flat printed composition, not a photographed product mockup
- no rulers, palette labels, accidental metadata, or generated filler copy

The poster text is a visual study. The website keeps the actual menu copy as live HTML so it remains readable, accessible, and easy to edit.

The weak SVG experiments remain excluded from the current system. Do not restore or regenerate `assets/nyhavn.svg`, `assets/menu-sheet.svg`, or `assets/dance.svg`.
