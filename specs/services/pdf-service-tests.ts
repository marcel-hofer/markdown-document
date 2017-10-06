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
    <head>
        <title>Awesome title!</title>
    </head>
    <body>
        Here is the content
    </body>
</html>`);

            const options = <IPdfOptions>{
                wkhtmltopdfPath: require('wkhtmltopdf-installer').path,

                content: { content: 'pdf-service-tests.html' }
            };

            // Act
            await pdfService.renderPdfAsync(__dirname, tempPdfFile, options);

            // Assert
            const pdfExists = await fileService.existsAsync(tempPdfFile);
            should(pdfExists).be.true();
        });
    });
});