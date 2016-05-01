var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var compass = require('gulp-compass');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var babelify = require("babelify");
var looseEnvify = require("loose-envify");
var notify = require("gulp-notify");
var uglify = require("gulp-uglify");
var streamify = require("gulp-streamify");
var duration = require('gulp-duration')
var rename = require("gulp-rename");

var scriptsDir = './client';
var buildDir = './public/js';
console.log(process.env.NODE_ENV)

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {

  var props = {
    entries: [scriptsDir + '/main.js'],
    extensions: ['.js', '.jsx'],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify, looseEnvify, reactify]
  };
  
  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  
  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(duration('Bundle done'))
      .pipe(gulp.dest(buildDir))
      .pipe(notify({title: 'Bundle Complete', message:'good job buddy'}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundling...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

function styles() {
  var opt = {
    config_file: './styles/config.rb',
    css: './public/css',
    sass: 'styles/sass'
  }
  var preprocess = function() {
    gutil.log('Compiling Sass');
    return gulp.src('styles/sass/main.scss')
      .pipe(compass(opt).on('error', handleErrors))
      .pipe(gulp.dest('public/css/'))
      .pipe(notify({title: 'Css Compiling Done.', message:'lookin stylish today scott'}))
  }
  return preprocess()
}

gulp.task('build-prod',['styles'],function() {
  console.log('Building for production..')
  var envifyCustomOptions = { _: 'purge', NODE_ENV: 'production'};
  var b = browserify({
    entries: [scriptsDir + '/main.js'],
    extensions: ['.js', '.jsx'],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify, reactify]
  });
  
  b.transform('envify', envifyCustomOptions);

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', handleErrors)
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('styles', function() {
  return styles()
});

gulp.task('watch-styles', function() {
  styles()
  return gulp.watch('styles/sass/*.scss', styles);
});

gulp.task('build', function() {
  return buildScript('bundle.js', false);
});

gulp.task('default', ['watch-styles'], function() {
  return buildScript('bundle.js', true);
});