const fs = require('fs');
const EleventyImage = require("@11ty/eleventy-img");
const markdown = require('./.eleventy.markdown');
const hashString = require('./.eleventy.functions').hashString;

module.exports = {
    pack: (pack) => {
        function prettyDigits (number) {
            return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
        }

        if (pack) {
            let outputString = `<section class="pack">`;
            outputString += `<ul class="pack__list">`;
            pack.contents.forEach((category) => {
                const color = (typeof category.color !== 'undefined' && category.color.length) ? category.color : '#808080';
                outputString += `<li class="pack__list-item -overview small">
                    <span class="pack__list-item__left"><svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${category.icon}.svg#icon"></use></svg></span><span class="pack__list-item__middle">${category.name}<span class="sr-only">:</span></span>
                    <span class="pack__list-item__right" style="padding-right: 0.3rem">${prettyDigits(category.total_weight)}g</span>
                    <div class="pack__list__bar" style="width: ${((category.total_weight / pack.total_weight) * 200).toFixed(3)}%; background: ${color};"></div>
                </li>`;
            });
            outputString += `</ul>`;
            outputString += `<ul class="statistics__list ${(pack.consumables_weight > 0) ? '-column-count-4' : ''}">
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">Total vikt<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.total_weight)}g</span>
                    </li>
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">Basvikt<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.base_weight)}g</span>
                    </li>
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">På kroppen<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.worn_weight)}g</span>
                    </li>`;
            if (pack.consumables_weight > 0) {
                outputString += `<li class="statistics__list-item">
                            <span class="statistics__list-item__label">Förbrukningsvaror<span class="sr-only">:</span></span>
                            <span class="statistics__list-item__value">${prettyDigits(pack.consumables_weight)}g</span>
                        </li>`;
            }
            outputString += `</ul>`;
            outputString += `<p><a href="https://www.packstack.io/pack/${pack.id}">Utrustningslistan ${pack.name} på Packstack</a></p>`;
            let equipmentString = ``;
            equipmentString += '<div id="equipment" class="pack__list-container -collapsed">';
            pack.contents.forEach((item_category) => {
                let packList = '';
                const color = (typeof item_category.color !== 'undefined' && item_category.color.length) ? item_category.color : '#ffffff';
                packList += `<ul class="pack__list">`;
                item_category.items.forEach((item) => {
                    const quantity = (typeof item.quantity !== 'undefined') ? item.quantity : 1;
                    let metaString = '';
                    if (typeof item.worn !== 'undefined' && item.worn) {
                        metaString = ` <span class="pack__list-item__bottom-right secondary"><svg class="icon" role="presentation" style="color: #5E35B1" aria-label="Buren" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/tshirt-crew.svg#icon"></use></svg></span>`;
                    } else if (typeof item.consumable !== 'undefined' && item.consumable) {
                        metaString = ` <span class="pack__list-item__bottom-right secondary">Förbrukningsvara</span>`;
                    }
                    packList += `<li class="pack__list-item"><span class="pack__list-item__left secondary">${quantity}st</span> <span class="pack__list-item__bottom secondary">${item.item.name}<span class="sr-only">.</span></span> <span class="pack__list-item__middle">${(typeof item.item.brand !== 'undefined' && item.item.brand !== null) ? item.item.brand.name : ''} <span class="bold">${(typeof item.item.product !== 'undefined' && item.item.product !== null) ? item.item.product.name : ''}</span><span class="sr-only">.</span></span> <span class="pack__list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
                });
                equipmentString += `<span class="pack__label">
                                        <svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${item_category.icon}.svg#icon"></use></svg>
                                        <span class="uppercase semibold">${item_category.name}</span>
                                        <span class="secondary">(${prettyDigits(item_category.total_weight)}g)</span>
                                        </span>`;
                equipmentString += packList;
                equipmentString += `</ul>`;
            });
            equipmentString += '<button id="visa-utrustning" class="Button pack__list-button">Visa all utrustning</button></div>';
            outputString += equipmentString;
            outputString += `</section>`;
            outputString += `<script>document.getElementById('visa-utrustning').addEventListener('click', (event) => { let container = document.getElementById('equipment'); container.classList.remove('-collapsed'); container.removeChild(event.target); });</script>`;
            outputString += `<script>const pack = ${JSON.stringify(pack)};</script>`;
            return outputString;
        }
        return '';
    },
    packStatistics: (pack) => {
        function prettyDigits (number) {
            return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
        }

        if (pack) {
            let outputString = `<section class="packStatistics">`;
            outputString += `<ul class="pack__list">`;
            pack.contents.forEach((category) => {
                const color = (typeof category.color !== 'undefined' && category.color.length) ? category.color : 'var(--color__text)';
                outputString += `<li class="pack__list-item -overview small">
                    <span class="pack__list-item__left"><svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${category.icon}.svg#icon"></use></svg></span><span class="pack__list-item__middle">${category.name}<span class="sr-only">:</span></span>
                    <span class="pack__list-item__right" style="padding-right: 0.3rem">${prettyDigits(category.total_weight)}g</span>
                    <div class="pack__list__bar" style="width: ${((category.total_weight / pack.total_weight) * 200).toFixed(3)}%; background: ${color};"></div>
                </li>`;
            });
            outputString += `</ul>`;
            outputString += `<ul class="statistics__list ${(pack.consumables_weight > 0) ? '-column-count-4' : ''}">
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">Total vikt<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.total_weight)}g</span>
                    </li>
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">Basvikt<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.base_weight)}g</span>
                    </li>
                    <li class="statistics__list-item">
                        <span class="statistics__list-item__label">På kroppen<span class="sr-only">:</span></span>
                        <span class="statistics__list-item__value">${prettyDigits(pack.worn_weight)}g</span>
                    </li>`;
            if (pack.consumables_weight > 0) {
                outputString += `<li class="statistics__list-item">
                            <span class="statistics__list-item__label">Förbrukningsvaror<span class="sr-only">:</span></span>
                            <span class="statistics__list-item__value">${prettyDigits(pack.consumables_weight)}g</span>
                        </li>`;
            }
            outputString += `</ul>`;
            outputString += `<p><a class="Button" href="https://www.packstack.io/pack/${pack.id}">Utrustningslistan ${pack.name} på Packstack</a></p>`;
            outputString += `</section>`;
            return outputString;
        }
        return '';
    },
    packInventory: (pack) => {
        function prettyDigits (number) {
            return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
        }

        if (pack) {
            let outputString = `<section class="packStatistics">`;
            let equipmentString = ``;
            equipmentString += '<div id="equipment" class="pack__list-container -collapsed">';
            pack.contents.forEach((item_category) => {
                let packList = '';
                const color = (typeof item_category.color !== 'undefined' && item_category.color.length) ? item_category.color : 'var(--color__text)';
                packList += `<ul class="pack__list">`;
                item_category.items.forEach((item) => {
                    const quantity = (typeof item.quantity !== 'undefined') ? item.quantity : 1;
                    let metaString = '';
                    if (typeof item.worn !== 'undefined' && item.worn) {
                        metaString = ` <span class="pack__list-item__bottom-right secondary"><svg class="icon" role="presentation" style="color: #5E35B1" aria-label="Buren" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/tshirt-crew.svg#icon"></use></svg></span>`;
                    } else if (typeof item.consumable !== 'undefined' && item.consumable) {
                        metaString = ` <span class="pack__list-item__bottom-right secondary">Förbrukningsvara</span>`;
                    }
                    if (typeof item.item.brand !== 'undefined' && item.item.brand !== null) {
                        packList += `<li class="pack__list-item"><span class="pack__list-item__left secondary">${quantity}st</span> <span class="pack__list-item__bottom secondary">${item.item.name}<span class="sr-only">.</span></span> <span class="pack__list-item__middle"><span class="light">${(typeof item.item.brand !== 'undefined' && item.item.brand !== null) ? item.item.brand.name : ''}</span> <span class="bold">${(typeof item.item.product !== 'undefined' && item.item.product !== null) ? item.item.product.name : ''}</span><span class="sr-only">.</span></span> <span class="pack__list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
                    } else {
                        packList += `<li class="pack__list-item"><span class="pack__list-item__left secondary">${quantity}st</span> <span class="pack__list-item__middle bold">${item.item.name}<span class="sr-only">.</span></span> <span class="pack__list-item__bottom secondary">${(item.item.notes) ? item.item.notes : ''}<span class="sr-only">.</span></span> <span class="pack__list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
                    }

                });
                equipmentString += `<span class="pack__label">
                                        <svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${item_category.icon}.svg#icon"></use></svg>
                                        <span class="uppercase semibold">${item_category.name}</span>
                                        <span class="secondary">(${prettyDigits(item_category.total_weight)}g)</span>
                                        </span>`;
                equipmentString += packList;
                equipmentString += `</ul>`;
            });
            equipmentString += '<button id="visa-utrustning" class="Button pack__list-button hidden@no-js">Visa all utrustning</button></div>';
            outputString += equipmentString;
            outputString += `</section>`;
            outputString += `<script>document.getElementById('visa-utrustning').addEventListener('click', (event) => { let container = document.getElementById('equipment'); container.classList.remove('-collapsed'); container.removeChild(event.target); });</script>`;
            outputString += `<script>const pack = ${JSON.stringify(pack)};</script>`;
            return outputString;
        }
        return '';
    },
    checksum: function (filename) {
        const fileContent = fs.readFileSync(filename, 'utf8');
        return hashString(fileContent);
    },
    image: async function (src, style, alt, caption = undefined) {
        if (typeof this.page.outputPath !== 'undefined' && typeof this.page.outputPath.lastIndexOf !== 'undefined') {
            let sizes = '100vw';
            const documentPath = this.page.filePathStem;
            const outputPath = this.page.outputPath
                .substring(0, this.page.outputPath.lastIndexOf('/')) // Remove document from path
                .replace(/^\//, ''); // remove first slash
            // If the image is absolute path or external
            const folderPath = './src/' + documentPath
                .substring(0, documentPath.lastIndexOf('/') + 1) // Remove document from path
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
                urlPath: ''
            };

            let metadata = await EleventyImage(src, options);
            console.log('[' + '\x1b[36m%s\x1b[0m', '11ty Image' + '\x1b[0m' + ']:', 'Created responsive images for', src);
            let format = '';
            for (const key in metadata) {
                format = key;
            }

            let lowsrc = (metadata[format].length > 1) ? metadata[format][1] : metadata[format][0];
            let highsrc = metadata[format][metadata[format].length - 1];
            let captionElement = (typeof caption !== 'undefined') ? `<figcaption>${markdown.render(caption)}</figcaption>` : '';
            let inlineStyling = (style === '-inline') ? ` style="flex: ${highsrc.width / highsrc.height}"` : '';
            sizes = (style === '-inline') ? `${(highsrc.width / highsrc.height) * 30}w` : sizes;
            return `<figure class="image ${style}"${inlineStyling}>
                   <picture>
            ${Object.values(metadata).map(imageFormat => {
                return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(', ')}" sizes="${sizes}">`;
            }).join('\n')}
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
    }
};