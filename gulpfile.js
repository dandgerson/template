var gulp = require('gulp');
var sass = require('gulp-sass'); // sass compile
var browserSync = require('browser-sync').create(); // live-reloading .etc
var useref = require('gulp-useref'); // concatenate 
var uglify = require('gulp-uglify'); // minify js
var gulpIf = require('gulp-if'); // correct minify
var cssnano = require('gulp-cssnano'); // minify css
var imagemin = require('gulp-imagemin'); // img optimization
var cache = require('gulp-cache'); // optimization of image optimization
var del = require('del'); // delete the dir
// var notify = require("gulp-notify"); // notify on errors
var autoprefixer = require('gulp-autoprefixer'); // prefixes automatization
var runSequence = require('run-sequence'); // sequence build task
var pug = require('gulp-pug');
// var data = require('gulp-data');
// var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var plumberNotifier = require('gulp-plumber-notifier');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false, // don't popup when browser-sync reload
  });
});

// Sass compiler
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.+(scss|sass)') // Gets all files ending with .scss in app/scss and children dirs
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(autoprefixer(['last 15 versions'])) // Using gulp-autoprefixer
  .pipe(gulp.dest('app/css')) // Outputs it in the css folder
  .pipe(browserSync.reload({ // Reloading with Browser Sync
    stream: true
  }));
});

// Pug compiler
gulp.task('pug', function(){
  return gulp.src(['app/pug/*', '!app/pug/includes/', '!app/pug/includes/*'])
  .pipe(plumber()) // console.log on error
  .pipe(plumberNotifier()) // beaty notify
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest('app'))
  .pipe(browserSync.reload({ // Reloading with Browser Sync
    stream: true
  }));
});

// Watchers v3 with pug
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.+(scss|sass)', ['sass']); // run 'sass' before watcher
  gulp.watch('app/pug/**/*.pug', ['pug']); // run 'pug' before watcher
  // Other watchers
  gulp.watch('app/**/*.html', browserSync.reload); // Reloads the browser whenever HTML file change
  gulp.watch('app/js/**/*.js', browserSync.reload); // Reloads the browser whenever JS file change
});

// Optimization tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  return gulp.src('app/*.html')
  .pipe(useref()) // concatenate .+(js|css) in one of each files with need name and path
  .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file
  .pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
  .pipe(gulp.dest('dist'))
});

// Optimizing img
gulp.task('img', function() {
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({ // run imagemin with cache
    interlaced: true // Setting interlaced to true
  })))
  .pipe(gulp.dest('dist/img'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts')) // Just copying
});

// Copying CSS
gulp.task('css', function() {
  return gulp.src(['app/css/!(libraries.css|main.css)'])
  .pipe(gulp.dest('dist/css')) // Just copying
});

// Copying js
gulp.task('js', function() {
  return gulp.src(['app/js/**/*.js'])
  .pipe(gulp.dest('dist/js')) // Just copying
});

// Clean dist all
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Clean dist except img
gulp.task('clean:dist:img', function() {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

// Clean cache
gulp.task('clean:cache', function (callback) {
  return cache.clearAll(callback) // delete cache
});

// Build Sequences
// ---------------

// Watch when using watchers v3
gulp.task('default', function(callback) {
  runSequence(['sass', 'pug', 'browserSync'], 'watch',
    callback
    )
});

// Build
gulp.task('build', function(callback) {
  runSequence(
  'clean:dist', // clean:dist first
  'pug',
  'sass',
    ['useref', 'img', 'fonts', 'css', 'js'], // then all others
    callback
    )
});

// Build except img
gulp.task('build:img', function(callback) {
  runSequence(
  'clean:dist:img', // clean:dist first
  'pug',
  'sass',
    ['useref', 'img', 'fonts', 'css', 'js'], // then all others
    callback
    )
});

// test syntax
gulp.task('hello', function() {
  console.log('Hello Dan!')
});
// 
// The Main Description Notes
// https://css-tricks.com/gulp-for-beginners/

// gulp.task syntax with instance
// 
// gulp.task('task-name', function () {
//   return gulp.src('source-files') // Get source files with gulp.src
//     .pipe(aGulpPlugin()) // Sends it through a gulp plugin
//     .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
//   });

// Globbing in Node
// 
// 1. *.scss: The * pattern is a wildcard that matches any pattern in the current directory. In this case, we’re matching any files ending with .scss in the root folder (project).
// 2. **/*.scss: This is a more extreme version of the * pattern that matches any file ending with .scss in the root folder and any child directories.
// 3. !not-me.scss: The ! indicates that Gulp should exclude the pattern from its matches, which is useful if you had to exclude a file from a matched pattern. In this case, not-me.scss would be excluded from the match.
// 4. *.+(scss|sass): The plus + and parentheses () allows Gulp to match multiple patterns, with different patterns separated by the pipe | character. In this case, Gulp will match any file ending with .scss or .sass in the root folder.

// Gulp watch syntax
// 
// gulp.task('watch', function() {
// gulp.watch('files-to-watch', ['tasks', 'to', 'run']); 
// // Other watchers
// });
// 
// Multiple watch
// 
// gulp.task('watch', ['array', 'of', 'tasks', 'to', 'complete','before', 'watch'], function (){
//   // ...
// })

// Gulp-useref concatenation
// 
// Gulp-useref concatenates any number of CSS and JavaScript files into a single file by looking for a comment that starts in .html file with "<!--build:" and ends with "<!--endbuild-->". Its syntax is:
// <!-- build:<type> <path> -->
// ... HTML Markup, list of script / link tags.
// <!-- endbuild -->
// <type> can either be js, css, or remove. It's best to set type to the type of file that you're trying to concatenate. If you set type to remove, Gulp will remove the entire build block without generating a file.
// <path> here refers to the target path of the generated file.