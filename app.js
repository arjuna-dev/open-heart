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
  const menuModeSelect = document.querySelector('#menu-mode-select');
  const menuPairSelect = document.querySelector('#menu-pair-select');
  const carouselAnimationSelect = document.querySelector('#carousel-animation-select');
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
  const categoryCurrent = document.querySelector('#menu-category-current');
  const categoryViewport = document.querySelector('.category-viewport');
  const menuSwitcher = document.querySelector('.menu-switcher');
  const minimalMenu = document.querySelector('#minimal-menu');
  const minimalTabs = [...document.querySelectorAll('[data-minimal-tab]')];
  const minimalSlides = [...document.querySelectorAll('[data-minimal-slide]')];
  const minimalViewport = document.querySelector('.minimal-menu__viewport');
  const pairedMenu = document.querySelector('#paired-menu');
  const pairedMenuTitle = document.querySelector('#paired-menu-title');
  const pairedMenuItems = document.querySelector('#paired-menu-items');
  const pairedMenuImage = document.querySelector('#paired-menu-image');
  const pairedMenuCaption = document.querySelector('#paired-menu-caption');
  const pairedTabs = [...document.querySelectorAll('[data-paired-tab]')];
  const carouselRegions = [...document.querySelectorAll('[data-carousel-region]')];
  const autoplayButtons = [...document.querySelectorAll('[data-carousel-autoplay-toggle]')];
  let activeCategory = 0;
  let activeMinimalGroup = 0;
  let minimalMenuMode = false;
  let pairedMenuMode = false;
  let carouselAnimationMode = carouselAnimationSelect?.value || 'slide';
  let categoryAnimation = null;
  let minimalAnimation = null;
  let pairedAnimation = null;

  function resetMotionStyles(element) {
    if (window.gsap) window.gsap.set(element, { clearProps: 'transform,opacity' });
    ['transform', 'opacity', 'translate', 'rotate', 'scale', 'position', 'inset', 'width'].forEach((property) => element.style.removeProperty(property));
  }

  function renderPairedCategory(index, { animate = false } = {}) {
    const slide = categorySlides[index];
    if (!slide || !pairedMenuItems) return;
    const category = slide.dataset.categorySlide;
    const label = categoryTabs[index]?.textContent.replace(/^\d+\s*/, '') || category;
    const heading = slide.querySelector('.menu-slide-head p')?.textContent || label;
    const dishes = [...slide.querySelectorAll('.dish')];

    if (pairedMenuTitle) pairedMenuTitle.textContent = heading;
    pairedMenuItems.replaceChildren(...dishes.map((dish, dishIndex) => {
      const item = document.createElement('li');
      item.className = 'paired-menu__item';
      const number = document.createElement('span');
      number.textContent = String(dishIndex + 1).padStart(2, '0');
      const copy = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = dish.querySelector('h3')?.textContent || '';
      const description = document.createElement('p');
      description.textContent = dish.querySelector('p')?.textContent || '';
      copy.append(title, description);
      item.append(number, copy);
      return item;
    }));

    const asset = categoryAssets[category];
    if (pairedMenuImage && asset) pairedMenuImage.src = asset;
    if (pairedMenuImage) pairedMenuImage.alt = `${label} menu poster in a controlled print`;
    if (pairedMenuCaption) pairedMenuCaption.textContent = `${String(index + 1).padStart(2, '0')} / ${label}`;
    pairedTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.setAttribute('aria-selected', String(isActive));
      if (isActive) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
      tab.tabIndex = isActive ? 0 : -1;
      tab.classList.toggle('is-active', isActive);
    });
    if (animate) animatePairedPresentation();
  }

  function finishPairedAnimation() {
    if (pairedAnimation) {
      pairedAnimation.kill();
      pairedAnimation = null;
    }
    pairedMenu?.querySelectorAll('.paired-menu__copy,.paired-menu__print').forEach((element) => {
      resetMotionStyles(element);
    });
  }

  function animatePairedPresentation() {
    if (!pairedMenu || pairedMenu.hidden || carouselAnimationMode === 'none' || prefersReducedMotion.matches || !window.gsap) return;
    finishPairedAnimation();
    const elements = [...pairedMenu.querySelectorAll('.paired-menu__copy,.paired-menu__print')];
    const from = carouselAnimationMode === 'fade'
      ? { opacity: 0, x: 0, xPercent: 0 }
      : { opacity: 0, x: 28, xPercent: 0 };
    const to = carouselAnimationMode === 'fade'
      ? { opacity: 1, duration: 0.52, ease: 'power1.inOut' }
      : { opacity: 1, x: 0, duration: 0.58, ease: 'power2.out' };
    pairedAnimation = window.gsap.fromTo(elements, from, {
      ...to,
      onComplete: () => {
        pairedAnimation = null;
        elements.forEach(resetMotionStyles);
      }
    });
  }

  function stabilizeCategoryViewport() {
    if (!categoryViewport || menuSwitcher?.hidden || categoryViewport.clientWidth < 1) return;
    let maximumHeight = 500;
    categorySlides.forEach((slide) => {
      const wasHidden = slide.hidden;
      const savedStyle = slide.getAttribute('style');
      slide.hidden = false;
      slide.style.position = 'absolute';
      slide.style.inset = '0 auto auto 0';
      slide.style.width = '100%';
      slide.style.visibility = 'hidden';
      slide.style.pointerEvents = 'none';
      slide.style.transform = 'none';
      slide.style.opacity = '1';
      maximumHeight = Math.max(maximumHeight, slide.offsetHeight);
      slide.hidden = wasHidden;
      if (savedStyle === null) slide.removeAttribute('style');
      else slide.setAttribute('style', savedStyle);
    });
    categoryViewport.style.height = `${Math.ceil(maximumHeight)}px`;
  }

  function finishCategoryAnimation() {
    if (categoryAnimation) {
      categoryAnimation.kill();
      categoryAnimation = null;
    }
    categorySlides.forEach((slide, i) => {
      const isActive = i === activeCategory;
      slide.hidden = !isActive;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
      slide.toggleAttribute('inert', !isActive);
      resetMotionStyles(slide);
    });
    categoryViewport?.classList.remove('is-animating');
  }

  function updateCategoryState(index) {
    const label = categoryTabs[index]?.textContent.replace(/^\d+\s*/, '').trim() || categorySlides[index]?.dataset.categorySlide || '';
    const category = categorySlides[index]?.dataset.categorySlide || '';
    categoryTabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.setAttribute('aria-selected', String(isActive));
      if (isActive) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
      tab.tabIndex = isActive ? 0 : -1;
      tab.classList.toggle('is-active', isActive);
    });
    if (categoryCount) categoryCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(categorySlides.length).padStart(2, '0')}`;
    if (categoryCurrent) categoryCurrent.textContent = `${String(index + 1).padStart(2, '0')} / ${label}`;
    menuSwitcher?.setAttribute('data-active-category', category);
  }

  function showCategory(index, { animate = true } = {}) {
    if (!categorySlides.length) return;
    finishCategoryAnimation();
    const previous = activeCategory;
    activeCategory = (index + categorySlides.length) % categorySlides.length;
    updateCategoryState(activeCategory);
    if (pairedMenuMode && pairedMenu && !pairedMenu.hidden) {
      renderPairedCategory(activeCategory, { animate: animate && previous !== activeCategory });
      return;
    }
    renderPairedCategory(activeCategory);
    if (!animate || previous === activeCategory || carouselAnimationMode === 'none' || prefersReducedMotion.matches || !window.gsap || !categoryViewport) {
      finishCategoryAnimation();
      return;
    }

    const outgoing = categorySlides[previous];
    const incoming = categorySlides[activeCategory];
    categorySlides.forEach((slide, i) => {
      const isInTransition = i === previous || i === activeCategory;
      slide.hidden = !isInTransition;
      slide.classList.toggle('is-active', i === activeCategory);
      slide.setAttribute('aria-hidden', String(i !== activeCategory));
      slide.inert = i !== activeCategory;
      slide.toggleAttribute('inert', i !== activeCategory);
      if (isInTransition) {
        slide.style.position = 'absolute';
        slide.style.inset = '0 auto auto 0';
        slide.style.width = '100%';
      }
    });
    categoryViewport.classList.add('is-animating');

    if (carouselAnimationMode === 'fade') {
      window.gsap.set(outgoing, { opacity: 1, x: 0, xPercent: 0 });
      window.gsap.set(incoming, { opacity: 0, x: 0, xPercent: 0 });
      categoryAnimation = window.gsap.timeline({
        onComplete: () => {
          categoryAnimation = null;
          finishCategoryAnimation();
        }
      });
      categoryAnimation
        .to(outgoing, { opacity: 0, duration: 0.24, ease: 'power1.out' }, 0)
        .to(incoming, { opacity: 1, duration: 0.42, ease: 'power1.inOut' }, 0.16);
      return;
    }

    window.gsap.set(outgoing, { opacity: 1, x: 0, xPercent: 0 });
    window.gsap.set(incoming, { opacity: 1, x: 0, xPercent: 100 });
    categoryAnimation = window.gsap.timeline({
      onComplete: () => {
        categoryAnimation = null;
        finishCategoryAnimation();
      }
    });
    categoryAnimation
      .to(outgoing, { xPercent: -100, duration: 0.62, ease: 'power2.inOut' }, 0)
      .to(incoming, { xPercent: 0, duration: 0.62, ease: 'power2.inOut' }, 0);
  }

  categoryTabs.forEach((tab, index) => tab.addEventListener('click', () => {
    pauseAutoplayForInteraction();
    showCategory(index);
  }));
  categoryPrevious?.addEventListener('click', () => {
    pauseAutoplayForInteraction();
    showCategory(activeCategory - 1);
  });
  categoryNext?.addEventListener('click', () => {
    pauseAutoplayForInteraction();
    showCategory(activeCategory + 1);
  });
  showCategory(0, { animate: false });
  stabilizeCategoryViewport();

  function stabilizeMinimalViewport() {
    if (!minimalViewport || minimalMenu?.hidden || minimalViewport.clientWidth < 1) return;
    let maximumHeight = 0;
    minimalSlides.forEach((slide) => {
      const wasHidden = slide.hidden;
      const savedStyle = slide.getAttribute('style');
      slide.hidden = false;
      slide.style.position = 'absolute';
      slide.style.inset = '0 auto auto 0';
      slide.style.width = '100%';
      slide.style.visibility = 'hidden';
      slide.style.pointerEvents = 'none';
      maximumHeight = Math.max(maximumHeight, slide.offsetHeight);
      slide.hidden = wasHidden;
      if (savedStyle === null) slide.removeAttribute('style');
      else slide.setAttribute('style', savedStyle);
    });
    minimalViewport.style.height = `${Math.max(220, Math.ceil(maximumHeight))}px`;
  }

  function commitMinimalGroup(index) {
    minimalSlides.forEach((slide, i) => {
      const isActive = i === index;
      slide.hidden = !isActive;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
      slide.toggleAttribute('inert', !isActive);
      resetMotionStyles(slide);
    });
    minimalViewport?.classList.remove('is-animating');
  }

  function finishMinimalAnimation() {
    if (minimalAnimation) {
      minimalAnimation.kill();
      minimalAnimation = null;
    }
    commitMinimalGroup(activeMinimalGroup);
  }

  function updateMinimalTabs() {
    minimalTabs.forEach((tab, i) => {
      const isActive = i === activeMinimalGroup;
      tab.setAttribute('aria-selected', String(isActive));
      if (isActive) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
      tab.tabIndex = isActive ? 0 : -1;
      tab.classList.toggle('is-active', isActive);
    });
  }

  function showMinimalGroup(index, { animate = true } = {}) {
    if (!minimalSlides.length) return;
    if (minimalAnimation) finishMinimalAnimation();
    const previous = activeMinimalGroup;
    activeMinimalGroup = (index + minimalSlides.length) % minimalSlides.length;
    updateMinimalTabs();
    if (!animate || previous === activeMinimalGroup || carouselAnimationMode === 'none' || prefersReducedMotion.matches || !window.gsap || !minimalViewport || minimalMenu?.hidden) {
      commitMinimalGroup(activeMinimalGroup);
      return;
    }

    const outgoing = minimalSlides[previous];
    const incoming = minimalSlides[activeMinimalGroup];
    minimalSlides.forEach((slide, i) => {
      const isInTransition = i === previous || i === activeMinimalGroup;
      slide.hidden = !isInTransition;
      slide.classList.toggle('is-active', i === activeMinimalGroup);
      slide.setAttribute('aria-hidden', String(i !== activeMinimalGroup));
      slide.inert = false;
      slide.removeAttribute('inert');
      if (isInTransition) {
        slide.style.position = 'absolute';
        slide.style.inset = '0 auto auto 0';
        slide.style.width = '100%';
      }
    });
    minimalViewport.classList.add('is-animating');
    if (carouselAnimationMode === 'fade') {
      window.gsap.set(outgoing, { opacity: 1, x: 0, xPercent: 0 });
      window.gsap.set(incoming, { opacity: 0, x: 0, xPercent: 0 });
      minimalAnimation = window.gsap.timeline({
        onComplete: () => {
          minimalAnimation = null;
          commitMinimalGroup(activeMinimalGroup);
        }
      });
      minimalAnimation
        .to(outgoing, { opacity: 0, duration: 0.24, ease: 'power1.out' }, 0)
        .to(incoming, { opacity: 1, duration: 0.42, ease: 'power1.inOut' }, 0.16);
      return;
    }
    window.gsap.set(outgoing, { opacity: 1, x: 0, xPercent: 0 });
    window.gsap.set(incoming, { opacity: 1, x: 0, xPercent: 100 });
    minimalAnimation = window.gsap.timeline({
      onComplete: () => {
        minimalAnimation = null;
        commitMinimalGroup(activeMinimalGroup);
      }
    });
    minimalAnimation
      .to(outgoing, { xPercent: -100, duration: 0.62, ease: 'power2.inOut' }, 0)
      .to(incoming, { xPercent: 0, duration: 0.62, ease: 'power2.inOut' }, 0);
  }

  minimalTabs.forEach((tab, index) => tab.addEventListener('click', () => {
    pauseAutoplayForInteraction();
    showMinimalGroup(index);
  }));
  pairedTabs.forEach((tab, index) => tab.addEventListener('click', () => {
    pauseAutoplayForInteraction();
    showCategory(index);
  }));
  showMinimalGroup(0, { animate: false });

  let categoryTimer = 0;
  let autoplayPausedByUser = false;
  let autoplayStoppedByFocus = false;
  let autoplayPausedByHover = false;
  let autoplayExplicitlyStarted = false;

  function pauseAutoplayForInteraction() {
    autoplayPausedByUser = true;
    autoplayStoppedByFocus = true;
    autoplayPausedByHover = false;
    autoplayExplicitlyStarted = false;
    stopCategoryAutoplay();
  }

  function syncAutoplayControls() {
    const isPlaying = Boolean(categoryTimer);
    autoplayButtons.forEach((button) => {
      button.textContent = isPlaying ? 'Pause' : 'Play';
      button.setAttribute('aria-label', isPlaying ? 'Pause automatic menu rotation' : 'Start automatic menu rotation');
    });
    [categoryCurrent, categoryCount, pairedMenuItems].forEach((region) => {
      region?.setAttribute('aria-live', isPlaying ? 'off' : 'polite');
    });
  }

  const stopCategoryAutoplay = () => {
    if (categoryTimer) window.clearInterval(categoryTimer);
    categoryTimer = 0;
    syncAutoplayControls();
  };
  const startCategoryAutoplay = () => {
    const slides = minimalMenuMode ? minimalSlides : categorySlides;
    const interactionPaused = autoplayStoppedByFocus || autoplayPausedByHover;
    if (categoryTimer || autoplayPausedByUser || document.hidden || prefersReducedMotion.matches || slides.length < 2 || (interactionPaused && !autoplayExplicitlyStarted)) {
      syncAutoplayControls();
      return;
    }
    categoryTimer = window.setInterval(() => {
      if (minimalMenuMode) showMinimalGroup(activeMinimalGroup + 1);
      else showCategory(activeCategory + 1);
    }, 5600);
    syncAutoplayControls();
  };

  autoplayButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (categoryTimer) {
        autoplayPausedByUser = true;
        autoplayExplicitlyStarted = false;
        stopCategoryAutoplay();
        return;
      }
      autoplayPausedByUser = false;
      autoplayStoppedByFocus = false;
      autoplayPausedByHover = false;
      autoplayExplicitlyStarted = true;
      startCategoryAutoplay();
    });
  });

  carouselRegions.forEach((region) => {
    region.addEventListener('click', (event) => {
      if (event.target.closest('[data-carousel-autoplay-toggle]')) return;
      if (event.target.closest('[data-category-tab],[data-minimal-tab],[data-paired-tab],.dish,.minimal-menu__item,.paired-menu__item')) {
        pauseAutoplayForInteraction();
      }
    });
  });

  carouselRegions.forEach((region) => {
    region.addEventListener('focusin', () => {
      if (autoplayExplicitlyStarted) return;
      autoplayStoppedByFocus = true;
      stopCategoryAutoplay();
    });
    region.addEventListener('pointerenter', () => {
      if (autoplayExplicitlyStarted) return;
      autoplayPausedByHover = true;
      stopCategoryAutoplay();
    });
    region.addEventListener('pointerleave', () => {
      autoplayPausedByHover = false;
      startCategoryAutoplay();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCategoryAutoplay();
    else startCategoryAutoplay();
  });
  startCategoryAutoplay();

  function applyMenuMode(mode = 'carousel') {
    pairedMenuMode = Boolean(menuPairSelect?.checked);
    minimalMenuMode = !pairedMenuMode && mode === 'minimal-list';
    body.classList.toggle('menu-minimal', minimalMenuMode);
    body.classList.toggle('menu-paired', pairedMenuMode);
    root.dataset.menuMode = pairedMenuMode ? 'paired-small' : minimalMenuMode ? 'minimal-list' : 'carousel';
    if (menuSwitcher) menuSwitcher.hidden = minimalMenuMode || pairedMenuMode;
    if (minimalMenu) minimalMenu.hidden = !minimalMenuMode;
    if (pairedMenu) pairedMenu.hidden = !pairedMenuMode;
    finishCategoryAnimation();
    finishMinimalAnimation();
    finishPairedAnimation();
    window.requestAnimationFrame(() => {
      stabilizeCategoryViewport();
      stabilizeMinimalViewport();
    });
    stopCategoryAutoplay();
    startCategoryAutoplay();
  }

  menuModeSelect?.addEventListener('change', (event) => applyMenuMode(event.target.value));
  menuPairSelect?.addEventListener('change', () => applyMenuMode(menuModeSelect?.value || 'carousel'));
  carouselAnimationSelect?.addEventListener('change', (event) => {
    carouselAnimationMode = event.target.value;
    root.dataset.carouselAnimation = carouselAnimationMode;
    finishCategoryAnimation();
    finishMinimalAnimation();
    finishPairedAnimation();
  });
  root.dataset.carouselAnimation = carouselAnimationMode;

  const supports3d = CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px');
  let flatMode = !flatSelect.checked || prefersReducedMotion.matches || !supports3d;
  let currentFace = 0;
  let rafId = 0;
  const faces = [...prism.querySelectorAll('.face')];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function applyFlatMode() {
    body.classList.toggle('is-flat', flatMode);
    root.style.scrollBehavior = flatMode ? '' : 'auto';
    flatSelect.checked = !flatMode;
    if (referenceHint) referenceHint.textContent = flatMode ? 'Scroll to explore' : 'Scroll to rotate';
    faces.forEach(face => {
      face.inert = false;
      face.removeAttribute('inert');
      face.style.pointerEvents = flatMode ? '' : 'none';
    });
    if (flatMode) {
      cancelAnimationFrame(turnRafId);
      turnRafId = 0;
      turnInProgress = false;
      scene.classList.remove('is-transitioning');
      scene.classList.remove('is-resting');
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
    // Wheel input owns the first part of the turn. There is no artificial dead zone.
    const t = clamp(local, 0, 1);
    const edgeEpsilon = 0.0005;
    const restingFace = local <= edgeEpsilon ? segment : local >= 1 - edgeEpsilon ? segment + 1 : -1;
    scene.style.setProperty('--face-progress', progress.toFixed(3));
    if (restingFace >= 0) {
      scene.classList.add('is-resting');
      scene.classList.remove('is-transitioning');
      prism.style.transform = 'none';
      faces.forEach((face, i) => {
        const isCurrent = i === restingFace;
        face.style.visibility = isCurrent ? 'visible' : 'hidden';
        face.inert = !isCurrent;
        face.toggleAttribute('inert', !isCurrent);
        face.style.pointerEvents = isCurrent ? 'auto' : 'none';
        face.style.transform = 'none';
        face.style.setProperty('--shade', '0');
      });
      currentFace = restingFace;
      updateNav(restingFace);
      return;
    }
    scene.classList.remove('is-resting');
    const angle = t * 90;
    const depth = scene.clientHeight / 2;
    const rotation = `rotateX(${angle}deg)`;
    prism.style.transform = `translateZ(${-depth}px) ${rotation}`;
    faces.forEach((face, i) => {
      const outgoing = i === segment;
      const incoming = i === segment + 1;
      const visible = outgoing || incoming;
      face.style.visibility = visible ? 'visible' : 'hidden';
      face.inert = !visible;
      face.toggleAttribute('inert', !visible);
      // Both faces remain interactive throughout the turn. The old halfway
      // switch made the visible face inert and caused lost clicks and text
      // selections during wheel-driven transitions.
      face.style.pointerEvents = visible ? 'auto' : 'none';
      face.setAttribute('aria-hidden', String(!visible));
      face.style.transform = outgoing ? `translateZ(${depth}px)` : incoming ? `rotateX(-90deg) translateZ(${depth}px)` : 'none';
      face.style.setProperty('--shade', String(outgoing ? 0.42 * t : 0.5 * (1 - t)));
      face.style.setProperty('--shade-direction', outgoing ? 'to bottom' : 'to top');
    });
    const nextFace = clamp(Math.round(progress), 0, 5);
    scene.classList.toggle('is-transitioning', t > 0 && t < 1);
    if (nextFace !== currentFace) {
      currentFace = nextFace;
      updateNav(currentFace);
    }
  }

  function requestPoseUpdate() {
    if (!rafId) rafId = requestAnimationFrame(updatePose);
  }

  let turnRafId = 0;
  let turnInProgress = false;

  function getScrollMetrics() {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const maxScroll = Math.max(track.offsetHeight - viewportHeight, 1);
    return { trackTop, maxScroll, pageSpan: maxScroll / 5 };
  }

  function getFaceScrollTop(index, metrics = getScrollMetrics()) {
    return metrics.trackTop + metrics.pageSpan * clamp(Number(index), 0, 5);
  }

  function animateTurnTo(top, duration = 720) {
    cancelAnimationFrame(turnRafId);
    root.style.scrollBehavior = 'auto';
    if (prefersReducedMotion.matches) {
      turnInProgress = false;
      window.scrollTo({ top, behavior: 'auto' });
      updatePose();
      resetWheelGesture();
      return;
    }
    const start = window.scrollY;
    const distance = top - start;
    if (Math.abs(distance) < 0.5) {
      turnInProgress = false;
      window.scrollTo({ top, behavior: 'auto' });
      updatePose();
      resetWheelGesture();
      return;
    }
    const startedAt = performance.now();
    turnInProgress = true;
    const step = (now) => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      window.scrollTo(0, start + distance * eased);
      updatePose();
      if (progress < 1) {
        turnRafId = requestAnimationFrame(step);
      } else {
        turnRafId = 0;
        turnInProgress = false;
        window.scrollTo({ top, behavior: 'auto' });
        updatePose();
        // Release exactly when this face lands. Any later wheel delta can
        // begin the next face immediately, even if the visitor keeps scrolling.
        resetWheelGesture();
      }
    };
    turnRafId = requestAnimationFrame(step);
  }

  function goToFace(index) {
    const target = clamp(Number(index), 0, 5);
    currentFace = target;
    updateNav(target);
    faces[target]?.querySelector('.face__inner')?.scrollTo({ top: 0, behavior: 'auto' });
    if (flatMode) {
      document.querySelector(`#face-${target}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const top = getFaceScrollTop(target);
    animateTurnTo(top);
  }

  const wheelCommitThreshold = 0.1;
  const wheelGestureIdleDelay = 180;
  let wheelDirection = 0;
  let wheelBaseScroll = 0;
  let wheelTargetFace = -1;
  let wheelGestureCommitted = false;
  let wheelReleaseTimer = 0;

  function resetWheelGesture() {
    wheelDirection = 0;
    wheelBaseScroll = 0;
    wheelTargetFace = -1;
    wheelGestureCommitted = false;
  }

  function armWheelRelease(delay = wheelGestureIdleDelay) {
    window.clearTimeout(wheelReleaseTimer);
    wheelReleaseTimer = window.setTimeout(() => {
      if (wheelGestureCommitted) {
        // The active turn owns all deltas until it lands. The completion
        // callback releases the gesture so continued scrolling can proceed.
        if (!turnInProgress) resetWheelGesture();
        return;
      }
      const shouldSettle = !turnInProgress && wheelDirection;
      const returnTop = shouldSettle ? getFaceScrollTop(currentFace) : 0;
      resetWheelGesture();
      if (shouldSettle) animateTurnTo(returnTop, 220);
    }, delay);
  }

  function route3dWheel(event) {
    if (flatMode || event.ctrlKey || event.metaKey || !event.deltaY) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.developer-panel')) return;
    const normalizedDelta = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? event.deltaY * 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? event.deltaY * window.innerHeight
        : event.deltaY;

    // One active turn owns one adjacent face. Consume the remaining momentum
    // while it is moving so a trackpad tail cannot skip a second face.
    if (wheelGestureCommitted) {
      event.preventDefault();
      armWheelRelease();
      return;
    }

    // Wheel input can still interrupt a navigation or settle animation when no
    // committed wheel gesture owns that motion.
    if (turnInProgress) {
      cancelAnimationFrame(turnRafId);
      turnRafId = 0;
      turnInProgress = false;
      window.clearTimeout(wheelReleaseTimer);
      resetWheelGesture();
    }
    const faceScroller = target?.closest('.face__inner');
    if (faceScroller && faceScroller.scrollHeight > faceScroller.clientHeight + 1) {
      const atTop = faceScroller.scrollTop <= 1;
      const atBottom = faceScroller.scrollTop + faceScroller.clientHeight >= faceScroller.scrollHeight - 1;
      const canScrollInside = normalizedDelta < 0 ? !atTop : !atBottom;
      if (canScrollInside) return;
    }
    event.preventDefault();
    const direction = normalizedDelta > 0 ? 1 : -1;
    if (!wheelDirection || direction !== wheelDirection) {
      wheelDirection = direction;
      wheelBaseScroll = getFaceScrollTop(currentFace);
      wheelTargetFace = clamp(currentFace + direction, 0, 5);
    }
    if (wheelTargetFace === currentFace) {
      armWheelRelease();
      return;
    }
    const metrics = getScrollMetrics();
    const destination = getFaceScrollTop(wheelTargetFace, metrics);
    const segmentStart = Math.min(wheelBaseScroll, destination);
    const segmentEnd = Math.max(wheelBaseScroll, destination);
    const nextScroll = clamp(window.scrollY + normalizedDelta, segmentStart, segmentEnd);
    window.scrollTo({ top: nextScroll, behavior: 'auto' });
    // Render in the same wheel event so a ten-pixel delta produces a
    // ten-pixel-equivalent pose change without waiting for another frame.
    updatePose();
    armWheelRelease();
    if (Math.abs(nextScroll - wheelBaseScroll) >= metrics.pageSpan * wheelCommitThreshold) {
      wheelGestureCommitted = true;
      animateTurnTo(destination);
    }
  }

  document.addEventListener('wheel', route3dWheel, { passive: false, capture: true });

  const faceHashMap = new Map([
    ['#face-0', 0],
    ['#story', 1],
    ['#menu', 2],
    ['#atmosphere', 3],
    ['#visit', 4]
  ]);
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (flatMode) return;
      const hash = link.getAttribute('href');
      const target = faceHashMap.get(hash);
      if (target === undefined) return;
      event.preventDefault();
      window.history.replaceState(null, '', hash);
      goToFace(target);
    });
  });

  function applyComposition(mode = 'centered-pair-small') {
    const small = mode === 'centered-pair-small';
    const reference = small || mode === 'centered-pair';
    body.classList.toggle('layout-reference', reference);
    body.classList.toggle('layout-reference-small', small);
    root.dataset.composition = small ? 'centered-pair-small' : 'centered-pair';
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
    flatMode = !event.target.checked || prefersReducedMotion.matches || !supports3d;
    applyFlatMode();
    goToFace(currentFace);
    requestPoseUpdate();
  });

  faceButtons.forEach((button) => button.addEventListener('click', () => goToFace(button.dataset.face)));
  faceTargets.forEach((button) => button.addEventListener('click', () => goToFace(button.dataset.faceTarget)));
  window.addEventListener('scroll', requestPoseUpdate, { passive: true });
  window.addEventListener('resize', () => {
    finishCategoryAnimation();
    finishMinimalAnimation();
    finishPairedAnimation();
    stabilizeCategoryViewport();
    stabilizeMinimalViewport();
    requestPoseUpdate();
    renderPretext();
  }, { passive: true });
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

  applyComposition(compositionSelect?.value || 'centered-pair-small');
  applyMenuMode(menuModeSelect?.value || 'carousel');
  applyFlatMode();
  document.fonts?.ready.then(stabilizeCategoryViewport);
  document.fonts?.ready.then(stabilizeMinimalViewport);
  window.addEventListener('load', () => {
    stabilizeCategoryViewport();
    stabilizeMinimalViewport();
  }, { once: true });
  requestPoseUpdate();
})();
