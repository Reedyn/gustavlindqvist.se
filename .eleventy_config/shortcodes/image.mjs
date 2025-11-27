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

export default function (src, style, alt, sizes, caption = undefined) {

	// Where is the source file located?
	let sourceLocation;
	if (src === '') {
		sourceLocation = 'null';
	} else if (src.startsWith('/')) {
		sourceLocation = 'local';
	} else {
		sourceLocation = 'external';
	}

	const host = process.env.HOST;
	const attributes = {
		alt: alt,
		loading: 'lazy',
		decoding: 'async',
	};
	const classString = ` class="image ${style}"`;

	const attributesString =
		' ' +
		Object.keys(attributes)
			.map((key) => `${key}="${attributes[key]}"`)
			.join(' ');

	switch (sourceLocation) {
		case 'null':
			if (caption) {
				return `<figure${classString}><img width="800" height="300"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
			}
			return `<figure${classString}><img width="800" height="300"${attributesString}></figure>`;

		case 'external':
			if (caption) {
				return `<figure${classString}><img src="${src}"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
			}
			return `<img src="${src}"${classString}${attributesString}>`;

		case 'local': {
			const filePath = './src' + src;
			const imgProxy = new ImgProxy({
				baseUrl: process.env.IMGPROXY_HOST,
				key: process.env.IMGPROXY_KEY,
				salt: process.env.IMGPROXY_SALT,
				encode: true,
			});

			EleventyImage(filePath);
			const metadata = EleventyImage.statsSync(filePath);
			console.log(
				'[' + '\x1b[36m%s\x1b[0m',
				'Image Shortcode' + '\x1b[0m' + ']:',
				'Create image element for ',
				filePath,
			);

			let format = '';
			for (const key in metadata) {
				format = key;
			}

			let imageSrc = metadata[format][0];
			const imgProxyWidths = [480, 800, 1080, 1620, 2430, 3600].filter(
				(width) => width < imageSrc.width,
			);
			imgProxyWidths.push(imageSrc.width);
			imgProxyWidths.sort().reverse();

			const captionElement = caption
				? `<figcaption>${markdown.render(caption)}</figcaption>`
				: '';

			const srcset = imgProxyWidths
				.map((width) => {
					return (
						imgProxy
							.builder()
							.width(width)
							.generateUrl(host + src) +
						' ' +
						width +
						'w'
					);
				})
				.join(', ');

			const sourceElement = host.includes('localhost')
				? `<source type="${imageSrc.sourceType}" srcset="${srcset}" sizes="${sizes}">`
				: '';

			return `<figure class="image ${style}"><picture>${sourceElement}
			<img
            src="${host + src}"
            width="${imageSrc.width}"
            height="${imageSrc.height}"
            ${attributesString}></picture>${captionElement}</figure>`;
		}
	}
}
