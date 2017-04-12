 var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat = require('gulp-concat'), 
		uglify = require('gulp-uglifyjs'),
		cssnano = require('gulp-cssnano'),
		rename = require('gulp-rename'),
		del = require('del'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		cache = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer'),
		gutil = require( 'gulp-util' ),
		ftp = require( 'vinyl-ftp' );


gulp.task('sass', function(){
	return gulp.src(['app/sass/**/*.sass', 'app/sass/**/*.scss'])
	.pipe(sass({outputStyle: 'expanded',includePaths: require('node-bourbon').includePaths}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
}); 

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: "app"
		},
		notify: false
	});
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/bower/jquery/dist/jquery.js',
		'app/bower/tether/dist/js/tether.js',
		'app/bower/bootstrap/dist/js/bootstrap.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['sass']);
	gulp.watch('app/**/*.html',browserSync.reload);
	gulp.watch('app/**/*.js',browserSync.reload);
});

gulp.task('clean', function() {
	return del.sync('dist');
})

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build',['clean', 'img', 'sass','scripts'], function() {
	var buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buldJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/html/*.html')
	.pipe(gulp.dest('dist/html'))

	var buildHtmlA = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'host',
		user:      'user',
		password:  'password',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**'
	];
	return gulp.src( globs, {base: 'dist/', buffer: false } )
		.pipe( conn.newer( './' ) )
		.pipe( conn.dest( './' ) ); 
});

gulp.task('clear', function () {
		return cache.clearAll();
});

gulp.task('default', ['watch']);