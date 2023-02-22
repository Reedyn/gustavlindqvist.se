/* eslint-env node */
/* global exports */
const {src, dest, parallel, watch} = require('gulp');
const browsersync = require('browser-sync').create();
const reload = browsersync.reload;
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sassGlob = require('gulp-sass-glob');
const csscomb = require('gulp-csscomb');
const plumber = require('gulp-plumber');
const fs = require('fs');

function css() {
    'use strict';
    return src('src/_sass/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(rename({
            basename: 'gustavlindqvist'
        }))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer({grid: true}))
        .pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(dest('src/assets/stylesheets/'))
        .pipe(minifycss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest('src/assets/stylesheets/'))
}

function serve() {
    'use strict';
    watch('src_/sass/**/*.scss', css);
}

exports.css = css;
exports.serve = serve;
exports['default'] = parallel(css, serve);
