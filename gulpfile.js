const gulp = require('gulp'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssbeautify = require('gulp-cssbeautify'),
  cssminify = require('gulp-clean-css'),
  htmlminify = require('gulp-htmlmin'),
  resizer = require('gulp-images-resizer'),
  image = require('gulp-image'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  browserify = require('gulp-browserify'),
  eslint = require('gulp-eslint'),
  jsminify = require('gulp-minify');


gulp.task('browser-sync', function() {
  return browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});


gulp.task('resize', function(cb) {
  return (gulp.src('img/*')
    .pipe(resizer({
      width: 400,
      crop: false,
      upscale: false
    }))
    .pipe(rename({
      suffix: '_small'
    }))
    .pipe(gulp.dest('img'), cb));
});

gulp.task('image', ['resize'], function() {
  console.log('>---Starting Images function---<');
  gulp.src(['img/*_small.jpg'])
    .pipe(image({
      //only for jpeg stuff
      jpegRecompress: ['--strip', '--quality', 'high', '--min', 9, '--max', 100],
      mozjpeg: true,
      concurrent: 10,
    }))
    .pipe(gulp.dest('img'));
});

// creating the task SASS
// and copy into dist
gulp.task('sass', function() {
  gulp.src(['sass/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssminify())
     .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css/'));
});

// beautify the code separately if needed
gulp.task('beautify', function() {
  return gulp.src('css/styles.css')
    .pipe(cssbeautify())
    .pipe(gulp.dest('css/'));
});

// copy minified html into dist
gulp.task('copyHTML', function() {
  return gulp.src('*.html')
  .pipe(htmlminify({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));

});

// copy imgs into dist
gulp.task('copyIMG', function() {
  return gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));

});

//minify JS
gulp.task('minifyJS', function() {
  gulp.src(['js/*.js'])
    .pipe(jsminify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('dist/js/'));
});

// minify app.js and service worker
gulp.task('minifyJS--SW', function() {
  gulp.src(['app.js', 'sw.js'])
    .pipe(jsminify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('dist/'));
});

//transpiling for idb promised library
// did not work appropriately
// utilize if necesary
gulp.task('scripts', function() {
  gulp.src(['js/db.js'])
    .pipe(babel({
      presets: ['es2015']
    })).pipe(browserify())
    .pipe(gulp.dest('js/db-fin'));
});

// utilize if necesary
gulp.task('eslint', function() {
  return gulp.src(['js/dbhelper-prom.js', 'js/main-prom.js', 'js/restaurant_info-prom.js', 'sw.js', 'app.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
  gulp.watch(['*.html', '*/*.css', '*/*.js', '*.*']).on('change', reload);
  gulp.watch(['sass/*/*.scss', 'sass/*.scss'], ['sass']);
  gulp.watch(['js/*.js'], ['minifyJS']);
  gulp.watch(['app.js', 'sw.js'], ['minifyJS--SW']);
  gulp.watch(['*.html'], ['copyHTML']);
  // utilize if necesary
  /* gulp.watch(['js/dbhelper-prom.js', 'js/main-prom.js', 'js/restaurant_info-prom.js', 'sw.js', 'app.js'],  ['eslint']); */
});


gulp.task('default', ['browser-sync', 'copyHTML', 'copyIMG', 'minifyJS', 'minifyJS--SW', 'watch']);