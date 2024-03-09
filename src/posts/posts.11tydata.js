require('dotenv').config();

const isDevEnv = process.env.ELEVENTY_ENV === 'development';
const todaysDate = new Date();

function showDraft(data) {
    const isDraft = 'draft' in data && data.draft !== false;
    const isFutureDate = data.publishedDate > todaysDate;
    return isDevEnv || (!isDraft && !isFutureDate);
}

module.exports = function() {
    return {
        eleventyComputed: {
            eleventyExcludeFromCollections: function(data) {
                if(showDraft(data)) {
                    return data.eleventyExcludeFromCollections;
                }
                else {
                    return true;
                }
            },
            permalink: function(data) {
                if(showDraft(data)) {
                    return data.permalink
                }
                else {
                    return false;
                }
            },
            // If publishedDate in front-matter is set to a string, convert it to a date object, if publishedDate is missing, revert back to page.date
            publishedDate: function(data) {
                if (typeof data.publishedDate === 'undefined' ) { //|| !!data.publishedDate) {
                    return data.page.date;
                } else {
                    return (typeof data.publishedDate === 'string') ? new Date(data.publishedDate) : data.publishedDate;
                }

            }
        }
    }
};
