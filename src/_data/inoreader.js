let Parser = require('rss-parser');
let opml = require('opml');
const fetch = require('@11ty/eleventy-fetch');

function fetchWithTimeout(resource, options = {}) {
    const {timeout = 5000} = options;
    return new Promise(async function (resolve, reject) {
        fetch(resource, {
            ...options
        }).then(resolve, reject);
        setTimeout(reject, timeout);
    });
}

module.exports = async () => {
    const inoreader = {};
    let parser = new Parser({
        timeout: 10000,
        customFields: {
            item: ['source']
        }
    });
    const maxPerFeed = 2;

    const opmlSources = [
        {
            'series': 'friluftsliv',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/Vandring+%26+friluftsliv'
        },
        {
            'series': 'löpning',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/L%C3%B6pning'
        },
        {
            'series': 'cykling',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/Cykling'
        },
        {
            'series': 'fotografering',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/Fotografering'
        },
        {
            'series': 'kartor',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/Kartografi'
        },
        {
            'series': 'ölbryggning',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/%C3%96lbryggning'
        },
        {
            'series': 'gaming',
            'url': 'https://www.inoreader.com/reader/subscriptions/export/user/1005830534/label/Gaming+%26+Entertainment'
        }
    ];


    const getSourcesFromOPML = async function () {
        const feedList = [];
        for (let index = 0; index < opmlSources.length; index++) {
            let opmlSource = opmlSources[index];
            const response = await fetchWithTimeout(opmlSource.url, {
                duration: '6h',
                type: 'text',
                directory: '.cache'
            });
            opml.parse(response, function (err, theOutline) {
                if (!err) {
                    feedList.push({
                        'series': opmlSource.series,
                        'urls': theOutline.opml.body.subs[0].subs
                    });
                }
            });
        }
        return feedList;
    };

    let feedLists = await getSourcesFromOPML();
    feedLists = removeSelf(feedLists);

    function sortByDate(a, b) {
        if (a.publicationDate > b.publicationDate) {
            return -1;
        }
        if (a.publicationDate < b.publicationDate) {
            return 1;
        }
        return 0;
    }

    function removeSelf(feedList) {
        const filteredFeedList = [];

        feedList.forEach((list) => {
            filteredFeedList.push({
                'series': list.series,
                'urls': list.urls.filter((feed) => {
                    return feed.xmlUrl.indexOf('gustavlindqvist.se') === -1;
                })
            });
        });
        return filteredFeedList;
    }

    const getPosts = async (feeds) => {

        let combinedFeed = [];

        for (let index = 0; index < feeds.length; index++) {
            let feedUrl = feeds[index].xmlUrl;
            let siteUrl = feeds[index].htmlUrl;
            let siteTitle = feeds[index].title;
            try {
                const rawFeed = await fetchWithTimeout(feedUrl, {
                    duration: '6h',
                    type: 'text',
                    directory: '.cache'
                });

                let feed = await parser.parseString(rawFeed);
                console.log('[' + '\x1b[35m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', 'Grabbed', feed.items.length, 'posts from', siteTitle + ' (' + feedUrl + ')');

                feed.items.forEach((item) => {
                    item.blogName = siteTitle;
                    item.blogLink = siteUrl;
                });

                const cleanFeed = feed.items.map((feedItem) => {
                    return {
                        title: feedItem.title,
                        link: feedItem.link,
                        publicationDate: new Date(feedItem.pubDate),
                        blogName: feedItem.blogName,
                        blogLink: feedItem.blogLink,
                        source: new URL(feedItem.link).origin
                    };
                });

                combinedFeed = combinedFeed.concat(cleanFeed.slice(0, maxPerFeed));


            } catch (err) {
                const msg = (typeof err !== 'undefined' && typeof err.message !== 'undefined') ? ': ' + err.message.replace(/[\n\r]/g, '. ') : '';
                console.log('[' + '\x1b[31m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', 'Failed to grab posts from', siteTitle, '(' + feedUrl + ')', msg);
            }
        }
        return combinedFeed.sort(sortByDate);

    };

    let allPosts = {};
    for (let index = 0; index < feedLists.length; index++) {
        const feedList = feedLists[index];
        console.log('[' + '\x1b[35m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', 'Grabbed', feedList.urls.length, 'feed sources for tag: ', feedList.series);
        allPosts[feedList.series] = await getPosts(feedList.urls);
    }
    inoreader.allPosts = allPosts;


    const getGoodShit = async () => {
        const feedURL = 'https://www.inoreader.com/stream/user/1005830534/tag/Good%20shit';//view/json';

        try {
            const rawFeed = await fetchWithTimeout(feedURL, {
                duration: '1h',
                type: 'text',
                directory: '.cache'
            });

            let feed = await parser.parseString(rawFeed);

            console.log('[' + '\x1b[35m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', 'Loaded', feed.items.length, 'posts from good-shit.');

            outputPosts = [];
            feed.items.forEach((post) => {
                outputPost = {};
                outputPost.title = post.title.replace(/\.[pdfPDF]+/, '');
                outputPost.creator = (typeof post.creator !== 'undefined') ?
                    post.creator :
                    '';
                post.description = "";
                outputPost.source = post.source;
                outputPost.url = post.link;
                outputPost.date = post.isoDate;
                outputPost.tags = (typeof post.categories !== 'undefined')
                    ? post.categories
                        .filter((tag) => tag !== 'Good shit')
                        .map((tag) => tag.toLowerCase())
                    : [];
                outputPost.feature_image = `https://opengraph.gustavlindqvist.se/${encodeURIComponent(post.link)}/small/webp/`;
                outputPosts.push(outputPost);
            });

            return outputPosts;

        } catch (err) {
            const msg = (typeof err !== 'undefined' && typeof err.message !== 'undefined') ? ': ' + err.message.replace(/[\n\r]/g, '. ') : '';
            console.log('[' + '\x1b[31m%s\x1b[0m', 'Inoreader' + '\x1b[0m' + ']:', msg);
        }
    };
    inoreader.goodShit = await getGoodShit();

    return inoreader;
};
