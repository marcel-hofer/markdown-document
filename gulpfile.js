const gulp = require('gulp');
const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');

const binPath  = require('wkhtmltopdf-installer').path;

gulp.task('build', [], function() {
    wkhtmltopdf.command = binPath;
    return wkhtmltopdf(fs.createReadStream('input.html'), {
        cover: 'cover.html',
        headerHtml: 'header.html',
        footerHtml: 'footer.html',
        toc: true,
        xslStyleSheet: 'toc.xslt',
        debug: true,

        headerSpacing: '10', // in mm
    })
    .pipe(fs.createWriteStream('output.pdf'));
});