/// <reference path="../include.d.ts" />

import * as should from "should";
import * as fs from "fs";
import * as path from "path";

import { default as fileService, TempFile } from "../../src/services/file-service";
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

    describe('writeFileAsync', function() {
        it('writes file', async function() {
            // Arrange
            mockFs({ });

            // Act
            await fileService.writeFileAsync('test.md', 'content');

            // Assert
            const writtenFile = fs.readFileSync('test.md');
            should(writtenFile.toString()).be.equal('content');
        });
    })

    describe('readDirectoryAsync', function() {
        // TODO:
    });

    describe('isDirectoryAsync', function() {
        it('returns true for a directory', async function() {
            // Arrange
            mockFs({
                'folder': { }
            });

            // Act
            const result = await fileService.isDirectoryAsync('folder');

            // Assert
            should(result).be.true();
        });

        it('returns false for a file', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = await fileService.isDirectoryAsync('document.md');

            // Assert
            should(result).be.false();
        });
    });

    describe('deleteDirectoryRecursiveAsync', function() {
        // TODO
    });

    describe('deleteDirectoryAsync', function() {
        // TODO
    });

    describe('deleteFileAsync', function() {
        it('deletes file', async function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });;

            // Act
            await fileService.deleteFileAsync('document.md');

            // Assert
            const result = await fileService.existsAsync('document.md');
            should(result).be.false();
        });
    });

    describe('createDirectoryRecursiveAsync', function() {
        it('creates directory recursive', async function() {
            // Arrange
            mockFs({ });

            const directory1 = path.join(__dirname, 'temp/folder1');
            const directory2 = path.join(__dirname, 'temp/folder1/folder2');

            // Act
            await fileService.createDirectoryRecursiveAsync(directory2);

            // Assert
            const directory1Exists = fs.existsSync(directory1);
            const directory2Exists = fs.existsSync(directory2);

            should(directory1Exists).be.equal(true, 'directory1 exists');
            should(directory2Exists).be.equal(true, 'directory2 exists');
        })
    });

    describe('createDirectoryAsync', function() {
        // TODO
    });

    describe('createTempFileAsync', function() {
        let tempFile: TempFile;
        
        it('returns temporary file', async function() {
            // Arrange
            mockFs({ });

            // Act
            tempFile = await fileService.createTempFileAsync({ postfix: '.html' });

            // Assert
            should(tempFile).be.not.null();
            should(tempFile.path).endWith('.html');
        });

        it('can write to temporary file', function() {
            // Act
            fs.writeFileSync(tempFile.path, 'content');

            // Assert
            const writtenFile = fs.readFileSync(tempFile.path);
            should(writtenFile.toString()).be.equal('content');
        });

        it('can delete temporary file', function() {
            // Act
            tempFile.delete();
            
            // Assert
            const writtenFileExists = fs.existsSync(tempFile.path);
            should(writtenFileExists).be.false();
        });
    });

    describe('createTempDirectoryAsync', function() {
        // TODO
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

    describe('toAbsoluteFileUrl', function() {
        // TODO
    });
});