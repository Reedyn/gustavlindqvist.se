const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sassGlob = require('gulp-sass-glob');
const csscomb = require('gulp-csscomb');
const plumber = require('gulp-plumber');

function css() {
	'use strict';
	return src('src/_sass/main.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(
			rename({
				basename: 'gustavlindqvist',
			}),
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({ grid: true }))
		.pipe(csscomb())
		.pipe(dest('src/assets/stylesheets/'))
		.pipe(minifycss())
		.pipe(sourcemaps.write('/'))
		.pipe(dest('src/assets/stylesheets/'));
}

function serve() {
	'use strict';
	watch('src/_sass/**/*.scss', css);
}

exports.css = css;
exports.serve = serve;
exports['default'] = parallel(css, serve);
