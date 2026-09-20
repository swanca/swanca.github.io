import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('les deux pages du portfolio existent et sont bilingues', async () => {
  const [home, repos] = await Promise.all([read('index.html'), read('repos/index.html')]);

  for (const html of [home, repos]) {
    assert.match(html, /<html[^>]+lang="fr"/);
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
    'https://github.com/swanca',
    'https://www.linkedin.com/in/swan-c-35044b11a/',
  ]) assert.ok(home.includes(url), url);

  assert.match(home, /TrackMyDex/);
  assert.match(home, /Bientôt disponible/);
  assert.match(home, /Coming soon/);
});

test('le contrôleur de langue mémorise un choix français ou anglais', async () => {
  const script = await read('assets/js/site.js');

  assert.match(script, /swanca-locale/);
  assert.match(script, /navigator\.language/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /document\.documentElement\.lang/);
});

test('la présentation couvre mobile, clavier et mouvement réduit', async () => {
  const [home, repos, css] = await Promise.all([read('index.html'), read('repos/index.html'), read('assets/css/styles.css')]);

  assert.match(home, /assets\/css\/styles\.css/);
  assert.match(repos, /assets\/css\/styles\.css/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*clip/);
});

test('chaque projet possède un visuel local et un texte alternatif bilingue', async () => {
  const home = await read('index.html');
  for (const name of ['plus-en-poche', 'steffi-couture', 'aoclair', 'trackmydex']) {
    const stat = await import('node:fs/promises').then(({ stat }) => stat(new URL(`assets/images/${name}.webp`, root)));
    assert.ok(stat.size > 10_000, name);
    assert.match(home, new RegExp(`assets/images/${name}\\.webp`));
  }
  assert.equal([...home.matchAll(/data-alt-fr=/g)].length, 4);
  assert.equal([...home.matchAll(/data-alt-en=/g)].length, 4);
});
