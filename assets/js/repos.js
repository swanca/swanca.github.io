const grid = document.querySelector('#repository-grid');
const count = document.querySelector('#repo-count');
const endpoint = 'https://api.github.com/users/swanca/repos?per_page=100&sort=updated';

let repositories = [];

const messages = {
  fr: {
    error: 'Impossible de charger les dépôts.',
    empty: 'Aucun dépôt public à afficher.',
    count: (value) => `${value} dépôt${value > 1 ? 's' : ''}`,
    stars: (value) => `${value} étoile${value > 1 ? 's' : ''}`,
    updated: (date) => `Mis à jour le ${date}`,
  },
  en: {
    error: 'Could not load repositories.',
    empty: 'No public repositories to display.',
    count: (value) => `${value} repositor${value === 1 ? 'y' : 'ies'}`,
    stars: (value) => `${value} star${value === 1 ? '' : 's'}`,
    updated: (date) => `Updated ${date}`,
  },
};

function locale() {
  return document.documentElement.lang === 'en' ? 'en' : 'fr';
}

function state(message) {
  grid.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.className = 'repo-state';
  paragraph.textContent = message;
  grid.append(paragraph);
}

function render() {
  const lang = locale();
  const copy = messages[lang];
  count.textContent = copy.count(repositories.length);

  if (!repositories.length) {
    state(copy.empty);
    return;
  }

  const cards = repositories.map((repo) => {
    const article = document.createElement('article');
    article.className = 'repository-card';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = repo.name;
    title.append(link);

    const description = document.createElement('p');
    description.textContent = repo.description || (lang === 'fr' ? 'Dépôt public GitHub.' : 'Public GitHub repository.');

    const meta = document.createElement('ul');
    meta.className = 'repository-meta';
    const values = [];
    if (repo.language) values.push(repo.language);
    if (repo.stargazers_count > 0) values.push(copy.stars(repo.stargazers_count));
    values.push(copy.updated(new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(repo.updated_at))));

    values.forEach((value) => {
      const item = document.createElement('li');
      item.textContent = value;
      meta.append(item);
    });

    article.append(title, description, meta);
    return article;
  });

  grid.replaceChildren(...cards);
}

async function loadRepositories() {
  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('Unexpected GitHub response');

    repositories = payload
      .filter((repo) => !repo.fork && repo.name !== 'swanca.github.io')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    render();
  } catch (error) {
    count.textContent = '';
    state(messages[locale()].error);
    console.error(error);
  }
}

window.addEventListener('portfolio:locale', render);
loadRepositories();
