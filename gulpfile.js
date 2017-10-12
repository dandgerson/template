var gulp = require('gulp');
var sass = require('gulp-sass'); // sass compile
var browserSync = require('browser-sync').create(); // live-reloading .etc
var useref = require('gulp-useref'); // concatenate 
var uglify = require('gulp-uglify'); // minify js
var gulpIf = require('gulp-if'); // correct minify
var cssnano = require('gulp-cssnano'); // minify css
var imagemin = require('gulp-imagemin'); // images optimization
var cache = require('gulp-cache'); // optimization of image optimization
var del = require('del'); // delete the dir
var notify = require("gulp-notify"); // notify on errors with Sass compiler v1
var autoprefixer = require('gulp-autoprefixer'); // prefixes automatization
var runSequence = require('run-sequence'); // sequence build task


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

// Sass compiler v1 with gulp-notify
// gulp.task('sass', function () {
//   return gulp.src('app/scss/**/*.+(scss|sass)') // Get source files with gulp.src and will match any file ending with .scss or .sass in scss dir and all child dirs
//   .pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError())) // Using gulp-sass with gulp-notify. gulp-sass doesn't stop if you do a typo
//   .pipe(autoprefixer(['last 15 versions'])) // Using gulp-autoprefixer
//   .pipe(gulp.dest('app/css')) // Outputs the file in the destination folder
//   .pipe(browserSync.reload({
//     stream: true
//   }))
// });

// Sass compiler v2 without gulp-notify
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.+(scss|sass)') // Gets all files ending with .scss in app/scss and children dirs
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(autoprefixer(['last 15 versions'])) // Using gulp-autoprefixer
  .pipe(gulp.dest('app/css')) // Outputs it in the css folder
  .pipe(browserSync.reload({ // Reloading with Browser Sync
    stream: true
  }));
})

// Watchers v1 using without defaul task
// gulp.task('watch', ['browserSync', 'sass'], function() {
//   gulp.watch('app/scss/**/*.+(scss|sass)', ['sass']); // run 'sass' before we start watching
//   // Other watchers
//   gulp.watch('app/**/*.html', browserSync.reload); // Reloads the browser whenever HTML file change
//   gulp.watch('app/js/**/*.js', browserSync.reload); // Reloads the browser whenever JS file change
// });

// Watchers v2
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.+(scss|sass)', ['sass']); // run 'sass' before we start watching
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

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({ // run imagemin with cache
    interlaced: true // Setting interlaced to true
  })))
  .pipe(gulp.dest('dist/images'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts')) // Just copying
});

// Clean dist all
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Clean dist except images
gulp.task('clean:dist:images', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Clean cache
gulp.task('clean:cache', function (callback) {
  return cache.clearAll(callback) // delete cache
});

// Build Sequences
// ---------------

// Watch when using wathers v2
gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
    )
});

// Build
gulp.task('build', function(callback) {
  runSequence(
  'clean:dist', // clean:dist first
  'sass',
    ['useref', 'images', 'fonts'], // then all others
    callback
    )
});

// for fun
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