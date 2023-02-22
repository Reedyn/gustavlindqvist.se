require('dotenv').config();

const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginPageAssets = require('eleventy-plugin-page-assets');
const pluginNavigation = require('@11ty/eleventy-navigation');
const pluginSchema = require('@quasibit/eleventy-plugin-schema');

const markdown = require('./.eleventy.markdown.js');
const filters = require('./.eleventy.filters.js');
const asyncFilters = require('./.eleventy.filters.async.js');
const shortcodes = require('./.eleventy.shortcodes.js');
const asyncShortcodes = require('./.eleventy.shortcodes.async.js');
const collections = require('./.eleventy.collections.js');

const CONTENT_GLOBS = {
    posts: 'src/posts/**/*.md|pages/**/*.md',
    assets: '*.png|*.jpg|*.jpeg|*.gif|*.webp|*.gpx|*.fit'
}

module.exports = function (eleventyConfig) {
    const ELEVENTY_ENVIRONMENT = (typeof process.env.ELEVENTY_ENV !== 'undefined') ? process.env.ELEVENTY_ENV : 'production';
    console.log('Building with', ELEVENTY_ENVIRONMENT, 'environment.');
    console.log('');

    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: true,
        excerpt_alias: 'custom_excerpt'
    });
    eleventyConfig.setLiquidOptions({
        dynamicPartials: false,
        strictFilters: true
    });
    eleventyConfig.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
        }
    });
    eleventyConfig.addPlugin(pluginNavigation);
    eleventyConfig.addPlugin(pluginPageAssets, {
        mode: 'directory',
        postsMatching: CONTENT_GLOBS.posts,
        assetsMatching: CONTENT_GLOBS.assets,
        recursive: false,
        hashAssets: false
    });
    eleventyConfig.addPlugin(pluginSchema);

    // Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName])
    });

    // Asynchronous filters
    Object.keys(asyncFilters).forEach((filterName) => {
        eleventyConfig.addNunjucksAsyncFilter(filterName, asyncFilters[filterName])
    });

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
    });

    // Asynchronous shortcodes
    Object.keys(asyncShortcodes).forEach((shortcodeName) => {
        eleventyConfig.addNunjucksAsyncShortcode(shortcodeName, asyncShortcodes[shortcodeName])
    });

    // Collections
    Object.keys(collections).forEach((collectionName) => {
        eleventyConfig.addCollection(collectionName, collections[collectionName])
    });

    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/CNAME');
    eleventyConfig.addPassthroughCopy('src/robots.txt');
    eleventyConfig.addPassthroughCopy({'src/webfinger.json': '/.well-known/webfinger'});
    eleventyConfig.addPassthroughCopy({'src/favicon': '/'});
    eleventyConfig.addPassthroughCopy('src/_redirects');

    // Layouts
    eleventyConfig.addLayoutAlias('base', 'base.njk');
    eleventyConfig.addLayoutAlias('page', 'page.njk');
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('beer', 'beer.njk');
    eleventyConfig.addLayoutAlias('brewery', 'brewery.njk');

    eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.setLibrary('md', markdown);

    return {
        dir: {
            input: 'src',
            output: '_site'
        },
        // Control which files Eleventy will process
        // e.g.: *.md, *.njk, *.html, *.liquid
        templateFormats: [
            'md',
            'hbs',
            'njk',
            'html',
        ],

        // Opt-out of pre-processing global data JSON files: (default: `liquid`)
        dataTemplateEngine: false,

        // Pre-process *.md files with: (default: `liquid`)
        markdownTemplateEngine: 'njk',

        // Pre-process *.html files with: (default: `liquid`)
        htmlTemplateEngine: 'njk',
    };
};
