# Tifa Jade's Portfolio

The portfolio of Tifa Jade, director, producer, and content strategist. Live at [tifajade.com](https://tifajade.com).

## Up next

**Top priority: bring the Stories blog back.** Stories are hidden for now. While they are hidden, the Stories index, every story page, the RSS and JSON feeds, the nav links and the homepage "Latest stories" section are all off, and the story files are kept as they are.

To turn Stories back on:

1. In `src/_data/site.json`, set `"showStories"` to `true`.
2. In the same file, remove `"hidden": true` from the Stories item in `nav`.
3. Run the site locally and check `/stories/`, a story page, `/feed.xml` and the homepage section. The `/admin/` CMS still works either way.

Before launching it, write at least a few real stories. The two files in `src/stories/` are samples. Then submit the sitemap and the feed to search engines.

Other open items:

- **Bring back the main showreel.** The showreel links are hidden for now: the homepage hero button, the header button and the menu entry. In `src/_data/site.json`, set `"showShowreel"` to `true` to show them again. The "Motion Design Showreel" button in the Motion & Broadcast Design module stays on either way, and it opens the same reel.

- About page: write the bio in the `bio` list at the top of `src/about.njk`, then decide whether to bring back the ten-chapter story (`showStory` in the same file).
- Move the large Goodwill and TCL comparison videos to smaller 720p encodes on Bunny.
- Consider real pages for the Tri-Cities and Yakima for local search.

## What's here

- **Projects**: film and motion case studies in `src/projects/`, published at `/projects/<name>/`.
- **Stories (currently hidden, see Up next)**: a photo journal of photo stories and essays in `src/stories/`, with RSS at `/feed.xml` and JSON Feed at `/feed.json` once it is turned back on.
- **Local business page**: `src/local-business.njk` at `/local-business/`. Its videos and categories are in `src/_data/localBusiness.json`.
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
