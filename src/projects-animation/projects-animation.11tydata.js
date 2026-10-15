// Defaults for every project in this folder: the case-study layout and
// clean /projects/<slug>/ URLs. Drafts (in drafts/) aren't published.
module.exports = {
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    permalink: (data) =>
      data.page.inputPath.includes("/drafts/")
        ? false
        : `/projects/${data.page.fileSlug}/`,
    // "Client: Title", unless the title already starts with the client name
    metaTitle: (data) => {
      if (!data.title) return data.client;
      if (data.title.startsWith(data.client)) return data.title;
      return `${data.client}: ${data.title}`;
    },
    description: (data) => data.description || data.subtitle,
  },
};
