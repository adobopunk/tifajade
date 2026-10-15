# Tifa Jade's Portfolio

The portfolio of Tifa Jade, director, producer and content strategist. Live at [tifajade.com](https://tifajade.com).

## What's here

- **Projects**: film and motion case studies in `src/projects-animation/`, published at `/projects/<name>/`.
- **Stories**: a photo journal of photo stories and essays in `src/stories/`, with RSS at `/feed.xml` and JSON Feed at `/feed.json`.
- **Services, About, Contact**: `src/services.njk`, `src/about.njk` and `src/contact.njk`. Services, clients and About chapters are driven by files in `src/_data/`.

## Editing Stories

Stories are written in the CMS at `/admin/` ([Sveltia CMS](https://sveltiacms.app/)). Every save is a commit to `main`, and Netlify rebuilds the site.

- Sign in with GitHub, or with a fine-grained GitHub token (Contents: read and write on this repo).
- New stories start as drafts. Turn off **Draft** to publish.
- Uploaded photos are converted to WebP and capped at 2400px before they're saved.
- Drafts appear on the local dev server only.

## Running locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:8080`. The design foundation (colors, type and components) is at `/styleguide/`.

## Tech

- [Eleventy](https://www.11ty.dev/) with Nunjucks templates and Markdown
- Sass compiled by Eleventy (`src/css/`)
- Small ES modules in `src/js/`, plus [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- Netlify for hosting, forms, redirects (`src/_redirects`) and image resizing
- Video on Bunny CDN and Bunny Stream

## Connect

- [Email](mailto:hi@tifajade.com)
