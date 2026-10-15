const path = require("node:path");
const sass = require("sass");

module.exports = function (eleventyConfig) {
  // Copy assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("app");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy("pdf");

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
      this.addDependencies(inputPath, result.loadedUrls);
      return async () => result.css;
    },
  });

  eleventyConfig.addCollection("animation", function (collection) {
    return collection
      .getFilteredByGlob("src/projects-animation/*.njk")
      .sort((a, b) => {
        const aFeature = a.data.feature === "yes" ? 1 : 0;
        const bFeature = b.data.feature === "yes" ? 1 : 0;

        // Prioritize featured projects
        if (aFeature !== bFeature) {
          return bFeature - aFeature;
        }

        // If both are featured projects
        if (aFeature && bFeature) {
          const aOrder = a.data.order !== undefined ? a.data.order : Infinity;
          const bOrder = b.data.order !== undefined ? b.data.order : Infinity;

          if (aOrder !== bOrder) {
            return aOrder - bOrder; // lower order first
          }
        }

        // Fallback to date sorting (newest first)
        const aDate = new Date(a.data.date);
        const bDate = new Date(b.data.date);

        return bDate - aDate;
      });
  });

  eleventyConfig.addCollection("video", function (collection) {
    return collection
      .getFilteredByGlob("src/projects-video/*.njk")
      .sort((a, b) => {
        // First, prioritize 'featured' items
        if (a.data.feature === "yes" && b.data.feature !== "yes") {
          return -1; // a should come first
        } else if (a.data.feature !== "yes" && b.data.feature === "yes") {
          return 1; // b should come first
        }
        // Then, sort by date (if both have the same 'feature' value)
        return new Date(b.data.date) - new Date(a.data.date);
      });
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

  eleventyConfig.addFilter("year", (date) =>
    (date instanceof Date ? date : new Date()).getFullYear()
  );

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

  // Absolute URLs for canonical/Open Graph tags
  const siteUrl = "https://tifajade.com";
  eleventyConfig.addFilter("absoluteUrl", (path) => siteUrl + encodeURI(path));
  eleventyConfig.addFilter("absoluteImage", (path) =>
    siteUrl + encodeURI(path || "/assets/img/og-image.jpg")
  );

  // Add index filter
  eleventyConfig.addFilter("index", function (array, value) {
    return array.indexOf(value);
  });

  // Add filter for adjacent projects
  eleventyConfig.addFilter(
    "getAdjacentProjects",
    (projects, currentProject) => {
      const currentIndex = projects.findIndex(
        (project) => project.fileSlug === currentProject.fileSlug
      );
      const previous = projects[currentIndex - 1] || null;
      const next = projects[currentIndex + 1] || null;
      return { previous, next };
    }
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_templates",
    },
    templateFormats: ["njk", "html", "scss"],
  };
};
