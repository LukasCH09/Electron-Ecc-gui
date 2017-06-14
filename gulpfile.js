
const gulp = require('gulp');
const stream = require('add-stream');
const pl = require('gulp-load-plugins')();

gulp.task('dev', ['src'], () => {
  gulp.watch(['src/**/*.js', 'src/**/*.html'], ['src:js']);
  gulp.watch(['src/**/*.scss'], ['src:css']);
});

gulp.task('src', ['src:js', 'src:css']);

gulp.task('src:js', () => {
  return gulp.src(['src/index.js', 'src/**/*.js'])
    .pipe(pl.plumber())
    .pipe(stream.obj(gulp.src('src/**/*.html')
      .pipe(pl.angularTemplatecache({ module: 'ecc' }))))
    .pipe(pl.concat('index.js'))
    .pipe(pl.ngAnnotate())
    .pipe(gulp.dest('dist'));
});

gulp.task('src:css', () => {
  return gulp.src(['src/**/*.scss'])
    .pipe(pl.plumber())
    .pipe(pl.concat('index.css'))
    .pipe(pl.sass().on('error', pl.sass.logError))
    .pipe(pl.cleanCss())
    .pipe(gulp.dest('dist'));
});
