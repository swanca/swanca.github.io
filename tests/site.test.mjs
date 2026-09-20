import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('les deux pages du portfolio existent et sont bilingues', async () => {
  const [home, repos] = await Promise.all([read('index.html'), read('repos/index.html')]);

  for (const html of [home, repos]) {
    assert.match(html, /<html[^>]+lang="en"/);
    const fr = [...html.matchAll(/data-fr=/g)].length;
    const en = [...html.matchAll(/data-en=/g)].length;
    assert.ok(fr > 5);
    assert.equal(fr, en);
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), /\s--\s/);
  }
});

test('les projets et profils publics utilisent les bonnes adresses', async () => {
  const home = await read('index.html');

  for (const url of [
    'https://plusenpoche.fr',
    'https://stefficouture.fr',
    'https://aoclair.fr',
    'https://trackmydex.com',
    'https://github.com/swanca',
    'https://www.linkedin.com/in/swan-c-35044b11a/',
  ]) assert.ok(home.includes(url), url);

  assert.ok(home.indexOf('href="https://trackmydex.com"') < home.indexOf('href="https://plusenpoche.fr"'));
  assert.doesNotMatch(home, /project-index/);
  assert.doesNotMatch(home, /Coming soon/);
});

test('la langue, le thème et les galeries restent utilisables sans framework', async () => {
  const script = await read('assets/js/site.js');

  assert.match(script, /swanca-locale/);
  assert.match(script, /return supported\.has\(stored\) \? stored : 'en'/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /document\.documentElement\.lang/);
  assert.match(script, /swanca-theme/);
  assert.match(script, /prefers-color-scheme: dark/);
  assert.match(script, /data-theme-toggle/);
  assert.match(script, /\[data-carousel\]/);
  assert.match(script, /ArrowLeft/);
  assert.match(script, /ArrowRight/);
});

test('la présentation sépare clairement les projets et couvre mobile et clavier', async () => {
  const [home, repos, css] = await Promise.all([read('index.html'), read('repos/index.html'), read('assets/css/styles.css')]);

  assert.match(home, /assets\/css\/styles\.css/);
  assert.match(repos, /assets\/css\/styles\.css/);
  assert.equal([...home.matchAll(/class="project-showcase/g)].length, 4);
  assert.equal([...home.matchAll(/data-carousel(?:\s|>)/g)].length, 4);
  assert.match(css, /\.project-showcase\s*\+/);
  assert.match(css, /\.project-gallery/);
  assert.match(css, /\.carousel-control/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /object-fit:\s*contain/);
  assert.doesNotMatch(home, /project-grid/);
});

test('chaque projet possède trois captures locales, récentes et bilingues', async () => {
  const home = await read('index.html');
  for (const name of ['trackmydex', 'plus-en-poche', 'steffi-couture', 'aoclair']) {
    for (const index of ['01', '02', '03']) {
      const filename = `${name}-${index}.webp`;
      const image = await stat(new URL(`assets/images/${filename}`, root));
      assert.ok(image.size > 10_000, filename);
      assert.match(home, new RegExp(`assets/images/${filename.replace('.', '\\.')}`));
    }
  }
  assert.equal([...home.matchAll(/data-alt-fr=/g)].length, 12);
  assert.equal([...home.matchAll(/data-alt-en=/g)].length, 12);
});

test('la page des dépôts charge et filtre les dépôts publics en sécurité', async () => {
  const script = await read('assets/js/repos.js');

  assert.match(script, /api\.github\.com\/users\/swanca\/repos\?per_page=100&sort=updated/);
  assert.match(script, /!repo\.fork/);
  assert.match(script, /repo\.name !== 'swanca\.github\.io'/);
  assert.match(script, /new Date\(b\.updated_at\) - new Date\(a\.updated_at\)/);
  assert.match(script, /Impossible de charger les dépôts/);
  assert.match(script, /Could not load repositories/);
  assert.match(script, /textContent/);
});

test('le site fournit les fichiers et métadonnées nécessaires à GitHub Pages', async () => {
  const [home, repos, robots, sitemap, notFound] = await Promise.all([
    read('index.html'),
    read('repos/index.html'),
    read('robots.txt'),
    read('sitemap.xml'),
    read('404.html'),
  ]);

  assert.match(home, /rel="canonical" href="https:\/\/swanca\.github\.io\/"/);
  assert.match(repos, /rel="canonical" href="https:\/\/swanca\.github\.io\/repos\/"/);
  assert.match(home, /property="og:image"/);
  assert.match(repos, /property="og:image"/);
  assert.match(robots, /Sitemap: https:\/\/swanca\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/swanca\.github\.io\/repos\//);
  assert.match(notFound, /href="\/"/);
  await access(new URL('.nojekyll', root));
});
