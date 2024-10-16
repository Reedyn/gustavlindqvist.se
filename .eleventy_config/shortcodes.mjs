import fs from 'fs';
import functions from './functions.mjs';
import image from './shortcodes/image.mjs';
import pack from './shortcodes/pack.mjs';

export default {
	pack: pack.pack,
	packInventory: pack.packInventory,
	image,
	checksum: function (filename) {
		const fileContent = fs.readFileSync(filename, 'utf8');
		return functions.hashString(fileContent);
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
