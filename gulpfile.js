

var gulp = require('gulp');
var tsb = require('gulp-tsb');
var filter = require('gulp-filter');
var es = require('event-stream');
var _ = require('lodash')
var fs = require('fs');
var path = require('path');
var mocha = require('gulp-mocha');
var chai = require('chai')
var cover = require('gulp-coverage')
var exec = require('child_process').exec
var watch = require('gulp-watch')
var incremental = require('./build/util').incremental
var tsOptions = require('./tsconfig.json').compilerOptions

const rootDir = path.join(__dirname, './src');
const COMPILE_PATH = './src/**/**/**';
const TEST_PATH = 'out/**/**/test/**.test.js';
const DEST_PATH = 'build/out'
global.chai = chai;



var toFileUri = function (filePath) {
  var match = filePath.match(/^([a-z])\:(.*)$/i);

  if (match) {
    filePath = '/' + match[1].toUpperCase() + ':' + match[2];
  }

  return 'file://' + filePath.replace(/\\/g, '/');
};

/*----------------------------------------------------------------------------
  BUILD SETTINGS
 ----------------------------------------------------------------------------*/

tsOptions['rootDir'] = COMPILE_PATH
tsOptions['sourceRoot'] = toFileUri(rootDir)
tsOptions['experimentalDecorators'] = true








function createCompile(build, ops) {
  var opts = ops ? ops : _.clone(tsOptions);
  opts.inlineSources = !!build;

  var ts = tsb.create(opts);

  return function (token) {
    var tsFilter = filter([
      '**/**/**.ts', '**/**/*.d.ts', '**/**.tsx'
    ], { restore: true });
    var input = es.through();
    var output = input
      .pipe(tsFilter)   //if copy other files like html,css ......
      .pipe(ts(token))
      .pipe(tsFilter.restore)
    return es.duplex(input, output);
  };
}



function compile(out, build) {
  var cmdOpts = _.clone(tsOptions)
  cmdOpts.module = 'commonjs';
  var cp = createCompile(build, cmdOpts)

  return function () {
    var src = gulp.src(COMPILE_PATH)
      .pipe(cp())
      .pipe(gulp.dest(out));
  };
}


function watchCompile(CB) {
  var compile = createCompile(false);
  watch(COMPILE_PATH)
    .pipe(incremental(compile, gulp.src(COMPILE_PATH), true))
    .pipe(gulp.dest(DEST_PATH))

}


gulp.task('default', ['compile']);
gulp.task('compile', compile(DEST_PATH, false))
gulp.task('watch', watchCompile)


gulp.task('test', function () {
  return gulp.src(TEST_PATH)
    .pipe(mocha({ ui: 'tdd' }))

})

gulp.task('coverage', function () {
  return gulp.src(TEST_PATH)
    .pipe(cover.instrument({
      pattern: ['out/**/*.js'],
      debugDirectory: 'debug'
    }))
    .pipe(mocha({ ui: 'tdd' }))
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('reports'));

})

console.log(tsOptions)