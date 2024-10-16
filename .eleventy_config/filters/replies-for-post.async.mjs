/* eslint-disable no-console */
import fetch from '@11ty/eleventy-fetch';
import sanitizeHTML from 'sanitize-html';
import 'dotenv/config';

const mastodonAsync = {};

mastodonAsync.host = 'jkpg.rocks';

const normalize = {
	mastodon: (posts) => {
		const myAccounts = [
			'https://mastodon.acc.sunet.se/@reedyn',
			'https://jkpg.rocks/@gustav',
			'https://mastodon.se/@gustav',
		];

		return posts
			.filter((reply) => {
				// Don't include bots
				// and only include posts that are public
				return !reply.account.bot && reply.visibility === 'public';
			})
			.map((reply) => {
				const image = reply.media_attachments.filter((media) => media.type === 'image')[0];

				return {
					published: reply.created_at,
					source: 'mastodon',
					type: 'in-reply-to',
					content: reply.content,
					image:
						typeof image !== 'undefined'
							? {
									preview_url: image.preview_url,
									url: image.url,
									description: image.description,
								}
							: null,
					url: reply.url,
					author: {
						name: reply.account.display_name.replace(/:\w+:/, '').trim(), // Remove custom emojis
						url: reply.account.url,
						image: reply.account.avatar_static,
						is_me: myAccounts.includes(reply.account.url),
					},
				};
			});
	},
	comments: (comments) => {
		const myAccounts = [
			'https://mastodon.acc.sunet.se/@reedyn',
			'https://jkpg.rocks/@gustav',
			'https://mastodon.se/@gustav',
		];

		return comments.map((comment) => {
			return {
				published: comment.published,
				type: comment['wm-property'],
				source: 'local',
				content: comment.content.html,
				url: comment.url,
				author: {
					name: comment.author.name,
					url: comment.author.url,
					image: comment.author.photo,
					is_me: myAccounts.includes(comment.author.url),
				},
			};
		});
	},
	webmentions: (webmentions) => {
		// define which HTML tags you want to allow in the webmention body content
		// https://github.com/apostrophecms/sanitize-html#what-are-the-default-options
		const allowedHTML = {
			allowedTags: ['b', 'i', 'em', 'strong', 'a'],
			allowedAttributes: {
				a: ['href'],
			},
		};
		return webmentions
			.filter((mention) => ['mention-of', 'in-reply-to'].includes(mention['wm-property']))
			.map((entry) => {
				const oldTwitterName = 'LindqvistGustav';
				const newTwitterName = 'lindqvistus';
				const replaceTwitterName = new RegExp(oldTwitterName, 'ig');

				if (entry.content) {
					if (typeof entry.content.html !== 'undefined') {
						// really long html mentions, usually newsletters or compilations
						entry.content.value =
							entry.content.html.length > 2000
								? `nämnde detta i <a href="${entry['wm-source']}">${entry['wm-source']}</a>`
								: sanitizeHTML(entry.content.html, allowedHTML);
					} else {
						entry.content.value = sanitizeHTML(entry.content.text, allowedHTML);
					}
					entry.content.value =
						typeof entry.content.value.replaceAll === 'function'
							? entry.content.value.replaceAll(replaceTwitterName, newTwitterName)
							: entry.content.value;
				} else {
					entry.content = '';
				}

				const myAccounts = [
					'https://twitter.com/Reedyn',
					'https://twitter.com/lindqvistus',
					'https://mastodon.acc.sunet.se/@reedyn',
					'https://jkpg.rocks/@gustav',
					'https://mastodon.se/@gustav',
				];

				entry.author['is-me'] =
					typeof entry.author['is-me'] !== 'undefined' && entry.author['is-me']
						? true
						: myAccounts.includes(entry.author.url);

				const urlFields = ['wm-target', 'mention-of'];

				if (entry['wm-source'].indexOf('twitter') !== -1) {
					entry['action-type'] = 'tweet';
				} else if (entry['wm-source'].indexOf('mastodon') !== -1) {
					entry['action-type'] = 'toot';
				} else {
					entry['action-type'] = 'comment';
				}

				urlFields.forEach((urlField) => {
					if (typeof entry[urlField] !== 'undefined') {
						entry[urlField] = entry[urlField].replace('http://', 'https://');
						entry[urlField] = entry[urlField].replace(
							'https://gustavlindqvist.se/.../vi-ska-inte-lyssna-pa.../',
							'https://gustavlindqvist.se/2014/09/15/vi-ska-inte-lyssna-pa-deras-politik-men-pa-deras-valjare/',
						);
						entry[urlField] = entry[urlField].replace(
							'https://gustavlindqvist.se/2022/TODO/',
							'https://gustavlindqvist.se/2022/todo/',
						);
						entry[urlField] = entry[urlField].split('#')[0];
					}
				});
				return {
					published: entry.published,
					type: entry['wm-property'],
					source: 'webmention',
					content: `<p>${entry.content.value}</p>`,
					url: entry.url,
					host: new URL(entry.url).host,
					author: {
						name: entry.author.name,
						url: entry.author.url,
						image: entry.author.photo,
						is_me: myAccounts.includes(entry.author.url),
					},
				};
			});
	},
};

const getMastodonReplies = async function (postId) {
	try {
		const url = `https://${mastodonAsync.host}/api/v1/statuses/${postId}/context`;
		const options = {
			duration: '1h',
			type: 'json',
			directory: '.cache',
		};

		const response = await fetch(url, options);

		if (postId === '110153096619496650') {
			console.log(this);
		}

		return [];
	} catch (err) {
		return [];
	}
};

const getRepliesForPost = async function (postId) {
	const postUrl = this.ctx.metadata.url + this.ctx.page.url;
	const comments = [];

	comments.push(
		normalize.webmentions(
			this.ctx.webmentions.filter((entry) => {
				return entry['wm-target'] === postUrl;
			}),
		),
	);

	comments.push(
		normalize.comments(
			this.ctx.comments.filter((entry) => {
				return entry['wm-target'] === postUrl;
			}),
		),
	);

	if (typeof postId !== 'undefined' && postId) {
		comments.push(normalize.mastodon(await getMastodonReplies(postId)));
	}
	const allComments = comments.flat(1);

	if (allComments.length) {
		console.log(
			'[' + '\x1b[34m%s\x1b[0m',
			'Comments' + '\x1b[0m' + ']:',
			'Loaded',
			allComments.length,
			'comments for',
			postUrl,
		);
	}

	return allComments.sort((a, b) => {
		return new Date(a.published) - new Date(b.published);
	});
};

export default getRepliesForPost;
