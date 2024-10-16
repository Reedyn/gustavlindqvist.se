import markdownIt from 'markdown-it';
import markdownItTasklist from 'markdown-it-task-lists';
import markdownItSup from 'markdown-it-sup';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItKbd from 'markdown-it-kbd';
import markdownItFootnotes from 'markdown-it-footnote';
import markdownItTables from 'markdown-it-multimd-table';
import markdownItAttrs from 'markdown-it-attrs';
import markdownIt11tyImages from './markdown/image.mjs';
import markdownItGallery from './markdown/gallery.mjs';
import markdownItContainer from 'markdown-it-container';

// Customize Markdown library and settings:
const markdown = markdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true,
	langPrefix: 'language-',
})
	.use(markdownItTasklist, {
		enabled: true,
		label: true,
		labelAfter: false,
	})
	.use(markdownItSup)
	.use(markdownItAbbr)
	.use(markdownItKbd)
	.use(markdownItFootnotes)
	.use(markdownItTables, {
		multiline: false,
		rowspan: true,
		headerless: true,
	})
	.use(markdownItAttrs)
	.use(markdownItContainer, 'note', {
		render: function (tokens, idx) {
			const token = tokens[idx];
			if (token.nesting === 1) {
				// opening tag
				const classes = token.attrGet('class') ? ' ' + token.attrGet('class') : '';
				return `<aside class="note${classes}">`;
			} else {
				// closing tag
				return '</aside>';
			}
		},
	})
	.use(markdownItContainer, 'gallery', markdownItGallery.gallery)
	.use(markdownItContainer, 'row', markdownItGallery.row);

markdown.renderer.rules.footnote_block_open = () =>
	'<section class="footnotes" aria-labelledby="fotnoter">\n' +
	'<h2 class="separator-heading" id="fotnoter"><span>Fotnoter</span></h2>\n' +
	'<ol class="footnotes-list">\n';

markdown.renderer.rules.image = markdownIt11tyImages;

export default markdown;
