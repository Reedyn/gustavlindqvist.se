const fs = require('fs');
const EleventyImage = require("@11ty/eleventy-img");
const markdown = require('./markdown');
const hashString = require('./functions').hashString;
const image = require('./shortcodes/image');
const pack = require('./shortcodes/pack');

module.exports = {
    pack: pack.pack,
    packStatistics: pack.packStatistics,
    packInventory: pack.packInventory,
    image,
    checksum: function (filename) {
        const fileContent = fs.readFileSync(filename, 'utf8');
        return hashString(fileContent);
    }
};