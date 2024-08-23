import gulp from 'gulp';
// import fileInline from 'gulp-file-inline';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';

// Task to copy project.js to the destination directory
gulp.task('cp-src', function(cb) {
    gulp.src(['./build/web-mobile/src/project.js'], { allowEmpty: true })
        .pipe(gulp.dest('./build/web-mobile/'))
        .on('end', cb);
});

// Task to concatenate CSS files
gulp.task('concat-css', gulp.series('cp-src', function(cb) {
    gulp.src(['./build/web-mobile/style-mobile.css', './html/loading.css'], { allowEmpty: true })
        .pipe(concat('style-mobile.css'))
        .pipe(gulp.dest('./build/web-mobile/'))
        .on('end', cb);
}));

// Task to minimize HTML and inline resources
        // .pipe(fileInline())
gulp.task('htmlmin', gulp.series('concat-css', function(cb) {
    gulp.src('./build/web-mobile/*.html', { allowEmpty: true })
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./build/web-mobile/'))
        .on('end', cb);
}));

// Task to revision resources
gulp.task('resRev', gulp.series('htmlmin', function(cb) {
    gulp.src(['./build/web-mobile/**/*.js', './build/web-mobile/*.png'], { allowEmpty: true })
        .pipe(rev())
        .pipe(gulp.dest('./build/web-mobile/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./build/web-mobile/'))
        .on('end', cb);
}));

// Default task to replace paths with revisioned file names
gulp.task('default', gulp.series('resRev', function(cb) {
    gulp.src(['./build/web-mobile/*.json', './build/web-mobile/index.html'], { allowEmpty: true })
        .pipe(revCollector())
        .pipe(gulp.dest('./build/web-mobile/'));
    
    gulp.src(['./build/web-mobile/*.json', './build/web-mobile/main*.js'], { allowEmpty: true })
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('./build/web-mobile/'))
        .on('end', cb);
}));
