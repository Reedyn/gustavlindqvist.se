const _ = require('lodash');
const slugify = require('slugify');
const {DateTime} = require('luxon');
const moment = require('moment/moment');
const markdown = require('./.eleventy.markdown');
const sanitizeHTML = require('sanitize-html');
const fs = require('fs');
const hashString = require('./.eleventy.functions').hashString;


module.exports = {
    groupByYear: (collection) => {
        return _.chain(collection)
            .groupBy((post) => post.date.getFullYear())
            .toPairs()
            .reverse()
            .value();
    },
    sortByOrder: (items) => {
        items = [...items];
        return items.sort((a, b) => Math.sign(a.data.order - b.data.order));
    },
    slug: (input) => {
        const options = {
            replacement: '-',
            remove: /[&,+()$~%.'":*?<>{}←→↑↓↔↕↖↗↘↙°′]/g,
            lower: true
        };
        return slugify(input, options);
    },
    hasTag: (arr, str) => {
        return arr.includes(str);
    },
    getRecipe: (recipeId, recipes) => {
        return recipes.find((recipe) => {
            return recipe._id === recipeId;
        });
    },
    getBatchesWithRecipeId: (recipeId, batches) => {
        return batches.filter((batch) => {
            return batch.recipe._id === recipeId;
        });
    },
    utf8_xml: (inputStr) => {
        return inputStr.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
    },
    trailingZeros: (num, totalLength) => {
        return String(num).padEnd(totalLength, '0');
    },
    htmlDateString: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy-LL-dd');
    },
    volumeToBottles: (volume) => {
        return Math.round(volume * 3);
    },
    head: (array, n) => {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    },
    removePostsNotInSeries: (collection, series) => {
        return collection.filter((post) => {
            return post.data.series.includes(series);
        });
    },
    date: (date, format) => {
        return moment(date).format(format);
    },
    dateFromString: (dateString) => {
        return new Date(dateString);
    },
    dateFolder: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy/MM/dd');
    },
    shortISODate: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy-MM-dd');
    },
    longISODate: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy-MM-dd HH:mm');
    },
    fullISODate: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toISO();
    },
    readableDate: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setLocale('sv').toFormat('d MMMM');
    },
    readableLongDate: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setLocale('sv').toFormat('d MMMM, yyyy');
    },
    lowercase: (inputString) => {
        return inputString.toLowerCase();
    },
    firstLetterUpper: (inputString) => {
        if (typeof inputString !== 'undefined' && inputString.length) {
            return inputString.charAt(0).toUpperCase() + inputString.slice(1);
        }
        return '';
    },
    encodeURL: (inputString) => {
        return encodeURI(inputString);
    },
    parseImagePath: (imagePath, postPath) => {
        if (imagePath) {
            if (imagePath.indexOf('/assets/images/') !== -1) { // If image is in the content folder.
                return imagePath;
            } else { // If not, prefix the post path to the image path
                return postPath + imagePath;
            }
        } else {
            return undefined;
        }
    },
    shuffle: (arr) => {
        let m = arr.length,
            t,
            i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }

        return arr;
    },
    renderUsingMarkdown: (rawString) => {
        return markdown.render(rawString);
    },
    firstLetterUppercase: (rawString) => {
        return rawString.charAt(0).toUpperCase() + rawString.slice(1);
    },
    hashString: hashString,
    prettyDigits: (number) => {
        return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    },
    isoString: (date = Date.now()) => new Date(date).toISOString(),
    interactionsForPage: (webmentions, comments, url) => {
        let interactions = webmentions.concat(comments); // Merge external and local interactions
        const allowedTypes = {
            likes: ['like-of'],
            reposts: ['repost-of'],
            replies: ['mention-of', 'in-reply-to']
        };

        // define which HTML tags you want to allow in the webmention body content
        // https://github.com/apostrophecms/sanitize-html#what-are-the-default-options
        const allowedHTML = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                a: ['href']
            }
        };

        const clean = (entry) => {
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
                entry.content.value = (typeof entry.content.value.replaceAll === 'function') ? entry.content.value.replaceAll(replaceTwitterName, newTwitterName) : (entry.content.value);
            }

            const myAccounts = [
                'https://twitter.com/Reedyn',
                'https://twitter.com/lindqvistus',
                'https://mastodon.acc.sunet.se/@reedyn',
                'https://jkpg.rocks/@gustav',
                'https://mastodon.se/@gustav'
            ];

            entry.author['is-me'] = (typeof entry.author['is-me'] !== 'undefined' && entry.author['is-me']) ? true : myAccounts.includes(entry.author.url);

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
                    entry[urlField] = entry[urlField].replace('https://gustavlindqvist.se/.../vi-ska-inte-lyssna-pa.../', 'https://gustavlindqvist.se/2014/09/15/vi-ska-inte-lyssna-pa-deras-politik-men-pa-deras-valjare/');
                    entry[urlField] = entry[urlField].replace('https://gustavlindqvist.se/2022/TODO/', 'https://gustavlindqvist.se/2022/todo/');
                    entry[urlField] = entry[urlField].split('#')[0];
                }
            });

            return entry;
        };

        // sort webmentions by published timestamp chronologically.
        // swap a.published and b.published to reverse order.
        const orderByDate = (a, b) => new Date(a.published) - new Date(b.published);

        // only allow webmentions that have an author name and a timestamp
        const checkRequiredFields = (entry) => {
            const {author} = entry;
            return !!author && !!author.name;
        };

        const pageInteractions = interactions
            .map(clean)
            .filter((mention) => mention['wm-target'] === url)
            .filter(checkRequiredFields)
            .sort(orderByDate);

        const likes = pageInteractions
            .filter((mention) => allowedTypes.likes.includes(mention['wm-property']))
            .filter((like) => like.author)
            .map((like) => like.author);

        const reposts = pageInteractions
            .filter((mention) => allowedTypes.reposts.includes(mention['wm-property']))
            .filter((repost) => repost.author);

        const replies = pageInteractions
            .filter((mention) => allowedTypes.replies.includes(mention['wm-property']))
            .filter((reply) => {
                const {author, published, content} = reply;
                return author && author.name && published && content;
            });

        const repostsAndReplies = reposts.concat(replies)
            .sort(orderByDate);

        return {
            likes,
            reposts,
            replies,
            repostsAndReplies
        };
    }
};