const _ = require('lodash');
const slugify = require('slugify');
const {DateTime} = require('luxon');
const moment = require('moment/moment');
const markdown = require('./markdown');
const hashString = require('./functions').hashString;
const featureImageFilter = require('./filters/feature-image');
const openGraphImageFilter = require('./filters/open-graph-image');
const dates = require('./filters/dates');
const time = require('./filters/time');

module.exports = {
    log: (object) => {
        console.log(object);
    },
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
    sortBySortDate: (items) => {
        items = [...items];
        return items
            .map((item) => {
                item.data.sortDate = (typeof item.data.sortDate !== 'undefined') ? item.data.sortDate : item.date;
                return item;
            })
            .sort((a, b) => new Date(a.data.sortDate) - new Date(b.data.sortDate));
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
    volumeToBottles: (volume) => {
        return Math.round(volume * 3);
    },
    dotToComma: (inputString) => {
        return inputString.replace('\.', ',');
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
            return typeof post.data.series !== 'undefined' && post.data.series.includes(series);
        });
    },
    date: dates.date,
    dateFromString: dates.dateFromString,
    dateFolder: dates.dateFolder,
    htmlDateString: dates.htmlDateString,
    shortISODate: dates.shortISODate,
    longISODate: dates.longISODate,
    fullISODate: dates.fullISODate,
    readableDate: dates.readableDate,
    readableLongDate: dates.readableLongDate,
    minutesToHoursAndMinutes: time.minutesToHoursAndMinutes,
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
    encodeURIComponent: (inputString) => {
        return encodeURIComponent(inputString);
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
        try {
            return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
        } catch {
            return '';
        }

    },
    isoString: (date = Date.now()) => new Date(date).toISOString(),
    count: (arr) => arr.length,
    featureImageFilter,
    openGraphImageFilter,
};