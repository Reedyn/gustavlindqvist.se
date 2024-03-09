module.exports = function() {
    return {
        eleventyComputed: {
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
