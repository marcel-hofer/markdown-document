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
            language: 'en',

            document: {
                title: 'My awesome title',
                subject: 'An awesome subject',
                date: '2017-09-22',
                authors: ['John Doe', 'David Miller'],
                keywords: ['markdown', 'document', 'pdf'],
                data: {
                    location: 'Current Location',

                    version: '1.2',
                    classification: 'Not Classified',
                    state: 'Final',
                    distribution: ['Project Members', 'John Doe', 'someone@example.com'],
                    history: [
                        { version: '0.1', date: '2017-01-01', author: 'John Doe', comment: 'Document created' },
                        { version: '1.0', date: '2017-03-15', author: 'John Doe', comment: 'Finished document' },
                        { version: '1.1', date: '2017-09-22', author: 'James Smith', comment: 'Added section 2' },
                    ],
                    references: [
                        { title: 'Requirements v2.pdf', date: '2016-10-30', author: 'Jane Smith' }
                    ],
                    abbreviations: [
                        { abbreviation: 'HTML', meaning: 'Hypertext Markup Language' },
                        { abbreviation: 'MD', meaning: 'Shorthand for Markdown' }
                    ]
                }
            }
        };

        // Act & Assert
        await testTemplateGenerationAsync(options, basicTemplate);
    });
});