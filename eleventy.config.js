const path = require("node:path");
const { fileURLToPath } = require("node:url");
const sass = require("sass");

const siteUrl = "https://tifajade.com";
const { showStories } = require("./src/_data/site.json");

// Netlify's Image CDN resizes images on request. It only exists on Netlify,
// so local builds use the original file.
const onNetlify = process.env.NETLIFY === "true";
const RESPONSIVE_WIDTHS = [640, 1024, 1600, 2400];

module.exports = async function (eleventyConfig) {
  // The RSS plugin is an ES module. A dynamic import works on every Node version,
  // while require() only works on newer ones (Netlify's default Node is older)
  const { feedPlugin } = await import("@11ty/eleventy-plugin-rss");

  // Copy assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/admin/config.yml": "admin/config.yml" });
  eleventyConfig.ignores.add("src/readme.md");

  // Redesign: scripts and vendored libraries
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/lenis/dist/lenis.min.js": "js/vendor/lenis.min.js",
  });

  // Redesign: compile src/css/*.scss (partials starting with _ are skipped)
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) return;

      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        style: "compressed",
        sourceMap: false,
        charset: false,
      });
      // Rebuild site.css whenever any partial it imports changes
      this.addDependencies(
        inputPath,
        result.loadedUrls.filter((u) => u.protocol === "file:").map((u) => fileURLToPath(u))
      );
      return async () => result.css;
    },
  });

  // Redesign: every published project, newest first
  eleventyConfig.addCollection("projects", (collection) =>
    collection
      .getFilteredByGlob("src/projects-animation/*.njk")
      .sort((a, b) => b.date - a.date)
  );

  // The project after this one in a list, wrapping around to the first
  eleventyConfig.addFilter("nextAfter", (pages, page) => {
    const i = pages.findIndex((p) => p.url === page.url);
    return pages[(i + 1) % pages.length];
  });

  // Front matter dates are midnight UTC; read them in UTC so January 1
  // doesn't slip back a year in US time zones
  eleventyConfig.addFilter("year", (date) =>
    (date instanceof Date ? date : new Date()).getUTCFullYear()
  );

  // Redesign: Stories (photo journal), oldest first like Eleventy's own
  // collections; templates reverse it. Drafts are already excluded.
  eleventyConfig.addCollection("stories", (collection) =>
    collection.getFilteredByGlob("src/stories/*.md")
  );

  // Image URL at a given width (Netlify Image CDN in production)
  const sizedImage = (src, width) => {
    if (!src || !onNetlify || /^https?:/.test(src) || src.endsWith(".svg")) return src;
    return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=80`;
  };
  eleventyConfig.addFilter("sizedImage", sizedImage);

  // srcset for an image; empty locally, where only the original exists
  eleventyConfig.addFilter("srcset", (src) => {
    if (!onNetlify || !src || /^https?:/.test(src)) return "";
    return RESPONSIVE_WIDTHS.map((w) => `${sizedImage(src, w)} ${w}w`).join(", ");
  });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));

  // RSS (Atom) and JSON feeds for Stories
  const feedMetadata = {
    language: "en",
    title: "Tifa Jade: Stories",
    subtitle: "Photo stories and writing by Tifa Jade.",
    base: `${siteUrl}/`,
    author: { name: "Tifa Jade", email: "hi@tifajade.com" },
  };
  // Feeds are only built while Stories are showing
  if (showStories) {
    eleventyConfig.addPlugin(feedPlugin, {
      type: "atom",
      outputPath: "/feed.xml",
      collection: { name: "stories", limit: 20 },
      metadata: feedMetadata,
    });
    eleventyConfig.addPlugin(feedPlugin, {
      type: "json",
      outputPath: "/feed.json",
      collection: { name: "stories", limit: 20 },
      metadata: feedMetadata,
    });
  }

  // Redesign: homepage carousel, ordered by each project's `carousel` number
  eleventyConfig.addCollection("carousel", (collection) =>
    collection
      .getFilteredByGlob("src/projects-animation/*.njk")
      .filter((p) => p.data.carousel)
      .sort((a, b) => a.data.carousel - b.data.carousel)
  );

  // Some media paths in front matter are already URL-encoded (Bunny CDN), some
  // aren't (local files with spaces). Normalize both.
  const safeUrl = (src) => encodeURI(decodeURI(src));

  // Project front matter stores video as a string or as { webm, mp4 }.
  // Returns [{ src, type }] with WebM first so browsers pick the smaller file.
  eleventyConfig.addFilter("videoSources", (video) => {
    if (!video) return [];
    const typeOf = (src) => (src.endsWith(".webm") ? "video/webm" : "video/mp4");
    if (typeof video === "string") return [{ src: safeUrl(video), type: typeOf(video) }];
    return ["webm", "mp4"]
      .filter((key) => video[key])
      .map((key) => ({ src: safeUrl(video[key]), type: `video/${key}` }));
  });

  // Same idea for posters: a string or { webp, jpg }
  eleventyConfig.addFilter("poster", (image) => {
    const src = typeof image === "string" ? image : image?.webp || image?.jpg;
    return safeUrl(src || "/assets/img/og-image.jpg");
  });

  // Projects in one category (film, motion)
  eleventyConfig.addFilter("byCategory", (pages, category) =>
    (pages || []).filter((p) => p.data.category === category)
  );

  // 1 → "01"
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  // Unique values of one key across a list of objects
  eleventyConfig.addFilter("uniqueValues", (items, key) => [
    ...new Set((items || []).map((item) => item[key]).filter(Boolean)),
  ]);

  // Look up a page in a collection by its file slug
  eleventyConfig.addFilter("bySlug", (pages, slug) =>
    (pages || []).find((p) => p.fileSlug === slug)
  );

  // Like bySlug, but also finds pages that aren't projects (src/_data/extraProjects.json),
  // which have the same shape: { url, data: { client, title, image, video } }
  const extraProjects = require("./src/_data/extraProjects.json");
  eleventyConfig.addFilter("resolveProject", (pages, slug) =>
    (pages || []).find((p) => p.fileSlug === slug) || extraProjects[slug]
  );

  // Absolute URLs for canonical/Open Graph tags
  eleventyConfig.addFilter("absoluteUrl", (path) => siteUrl + encodeURI(path));
  eleventyConfig.addFilter("absoluteImage", (path) =>
    siteUrl + encodeURI(path || "/assets/img/og-image.jpg")
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_templates",
    },
    templateFormats: ["njk", "html", "md", "scss"],
  };
};
