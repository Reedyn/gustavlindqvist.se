const EleventyImage = require("@11ty/eleventy-img");
const markdownIt = require('markdown-it');

let markdown = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    langPrefix: 'language-',
});

module.exports = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const source = decodeURI(token.attrGet('src'));
    const attributes = {
        alt: token.content,
        loading: 'lazy',
        decoding: 'async'
    };
    const style = (token.attrGet('class')) ? token.attrGet('class') : '';
    const classString = ` class="image ${style}"`;

    const caption = token.attrGet('title');

    const attributesString = ' ' + Object.keys(attributes).map(key => `${key}="${attributes[key]}"`).join(" ");

    if (source === '') {
        if (caption) {
            return `<figure${classString}><img width="800" height="300"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
        }
        return `<figure${classString}><img width="800" height="300"${attributesString}></figure>`;
    } else if (source.startsWith('/') || source.startsWith('http')) { // If the source is absolute or external
        if (caption) {
            return `<figure${classString}><img src="${source}"${attributesString}><figcaption><em>${markdown.render(caption)}</em></figcaption></figure>`;
        }
        return `<img src="${source}"${classString}${attributesString}>`;
    } else if (!env.page.outputPath) {
        return `<figure${classString}><img width="800" height="300"${attributesString}></figure>`;
    } else { // If relative, local image
        const documentPath = env.page.filePathStem;
        const outputPath = env.page.outputPath
            .substring(0, env.page.outputPath.lastIndexOf('/')) // Remove document from path
            .replace(/^\//, ''); // remove first slash

        // If the image is absolute path or external
        const folderPath = './src/' + documentPath
            .substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
            .replace(/^\//, ''); // remove first slash

        const options = {
            widths: [480, 800, 1080, 1620, 2430, null],
            formats: [null],
            outputDir: outputPath,
            urlPath: '',
            sharpGifOptions: {
                animated: true
            },
            sharpJpegOptions: {
                progressive: true,
                optimiseScans: true
            }
        };

        const filePath = folderPath + source;

        EleventyImage(filePath, options);
        const metadata = EleventyImage.statsSync(filePath, options);
        console.log('[' + '\x1b[36m%s\x1b[0m', '11ty Image' + '\x1b[0m' + ']:', 'Created responsive images for', filePath);

        let format = '';
        for (const key in metadata) {
            format = key;
        }

        let lowsrc = (metadata[format].length > 1) ? metadata[format][1] : metadata[format][0];
        let highsrc = metadata[format][metadata[format].length - 1];

        let inlineStyling = (style === '-inline') ? ` style="flex: ${highsrc.width / highsrc.height}"` : '';

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

        const captionElement = (caption) ? `<figcaption>${markdown.render(caption)}</figcaption>` : '';

        return `<figure class="image ${style}"${inlineStyling}>
               <picture>
        ${Object.values(metadata).map(imageFormat => {
            return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(', ')}" sizes="${sizes}">`;
        }).join('\n')}
          <img
            src="${lowsrc.url}"
            width="${lowsrc.width}"
            height="${lowsrc.height}"
            ${attributesString}>
        </picture>${captionElement}</figure>`;
    }
};
