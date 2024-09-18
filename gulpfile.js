const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

// Динамічний імпорт autoprefixer
async function loadAutoprefixer() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;
  return autoprefixer;
}

// Шляхи до файлів
const paths = {
  scss: './src/scss/**/*.scss',
  css: './dist/css',
  html: './src/*.html',
};

// Завдання для компіляції SCSS у CSS
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

// Завдання для перезавантаження браузера
function reload(done) {
  browserSync.reload();
  done();
}

// Налаштування BrowserSync
function serve() {
  browserSync.init({
    server: './src',
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.html, reload);
}

// Створення основних завдань
exports.styles = styles;
exports.serve = gulp.series(styles, serve);
