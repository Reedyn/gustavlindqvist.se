/* eslint-disable no-console */
const { XMLParser } = require('fast-xml-parser');
const opml = require('opml');
const fetch = require('@11ty/eleventy-fetch');

function fetchWithTimeout(resource, options = {}) {
	const { timeout = 5000 } = options;
	return new Promise(function (resolve, reject) {
		fetch(resource, {
			...options,
		}).then(resolve, reject);
		setTimeout(reject, timeout);
	});
}

module.exports = async () => {
	const inoreader = {};

	const opmlSources = [
		{
			title: 'Nyheter, journalism & politik',
			folder_name: 'Nyheter%2C+journalism+%26+politik',
		},
		{
			title: 'Säkerhet, integritet & försvar',
			folder_name: 'Säkerhet%2C+integritet+%26+försvar',
		},
		{
			title: 'Friluftsliv',
			series: 'friluftsliv',
			folder_name: 'Friluftsliv',
		},
		{
			title: 'Orientering',
			series: 'orientering',
			folder_name: 'Orientering',
		},
		{
			title: 'Löpning',
			series: 'löpning',
			folder_name: 'Löpning',
		},
		{
			title: 'Cykling',
			series: 'cykling',
			folder_name: 'Cykling',
		},
		{
			title: 'Stadsplanering',
			folder_name: 'Stadsplanering',
		},
		{
			title: 'Kartor',
			series: 'kartor',
			folder_name: 'Kartor',
		},
		{
			title: 'Fotografering',
			series: 'fotografering',
			folder_name: 'Fotografering',
		},
		{
			title: 'Astronomi',
			folder_name: 'Astronomi',
		},
		{
			title: 'Gaming',
			series: 'gaming',
			folder_name: 'Gaming',
		},
		{
			title: 'Ölbryggning',
			series: 'ölbryggning',
			folder_name: 'Ölbryggning',
		},
		{
			title: 'Bibliotek',
			folder_name: 'Bibliotek',
		},
		{
			title: 'Forskning',
			folder_name: 'Forskning',
		},
		{
			title: 'Webcomics',
			folder_name: 'Webcomics',
		},
		{
			title: 'Internet',
			folder_name: 'Internet',
		},
		{
			title: 'Webbutveckling',
			series: 'webdev',
			folder_name: 'Webbutveckling',
		},
		{
			title: 'Teknologi',
			series: 'teknologi',
			folder_name: 'Teknologi',
		},
		{
			title: 'Övrigt',
			series: 'övrigt',
			folder_name: 'Övrigt',
		},
	];

	const getSourcesFromOPML = async function () {
		const feedList = [];
		for (let index = 0; index < opmlSources.length; index++) {
			let opmlSource = opmlSources[index];
			const response = await fetchWithTimeout(
				`https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/${opmlSource.folder_name}`,
				{
					duration: '6h',
					type: 'text',
					directory: '.cache',
				},
			);
			opml.parse(response, function (err, theOutline) {
				if (!err) {
					feedList.push({
						title: opmlSource.title,
						series: opmlSource.series,
						feeds: theOutline.opml.body.subs[0].subs,
					});
				}
			});
		}
		console.log(
			'[' + '\x1b[35m%s\x1b[0m',
			'Inoreader' + '\x1b[0m' + ']:',
			'Grabbed',
			feedList.length,
			'feed lists from Inoreader',
		);
		return feedList;
	};

	function removeSelf(feedList) {
		const filteredFeedList = [];

		feedList.forEach((list) => {
			filteredFeedList.push({
				title: list.title,
				series: list.series,
				feeds: list.feeds.filter((feed) => {
					return feed.xmlUrl.indexOf('gustavlindqvist.se') === -1;
				}),
			});
		});
		console.log(
			'[' + '\x1b[35m%s\x1b[0m',
			'Inoreader' + '\x1b[0m' + ']:',
			'Removed self from feed lists',
		);
		return filteredFeedList;
	}

	const feedLists = removeSelf(await getSourcesFromOPML());

	const getLinkBlog = async () => {
		const feedURL = 'https://www.inoreader.com/stream/user/1005830534/tag/Linkblog?n=500';

		try {
			const rawFeed = await fetchWithTimeout(feedURL, {
				duration: '1h',
				type: 'text',
				directory: '.cache',
			});

			const xml_parser = new XMLParser({
				attributeNamePrefix: '@',
				ignoreAttributes: false,
				// processEntities: false
			});

			let feed = await xml_parser.parse(rawFeed).rss.channel.item;

			console.log(
				'[' + '\x1b[35m%s\x1b[0m',
				'Inoreader' + '\x1b[0m' + ']:',
				'Loaded',
				feed.length,
				'posts from linkblog.',
			);

			const outputPosts = [];
			feed.forEach((post) => {
				const outputPost = {};
				outputPost.title = post.title.replace(/\.[pdfPDF]+/, '');
				outputPost.source = {
					name: post.source['#text'],
					url: post.source['@url'],
				};
				outputPost.url = post.link;
				outputPost.date = new Date(post.pubDate).toISOString();
				outputPost.tags =
					typeof post.category === 'object'
						? post.category.filter((tag) => tag !== 'Good shit')
						: [];
				outputPost.feature_image = `https://opengraph.gustavlindqvist.se/${encodeURIComponent(post.link)}/small/webp/`;
				outputPost.content = `<img src="${outputPost.feature_image}" alt="Featurebild för ${outputPost.title}"><p><a href="${outputPost.url}">${outputPost.title}</a></p>`;
				outputPosts.push(outputPost);
			});

			return outputPosts;
		} catch (err) {
			const msg =
				typeof err !== 'undefined' && typeof err.message !== 'undefined'
					? ': ' + err.message.replace(/[\n\r]/g, '. ')
					: '';
			console.log('[' + '\x1b[31m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', msg);
		}
	};

	inoreader.feeds = feedLists;
	inoreader.linkblog = await getLinkBlog();

	return inoreader;
};
