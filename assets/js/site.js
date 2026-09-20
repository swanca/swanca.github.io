(() => {
const STORAGE_KEY = 'swanca-locale';
const THEME_KEY = 'swanca-theme';
  const supported = new Set(['fr', 'en']);

  function resolveLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (supported.has(stored)) return stored;
return 'en';
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

function enablePointerMotion() {
if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
document.querySelectorAll('[data-tilt]').forEach((card) => {
let frame = 0;
card.addEventListener('pointermove', (event) => {
cancelAnimationFrame(frame);
frame = requestAnimationFrame(() => {
const bounds = card.getBoundingClientRect();
const x = (event.clientX - bounds.left) / bounds.width - .5;
const y = (event.clientY - bounds.top) / bounds.height - .5;
card.style.setProperty('--tilt-x', `${(-y * 1.8).toFixed(2)}deg`);
card.style.setProperty('--tilt-y', `${(x * 1.8).toFixed(2)}deg`);
});
});
card.addEventListener('pointerleave', () => {
cancelAnimationFrame(frame);
card.style.setProperty('--tilt-x', '0deg');
card.style.setProperty('--tilt-y', '0deg');
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
  enablePointerMotion();
})();
