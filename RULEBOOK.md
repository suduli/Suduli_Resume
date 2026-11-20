# Site Rulebook

The rules for changing the resume site. Read this before editing, and follow `DESIGN.md` for anything visual.

## 1. Repository and shipping

1. **Work on a branch.** Never commit straight to `main`. Name branches `feature/<topic>` or `fix/<topic>`.
2. **Pull request, then merge.** Every change reaches `main` through a PR. Pushing to `main` deploys to production (Vercel and GitHub Pages).
3. **Keep PRs small and single-purpose.** Separate design, content, SEO and diagram changes into different PRs.
4. **Do not commit scratch.** `.archify/`, `.claude/`, `.agents/`, `NUL` and `skills-lock.json` stay out of commits.
5. **Line endings.** Some files are CRLF in the working copy. Keep each file's existing line endings; do not convert whole files.

## 2. Hosting: what is served

`vercel.json` controls what Vercel deploys. **It must list every folder the site needs.** Current builds:

- `*.html`, `assets/**/*`, `translations/**/*`, `robots.txt`, `sitemap.xml`, `favicon.png`

Missing a folder means production returns 404 for it. The translations were missing for this reason, which broke the language switcher and the theme toggle.

**Rule:** when you add a new top-level folder or file type that the browser loads, add it to `builds` in the same PR, then check the Vercel preview (or production after merge) for a 200.

## 3. Content and translations

1. **Source of truth.** The English text lives in `translations/en.json`. Every visible string on `index.html` uses a `data-i18n` key.
2. **Add keys to all six languages.** When you add a key, add it to `en.json`, `de.json`, `fr.json`, `ja.json`, `ko.json` and `zh.json` in the same PR. A key missing from a language falls back to English; a missing English key shows the raw key.
3. **Keep the resume data consistent.** Years of experience, job titles, employers, dates and awards must match `assets/data/Suduli_Resume.pdf`. The same numbers appear in the hero, the About section, the JSON-LD `jobTitle`/`description`, the meta description and the Open Graph tags.
4. **No invented facts.** Do not add metrics, awards, dates or employers that are not in the resume. If a claim is in the English text but not in the PDF, flag it in the PR.
5. **Plain language.** Short sentences. Active voice. No marketing superlatives.

## 4. Code

1. **No inline colours or fonts in components.** Use tokens from `DESIGN.md` §2–3.
2. **No inline layout styles.** Put spacing and grid rules in a stylesheet. The only exception is an `animation-delay` on a reveal element (`style="--d:…"`).
3. **Layer stylesheets in this order:** `main.css` (base, skills explorer, navigation, particles), then `editorial.css` (tokens and sections), then page-specific files (`my-work.css`, `language-switcher.css`, `youtube-icon.css`). Later files win, so override in the right layer rather than adding `!important` in new places.
4. **Keep scripts working when markup changes.** `assets/js/core/main.js` reads these IDs and classes: `.hamburger`, `.nav-menu`, `#theme-toggle`, `#theme-icon`, `#particles-js`, `.form`, `#reveal-phone`, `#phone-hidden`, `#phone-number`, `#recommendation-summary`, `.categories-carousel`, `.skills-detail-panel`. Do not rename them without updating the script.
5. **Cache-bust CSS and JS** when you change a file that a page already loaded: add or bump `?v=N` on its `<link>` or `<script>`. Browsers and CDNs otherwise keep the old copy.
6. **Test for errors.** Open the console on desktop and phone. A `RangeError` or a 404 for a `translations/` or `assets/` file is a blocker.

## 5. Accessibility

1. Body text contrast must meet WCAG AAA (7:1) where the design allows, and never fall below AA (4.5:1).
2. Every interactive element needs a visible focus ring (`:focus-visible` in `editorial.css`).
3. Images and diagrams need `alt` text, or `title` on an iframe.
4. Icon-only buttons need an `aria-label` that changes with state (the theme toggle does).
5. Forms keep a visible or screen-reader label for each field.
6. Motion must respect `prefers-reduced-motion`.

## 6. SEO

1. **Canonical base:** `https://suduli-resume.vercel.app`. Every `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`, `robots.txt` Sitemap line and `sitemap.xml` `<loc>` uses this base. Do not add links to other hosts for the site itself.
2. **Every public page is in `sitemap.xml`** with a `lastmod` date. A new page is not done until it is listed.
3. **Every public page has:** a unique `<title>`, a `description` of 120–160 characters, `canonical`, `og:title`, `og:description`, `og:image` (1200×630), `twitter:card` `summary_large_image`, and `robots` `index, follow`.
4. **One `<h1>` per page.** Section titles are `<h2>`.
5. **Do not hide content from crawlers** in JavaScript-only text. The English text must be in the HTML.
6. **Verification tags** for Google Search Console and Bing Webmaster Tools go in the `<head>` of `index.html` only.

## 7. Archify diagrams

Follow `docs/WORK-DIAGRAM-STANDARD.md` in full. The rules that most often go wrong:

1. **Motion.** An embedded diagram plays only when it is **not** in embed mode (`?embed=1` disables motion). Load with `?theme=dark` only, and hide the chrome with the CSS in `my-work.js`. Set `localStorage["archify-motion"] = "live"` on the site origin.
2. **Size.** Never fix an iframe height. `my-work.js` sets each frame's height to its diagram's body height on load and resize.
3. **Theme.** Set `data-theme` on the diagram's `<html>` element. Do not reload the frame to change theme.
4. **Gates.** Each diagram passes all four Archify gates (`validate`, `deliver`, `check`, `browser-check`) before it is published.
5. **Source.** Commit each `candidate.json` under `assets/diagrams/<company>/src/`.
6. **Scope per company.** One folder per employer: `assets/diagrams/<company-slug>/`.

## 8. Reviews and deployment checks

Before asking for a review, confirm all of these in the Vercel preview or on production:

- [ ] Home page and `/my-work.html` load with no console errors.
- [ ] Light/dark toggle changes the page and every diagram.
- [ ] Language switcher changes the text (test at least English and German).
- [ ] Testimonials load (no error card).
- [ ] No horizontal scroll at 375px, 768px and 1280px.
- [ ] `/robots.txt`, `/sitemap.xml`, `/translations/en.json` and `/assets/img/og-image.png` return 200.
- [ ] Each diagram fills its frame; no clipped or empty space.

## 9. Changing these rules

Update this file in the same PR as the change that needs the new rule. Explain why in the PR description.
