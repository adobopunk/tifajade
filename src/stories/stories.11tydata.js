// Defaults for every Story. Posts are Markdown files written by hand or by
// the CMS at /admin/. Drafts render on the local dev server only.
const isDev = process.env.ELEVENTY_RUN_MODE === "serve";
const site = require("../_data/site.json");

module.exports = {
  layout: "layouts/story.njk",
  kind: "photo",
  // Treat the body as plain Markdown, so text written in the CMS can never be
  // mistaken for template code
  templateEngineOverride: "md",
  eleventyComputed: {
    // Stories are hidden while site.json has showStories set to false
    permalink: (data) =>
      !site.showStories || (data.draft && !isDev) ? false : `/stories/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) =>
      !site.showStories || Boolean(data.draft && !isDev),
    // Photo stories open on a full-bleed cover, so the header sits over it
    headerVariant: (data) => (data.kind === "photo" && data.cover ? "overlay" : undefined),
    image: (data) => data.cover,
  },
};
