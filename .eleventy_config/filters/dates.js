const {DateTime} = require('luxon');
module.exports = {

    htmlDateString: (dateObj) => {
        return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy-LL-dd');
    },
};