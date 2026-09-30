# AGENTS.md — Content Management Guide

## Adding a New Case Study

1. Create `src/content/cases/<slug>.md` with frontmatter:
   ```yaml
   ---
   title: "Case Title"
   description: "One-line summary"
   type: case
   lang: en
   cover: "https://framerusercontent.com/images/..."
   coverAlt: "Cover alt text"
   ---
   ```
2. Write the body in Markdown below the frontmatter.
3. The case auto-appears on `/cases` and gets its own page at `/cases/<slug>`.

## Adding a New Article

Same as above but set `type: article`. Articles appear on `/articles`.

## Adding a New Page

1. Create `src/pages/<slug>.astro`.
2. Import and wrap with `Base` layout:
   ```astro
   ---
   import Base from '../layouts/Base.astro';
   ---
   <Base title="Page Title">
     <!-- content -->
   </Base>
   ```
3. Update nav links in `src/layouts/Base.astro` if needed.

## Assets

- Static files go in `public/` and are served at `/`.
- External images (framerusercontent.com) are referenced directly.

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # local preview
```

Deploy is via GitHub Pages (gh-pages branch or GitHub Actions).
