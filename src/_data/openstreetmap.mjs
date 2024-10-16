/* eslint-disable no-console */
import Parser from 'rss-parser';
import fetch from '@11ty/eleventy-fetch';

export default async () => {
	const openstreetmap = {};

	let parser = new Parser({
		timeout: 10000,
		customFields: {
			item: ['content'],
		},
	});

	const openstreetmap_personal_history_feed =
		'https://www.openstreetmap.org/user/reedyn/history/feed';

	const getEdits = async () => {
		try {
			const rawFeed = await fetch(openstreetmap_personal_history_feed, {
				duration: '3h',
				type: 'text',
				directory: '.cache',
			});
			const feed = await parser.parseString(rawFeed);
			const edits = [];
			console.log(
				'[' + '\x1b[32m%s\x1b[0m',
				'OpenStreetMap' + '\x1b[0m' + ']:',
				feed.items.length,
				"edits from Gustav's OSM profile (" + feed.link + ')',
			);
			feed.items.forEach((item) => {
				const edit = {};
				edit.id = item.id.slice(item.id.lastIndexOf('/') + 1);
				edit.url = item.id;
				edit.comment = item.title.slice(item.title.indexOf('-') + 1).trim();
				edit.resultatmaps = 'https://resultmaps.neis-one.org/osm-change-viz?c=' + edit.id;
				edit.date = new Date(item.pubDate);
				edits.push(edit);
			});
			return edits;
		} catch (err) {
			console.error(err);
		}
	};

	openstreetmap.edits = await getEdits();

	return openstreetmap;
};
