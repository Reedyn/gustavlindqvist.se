const sanitizeHTML = require("sanitize-html");

module.exports = (webmentions, comments, url) => {
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