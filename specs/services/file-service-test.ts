/// <reference path="../include.d.ts" />

import * as should from "should";

import fileService from "../../src/services/file-service";
import * as mockFs from "mock-fs";

describe('FileService', function() {
    describe('existsAsync', function() {
        it('returns true if file exists', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = await fileService.existsAsync('document.md');

            // Assert
            should(result).be.true();
        });

        
        it('returns false if file does not exists', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = await fileService.existsAsync('document2.md');

            // Assert
            should(result).be.false();
        });
    });

    describe('readFile', function() {
        it('returns file content if file exists', function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = fileService.readFile('document.md');

            // Assert
            should(result).be.not.null();
            should(result.toString()).be.equal('content');
        });

        it('fails if file does not exist', function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const act = () => fileService.readFile('document2.md');

            // Assert
            should.throws(act);
        });
    });

    describe('readFileAsync', function() {
        it('returns file content if file exists', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = await fileService.readFileAsync('document.md');

            // Assert
            should(result).be.not.null();
            should(result.toString()).be.equal('content');
        });

        it('fails if file does not exist', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = fileService.readFileAsync('document2.md');

            // Assert
            await should(result).be.rejectedWith(Error);
        });
    });

    describe('changeExt', function() {
        it('changes test.md with .json to test.json', function() {
            // Act
            const result = fileService.changeExt('test.md', '.json');

            // Assert
            should(result).be.equal('test.json');
        });
        
        it('changes test.md with -props.json to test-props.json', function() {
            // Act
            const result = fileService.changeExt('test.md', '-props.json');

            // Assert
            should(result).be.equal('test-props.json');
        });

        it('changes test.md with <empty> to test', function() {
            // Act
            const result = fileService.changeExt('test.md', '');

            // Assert
            should(result).be.equal('test');
        });

        it('changes test with .json to test.json', function() {
            // Act
            const result = fileService.changeExt('test', '.json');

            // Assert
            should(result).be.equal('test.json');
        });
    });
});