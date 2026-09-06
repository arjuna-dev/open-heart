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

  body.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supports3d = CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px');
  let flatMode = prefersReducedMotion.matches || !supports3d;
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
    if (menuImage) menuImage.src = asset === 'ink-02' ? 'assets/menu-chatgpt.png' : 'assets/menu-sheet.svg';
    if (cityImage) cityImage.src = asset === 'ink-03' ? 'assets/nyhavn-gemini.png' : 'assets/nyhavn.svg';
    if (danceImage) danceImage.src = asset === 'ink-03' ? 'assets/dance-gemini.png' : 'assets/dance.svg';
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

  interestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(interestForm);
    const email = String(data.get('email') || '').trim();
    if (!email) return;
    formNote.textContent = 'A small hello received. We will keep the kettle warm.';
    formNote.style.color = 'var(--accent)';
    interestForm.reset();
  });

  applyFlatMode();
  requestPoseUpdate();
})();
