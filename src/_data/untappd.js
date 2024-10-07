/* eslint-disable no-console */
let Parser = require('rss-parser');
const fetch = require('@11ty/eleventy-fetch');

module.exports = async () => {
	let parser = new Parser({
		timeout: 10000,
		customFields: {
			item: ['description'],
		},
	});

	const untappdBreweryURL = 'https://untappd.com/rss/brewery/505146';

	const createCheckinFromFeedItem = (checkinFeedItem) => {
		const checkin = {};
		let [username, beer] = checkinFeedItem.title.split(' is drinking a '); // Separate title into the different objects
		beer = beer.replace(/at\s.*/, '').trim(); // Remove location and extra spaces.
		let review_description = '';

		if (typeof checkinFeedItem.description !== 'undefined') {
			let [review_desc] = checkinFeedItem.description.split(' ('); // Separate title into the different objects
			review_description = review_desc;
		}

		checkin.beer = beer;
		checkin.user = {
			name: username,
			link: checkinFeedItem.link.replace(/\/checkin\/\d+/, '').trim(),
		};
		checkin.review = {
			description: review_description,
		};
		checkin.date = new Date(checkinFeedItem.pubDate);
		checkin.url = checkinFeedItem.link;
		return checkin;
	};

	const getPosts = async () => {
		const checkins = [];
		try {
			let rawFeed = await fetch(untappdBreweryURL, {
				duration: '1d',
				type: 'text',
				directory: '.cache',
			});
			let feed = await parser.parseString(rawFeed);
			console.log(
				'[' + '\x1b[33m%s\x1b[0m',
				'Untappd' + '\x1b[0m' + ']:',
				'loaded',
				feed.items.length + ' checkins (' + feed.link + ')',
			);
			feed.items.forEach((item) => {
				checkins.push(createCheckinFromFeedItem(item));
			});
			return checkins;
		} catch (err) {
			console.error(err);
		}
	};

	return {
		checkins: await getPosts(),
	};
};
