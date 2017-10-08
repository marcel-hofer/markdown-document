/// <reference path="../include.d.ts" />

import * as should from "should";
import * as path from "path";

import { IOptions, MarkdownDocument } from "../../src/markdown-document";
import fileService from "../../src/services/file-service";

import { testTemplateGenerationAsync, basicTemplate } from "./helpers";

describe('Layout <document>', function() {
    it('renders', async function() {
        this.timeout(15000);

        // Arrange
        const options = <IOptions>{
            documentPath: path.join(__dirname, 'document.md'),
            outputPath: path.join(__dirname, 'document.pdf'),
            tempPath: path.join(__dirname, 'temp/document'),
            layout: 'document',
            document: {
                title: 'My awesome title',
                subject: 'An awesome subject',
                date: '2017-09-22',
                authors: ['John Doe', 'David Miller'],
                data: {
                    location: 'Current Location'
                }
            }
        };

        // Act & Assert
        await testTemplateGenerationAsync(options, basicTemplate);
    });
});