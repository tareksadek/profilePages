import babel       from 'gulp-babel';
import concat      from 'gulp-concat';
import del         from 'del';
import gulp        from 'gulp';
import sass        from 'gulp-sass';
import uglify      from 'gulp-uglify';
import browserSync from 'browser-sync';

const server = browserSync.create();

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss'
};

const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
};

const clean = () => del(APPPATH.css);

function scripts() {
  return gulp.src(APPPATH.js, {sourcemaps: true, allowEmpty: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(APPPATH.js));
}

function styles() {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  });
  done();
}

const watch = () => gulp.watch([SOURCEPATHS.sassSource, APPPATH.js], gulp.series(styles, scripts, reload));

const dev = gulp.series(clean, styles, scripts, serve, watch);
export default dev;

// gulp.task('sass', function(){
//   return gulp.src(SOURCEPATHS.sassSource)
//     .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//     .pipe(gulp.dest(APPPATH.css));
// });
//
// gulp.task('serve', gulp.series(['sass']), function(){
//   browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
//     server: {
//       baseDir: APPPATH.root
//     }
//   });
// });
//
// //gulp.task('default', ['sass']);
// gulp.task('default', gulp.series(['serve', 'sass']));
