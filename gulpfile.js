var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var mainBowerFiles = require('main-bower-files');
var print = require('gulp-print');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');

gulp.task('css', function () {
    gulp.src(['src/css/*.css'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(gulp.dest('docs/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('docs/css'))
        .pipe(reload({stream: true}))
});

gulp.task('js', function () {
    gulp.src(['src/js/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(gulp.dest('docs/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('docs/js'))
        .pipe(reload({stream: true}))
});

gulp.task('html', function () {
    gulp.src(['src/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('docs/'))
        .pipe(reload({stream: true}))
});

gulp.task('image', function () {
    gulp.src(['src/img/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('docs/img'))
        .pipe(reload({stream: true}))
});

gulp.task('vendor', function () {
    var bowerFiles = mainBowerFiles();
    var jsFilter = gulpFilter('**/*.js', {restore: true});
    var cssFilter = gulpFilter('**/*.css', {restore: true});
    var imgFilter = gulpFilter(['**/*.gif', '**/*.png', '**/*.jpg'], {restore: true});

    gulp.src(bowerFiles)
        .pipe(print())
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('docs/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('docs/js'))
        .pipe(jsFilter.restore);

    gulp.src(bowerFiles)
        .pipe(cssFilter)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('docs/css'))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('docs/css'))
        .pipe(cssFilter.restore);

    return gulp.src(bowerFiles)
        .pipe(imgFilter)
        .pipe(gulp.dest('docs/img'));
});

gulp.task('watch', function () {
    browserSync.init({
        server: "./docs"
    });
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/img/*', ['image']);
});

gulp.task('default', ['js', 'css', 'html', 'image', 'vendor', 'watch']);
