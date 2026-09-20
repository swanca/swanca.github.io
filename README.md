# swanca.github.io

Portfolio bilingue de Swan Carenini.

## Développement local

Le site est statique et ne demande aucune installation.

```powershell
python -m http.server 4173
```

Ouvrir ensuite `http://127.0.0.1:4173/`.

## Vérification

```powershell
node --test tests/*.test.mjs
```

Le déploiement est assuré par GitHub Pages depuis la branche `main`.
