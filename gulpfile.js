const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');

const merge = require("merge-stream");

gulp.task('clean', function() {
    return del([
        'output', 
        'src/**/*.js',
        'specs/**/*.js',
        'specs/**/*.html',
        'specs/**/*.pdf'
    ]);
});

gulp.task('build', ['clean'], function() {
    let tsProject = ts.createProject('tsconfig.json');

    let build = gulp.src('src/**/*.ts')
        .pipe(tsProject({
            declaration: true
        }));

    let copyPackageJson = gulp.src('package.json')
        .pipe(gulp.dest('.'));

    return merge(
        build.js.pipe(gulp.dest('output')), 
        build.dts.pipe(gulp.dest('output/definitions')),
        copyPackageJson);
});

gulp.task('build-test', ['clean'], function() {
    let tsProject = ts.createProject('tsconfig.json');

    let build = gulp.src([
            'src/**/*.ts',
            'specs/**/*.ts'
        ], {
            base: './'
        })
        .pipe(tsProject())
        .pipe(gulp.dest('./'));

    return merge(build);
});

gulp.task('test', ['build-test'], function() {
    return gulp.src('specs/**/*.js')
        .pipe(mocha({
            timeout: 50
        }));
});