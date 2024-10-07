module.exports = {
	gallery: {
		minMarkerCount: 4,
		render: function (tokens, idx) {
			const token = tokens[idx];
			if (token.nesting === 1) {
				const classes = token.attrGet('class') ? ' ' + token.attrGet('class') : '';
				// opening tag
				return `<figure class="gallery${classes}">`;
			} else {
				// closing tag
				return '</figure>';
			}
		},
	},
	row: {
		render: function (tokens, idx) {
			const token = tokens[idx];
			if (token.nesting === 1) {
				// opening tag
				const classes = token.attrGet('class') ? ' ' + token.attrGet('class') : '';
				return `<figure class="gallery-row${classes}">`;
			} else {
				// closing tag
				return '</figure>';
			}
		},
	},
};
