# Copilot instructions for SRZ Finds

This is a small, static, single-page product listing site (vanilla HTML/CSS/JS). These notes help an AI coding agent be productive quickly in this repo.

Key facts
- Project type: Static site (no build system). Single HTML entry: `index.html`.
- Frontend: Vanilla JavaScript in `js/script.js`, styling in `css/style.css`, assets in `images/`.
- Product data: Defined directly in `js/script.js` (array `products`). The footer even says: "edit products in the JavaScript section."

What you can change safely
- Update or add product objects inside `js/script.js` (fields: `id`, `name`, `category`, `price`, `image`, `description`, `affiliate`).
- Update images in `images/` and reference them by relative path (e.g. `images/lamp.jpg`).
- Adjust UI/visuals in `css/style.css`.

Important files and reference points (quick links)
- `index.html` — page structure and ARIA hints. Important IDs: `q` (search input), `clearBtn`, `category`, `sort`, `resetBtn`, `grid`, `empty`, `countBadge`. Note `addSampleBtn` is present but commented out.
- `js/script.js` — product list and UI logic. Key functions: `populateCategories()`, `render(list)`, `getFiltered()`.
- `css/style.css` — design tokens (CSS variables) and card/grid layout.

Developer workflows (how to run and debug)
- No build step—open `index.html` in a browser to view the site. For a local server (recommended for correct relative asset loading), run:
  - `python3 -m http.server 8000` (from project root) or `npx http-server` if you prefer Node tooling.
- Use browser DevTools console to inspect runtime state (the `products` array lives in `js/script.js`).

Patterns and conventions to follow
- Single-source product data: do not split product definitions across multiple files. Keep them in `js/script.js` unless the change explicitly adds a data-loading layer.
- Keep changes minimal and local: aim to edit `js/script.js` and `css/style.css` rather than introducing a bundler, transpiler, or framework.
- Accessibility hints already present: `aria-live` on `#grid` and `role="search"` on the search container—preserve these attributes when refactoring.

Behavioral specifics the agent should know (examples)
- Search logic: `getFiltered()` lowercases the search term and matches against `name`, `description`, and `category`.
- Sorting keys: `relevance` (default), `price-asc`, `price-desc`, `name-asc` (see `sort` select in `index.html` and handling in `getFiltered()`).
- Category population: categories are dynamically generated from `products.map(p => p.category)` in `populateCategories()`.

When editing UI/UX
- If touching markup in `index.html`, ensure the element IDs listed above are preserved unless you update `js/script.js` accordingly.
- If adding interactive controls, follow existing event wiring style (vanilla `addEventListener('input', ...)`, `click` handlers attached at bottom of `js/script.js`).

PR / commit guidance for an AI agent
- Preferred commit message prefix: `feat:` for new features, `fix:` for bug fixes, `docs:` for documentation updates, `style:` for CSS-only changes. Example: `feat: add new product and image for lamp`.
- Keep PRs small and focused (single responsibility). If a change touches data and UI, split into data update + UI tweak when reasonable.

What not to do (avoid)
- Do not introduce a build system, bundler, or heavy dependencies without explicit instruction from maintainers.
- Do not change global layout semantics or remove ARIA attributes unless replacing them with equivalent accessibility patterns.

If you need more context
- Ask the maintainer which branch or release to target. This repo appears to be a simple static site—confirm if the site is hosted using a particular pipeline before adding CI.

---
If anything above is unclear or you want extra guidance (tests, small animation patterns, or a JSON-backed data loader), tell me what you want and I will update this file.
