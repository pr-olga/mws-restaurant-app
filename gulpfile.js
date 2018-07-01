const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssbeautify = require('gulp-cssbeautify'),
    resizer = require('gulp-images-resizer'),
    image = require('gulp-image'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');

gulp.task('resize', function (cb) {
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

gulp.task('image', function () {
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


gulp.task('browser-sync', function () {
    return browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// creating the task SASS
// Compile sass into readable .css
gulp.task('sass', function () {
    gulp.src(['sass/*.scss'])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('css/'));
});

// beatify the code separately if needed
gulp.task('beutify',  function() {
    return gulp.src('css/styles.css')
        .pipe(cssbeautify())
        .pipe(gulp.dest('css/style.css'));
});

gulp.task('watch', function () {
    gulp.watch(["*.html", "*/*.css", "*/*.js", "*.*"]).on('change', reload);
    gulp.watch(['sass/*/*.scss', 'sass/*.scss'],  ['sass']);
});

gulp.task('default', ['browser-sync', 'watch']);