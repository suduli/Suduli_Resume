# Design System

The visual reference for the resume site (`index.html`), the My Work page (`my-work.html`) and the Archify diagrams. Every value below comes from `assets/css/editorial.css`, `assets/css/my-work.css` and `assets/js/features/my-work.js`. If code and this file disagree, the code wins and this file must be updated.

## 1. Look and feel

- **Editorial, resume-first.** Serif display headings, sans-serif body text, mono labels. Generous whitespace, hairline dividers, rounded cards.
- **Warm and calm.** Dark by default, with a warm amber accent. Light mode is warm paper, not white.
- **Accessible by default.** Target WCAG 2.1 AAA contrast for body text. Visible focus rings on every interactive element. Respect `prefers-reduced-motion`.

## 2. Colour tokens

Defined on `:root` (dark, the default) and `[data-theme="light"]`. Components read tokens only; never hard-code colours in components.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg-primary` | `#0b0d10` | `#f7f5f0` | Page background |
| `--bg-secondary` | `#111418` | `#f1eee6` | Alternate surfaces, tags |
| `--bg-tertiary` | `#171b21` | `#ebe7dd` | Deepest surface |
| `--bg-card` | `#13171d` | `#ffffff` | Cards, form, panels |
| `--bg-card-hover` | `#1a1f27` | `#fbfaf7` | Card hover |
| `--text-primary` | `#ecebe6` | `#17191c` | Headings, values |
| `--text-secondary` | `#bcbdb6` | `#3d4147` | Body text |
| `--text-tertiary` | `#a3a69e` | `#54585f` | Labels, captions |
| `--accent-primary` | `#e7b26b` | `#7a4f0e` | Buttons, links, index numbers |
| `--accent-secondary` | `#8fd3c1` | `#1f6f5c` | Sub-headings, status dot |
| `--border-primary` | 10% text | 12% text | Hairlines, card borders |
| `--border-accent` | 45% amber | 45% brown | Outlined buttons, highlighted cards |
| `--navbar-bg` | 86% bg | 90% bg | Sticky header |

Contrast: `--text-tertiary` is the lowest-contrast text token. Do not use it below 14px or on `--bg-secondary`.

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Display and headings | `--font-heading` (Fraunces, Georgia fallback) | Weight 600. Hero name uses `clamp(40px, 6.4vw, 78px)`. Section titles use `clamp(30px, 4.2vw, 46px)`. |
| Body | `--font-body` (Inter, system fallback) | 17px, line height 1.65. 16px on phones. |
| Labels, index numbers, dates | `--font-mono` (JetBrains Mono) | 12–13px, uppercase with `letter-spacing: .08em` for labels. |

Google Fonts are loaded once per page: Fraunces, Inter and JetBrains Mono. Do not add a fourth family.

## 4. Spacing and layout

- **Container:** `max-width: 1120px` (`--wrap`), side padding `16px` (`--gutter`).
- **Section rhythm:** `--section-y: 104px` top and bottom. 72px on phones.
- **Split layout:** heading column and content column with a 56–64px gap. Stacks to one column at `max-width: 960px`.
- **Breakpoints:**
  - `960px`: stack split layouts, single-column grids.
  - `768px`: hamburger navigation (set in `main.css`).
  - `640px`: phone layout, single-column cards, smaller padding.
  - `769px–1280px`: tablet navigation is tightened, and social icons are hidden in the header.

## 5. Components

- **Buttons.** Pill shape (`border-radius: 999px`). Primary: amber fill, dark text (white text in light mode). Secondary: outlined with `--border-accent`. Ghost: text only. Hover darkens or brightens the fill, never moves the layout.
- **Cards.** `--bg-card` surface, `1px` `--border-primary` border, radius 14px (project and contact cards) or 16–18px (large panels). Hover changes the border to `--border-accent`.
- **Section header.** Index number in mono amber (`01`, `02`), then the Fraunces title, then one short lead paragraph.
- **Timeline (experience).** Dates in mono amber in a left column; role and company on the right; bullets are short amber dashes.
- **Tags.** Mono 12px, pill, `--border-primary`, on `--bg-secondary`.
- **Contact cards.** One column. Icon in amber, label in mono uppercase, value in body text.
- **Form.** Card with 40px padding (28px on phones). Title is left-aligned Fraunces. Inputs use `--bg-card` with a 10px radius, and the focus border is amber.
- **Theme toggle.** 36px circle in the header, with an icon that shows the mode you will switch to.

## 6. Motion

- Reveal-on-scroll: elements fade and rise 28px over 0.8s. Stagger with `--d` delays.
- Hover: 0.2–0.25s on colour and border; cards lift 3px.
- Reduced motion: all animation and transition durations drop to near zero, and reveal content is shown at once.
- Archify diagrams animate only when the stored motion choice is `live` (see RULEBOOK §7).

## 7. Archify diagrams

Diagrams follow the rules in `docs/WORK-DIAGRAM-STANDARD.md`:

- Preset `classic` (the contract default). The site injects its own palette tokens into each diagram, so the site look wins.
- Tokens: `--bg` `#0b0d10` (dark) and `#f7f5f0` (light), with the same text and accent values as the site.
- Each diagram is embedded in its own chapter and sized to its content.

## 8. Imagery

- Social share image: `assets/img/og-image.png`, 1200×630, dark background, Fraunces name, amber rule.
- Favicon: `favicon.png`.
- No stock photos. Diagrams and typography carry the design.

## 9. Iconography

Font Awesome 6.4 (`fas` and `fab`). Icons are decorative (`aria-hidden="true"`) unless they are the only label, in which case they need an `aria-label` on the parent.

## 10. Do not

- Do not add a new colour, font or radius without updating this file.
- Do not use centred headings in the editorial sections. Headings are left-aligned.
- Do not use pure white or pure black text on the backgrounds. Use the tokens.
- Do not animate layout properties (width, height, top, left). Animate opacity and transform.
