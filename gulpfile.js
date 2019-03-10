const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const sass = require('gulp-sass');
const riot = require('gulp-riot');
const runElectron = require('gulp-run-electron');
const runSequence = require('run-sequence');

//CLEAN
gulp.task('clean', function() {
	return gulp.src('app', { read: false }).pipe(clean());
});

//ELECTRON
gulp.task('electron', function() {
	gulp.src('./').pipe(runElectron());
});

//HTML
gulp.task('html', function() {
	return gulp.src('src/*.html').pipe(gulp.dest('./app'));
});

//SCSS
gulp.task('scss', function() {
	return gulp
		.src('./src/css/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('./app/css'));
});

//JS
gulp.task('js', function() {
	return gulp
		.src(['./src/views/*.tag', './src/js/*.js'])
		.pipe(concat('app.js'))
		.pipe(riot({ compact: true }))
		.pipe(
			minify({
				ext: {
					min: '.js'
				},
				noSource: true
			})
		)
		.pipe(gulp.dest('./app/js/'));
});

//ASSETS
gulp.task('assets', function() {
	return gulp.src(['src/assets/**/*']).pipe(gulp.dest('./app/assets'));
});

//WATCH
gulp.task('watch', function() {
	gulp.watch('src/css/*.scss', ['scss', runElectron.rerun]);
	gulp.watch('src/assets/*', ['assets', runElectron.rerun]);
	gulp.watch('src/*.html', ['html', runElectron.rerun]);
	gulp.watch(['./src/views/*.tag', './src/js/*.js'], ['js', runElectron.rerun]);
});

//START
gulp.task('start', ['clean'], function() {
	runSequence('html', 'js', 'scss', 'assets', 'watch', 'electron');
});
