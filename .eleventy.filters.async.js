const Image = require('@11ty/eleventy-img');

module.exports = {
    featuredImageFilter: (src, sizes, style, postData, callback) => {
        if ((typeof src === 'undefined' || !src) && postData.outputPath) {
            callback(null, ``);
            return null;
        }
        const documentPath = postData.filePathStem;
        src = src.replace(/^\//, '');

        let outputPath = '';
        try {
            outputPath = postData.outputPath
                .substring(0, postData.outputPath.lastIndexOf("/")) // Remove document from path
                .replace(/^\//, ''); // remove first slash
            // If the image is absolute path or external
        } catch (error) {
            outputPath = '';
        }

        const folderPath = documentPath
            .substring(0, documentPath.lastIndexOf("/") + 1) // Remove document from path
            .replace(/^\//, ''); // remove first slash

        // If the image is absolute path or external
        if (src.startsWith('assets') || src.startsWith('http')) {

        } else { // Otherwise assume the file is relative to the document folder
            src = folderPath + src;
        }

        const options = {
            widths: [500, 900, 1500, 2500, null],
            formats: [null],
            outputDir: outputPath,
            urlPath: postData.url
        };
        Image(src, options).then((metadata) => {
            let format = '';
            for (const key in metadata) {
                format = key;
            }

            let lowsrc = (metadata[format].length > 1) ? metadata[format][1] : metadata[format][0];

            let imageSrc = metadata[format][0];
            console.log('[' + '\x1b[36m%s\x1b[0m', '11ty Image' + '\x1b[0m' + ']:', 'Created featured image ', imageSrc.url);
            callback(null, `<figure class="image ${style}">
                   <picture>
            ${Object.values(metadata).map(imageFormat => {
                return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
            }).join("\n")}
              <img
                src="${lowsrc.url}"
                width="${lowsrc.width}"
                height="${lowsrc.height}"
                alt=""
                loading="lazy"
                decoding="async">
            </picture></figure>`);
        }).catch(message => {
            console.error('[' + '\x1b[36m%s\x1b[0m', '11ty Image' + '\x1b[0m' + ']:', message)
        });
    }
};