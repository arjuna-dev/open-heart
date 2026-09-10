# Open Heart: print-led exploration

## What is being preserved

`archive/first-design` points to `a7f7d85`, the version matching the supplied screenshots' controls and section content. It is pushed to origin. The Pages workflow includes it at `comparisons/first-design/` without replacing the current landing page. Old copy and rejected SVG illustrations are historical evidence only, not newly approved assets.

For the screenshot combination select Mono / terracotta, Plate 02 / generated menu print, and flat reading mode.

## What mono-color means here

The system is not a font-color picker. It is exposed paper, assigned printing plates, a dominant crop, type interacting with that crop, and strong changes of scale. Web translations should preserve those relationships, with alternating paper-led and ink-led sections and a dark final field. Raster images retain their generated inks rather than receiving arbitrary CSS color filters.

Generated posters are visual studies. Rebuild approved typography as live accessible text, using the raster specimen at its intended crop. Do not ship a whole text-heavy poster as the only readable page.

The current content structure is a compact introduction, ONE auto-rotating menu carousel whose slides are categories, an atmosphere study with the interactive text treatment, and concise find-us/contact/hours/language fields. No invented dog policy, manifesto or repeated menu-only pages. Real address and hours should replace the concept fields before launch.

The developer menu includes two sparse composition directions. `Centered pair SMALL` is the tighter working direction, with an exact 300-pixel copy column and exact 300-pixel image column shared by every non-menu face. Pages differ in content, not in their core pair geometry. `Centered pair / reference` gives the group more room while preserving the supplied sparse study: large empty fields, a small left copy block, a right-hand image, and fixed studio chrome. The size difference remains visible on mobile, where SMALL uses a 300-pixel copy and 240-pixel image while the reference composition can use a 330-pixel copy and 280-pixel image. The former full-editorial mode and its unused CSS have been removed. The baseline Open Heart wordmark is used in both modes.

The menu presentation can also switch from the image-led category carousel to an ultra-minimal text list. That study uses deliberately tiny list typography and consolidates the tabs into Benedict + sandwiches, entrees + sauces, and drinks + desserts. A separate checkbox places the current category inside the exact centered-pair SMALL constraints, with one text column and one image column.

## Generation and review

Every concept is submitted through the integrated in-app Browser using the ChatGPT and Gemini browser interfaces. Original full-resolution downloads are saved under `assets/menu/`, `assets/studies/`, or the accepted paired set under `assets/posters/`. The gallery distinguishes these from earlier assets and rejected attempts. Counts must exclude rejected attempts and legacy files when reporting this batch.

The current paired poster batch contains 20 accepted assets, 10 ChatGPT versions and 10 Gemini versions. It includes two versions of each subject: avocado Benedict, lime pickle Benedict, vegan salmon, pulled mushrooms, avocado mango salad, vegan Caesar, BBQ cauliflower, five sauces, avocado key-lime pie, and something warm. The exact generation and review rules are recorded in `assets/posters/README.md`.

The initial dish series used the supplied salmon and rooster references. The city, dance, logo and poster series uses the supplied Le grand bassin reference. References guide plate separation, screening and image-type interaction, not their slogans or exact layouts.

Never replace missing art with programmatic SVG geometry. `nyhavn.svg`, `menu-sheet.svg` and `dance.svg` were explicitly rejected. Do not regenerate that type of primitive illustration or silently restore it to the current site.

Each initial prompt assigns neutral paper, one or two exact inks, plate roles, composition, paper exposure, crop, type voice, exact words and restrained printing effects. Logo and website-content posters explicitly override the skill's generic no-logo and short-copy defaults.

## Poem and interactive type research

Vivekananda's *To a Friend* contains an especially relevant ending about love for all beings. It is explicitly devotional, not a secular nature-conservation poem. The available English text is a translation from Bengali; the translator and edition must be identified before claiming that translation is public domain. Do not substitute a modern translation without permission.

Source: https://en.wikisource.org/wiki/The_Complete_Works_of_Swami_Vivekananda/Volume_4/Translation:_Poems/To_a_Friend

The supplied Pretext demo page includes text reflow around moving objects and organic text shapes. The actual library's primary source is https://github.com/chenglou/pretext . Its line-by-line layout is suitable for computing text inside a changing leaf silhouette; it is not itself a shape or animation engine.

The CSS 3D experiment keeps page movement at the document level. A short wheel or trackpad gesture now advances exactly one face, while transformed inactive faces have pointer hit testing disabled and the fixed page pager remains available. The shorter virtual track removes the previous high threshold without changing the six-face geometry.

Implemented treatment: one generous leaf silhouette made from readable lines, with Pretext measuring and reflowing the lines and a slight contour response to pointer movement. The poem is also available in ordinary reading order through a plain-text toggle and remains readable when reduced motion is requested. No auto-scattering words or motion is required to read it. Keep the study visually subordinate until the poem and visual direction are approved.

Reference: https://pretextjs.dev/pretext-demo
