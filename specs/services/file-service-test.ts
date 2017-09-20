/// <reference path="../include.d.ts" />

import * as should from "should";

import fileService from "../../src/services/file-service";
import * as mockFs from "mock-fs";

describe('FileService', function() {
    describe('existsAsync', function() {
        it('returns true if file exists', async function() {
            // Arrange
            mockFs({
                'document.md': "content"
            });

            // Act
            const result = await fileService.existsAsync('document.md');

            // Assert
            should(result).be.true();
        });

        
        it('returns false if file does not exists', async function() {
            // Arrange
            mockFs({
                'document.md': "content"
            });

            // Act
            const result = await fileService.existsAsync('document2.md');

            // Assert
            should(result).be.false();
        });
    });
});