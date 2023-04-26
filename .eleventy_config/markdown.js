const markdownIt = require('markdown-it');
const markdownItTasklist = require('markdown-it-task-lists');
const markdownItSup = require('markdown-it-sup');
const markdownItAbbr = require('markdown-it-abbr');
const markdownItKbd = require('markdown-it-kbd');
const markdownItFootnotes = require('markdown-it-footnote');
const markdownItTables = require('markdown-it-multimd-table');
const markdownItAttrs = require('markdown-it-attrs');
const markdownIt11tyImages = require('./markdown/image');
const markdownItGallery = require('./markdown/gallery');

// Customize Markdown library and settings:
let markdown = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    langPrefix: 'language-',
})
    .use(markdownItTasklist, {
        enabled: true,
        label: true,
        labelAfter: false
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
    .use(require('markdown-it-container'),'note',{
        render: function (tokens, idx) {
            const token = tokens[idx];
            if (token.nesting === 1) {
                // opening tag
                const classes = (token.attrGet('class')) ? ' ' + token.attrGet('class') : '';
                return `<aside class="note${classes}">`;

            } else {
                // closing tag
                return '</aside>';
            }
        }
    })
    .use(require('markdown-it-container'),'gallery', markdownItGallery.gallery)
    .use(require('markdown-it-container'),'row',markdownItGallery.row);



markdown.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes" aria-labelledby="fotnoter">\n' +
    '<h2 class="separator-heading" id="fotnoter"><span>Fotnoter</span></h2>\n' +
    '<ol class="footnotes-list">\n'
);

markdown.renderer.rules.image = markdownIt11tyImages;

module.exports = markdown;