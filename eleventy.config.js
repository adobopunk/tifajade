const pluginSEO = require("eleventy-plugin-seo");

module.exports = function (eleventyConfig) {
  // Copy assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("app");

  // Set template formats
  eleventyConfig.setTemplateFormats(["njk", "html"]); // Include njk for Nunjucks

  // Add a collection for projects sorted by featured status and then by date
  eleventyConfig.addCollection("projects", function (collection) {
    return collection.getFilteredByGlob("src/projects/*.njk").sort((a, b) => {
      const aFeatured = a.data.feature === "yes";
      const bFeatured = b.data.feature === "yes";

      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;

      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

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

  // Add SEO plugin configuration
  eleventyConfig.addPlugin(pluginSEO, {
    title: (data) => data.site.title,
    description: (data) => data.site.description,
    url: (data) => data.site.url,
    author: (data) => data.site.author,
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_templates",
    },
    templateFormats: ["njk", "html"],
    data: {
      siteUrl: "https://tifajade.com",
    },
  };
};
