/// <reference path="../include.d.ts" />

import * as should from "should";

import { MarkdownService } from "../../src/services/markdown-service";
import * as mockFs from "mock-fs";

describe('MarkdownService', function() {
    describe('renderFileAsync', function() {
        it('returns rendered markdown', async function() {
            // Arrange
            const service = new MarkdownService();
            mockFs({
                'document.md': '# title'
            });

            // Act
            const result = await service.renderFileAsync('document.md');

            // Assert
            should(result.trim()).be.equal('<h1>title</h1>');
        });
    });
});