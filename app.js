(() => {
  const root = document.documentElement;
  const body = document.body;
  const scene = document.querySelector('#scene');
  const prism = document.querySelector('#prism');
  const track = document.querySelector('#scroll-track');
  const faceButtons = [...document.querySelectorAll('.face-button')];
  const faceTargets = [...document.querySelectorAll('[data-face-target]')];
  const paletteSelect = document.querySelector('#palette-select');
  const assetSelect = document.querySelector('#asset-select');
  const flatSelect = document.querySelector('#flat-select');
  const menuImage = document.querySelector('.asset-image--menu');
  const cityImage = document.querySelector('.asset-image--city');
  const danceImage = document.querySelector('.asset-image--dance');
  const coffeeArt = document.querySelector('.coffee-art');
  const interestForm = document.querySelector('#interest-form');
  const formNote = document.querySelector('#form-note');

  const dishAssets = {
    'benedict-avocado': 'assets/menu/benedict-avocado-chatgpt.png',
    'benedict-lime': 'assets/menu/benedict-lime-chatgpt.png',
    'benedict-chipotle': 'assets/menu/benedict-chipotle-chatgpt.png',
    'salmon-sandwich': 'assets/menu/salmon-chatgpt-variant.png',
    'pulled-sandwich': 'assets/menu/pulled-chatgpt.png',
    'mango-salad': 'assets/menu/mango-gemini.jpg',
    'caesar-salad': 'assets/menu/caesar-chatgpt.png',
    'protein-salad': 'assets/menu/protein-gemini.jpg',
    'cauliflower-wings': 'assets/menu/cauliflower-chatgpt.png',
    'fries-rosemary': 'assets/menu/fries-rosemary-chatgpt.png',
    'key-lime-pie': 'assets/menu/key-lime-chatgpt.png',
    'strawberries-cream': 'assets/menu/strawberries-chatgpt.png'
  };

  const dishGeminiAssets = {
    'benedict-avocado': 'assets/menu/benedict-avocado-gemini.jpg',
    'benedict-lime': 'assets/menu/benedict-lime-gemini.jpg',
    'pulled-sandwich': 'assets/menu/pulled-gemini.jpg',
    'mango-salad': 'assets/menu/mango-gemini.jpg',
    'caesar-salad': 'assets/menu/caesar-gemini.jpg',
    'protein-salad': 'assets/menu/protein-gemini.jpg',
    'cauliflower-wings': 'assets/menu/cauliflower-gemini.jpg',
    'fries-rosemary': 'assets/menu/fries-rosemary-gemini.jpg',
    'strawberries-cream': 'assets/menu/strawberries-gemini.jpg'
  };

  body.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyDishAssets(provider = 'selected') {
    document.querySelectorAll('.dish[data-item]').forEach((dish) => {
      const selected = dishAssets[dish.dataset.item];
      const src = provider === 'gemini' ? (dishGeminiAssets[dish.dataset.item] || selected) : selected;
      const image = dish.querySelector('img');
      const figure = dish.querySelector('.dish-art');
      if (!src || !image || !figure) return;
      image.src = src;
      figure.hidden = false;
    });
  }

  applyDishAssets();

  const categoryTabs = [...document.querySelectorAll('[data-category-tab]')];
  const categorySlides = [...document.querySelectorAll('[data-category-slide]')];
  const categoryCount = document.querySelector('#menu-category-count');
  const categoryPrevious = document.querySelector('#menu-category-prev');
  const categoryNext = document.querySelector('#menu-category-next');
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

  const supports3d = CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px');
  let flatMode = flatSelect.checked || prefersReducedMotion.matches || !supports3d;
  let currentFace = 0;
  let rafId = 0;
  const faces = [...prism.querySelectorAll('.face')];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function applyFlatMode() {
    body.classList.toggle('is-flat', flatMode);
    flatSelect.checked = flatMode;
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

  paletteSelect.addEventListener('change', (event) => {
    root.dataset.palette = event.target.value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--paper').trim());
  });

  assetSelect.addEventListener('change', (event) => {
    const asset = event.target.value;
    root.dataset.asset = asset;
    const hero = document.querySelector('#hero-image');
    if (hero) hero.src = asset === 'gemini' ? 'assets/menu/benedict-avocado-gemini.jpg' : 'assets/menu/benedict-avocado-chatgpt.png';
    applyDishAssets(asset);
    coffeeArt?.classList.toggle('coffee-art--generated', asset === 'ink-03');
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
  window.addEventListener('resize', requestPoseUpdate, { passive: true });
  window.visualViewport?.addEventListener('resize', requestPoseUpdate, { passive: true });
  prefersReducedMotion.addEventListener?.('change', (event) => {
    flatMode = event.matches || !supports3d;
    applyFlatMode();
    requestPoseUpdate();
  });

  document.querySelector('#logo-select')?.addEventListener('change', event => {
    body.classList.toggle('logo-stacked', event.target.value === 'stacked');
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

  applyFlatMode();
  requestPoseUpdate();
})();
