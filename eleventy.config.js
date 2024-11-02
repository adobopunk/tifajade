module.exports = function (eleventyConfig) {
  // Copy assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("app");

  // Set template formats
  eleventyConfig.setTemplateFormats(["njk", "html"]); // Include njk for Nunjucks

  // Add a collection for projects sorted by date
  eleventyConfig.addCollection("projects", function (collection) {
    return collection.getFilteredByGlob("src/projects/*.njk").sort((a, b) => {
      return b.date - a.date; // Sort by date, most recent first
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
