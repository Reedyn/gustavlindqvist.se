/* eslint-disable no-console */
import fetch from '@11ty/eleventy-fetch';
const WEBMENTION_BASE_URL = 'https://webmention.io/api/mentions.jf2';

export default async () => {
	const domain = 'gustavlindqvist.se'; // e.g. lukeb.co.uk
	const token = process.env.WEBMENTIONIO_TOKEN; // found at the bottom of https://webmention.io/settings

	const url = `${WEBMENTION_BASE_URL}?domain=${domain}&token=${token}&per-page=1000`;

	try {
		const feed = await fetch(url, {
			duration: '30m',
			type: 'json',
			directory: '.cache',
		});

		feed.children.forEach((webmention) => {
			if (!webmention.published && webmention['wm-received']) {
				webmention.published = webmention['wm-received'];
			}
		});

		console.log(
			'[' + '\x1b[34m%s\x1b[0m',
			'WebMentions' + '\x1b[0m' + ']:',
			'loaded',
			feed.children.length,
			'webmentions',
		);
		return feed.children;
	} catch (err) {
		console.error(err);
		return [];
	}
};
