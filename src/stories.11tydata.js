// The Stories index page is hidden while site.json has showStories set to false.
const site = require("./_data/site.json");

module.exports = {
  eleventyComputed: {
    permalink: () => (site.showStories ? "/stories/" : false),
    eleventyExcludeFromCollections: () => !site.showStories,
  },
};
