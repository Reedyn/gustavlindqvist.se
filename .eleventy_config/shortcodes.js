const fs = require('fs');
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
	},
	githubLink: function () {
		const prefix = 'https://github.com/Reedyn/gustavlindqvist.se/blob/main/';
		return prefix + this.page.inputPath.replace('./', '');
	},
	sourceLink: function () {
		const prefix = 'https://raw.githubusercontent.com/Reedyn/gustavlindqvist.se/main/';
		return prefix + this.page.inputPath.replace('./', '');
	},
	editLink: function () {
		return `${this.ctx.page.inputPath.replace('./', '/')}`;
	},
};
