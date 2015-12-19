/* jshint node:true */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var mocha = require('gulp-mocha');

gulp.task('contact', function () {
  var jsonConcat = require("json-concat");

  jsonConcat({
    src: ["data/0.json", "data/1-html.json"],
    dest: "./data/data.json"
  }, function (json) {
    console.log(json);
  });
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('connect', function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('./'))
    .use(serveIndex('./'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  gulp.watch([
    'index.html',
    'app/scripts/**.js',
    'app/images/**/*',
    'app/styles/**/*.css',
    'app/templates/**.html',
    'app/logo/**/*',
    'data/**.json'
  ]).on('change', $.livereload.changed);
});

gulp.task('build', ['jshint'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', function () {
  gulp.start('build');
});
