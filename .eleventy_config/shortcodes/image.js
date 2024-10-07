const EleventyImage = require('@11ty/eleventy-img');
const markdown = require('../markdown');

module.exports = async function (src, style, alt, caption = undefined) {
	if (typeof this.page.outputPath !== 'undefined' && typeof this.page.outputPath.lastIndexOf !== 'undefined') {
		const documentPath = this.page.filePathStem;
		const outputPath = this.page.outputPath
			.substring(0, this.page.outputPath.lastIndexOf('/')) // Remove document from path
			.replace(/^\//, ''); // remove first slash

		// If the image is absolute path or external
		const folderPath =
			'./src/' +
			documentPath
				.substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
				.replace(/^\//, ''); // remove first slash

		// If the image is absolute path or external
		if (src.startsWith('/assets')) {
			src = 'src' + src;
		} else if (src.startsWith('http')) {
			// src = src
		} else {
			// Otherwise assume the file is relative to the document folder
			src = folderPath + src;
		}

		const options = {
			widths: [480, 720, 1080, 1620, 2430, null],
			formats: [null],
			outputDir: outputPath,
			urlPath: '',
			sharpGifOptions: {
				animated: true,
			},
			sharpJpegOptions: {
				progressive: true,
				optimiseScans: true,
			},
		};

		let metadata = await EleventyImage(src, options);

		console.log('[' + '\x1b[36m%s\x1b[0m', '11ty Image' + '\x1b[0m' + ']:', 'Created responsive images for', src);

		let format = '';
		for (const key in metadata) {
			format = key;
		}

		let lowsrc = metadata[format].length > 1 ? metadata[format][1] : metadata[format][0];
		let highsrc = metadata[format][metadata[format].length - 1];

		let captionElement =
			typeof caption !== 'undefined' ? `<figcaption>${markdown.render(caption)}</figcaption>` : '';

		let inlineStyling = style === '-inline' ? ` style="flex: ${highsrc.width / highsrc.height}"` : '';

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
				sizes = `(max-width: 40em) 100vw, (max-width: 65em) ${(highsrc.width / highsrc.height) * 40}vw, ${(highsrc.width / highsrc.height) * 40}rem`;
				break;
		}
		return `<figure class="image ${style}"${inlineStyling}>
                   <picture>
            ${Object.values(metadata)
				.map((imageFormat) => {
					return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map((entry) => entry.srcset).join(', ')}" sizes="${sizes}">`;
				})
				.join('\n')}
              <img
                src="${lowsrc.url}"
                width="${lowsrc.width}"
                height="${lowsrc.height}"
                alt="${alt}"
                loading="lazy"
                decoding="async">
            </picture>${captionElement}</figure>`;
	}
	return false;
};
