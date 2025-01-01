/* eslint-disable no-console */
import EleventyImage from '@11ty/eleventy-img';
import ImgProxy from 'imgproxy';
import path from 'node:path';

export default async function (filePath, sizes, style, postData) {
	if ((typeof filePath === 'undefined' || !filePath) && postData.outputPath) {
		return null;
	}
	const imgProxy = new ImgProxy({
		baseUrl: process.env.IMGPROXY_HOST,
		key: process.env.IMGPROXY_KEY,
		salt: process.env.IMGPROXY_SALT,
		encode: true,
	});
	const host = process.env.HOST;
	const documentPath = postData.filePathStem;
	filePath = filePath.replace(/^\//, '');

	// Where is the source file located?
	let sourceLocation;
	if (filePath.startsWith('http')) {
		sourceLocation = 'external';
	} else if (filePath.startsWith('assets')) {
		sourceLocation = 'assets';
	} else {
		sourceLocation = 'relative';
	}

	let outputPath;

	try {
		outputPath = postData.outputPath
			.substring(0, postData.outputPath.lastIndexOf('/')) // Remove document from path
			.replace(/^\//, ''); // remove first slash
		// If the image is absolute path or external
	} catch (error) {
		outputPath = '';
	}

	const folderPath = documentPath
		.substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
		.replace(/^\//, ''); // remove first slash

	let urlPrefix = '';

	switch (sourceLocation) {
		case 'external':
			break;
		case 'assets':
			filePath = './src/' + filePath;
			break;
		case 'relative':
			filePath = './src/' + folderPath + filePath;
			urlPrefix = host;
			break;
	}

	const options = {
		widths: [null],
		formats: [null],
		outputDir: outputPath,
		filenameFormat: function (id, src, width, format) {
			const extension = path.extname(src);
			const name = path.basename(src, extension);

			return `${name}.${format}`;
		},
		urlPath: postData.url,
	};

	EleventyImage(filePath, options);
	const metadata = EleventyImage.statsSync(filePath, options);

	let format = '';
	for (const key in metadata) {
		format = key;
	}

	let imageSrc = metadata[format][0];

	const imageProxyWidths = [480, 800, 1080, 1620, 2430, 3600]
		.filter((width) => width < imageSrc.width)
		.push(imageSrc.width);

	console.log(
		'[' + '\x1b[36m%s\x1b[0m',
		'11ty Image' + '\x1b[0m' + ']:',
		'Created featured image ',
		imageSrc.url,
	);

	const srcset = imageProxyWidths
		.map((width) => {
			return (
				imgProxy
					.builder()
					.width(width)
					.generateUrl(urlPrefix + imageSrc.url) +
				' ' +
				width +
				'w '
			);
		})
		.join(', ');

	const sourceElement = !process.env.HOST.includes('localhost')
		? `<source type="${imageSrc.sourceType}" srcset="${srcset}" sizes="${sizes}">`
		: '';

	return `<figure class="image ${style}"><picture>
        		${sourceElement}
				<img
					src="${urlPrefix + imageSrc.url}"
					width="${imageSrc.width}"
					height="${imageSrc.height}"
					alt=""
					loading="eager">
        </picture></figure>`;
}
