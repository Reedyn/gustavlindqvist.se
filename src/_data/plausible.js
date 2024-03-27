const fetch = require("@11ty/eleventy-fetch");

require('dotenv').config();

module.exports = async () => {
    const apiKey = process.env.PLAUSIBLE_APIKEY;

    const getPopularPages = async () => {
        try {
            const response = await fetch('https://plausible.gustavlindqvist.se/api/v1/stats/breakdown?site_id=gustavlindqvist.se&period=12mo&property=event:page&limit=50', {
                duration: "7d",
                type: "json",
                directory: ".cache",
                fetchOptions: {
                    headers: {'Authorization': 'Bearer ' + apiKey}
                }
            });
            console.log('[' + '\x1b[36m%s\x1b[0m', 'Plausible' + '\x1b[0m' + ']:', 'Loaded analytics for',response.results.length,'pages');
            return response.results;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    const popularPages = await getPopularPages();

    return {
        popularPages: popularPages
    };
}