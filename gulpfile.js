const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

async function loadAutoprefixer() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;
  return autoprefixer;
}

const paths = {
  scss: './src/scss/**/*.scss',
  css: './dist/css',
  html: './src/*.html',
};

async function styles() {
  const autoprefixer = await loadAutoprefixer();
  
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

function reload(done) {
  browserSync.reload();
  done();
}

function serve() {
  browserSync.init({
    server: './src',
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.html, reload);
}

exports.styles = styles;
exports.serve = gulp.series(styles, serve);
