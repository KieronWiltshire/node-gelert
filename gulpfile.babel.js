'use strict';

import Fsx from 'fs-extra';
import Path from 'path';
import Gulp from 'gulp';
import Babel from 'gulp-babel';

let distDir = Path.join(__dirname, 'build');
let testDistDir = Path.join(__dirname, 'build-test');

/**
 * Build the application
 */
Gulp.task('build', ['transpile'], function() {
  return Gulp.src([
    'test/**/*'
  ])
  .pipe(Babel())
  .pipe(Gulp.dest(testDistDir));
});

/**
 * Transpile the application
 */
Gulp.task('transpile', ['clean'], function() {
  return Gulp.src([
      'src/**/*'
    ])
    .pipe(Babel())
    .pipe(Gulp.dest(distDir));
});

/**
 * Clean the environment
 */
Gulp.task('clean', function() {
  Fsx.removeSync(distDir);
});
