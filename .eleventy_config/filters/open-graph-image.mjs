/* eslint-disable no-console */
import EleventyImage from '@11ty/eleventy-img';
import path from 'node:path';

export default async function (src, postData) {
	if ((typeof src === 'undefined' || !src) && postData.outputPath) {
		return src;
	}

	const documentPath = postData.filePathStem;
	src = src.replace(/^\//, '');

	let outputPath;
	try {
		outputPath = postData.outputPath
			.substring(0, postData.outputPath.lastIndexOf('/')) // Remove document from path
			.replace(/^\//, ''); // remove first slash

		// If the image is absolute path or external
		// eslint-disable-next-line no-unused-vars
	} catch (error) {
		outputPath = '';
	}

	const folderPath = documentPath
		.substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
		.replace(/^\//, ''); // remove first slash
	// If the image is absolute path or external
	if (src.startsWith('assets')) {
		src = './src/' + src;
	} else {
		// Otherwise assume the file is relative to the document folder
		src = './src/' + folderPath + src;
	}

	const options = {
		widths: [null],
		formats: [null],
		filenameFormat: function (id, src, width, format) {
			const extension = path.extname(src);
			const name = path.basename(src, extension);

			return `${name}.${format}`;
		},
		outputDir: outputPath,
		urlPath: postData.url,
	};

	let format = '';

	EleventyImage(src, options);
	const metadata = EleventyImage.statsSync(src, options);
	for (const key in metadata) {
		format = key;
	}

	let imageSrc = metadata[format][0];

	console.log(
		'[' + '\x1b[36m%s\x1b[0m',
		'11ty Image' + '\x1b[0m' + ']:',
		'Created open-graph image ',
		imageSrc.url,
	);
	return imageSrc.url;
}
