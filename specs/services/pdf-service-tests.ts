/// <reference path="../include.d.ts" />

import * as should from "should";
import * as path from "path";

import { default as pdfService, IPdfOptions } from "../../src/services/pdf-service";
import { default as fileService, TempFile } from "../../src/services/file-service";

describe('PdfService', function() {
    describe('renderPdfAsync', function() {
        it('renders html to pdf', async function() {
            this.timeout(15000);

            // Arrange
            const tempHtmlFile = path.join(__dirname, 'pdf-service-tests.html');
            const tempPdfFile = path.join(__dirname, 'pdf-service-tests.pdf');

            await fileService.writeFileAsync(tempHtmlFile, `<html>
    <head></head>
    <body>
            Here is the content
    </body>
</html>`);

            const options = <IPdfOptions>{
                phantomPath: require('phantomjs-prebuilt').path,

                paperFormat: 'A4',
                paperOrientation: 'portrait',
                paperMargin: {
                    top: '1cm',
                    left: '2cm',
                    bottom: '3cm',
                    right: '4cm'
                },

                renderDelay: 0,
                loadTimeout: 10000
            };

            // Act
            await pdfService.renderPdfAsync(tempHtmlFile, tempPdfFile, options);

            // Assert
            const pdfExists = await fileService.existsAsync(tempPdfFile);
            should(pdfExists).be.true();
        });
    });
});