# Project Guidelines

## Overview

Static GitHub Pages web app — SAP Insider Las Vegas 2026 workshop access portal.
Attendees select a workshop and (if required) enter a group number to receive personalized credentials and links.

No build process. No npm. No frameworks. Pure HTML + CSS + JS.

## Architecture

```
index.html      # Single-page UI — form, result sections, copy-to-clipboard
css/styles.css  # SAP-branded styles; uses CSS variables for colors/spacing
js/app.js       # All logic — WORKSHOPS config, validation, DOM manipulation
```

- Workshop data lives in the `WORKSHOPS` object at the top of `app.js`. Add/change workshops there.
- UI visibility is managed exclusively via the `show(id)` / `hide(id)` helpers, which toggle the `hidden` and `fade-in` CSS classes.
- Input validation uses `input-error` / `input-ok` CSS classes for visual feedback; error text shown in `#group-error`.

## Conventions

- **Vanilla JS only** — no libraries, no module bundlers, no TypeScript.
- **No inline styles** — all styling through `styles.css` classes.
- **3-digit zero-padded group numbers** — validation regex is `^\d{3}$`; range 001–199.
- For new workshops: add an entry to `WORKSHOPS` with `needsGroup`, `invalidGroups` (array of `[lo, hi]` pairs), and the relevant URLs.
- Credential generation follows patterns already in `app.js` — keep consistent with existing format.

## Local Development

```bash
npx serve .
# then open http://localhost:3000
```

Or just open `index.html` directly in a browser.

## Deployment

GitHub Pages — `main` branch, root folder (`/`). No CI required; push to `main` deploys automatically.

## SAP Branding

- Use existing CSS variables defined in `styles.css` for colors, not hardcoded hex values.
- The SAP logo mark and header layout are in `index.html` `<header>` — preserve the structure when editing.
