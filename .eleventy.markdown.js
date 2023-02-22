const slugify = require('slugify');
const markdownItAnchor = require('markdown-it-anchor');
const markdownIt = require('markdown-it');
const markdownItTasklist = require('markdown-it-task-lists');
const markdownItSup = require('markdown-it-sup');
const markdownItAbbr = require('markdown-it-abbr');
const markdownItKbd = require('markdown-it-kbd');
const markdownItFootnotes = require('markdown-it-footnote');
const markdownItTables = require('markdown-it-multimd-table');
const markdownItContainer = require('markdown-it-container');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItImageFigures = require('markdown-it-image-figures');
const markdownItAnchorOptions = {
    level: [1, 2, 3, 4],
    slugify: (str) =>
        slugify(str, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        }),
    tabIndex: false,
    permalink: markdownItAnchor.permalink.headerLink(),
};

const scrollBlock = {
    validate: function (params) {
        return params.trim().match(/^scroll-block\s*(.*)$/);
    },

    render: function (tokens, idx) {
        const m = tokens[idx].info.trim().match(/^scroll-block\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            // opening tag
            return '<section class="scroll-block ' + m[1] + '">\n';

        } else {
            // closing tag
            return '</section>\n';
        }
    }
};

// Customize Markdown library and settings:
let markdown = markdownIt({
    html: true,
    breaks: true,
    linkify: true
})
    .use(markdownItTasklist, {
        enabled: false,
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
    .use(markdownItAnchor, markdownItAnchorOptions)
    .use(markdownItContainer, 'scroll-block', scrollBlock)
    .use(markdownItAttrs)
    .use(markdownItImageFigures, {
        lazy: true,
        async: true,
        copyAttrs: "class",
        dataType: true,
        figcaption: true
    });

markdown.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes" aria-labelledby="fotnoter">\n' +
    '<h2 class="separator-heading" id="fotnoter"><span>Fotnoter</span></h2>\n' +
    '<ol class="footnotes-list">\n'
);

module.exports = markdown;