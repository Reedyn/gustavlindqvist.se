/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		require('postcss-import-ext-glob'),
		require('postcss-import'),
		require('postcss-custom-media'),
		require('autoprefixer'),
		require('postcss-nesting'),
		require('cssnano'),
	],
};

module.exports = config;
