# Bilingual Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a sober bilingual portfolio at `https://swanca.github.io` for four web projects and the public repositories of GitHub user `swanca`.

**Architecture:** A dependency-free static site uses two HTML pages, one shared stylesheet, one language controller and one GitHub repository loader. Project images are locally stored WebP captures. GitHub Pages publishes the repository root from `main`.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript, Node.js tests, GitHub CLI, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-20-portfolio-design.md`

## Global Constraints

- Public identity is `swanca`; the copy identifies Swan Carenini without exposing contact details.
- French and English cover every visible interface string.
- Copy is short, factual and contains no double-hyphen punctuation.
- The four projects are Plus en Poche, Steffi Couture, AOclair and TrackMyDex.
- TrackMyDex is marked coming soon and has no live-site action.
- GitHub points to `https://github.com/swanca`.
- LinkedIn points to `https://www.linkedin.com/in/swan-c-35044b11a/`.
- The site has no framework, tracking, advertising cookies or form.
- The repository list uses the public GitHub API with a clear failure state.
- The site must work on mobile, by keyboard and with reduced motion.
- GitHub Pages publishes the root of branch `main`.

---

### Task 1: Static shell and bilingual content

**Files:**
- Create: `index.html`
- Create: `repos/index.html`
- Create: `assets/js/site.js`
- Create: `tests/site.test.mjs`

**Interfaces:**
- Produces: DOM nodes with `data-fr` and `data-en`; `window.PortfolioLocale.setLocale(locale)`; localStorage key `swanca-locale`.

- [ ] Write `tests/site.test.mjs` assertions that both pages exist, every `data-fr` has `data-en`, required project URLs and social URLs are present, and no `--` appears in visible copy.
- [ ] Run `node --test tests/site.test.mjs` and verify failure because the pages do not exist.
- [ ] Create both semantic pages with compact bilingual copy, navigation, project status and accessibility labels.
- [ ] Implement locale resolution: stored `fr|en`, then browser language beginning with `en`, otherwise `fr`; update text, `lang`, title and locale buttons.
- [ ] Run the test and verify it passes.
- [ ] Commit with `feat: add bilingual portfolio content`.

### Task 2: Editorial responsive presentation

**Files:**
- Create: `assets/css/styles.css`
- Modify: `index.html`
- Modify: `repos/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: semantic classes from Task 1.
- Produces: shared responsive layout with project rows, browser frames and repository grid.

- [ ] Add assertions for stylesheet linkage, viewport metadata, reduced-motion rule, visible focus rule and overflow protection.
- [ ] Run tests and verify the new CSS assertions fail.
- [ ] Implement the approved palette, restrained typography, sticky header, alternating desktop project rows, stacked mobile layout, repository cards, language control and accessible focus states.
- [ ] Run tests and verify they pass.
- [ ] Commit with `feat: style responsive project gallery`.

### Task 3: Real project visuals

**Files:**
- Create: `assets/images/plus-en-poche.webp`
- Create: `assets/images/steffi-couture.webp`
- Create: `assets/images/aoclair.webp`
- Create: `assets/images/trackmydex.webp`
- Modify: `index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: four local WebP images no larger than 1600 pixels wide, each referenced with bilingual alternative text.

- [ ] Add assertions that all four images exist, are nonempty, use local paths and have bilingual alternative text.
- [ ] Run tests and verify failure because images do not exist.
- [ ] Capture the three public home pages at a consistent desktop viewport and export optimized WebP files.
- [ ] Locate the TrackMyDex project locally, run or inspect its existing interface, and export a representative WebP preview without inventing unavailable features.
- [ ] Reference the images with explicit dimensions and lazy loading below the first project.
- [ ] Run tests and verify they pass.
- [ ] Commit with `feat: add project previews`.

### Task 4: Public repository page

**Files:**
- Create: `assets/js/repos.js`
- Modify: `repos/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `GET https://api.github.com/users/swanca/repos?per_page=100&sort=updated`.
- Produces: sorted repository cards; localized loading, empty and error states; excludes forks and `swanca.github.io`.

- [ ] Add tests that verify the API endpoint, fork exclusion, portfolio exclusion, sort order and localized error strings.
- [ ] Run tests and verify failure because `repos.js` does not exist.
- [ ] Implement fetch, validation, filtering, sorting and safe DOM rendering with `textContent`.
- [ ] Run tests and verify they pass.
- [ ] Commit with `feat: list public GitHub repositories`.

### Task 5: Metadata, validation and publication

**Files:**
- Create: `.nojekyll`
- Create: `404.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `README.md`
- Create: `tests/links.test.mjs`
- Modify: `index.html`
- Modify: `repos/index.html`

**Interfaces:**
- Produces: publishable repository `swanca/swanca.github.io` and live site `https://swanca.github.io`.

- [ ] Add tests for canonical URLs, descriptions, Open Graph metadata, sitemap routes, robots sitemap and internal link targets.
- [ ] Run all tests and verify the new metadata assertions fail.
- [ ] Add concise bilingual metadata, canonical links, Open Graph image, 404 navigation, robots and sitemap.
- [ ] Run `node --test tests/*.test.mjs` and verify all tests pass.
- [ ] Serve locally and inspect desktop and mobile screenshots for clipping, overflow, missing translations and broken images.
- [ ] Create public repository `swanca/swanca.github.io`, push `main`, enable GitHub Pages from the root and wait for deployment.
- [ ] Verify `https://swanca.github.io`, `/repos/`, both languages, all four visuals, GitHub, LinkedIn and repository loading.
- [ ] Commit with `chore: prepare GitHub Pages publication`.
