module.exports = {
    tagsBySize: (collection) => {
        // callback that can return any arbitrary data (since v0.5.3)
        // see https://www.11ty.dev/docs/collections/#getall()
        const allPosts = collection.getAll();

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
        const countPostsByTag = new Map();
        allPosts.forEach((post) => {
            // short circuit eval sets tags to an empty array if there are no tags set
            const tags = post.data.tags || [];
            tags.forEach((tag) => {
                const count = countPostsByTag.get(tag) || 0;
                countPostsByTag.set(tag, count + 1)
            })
        });

        return [...countPostsByTag].sort((a, b) => b[1] - a[1])
    }
};