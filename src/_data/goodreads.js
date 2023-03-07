const Parser = require('rss-parser');
const fetch = require('@11ty/eleventy-fetch');

module.exports = async () => {
    let parser = new Parser({
        timeout: 10000,
        customFields: {
            item: ['book_id', 'book', 'author_name'],
        }
    });

    const feed_id = '14070425';

    const getPosts = async (shelf, feed_id) => {
        try {
            let rawFeed = await fetch(`https://www.goodreads.com/review/list_rss/${feed_id}?shelf=${shelf}`, {
                duration: '1d',
                type: 'text',
                directory: '.cache',
            });

            let feed = await parser.parseString(rawFeed);
            console.log(
                '[' + '\x1b[95m%s\x1b[0m', 'Goodreads' + '\x1b[0m' + ']:' ,
                feed.items.length ,
                `books from the ${shelf} shelf (${feed.link})`
            );
            feed.items.forEach((item) => {
                item.date = new Date(item.pubDate);
                item.url = 'https://www.goodreads.com/book/show/' + item.book_id;
                item.pages = item.book.num_pages[0] + ' sidor';
                item.author = item.author_name;
            });
            return feed.items;
        } catch (err) {
            console.error(err);
        }
    };

    return {
        read: await getPosts('read',feed_id),
        currently_reading: await getPosts('currently-reading',feed_id),
        want_to_read: await getPosts('to-read',feed_id),
    }

};
