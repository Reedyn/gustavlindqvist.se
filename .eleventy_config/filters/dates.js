const { DateTime } = require('luxon');
const moment = require('moment');
module.exports = {
	htmlDateString: (dateObj) => {
		return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toFormat('yyyy-LL-dd');
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
		return DateTime.fromJSDate(dateObj)
			.setZone('Europe/Stockholm')
			.toFormat('yyyy-MM-dd HH:mm');
	},
	fullISODate: (dateObj) => {
		return DateTime.fromJSDate(dateObj).setZone('Europe/Stockholm').toISO();
	},
	readableDate: (dateObj) => {
		return DateTime.fromJSDate(dateObj).setLocale('sv').toFormat('d MMMM');
	},
	readableLongDate: (dateObj) => {
		return DateTime.fromJSDate(dateObj).setLocale('sv').toFormat('d MMMM, yyyy');
	},
};
