var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    Server = require('karma').Server,
    ngAnnotate = require('browserify-ngannotate');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

// cleans the build output
gulp.task('clean', function(cb) {
  return gulp.src('build/*')
      .pipe(clean());
});

// runs bower to install frontend dependencies
gulp.task('bower', function() {
  var install = require('gulp-install');

  return gulp.src(['./bower.json'])
      .pipe(install());
});

// runs sass, creates css source maps
gulp.task('build-css', ['clean'], function() {
  return gulp.src('./app/sass/*')
      .pipe(sourcemaps.init())
      .pipe(sass())
      // .pipe(cachebust.resources())
      .pipe(sourcemaps.write('./app/css'))
      .pipe(gulp.dest('./app/css'));
});

// fills in the angular template cache, to prevent loading the html templates via separte http requests
gulp.task('build-template-cache', ['clean'], function(){
  var ngHtml2Js = require('gulp-ng-html2js'),
      concat = require('gulp-concat');

  return gulp.src('./app/views/*.html')
    .pipe(ngHtml2Js({
        moduleName: 'TicTacToe',
        prefix: '/views/'
    }))
    .pipe(concat('templateCacheViews.js'))
    .pipe(gulp.dest('./build'));
});

// runs jshint
gulp.task('jshint', function() {
  gulp.src('./app/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// runs karma tests
gulp.task('test', ['build-js'], function(done) {
  Server.start({
    configFile: __dirname + '/karma.config.js',
    singleRun: true
  }, function() {
    done();
  });
});

// build a minified Javascript bundle - the order of the js files is determined by browserify
gulp.task('build-js', ['clean'], function() {
  var b = browserify({
      entries: './app/modules/TicTacToe.js',
      debug: true,
      paths: ['./app/controllers', './app/services', './app/directives', './app/modules', './app'],
      transform: [ngAnnotate]
  });

  return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // .pipe(cachebust.resources())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/'));
});

// full build (except sprites), applies cache busting to the main page css and js bundles
gulp.task('build', ['clean', 'bower', 'build-css', 'build-template-cache', 'jshint', 'build-js'], function() {
// gulp.task('build', ['clean', 'bower', 'build-css', 'jshint', 'build-js'], function() {
  return gulp.src('app/index.html')
      .pipe(cachebust.references())
      .pipe(gulp.dest('build'));
});

// watches file system and triggers a build when a modification is detected
gulp.task('watch', function() {
  return gulp.watch(['./app/index.html', './app/views/*.html', './app/sass/*.*css', './app/**/*.js'], ['build']);
});

// launches a web server that serves files in the current directory
gulp.task('webserver', ['watch', 'build'], function() {
  gulp.src('.')
      .pipe(webserver({
        livereload: false,
        directoryListing: true,
        open: 'http://localhost:8000/build/index.html'
      }));
});

// launches a build upon modification and publish it to a running server
gulp.task('dev', ['watch', 'webserver']);

// generates a sprite png and the corresponding sass sprite map.
// this is not included in the recurring development build and needs to be run separately
gulp.task('sprite', function() {
  var spriteData = gulp.src('./app/images/*.png')
      .pipe(spritesmith({
        imgName: 'todo-sprite.png',
        cssName: '_todo-sprite.scss',
        algorith: 'top-down',
        padding: 5
      }));

  spriteData.css.pipe(gulp.dest('./build'));
  spriteData.img.pipe(gulp.dest('./build'));
});

// installs and builds everything, including sprites
gulp.task('default', ['sprite', 'build', 'test']);
