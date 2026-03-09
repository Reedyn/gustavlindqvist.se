export default {
	gallery: {
		minMarkerCount: 4,
		render: function (tokens, idx) {
			const token = tokens[idx];
			if (token.nesting === 1) {
				const classes = token.attrGet('class') ? ' ' + token.attrGet('class') : '';
				// opening tag
				return `<figure class="kg-card kg-gallery-card kg-width-wide${classes}"><div class="kg-gallery-container">`;
			} else {
				// closing tag
				return '</div></figure>';
			}
		},
	},
	row: {
		render: function (tokens, idx) {
			const token = tokens[idx];
			if (token.nesting === 1) {
				// opening tag
				const classes = token.attrGet('class') ? ' ' + token.attrGet('class') : '';
				return `<div class="kg-gallery-row${classes}">`;
			} else {
				// closing tag
				return '</div>';
			}
		},
	},
};
