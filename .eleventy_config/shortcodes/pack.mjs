export default {
	pack: (pack) => {
		function prettyDigits(number) {
			return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		}

		if (pack) {
			let outputString = `<section class="pack" data-name="${pack.name}" data-id="${pack.packId}">`;
			pack.contents.forEach((category) => {
				const color =
					typeof category.color !== 'undefined' && category.color.length
						? category.color
						: 'oklch(60% 0 0)';
				outputString += `<details class="category"><summary class="category-summary">
                    <span class="category-summary__left"><svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${category.icon}.svg#icon"></use></svg></span><span class="category-summary__middle">${category.name}<span class="sr-only">:</span></span>
                    <span class="category-summary__right" style="padding-right: 0.3rem">${prettyDigits(category.total_weight)}g</span>
                    <div class="category-summary__bar" style="width: ${((category.total_weight / pack.total_weight) * 200).toFixed(3)}%; background: ${color};"></div></summary>`;
				let packList = '';

				packList += '<ul class="list">';
				category.items.forEach((item) => {
					const quantity = typeof item.quantity !== 'undefined' ? item.quantity : 1;
					let metaString = '';
					if (typeof item.worn !== 'undefined' && item.worn) {
						metaString =
							' <span class="list-item__bottom-right secondary"><svg class="icon" role="presentation" style="color: #5E35B1" aria-label="Buren" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/tshirt-crew.svg#icon"></use></svg></span>';
					} else if (typeof item.consumable !== 'undefined' && item.consumable) {
						metaString =
							' <span class="list-item__bottom-right secondary">Förbrukningsvara</span>';
					}
					if (typeof item.item.brand !== 'undefined' && item.item.brand !== null) {
						packList += `<li class="list-item"><span class="list-item__left secondary">${quantity}st</span> <span class="list-item__bottom secondary">${item.item.name}<span class="sr-only">.</span></span> <span class="list-item__middle"><span class="light">${typeof item.item.brand !== 'undefined' && item.item.brand !== null ? item.item.brand.name : ''}</span> <span class="bold">${typeof item.item.product !== 'undefined' && item.item.product !== null ? item.item.product.name : ''}${typeof item.item.product_variant !== 'undefined' && item.item.product_variant !== null ? ' ' + item.item.product_variant.name : ''}</span><span class="sr-only">.</span></span> <span class="list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
					} else {
						packList += `<li class="list-item"><span class="list-item__left secondary">${quantity}st</span> <span class="list-item__middle bold">${item.item.name}<span class="sr-only">.</span></span> <span class="list-item__bottom secondary">${item.item.notes ? item.item.notes : ''}<span class="sr-only">.</span></span> <span class="list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
					}
				});
				packList += '</ul>';
				outputString += packList;
				outputString += '</details>';
			});
			outputString += `<ul class="statistics-list ${pack.consumables_weight > 0 ? '-column-count-4' : ''}">
                    <li class="list-item">
                        <span class="item-label">Total vikt<span class="sr-only">:</span></span>
                        <span class="item-value">${prettyDigits(pack.total_weight)}g</span>
                    </li>
                    <li class="list-item">
                        <span class="item-label">Basvikt<span class="sr-only">:</span></span>
                        <span class="item-value">${prettyDigits(pack.base_weight)}g</span>
                    </li>
                    <li class="list-item">
                        <span class="item-label">På kroppen<span class="sr-only">:</span></span>
                        <span class="item-value">${prettyDigits(pack.worn_weight)}g</span>
                    </li>`;
			if (pack.consumables_weight > 0) {
				outputString += `<li class="list-item">
                            <span class="item-label">Förbrukningsvaror<span class="sr-only">:</span></span>
                            <span class="item-value">${prettyDigits(pack.consumables_weight)}g</span>
                        </li>`;
			}
			outputString += '</ul>';
			outputString += '</section>';
			return outputString;
		}
		return '';
	},
	packInventory: (pack) => {
		function prettyDigits(number) {
			return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
		}

		if (pack) {
			let outputString = '<section class="pack">';
			let equipmentString = '';
			equipmentString += '<div class="list-container equipment -collapsed">';
			pack.contents.forEach((item_category) => {
				let packList = '';
				const color =
					typeof item_category.color !== 'undefined' && item_category.color.length
						? item_category.color
						: 'var(--color__text)';
				packList += '<ul class="list">';
				item_category.items.forEach((item) => {
					const quantity = typeof item.quantity !== 'undefined' ? item.quantity : 1;
					let metaString = '';
					if (typeof item.worn !== 'undefined' && item.worn) {
						metaString =
							' <span class="list-item__bottom-right secondary"><svg class="icon" role="presentation" style="color: #5E35B1" aria-label="Buren" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/tshirt-crew.svg#icon"></use></svg></span>';
					} else if (typeof item.consumable !== 'undefined' && item.consumable) {
						metaString =
							' <span class="list-item__bottom-right secondary">Förbrukningsvara</span>';
					}
					if (typeof item.item.brand !== 'undefined' && item.item.brand !== null) {
						packList += `<li class="list-item"><span class="list-item__left secondary">${quantity}st</span> <span class="list-item__bottom secondary">${item.item.name}<span class="sr-only">.</span></span> <span class="list-item__middle"><span class="light">${typeof item.item.brand !== 'undefined' && item.item.brand !== null ? item.item.brand.name : ''}</span> <span class="bold">${typeof item.item.product !== 'undefined' && item.item.product !== null ? item.item.product.name : ''}${typeof item.item.product_variant !== 'undefined' && item.item.product_variant !== null ? ' ' + item.item.product_variant.name : ''}</span><span class="sr-only">.</span></span> <span class="list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
					} else {
						packList += `<li class="list-item"><span class="list-item__left secondary">${quantity}st</span> <span class="list-item__middle bold">${item.item.name}<span class="sr-only">.</span></span> <span class="list-item__bottom secondary">${item.item.notes ? item.item.notes : ''}<span class="sr-only">.</span></span> <span class="list-item__right">${prettyDigits(item.item.weight * quantity)}g</span>${metaString}</li>`;
					}
				});
				equipmentString += `<span class="label">
                                        <svg class="icon -large" role="presentation" style="color: ${color}" aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><use xmlns:xlink="http://www.w3.org/1999/xlink" href="/assets/icons/${item_category.icon}.svg#icon"></use></svg>
                                        <span class="uppercase semibold">${item_category.name}</span>
                                        <span class="secondary">(${prettyDigits(item_category.total_weight)}g)</span>
                                        </span>`;
				equipmentString += packList;
				equipmentString += '</ul>';
			});
			equipmentString +=
				'<button class="button list-button list-button__show-inventory hidden@no-js">Visa all utrustning</button></div>';
			outputString += equipmentString;
			outputString += '</section>';
			return outputString;
		}
		return '';
	},
};
