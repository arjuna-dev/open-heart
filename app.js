(() => {
  const root = document.documentElement;
  const body = document.body;
  const scene = document.querySelector('#scene');
  const prism = document.querySelector('#prism');
  const track = document.querySelector('#scroll-track');
  const faceButtons = [...document.querySelectorAll('.face-button')];
  const faceTargets = [...document.querySelectorAll('[data-face-target]')];
  const paletteSelect = document.querySelector('#palette-select');
  const flatSelect = document.querySelector('#flat-select');
  const compositionSelect = document.querySelector('#composition-select');
  const referenceHint = document.querySelector('#reference-hint');
  const interestForm = document.querySelector('#interest-form');
  const formNote = document.querySelector('#form-note');

  body.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const categoryAssets = {
    benedict: 'assets/posters/chatgpt/01-avocado-benedict.png',
    sandwiches: 'assets/posters/chatgpt/03-vegan-salmon.png',
    salads: 'assets/posters/chatgpt/06-vegan-caesar.png',
    entrees: 'assets/posters/chatgpt/07-bbq-cauliflower.png',
    sauces: 'assets/posters/chatgpt/08-five-sauces.png',
    desserts: 'assets/menu/key-lime-chatgpt.png',
    drinks: 'assets/posters/chatgpt/10-something-warm.png'
  };

  function applyCategoryAssets() {
    document.querySelectorAll('[data-category-art]').forEach((figure) => {
      const asset = categoryAssets[figure.dataset.categoryArt];
      const image = figure.querySelector('img');
      if (!asset || !image) return;
      image.src = asset;
    });
  }

  applyCategoryAssets();

  const categoryTabs = [...document.querySelectorAll('[data-category-tab]')];
  const categorySlides = [...document.querySelectorAll('[data-category-slide]')];
  const categoryCount = document.querySelector('#menu-category-count');
  const categoryPrevious = document.querySelector('#menu-category-prev');
  const categoryNext = document.querySelector('#menu-category-next');
  const menuSwitcher = document.querySelector('.menu-switcher');
  let activeCategory = 0;

  function showCategory(index) {
    if (!categorySlides.length) return;
    activeCategory = (index + categorySlides.length) % categorySlides.length;
    categorySlides.forEach((slide, i) => {
      const isActive = i === activeCategory;
      slide.hidden = !isActive;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    categoryTabs.forEach((tab, i) => {
      const isActive = i === activeCategory;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      tab.classList.toggle('is-active', isActive);
    });
    if (categoryCount) categoryCount.textContent = `${String(activeCategory + 1).padStart(2, '0')} / ${String(categorySlides.length).padStart(2, '0')}`;
  }

  categoryTabs.forEach((tab, index) => tab.addEventListener('click', () => showCategory(index)));
  categoryPrevious?.addEventListener('click', () => showCategory(activeCategory - 1));
  categoryNext?.addEventListener('click', () => showCategory(activeCategory + 1));
  showCategory(0);

  let categoryTimer = 0;
  const stopCategoryAutoplay = () => {
    if (categoryTimer) window.clearInterval(categoryTimer);
    categoryTimer = 0;
  };
  const startCategoryAutoplay = () => {
    if (categoryTimer || prefersReducedMotion.matches || categorySlides.length < 2) return;
    categoryTimer = window.setInterval(() => showCategory(activeCategory + 1), 4200);
  };
  menuSwitcher?.addEventListener('mouseenter', stopCategoryAutoplay);
  menuSwitcher?.addEventListener('mouseleave', startCategoryAutoplay);
  menuSwitcher?.addEventListener('focusin', stopCategoryAutoplay);
  menuSwitcher?.addEventListener('focusout', (event) => {
    if (!menuSwitcher.contains(event.relatedTarget)) startCategoryAutoplay();
  });
  startCategoryAutoplay();

  const supports3d = CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px');
  let flatMode = flatSelect.checked || prefersReducedMotion.matches || !supports3d;
  let currentFace = 0;
  let rafId = 0;
  const faces = [...prism.querySelectorAll('.face')];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function applyFlatMode() {
    body.classList.toggle('is-flat', flatMode);
    flatSelect.checked = flatMode;
    if (referenceHint) referenceHint.textContent = flatMode ? 'Scroll to explore' : 'Scroll to rotate';
    faces.forEach(face => { face.inert = false; });
    if (flatMode) {
      scene.classList.remove('is-transitioning');
      scene.dataset.face = String(currentFace);
      updateNav(currentFace);
    }
  }

  function updateNav(index) {
    faceButtons.forEach((button) => {
      const isCurrent = Number(button.dataset.face) === index;
      button.classList.toggle('is-current', isCurrent);
      if (isCurrent) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    scene.dataset.face = String(index);
  }

  function updatePose() {
    rafId = 0;
    if (flatMode) {
      const nearest = faces.reduce((best, face, i) => Math.abs(face.getBoundingClientRect().top) < Math.abs(faces[best].getBoundingClientRect().top) ? i : best, 0);
      currentFace = nearest;
      updateNav(nearest);
      return;
    }
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const maxScroll = Math.max(track.offsetHeight - viewportHeight, 1);
    const progress = clamp((window.scrollY - trackTop) / maxScroll, 0, 1) * 5;
    const segment = Math.min(Math.floor(progress), 4);
    const local = progress - segment;
    // Give each page a flat reading interval. Each pair shares a physical edge.
    const t = clamp((local - 0.18) / 0.64, 0, 1);
    const angle = t * 90;
    const vertical = segment < 3;
    const depth = (vertical ? scene.clientHeight : scene.clientWidth) / 2;
    const rotation = vertical ? `rotateX(${angle}deg)` : `rotateY(${-angle}deg)`;
    prism.style.transform = `translateZ(${-depth}px) ${rotation}`;
    faces.forEach((face, i) => {
      const outgoing = i === segment;
      const incoming = i === segment + 1;
      face.style.visibility = outgoing || incoming ? 'visible' : 'hidden';
      face.inert = i !== (t < 0.5 ? segment : segment + 1);
      face.style.transform = outgoing ? `translateZ(${depth}px)` : incoming ? `${vertical ? 'rotateX(-90deg)' : 'rotateY(90deg)'} translateZ(${depth}px)` : 'none';
      face.style.setProperty('--shade', String(outgoing ? 0.42 * t : 0.5 * (1 - t)));
      face.style.setProperty('--shade-direction', vertical ? (outgoing ? 'to bottom' : 'to top') : (outgoing ? 'to right' : 'to left'));
    });
    const nextFace = clamp(Math.round(progress), 0, 5);
    scene.classList.toggle('is-transitioning', t > 0 && t < 1);
    scene.style.setProperty('--face-progress', progress.toFixed(3));
    if (nextFace !== currentFace) {
      currentFace = nextFace;
      updateNav(currentFace);
    }
  }

  function requestPoseUpdate() {
    if (!rafId) rafId = requestAnimationFrame(updatePose);
  }

  function goToFace(index) {
    const target = clamp(Number(index), 0, 5);
    currentFace = target;
    updateNav(target);
    if (flatMode) {
      document.querySelector(`#face-${target}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const top = track.offsetTop + ((track.offsetHeight - (window.visualViewport?.height || window.innerHeight)) * target) / 5;
    window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  }

  function applyComposition(mode = 'print-room') {
    const reference = mode === 'centered-pair';
    body.classList.toggle('layout-reference', reference);
    root.dataset.composition = reference ? 'centered-pair' : 'print-room';
  }

  compositionSelect?.addEventListener('change', (event) => applyComposition(event.target.value));

  const pretextStage = document.querySelector('#pretext-stage');
  const pretextLines = document.querySelector('#pretext-lines');
  const pretextToggle = document.querySelector('#pretext-toggle');
  const pretextStatus = document.querySelector('#pretext-status');
  const poemText = 'In Devas, beasts, birds, insects, and in worms,\nThis Prema dwells. Who loves all beings without distinction,\nHe indeed is worshipping best his God.';
  let pretextApi = null;
  let pretextPlain = false;

  function renderPretextFallback(width, lineHeight) {
    const words = poemText.replaceAll('\n', ' ').split(/\s+/);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > 28 && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines.map((text, i) => ({ text, width: width * (0.55 + 0.4 * Math.sin(Math.PI * ((i + 0.5) / lines.length))), y: i * lineHeight }));
  }

  function renderPretext() {
    if (!pretextStage || !pretextLines || pretextPlain) return;
    const stageWidth = pretextStage.clientWidth;
    if (!stageWidth) return;
    const lineHeight = window.innerWidth < 800 ? 22 : 27;
    const bodyStyle = getComputedStyle(pretextLines);
    const canvasFont = `${bodyStyle.fontWeight} ${bodyStyle.fontSize} ${bodyStyle.fontFamily}`;
    const prepared = pretextApi?.prepareWithSegments(poemText, canvasFont, { whiteSpace: 'pre-wrap' });
    const maxWidth = Math.max(220, stageWidth - 36);
    const lines = [];
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let safety = 0;
    while (prepared && safety < 40) {
      const y = lines.length * lineHeight;
      const t = lines.length / 8;
      const width = maxWidth * (0.48 + 0.47 * Math.sin(Math.PI * Math.min(t, 1)));
      const next = pretextApi.layoutNextLine(prepared, cursor, width);
      if (!next) break;
      lines.push({ text: next.text, width, y });
      cursor = next.end;
      safety += 1;
    }
    const resolved = lines.length ? lines : renderPretextFallback(maxWidth, lineHeight);
    pretextLines.replaceChildren(...resolved.map((entry) => {
      const line = document.createElement('span');
      line.textContent = entry.text;
      line.style.width = `${entry.width}px`;
      line.style.left = `calc(50% - ${entry.width / 2}px)`;
      line.style.top = `${entry.y}px`;
      return line;
    }));
    pretextLines.style.height = `${Math.max(170, resolved.length * lineHeight + 10)}px`;
  }

  function setPretextPlain(plain) {
    pretextPlain = plain;
    if (!pretextStage || !pretextLines) return;
    pretextStage.dataset.plain = String(plain);
    pretextToggle?.setAttribute('aria-pressed', String(plain));
    if (pretextToggle) pretextToggle.textContent = plain ? 'Shape the lines' : 'Read plainly';
    if (pretextStatus) pretextStatus.textContent = plain ? 'Plain reading mode.' : (pretextApi ? 'Pretext layout active.' : 'Reading shape fallback active.');
    if (plain) {
      pretextLines.textContent = poemText;
      pretextLines.style.height = 'auto';
    } else {
      renderPretext();
    }
  }

  pretextToggle?.addEventListener('click', () => setPretextPlain(!pretextPlain));
  pretextStage?.addEventListener('pointermove', (event) => {
    const rect = pretextStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pretextStage.style.setProperty('--shape-x', `${x.toFixed(3)}deg`);
    pretextStage.style.setProperty('--shape-y', `${y.toFixed(3)}deg`);
  });
  pretextStage?.addEventListener('pointerleave', () => {
    pretextStage.style.setProperty('--shape-x', '0deg');
    pretextStage.style.setProperty('--shape-y', '0deg');
  });
  if (pretextStage) {
    import('https://esm.sh/@chenglou/pretext@0.0.8?bundle').then((module) => {
      pretextApi = module;
      if (pretextStatus) pretextStatus.textContent = 'Pretext layout active.';
      renderPretext();
    }).catch(() => {
      if (pretextStatus) pretextStatus.textContent = 'Reading shape fallback active.';
      renderPretext();
    });
  }

  paletteSelect.addEventListener('change', (event) => {
    root.dataset.palette = event.target.value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--paper').trim());
  });

  flatSelect.addEventListener('change', (event) => {
    flatMode = event.target.checked;
    applyFlatMode();
    goToFace(currentFace);
    requestPoseUpdate();
  });

  faceButtons.forEach((button) => button.addEventListener('click', () => goToFace(button.dataset.face)));
  faceTargets.forEach((button) => button.addEventListener('click', () => goToFace(button.dataset.faceTarget)));
  window.addEventListener('scroll', requestPoseUpdate, { passive: true });
  window.addEventListener('resize', () => { requestPoseUpdate(); renderPretext(); }, { passive: true });
  window.visualViewport?.addEventListener('resize', requestPoseUpdate, { passive: true });
  prefersReducedMotion.addEventListener?.('change', (event) => {
    flatMode = event.matches || !supports3d;
    stopCategoryAutoplay();
    if (!event.matches) startCategoryAutoplay();
    applyFlatMode();
    requestPoseUpdate();
  });

  interestForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(interestForm);
    const email = String(data.get('email') || '').trim();
    if (!email) return;
    formNote.textContent = 'A small hello received. We will keep the kettle warm.';
    formNote.style.color = 'var(--accent)';
    interestForm.reset();
  });

  document.querySelector('#share-button')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const status = document.querySelector('#share-status');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Open Heart', text: 'Open Heart, a vegetarian place for original plant-based creations.', url: window.location.href });
        if (status) status.textContent = 'Shared.';
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        if (status) status.textContent = 'Link copied.';
      } else if (status) {
        status.textContent = window.location.href;
      }
    } catch (error) {
      if (error?.name !== 'AbortError' && status) status.textContent = 'The link is ready in the address bar.';
    }
    button.blur();
  });

  applyComposition(compositionSelect?.value || 'print-room');
  applyFlatMode();
  requestPoseUpdate();
})();
