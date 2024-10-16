/* eslint-disable no-console */
/* global: require, module, process */
require('dotenv').config();

import pluginFeed from '@11ty/eleventy-plugin-rss';
import pluginNavigation from '@11ty/eleventy-navigation';
import pluginSchema from '@quasibit/eleventy-plugin-schema';

import markdown from './.eleventy_config/markdown.mjs';
import filters from './.eleventy_config/filters.mjs';
import asyncFilters from './.eleventy_config/filters.async.js';
import shortcodes from './.eleventy_config/shortcodes.mjs';
import collections from './.eleventy_config/collections.mjs';

import 'dotenv/config';

export default function (eleventyConfig) {
	const ELEVENTY_ENVIRONMENT =
		typeof process.env.ELEVENTY_ENV !== 'undefined' ? process.env.ELEVENTY_ENV : 'production';
	console.log('Building with', ELEVENTY_ENVIRONMENT, 'environment.');
	console.log('');

	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_alias: 'custom_excerpt',
	});
	eleventyConfig.setLiquidOptions({
		dynamicPartials: false,
		strictFilters: true,
	});
	eleventyConfig.addPlugin(pluginFeed, {
		posthtmlRenderOptions: {
			closingSingleTag: 'default', // opt-out of <img/>-style XHTML single tags
		},
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(pluginSchema);

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName]);
	});

	// Async filters
	Object.keys(asyncFilters).forEach((filterName) => {
		eleventyConfig.addAsyncFilter(filterName, asyncFilters[filterName]);
	});

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
	});

	// Collections
	Object.keys(collections).forEach((collectionName) => {
		eleventyConfig.addCollection(collectionName, collections[collectionName]);
	});

	eleventyConfig.addPassthroughCopy('src/assets');
	eleventyConfig.addPassthroughCopy('src/CNAME');
	eleventyConfig.addPassthroughCopy('src/robots.txt');
	eleventyConfig.addPassthroughCopy('src/key_gustav-lindqvist.asc');
	eleventyConfig.addPassthroughCopy({
		'src/webfinger.json': '/.well-known/webfinger',
	});
	eleventyConfig.addPassthroughCopy({ 'src/favicon': '/' });
	eleventyConfig.addPassthroughCopy('src/_redirects');
	eleventyConfig.addPassthroughCopy('src/_headers');

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
			output: '_site',
		},
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: ['md', 'hbs', 'njk', 'html'],

		// Opt-out of pre-processing global data JSON files: (default: `liquid`)
		dataTemplateEngine: false,

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: 'njk',

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: 'njk',
	};
}
