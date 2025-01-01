/* eslint-disable no-console */
import EleventyImage from '@11ty/eleventy-img';
import markdownIt from 'markdown-it';
import path from 'node:path';
import ImgProxy from 'imgproxy';

let markdown = markdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true,
	langPrefix: 'language-',
});

export default function (tokens, index, options, env) {
	const token = tokens[index];
	const source = decodeURI(token.attrGet('src'));

	const imgProxy = new ImgProxy({
		baseUrl: process.env.IMGPROXY_HOST,
		key: process.env.IMGPROXY_KEY,
		salt: process.env.IMGPROXY_SALT,
		encode: true,
	});
	const attributes = {
		alt: token.content,
		loading: 'lazy',
		decoding: 'async',
	};
	const style = token.attrGet('class') ? token.attrGet('class') : '';
	const classString = ` class="image ${style}"`;
	const caption = token.attrGet('title');
	const attributesString =
		' ' +
		Object.keys(attributes)
			.map((key) => `${key}="${attributes[key]}"`)
			.join(' ');

	// Where is the source file located?
	let sourceLocation;
	if (source === '') {
		sourceLocation = 'null';
	} else if (source.startsWith('/')) {
		sourceLocation = 'relative-to-root';
	} else if (source.startsWith('http')) {
		sourceLocation = 'external';
	} else if (!env.page.outputPath) {
		sourceLocation = 'null';
	} else {
		sourceLocation = 'local';
	}

	switch (sourceLocation) {
		case 'null':
			if (caption) {
				return `<figure${classString}><img width="800" height="300"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
			}
			return `<figure${classString}><img width="800" height="300"${attributesString}></figure>`;

		case 'relative-to-root':
			if (caption) {
				return `<figure${classString}><img src="${source}"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
			}
			return `<img src="${source}"${classString}${attributesString}>`;

		case 'external':
			if (caption) {
				return `<figure${classString}><img src="${source}"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
			}
			return `<img src="${source}"${classString}${attributesString}>`;

		case 'local': {
			const documentPath = env.page.filePathStem;
			const outputPath = env.page.outputPath
				.substring(0, env.page.outputPath.lastIndexOf('/')) // Remove document from path
				.replace(/^\//, ''); // remove first slash

			// If the image is absolute path or external
			const folderPath =
				'./src/' +
				documentPath
					.substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
					.replace(/^\//, ''); // remove first slash

			const widths = [480, 800, 1080, 1620, 2430];
			const options = {
				widths: [null],
				formats: [null],
				outputDir: outputPath,
				urlPath: '',
				filenameFormat: function (id, src, width, format) {
					const extension = path.extname(src);
					const name = path.basename(src, extension);

					return `${name}.${format}`;
				},
			};

			const filePath = folderPath + source;

			EleventyImage(filePath, options);
			const metadata = EleventyImage.statsSync(filePath, options);
			console.log(
				'[' + '\x1b[36m%s\x1b[0m',
				'11ty Image' + '\x1b[0m' + ']:',
				'Create image element for ',
				filePath,
			);

			let format = '';
			for (const key in metadata) {
				format = key;
			}

			let imageSrc = metadata[format][0];

			let inlineStyling =
				style === '-inline' ? ` style="flex: ${imageSrc.width / imageSrc.height}"` : '';

			// Base sizes on the layout changes.
			let sizes = '(max-width: 50rem) 100vw, 50rem';
			switch (style) {
				case '-full':
					sizes = '100vw';
					break;
				case '-wide':
					sizes = '(max-width: 80rem) 100vw, 80rem';
					break;
				case '-inline':
					// Approximation of the size in the UI, not perfect since the siblings width isn't taken into account
					sizes = `(max-width: 40em) 100vw, (max-width: 65em) ${(imageSrc.width / imageSrc.height) * 40}vw, ${(imageSrc.width / imageSrc.height) * 40}rem`;
					break;
			}

			const captionElement = caption
				? `<figcaption>${markdown.render(caption)}</figcaption>`
				: '';
			console.log(
				imgProxy
					.builder()
					.width(300)
					.generateUrl(
						'https://gustavlindqvist.se/2024/10/09/skolgardskarta-till-talavidskolan/3Rx9ljY8jB-1589.jpeg',
					),
			);

			const srcset = widths
				.map((width) => {
					return (
						imgProxy.builder().width(width).generateUrl(imageSrc.url) +
						' ' +
						width +
						'w'
					);
				})
				.join(', ');

			const sourceElement = !process.env.HOST.includes('localhost')
				? `<source type="${imageSrc.sourceType}" srcset="${srcset}" sizes="${sizes}">`
				: '';

			return `<figure class="image ${style}"${inlineStyling}><picture>${sourceElement}
			<img
            src="${imageSrc.url}"
            width="${imageSrc.width}"
            height="${imageSrc.height}"
            ${attributesString}></picture>${captionElement}</figure>`;
		}
	}
}
