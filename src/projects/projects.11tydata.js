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
    // Set `seoTitle` in a project's front matter to shorten the <title>
    metaTitle: (data) => {
      if (data.seoTitle) return data.seoTitle;
      if (!data.title) return data.client;
      if (data.title.startsWith(data.client)) return data.title;
      return `${data.client}: ${data.title}`;
    },
    description: (data) => data.description || data.subtitle,
    // Structured data for search engines
    jsonLd: (data) => {
      if (!data.client || !data.title || data.page.inputPath.includes("/drafts/")) return undefined;
      const site = "https://tifajade.com";
      const img = typeof data.image === "string" ? data.image : data.image?.jpg || data.image?.webp;
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: data.title.startsWith(data.client) ? data.title : `${data.client}: ${data.title}`,
        description: data.description || data.subtitle,
        url: `${site}/projects/${data.page.fileSlug}/`,
        ...(img && !/^https?:/.test(img) ? { image: site + encodeURI(decodeURI(img)) } : {}),
        ...(data.date ? { dateCreated: new Date(data.date).toISOString().slice(0, 10) } : {}),
        creator: { "@type": "Person", name: "Tifa Jade", url: site + "/" },
        ...(data.scope ? { "genre": data.category === "film" ? "Film" : "Motion design" } : {}),
      };
    },
  },
};
