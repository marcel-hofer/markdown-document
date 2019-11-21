const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');

const merge = require("merge-stream");

function clean() {
    return del([
        'output',
        'src/**/*.js',
        'specs/**/*.js',
        'specs/**/*.html',
        'specs/**/*.pdf',
        '!specs/testfiles/**'
    ]);
}

function build() {
    const tsProject = ts.createProject('tsconfig.json', {
        declaration: true
    });

    const build = gulp.src('src/**/*.ts')
        .pipe(tsProject());

    const copyPackageJson = gulp.src('package.json')
        .pipe(gulp.dest('.'));

    return merge(
        build.js.pipe(gulp.dest('output')),
        build.dts.pipe(gulp.dest('output/definitions')),
        copyPackageJson);
}

function buildTest() {
    const tsProject = ts.createProject('tsconfig.json');

    const build = gulp.src([
            'src/**/*.ts',
            'specs/**/*.ts'
        ], {
            base: './'
        })
        .pipe(tsProject())
        .pipe(gulp.dest('./'));

    return merge(build);
}

function test() {
    return gulp.src('specs/**/*.js')
        .pipe(mocha({
            timeout: 50
        }));
}


gulp.task('clean', clean);
gulp.task('build', gulp.series('clean', build));
gulp.task('test', gulp.series('clean', buildTest, test));