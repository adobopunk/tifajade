module.exports = function (eleventyConfig) {
	//copy `assets/` to `_site/assets/`
	eleventyConfig.addPassthroughCopy('assets');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addPassthroughCopy('img');
	eleventyConfig.addPassthroughCopy('app');

	return {
		dir: {
			input: 'src',
			output: '_site',
			includes: '_templates',
		},
	};
};
