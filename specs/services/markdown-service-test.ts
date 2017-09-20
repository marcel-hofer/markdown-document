/// <reference path="../include.d.ts" />

import * as should from "should";

import markdownService from "../../src/services/markdown-service";
import * as mockFs from "mock-fs";

describe('MarkdownService', function() {
    describe('renderFileAsync', function() {
        it('returns rendered markdown', async function() {
            // Arrange
            mockFs({
                'document.md': '# title'
            });

            // Act
            const result = await markdownService.renderFileAsync('document.md');

            // Assert
            should(result.trim()).be.equal('<h1>title</h1>');
        });
    });
});