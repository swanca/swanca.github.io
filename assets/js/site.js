(() => {
  const STORAGE_KEY = 'swanca-locale';
  const THEME_KEY = 'swanca-theme';
  const supported = new Set(['fr', 'en']);

  function resolveLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return supported.has(stored) ? stored : 'en';
  }

  function setLocale(locale) {
    const next = supported.has(locale) ? locale : 'en';
    document.documentElement.lang = next;
    document.querySelectorAll('[data-fr][data-en]').forEach((node) => {
      node.textContent = node.dataset[next];
    });
    document.querySelectorAll('[data-alt-fr][data-alt-en]').forEach((node) => {
      node.alt = node.dataset[next === 'fr' ? 'altFr' : 'altEn'];
    });
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.locale === next));
    });
    document.title = document.body.dataset[next === 'fr' ? 'titleFr' : 'titleEn'];
    localStorage.setItem(STORAGE_KEY, next);
    document.dispatchEvent(new CustomEvent('portfolio:locale', { detail: next }));
  }

  function resolveTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.dataset.activeTheme = next;
    });
    localStorage.setItem(THEME_KEY, next);
  }

  function enableCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const slides = [...carousel.querySelectorAll('[data-slide-panel]')];
      const dots = [...carousel.querySelectorAll('[data-slide]')];
      const position = carousel.querySelector('.carousel-position');
      let current = 0;
      let pointerStart = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== current; });
        dots.forEach((dot, dotIndex) => dot.setAttribute('aria-pressed', String(dotIndex === current)));
        if (position) position.textContent = `${current + 1} / ${slides.length}`;
      }

      carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => show(current - 1));
      carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => show(current + 1));
      dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.slide))));
      carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
      });
      carousel.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
      carousel.addEventListener('pointerup', (event) => {
        if (pointerStart === null) return;
        const distance = event.clientX - pointerStart;
        pointerStart = null;
        if (Math.abs(distance) < 45) return;
        show(current + (distance < 0 ? 1 : -1));
      });
      carousel.addEventListener('pointercancel', () => { pointerStart = null; });
      show(0);
    });
  }

  function enablePointerMotion() {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.project-gallery').forEach((gallery) => {
      let frame = 0;
      gallery.addEventListener('pointermove', (event) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = gallery.getBoundingClientRect();
          gallery.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
          gallery.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
        });
      });
    });
  }

  window.PortfolioLocale = { setLocale, resolveLocale };
  document.querySelectorAll('[data-locale]').forEach((button) => button.addEventListener('click', () => setLocale(button.dataset.locale)));
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }));
  setTheme(resolveTheme());
  setLocale(resolveLocale());
  enableCarousels();
  enablePointerMotion();
})();
