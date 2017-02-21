const gulp = require('gulp');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

const path = {
    html: ['*.html', '_includes/*.html', '_layouts/*.html'],
    scss: 'scss/**/*.scss'
};

gulp.task('jekyll:build', ['sass', 'sass-lib'], function(done) {
    exec('jekyll build', function(error, stdout, stderr) {
        if(error) {
            console.log(`exec error ${error}`);
            return;
        }
        console.log(`exec stdout ${stdout}`);
        console.log(`exec stderr ${stderr}`);
        done();
    });
});

gulp.task('browser-sync', ['jekyll:build'], function(){
    bs.init({
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('sass', function(){
    return gulp.src('scss/main.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('_site/assets/styles/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('sass-lib', function(){
    return gulp.src('scss/lib.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('_site/assets/styles/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('jekyll:rebuild', ['jekyll:build'], function() {
    bs.reload();
});

gulp.task('watch', function() {
    gulp.watch(path.html, ['jekyll:rebuild']);
    gulp.watch(path.scss, ['sass', 'sass-lib']);
});

gulp.task('serve', ['browser-sync', 'watch']);
