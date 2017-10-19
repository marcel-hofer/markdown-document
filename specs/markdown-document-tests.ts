/// <reference path="include.d.ts" />

import * as should from "should";
import * as path from "path";

import { IOptions, MarkdownDocument } from "../src/markdown-document";

import { PDF_GENERATION_TIMEOUT } from "./constants";
import { testTemplateGenerationAsync, basicTemplate } from "./layouts/helpers";

describe('MarkdownDocument', function() {
    it('constructor throws no exception', function() {
        // Arrange
        const options = <IOptions>{ documentPath: 'example.md' };

        // Act
        const document = new MarkdownDocument(options);
    });

    describe('createPdfAsync', function() {
        it('works without document options', async function() {
            this.timeout(PDF_GENERATION_TIMEOUT);

            // Arrange
            const options = <IOptions>{
                documentPath: path.join(__dirname, 'no-options.md'),
                outputPath: path.join(__dirname, 'no-options.pdf'),
                tempPath: path.join(__dirname, 'temp/no-options')
            };

            // Act & Assert
            await testTemplateGenerationAsync(options, basicTemplate(''));
        });
    });
});