const _ = require('lodash');
const slugify = require('slugify');
const {DateTime} = require('luxon');
const moment = require('moment/moment');
const markdown = require('./markdown');
const hashString = require('./functions').hashString;
const featuredImageFilter = require('./filters/featured-image');
const interactionsForPage = require('./filters/interactions-for-page');
const dates = require('./filters/dates');

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
            remove: /[&,+()$~%.'":*?<>{}←→↑↓↔↕↖↗↘↙°!′]/g,
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
    htmlDateString: dates.htmlDateString,
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
    interactionsForPage,
    featuredImageFilter
};