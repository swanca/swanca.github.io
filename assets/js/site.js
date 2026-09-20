(() => {
  const STORAGE_KEY = 'swanca-locale';
  const supported = new Set(['fr', 'en']);

  function resolveLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (supported.has(stored)) return stored;
    return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
  }

  function setLocale(locale) {
    const next = supported.has(locale) ? locale : 'fr';
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

  window.PortfolioLocale = { setLocale, resolveLocale };
  document.querySelectorAll('[data-locale]').forEach((button) => button.addEventListener('click', () => setLocale(button.dataset.locale)));
  setLocale(resolveLocale());
})();
