/// <reference path="../include.d.ts" />

import * as should from "should";
import * as fs from "fs";
import * as path from "path";

import { default as fileService, TempPath } from "../../src/services/file-service";
import * as mockFs from "mock-fs";

describe('FileService', function() {
    describe('exists', function() {
        it('returns true if file exists', function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = fileService.exists('document.md');

            // Assert
            should(result).be.true();
        });

        
        it('returns false if file does not exists', function() {
            // Arrange
            mockFs({
                'document.md': 'content'
            });

            // Act
            const result = fileService.exists('document2.md');

            // Assert
            should(result).be.false();
        });
    });

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
        it('lists content of empty directory', async function() {
            // Arrange
            mockFs({
                'folder': { },
                'folder2': {
                    'file1.md': 'content',
                    'file2.md': 'content'
                }
            });

            // Act
            const result = await fileService.readDirectoryAsync('folder');

            // Assert
            should(result).not.be.null();
            should(result).be.lengthOf(0);
        });

        it('lists content of directory', async function() {
            // Arrange
            mockFs({
                'folder': {
                    'another-folder': {
                        'file1.md': 'content'
                    },
                    'file1.md': 'content',
                    'file2.md': 'content'
                },
                'folder2': { }
            });

            // Act
            const result = await fileService.readDirectoryAsync('folder');

            // Assert
            should(result).not.be.null();
            should(result).be.eql([
                'another-folder',
                'file1.md',
                'file2.md'
            ]);
        });
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
        it('deletes empty directory', async function() {
            // Arrange
            mockFs({
                'folder': { }
            });

            // Act
            await fileService.deleteDirectoryRecursiveAsync('folder');

            // Assert
            const result = await fileService.existsAsync('folder');
            should(result).be.false();
        });

        it('deletes directory with sub directories', async function() {
            // Arrange
            mockFs({
                'folder': { 
                    'folder2': { },
                    'folder3': { }
                }
            });

            // Act
            await fileService.deleteDirectoryRecursiveAsync('folder');

            // Assert
            const result = await fileService.existsAsync('folder');
            should(result).be.false();
        });

        it('deletes directory with files', async function() {
            // Arrange
            mockFs({
                'folder': { 
                    'file1.md': 'content',
                    'file2.md': 'content'
                }
            });

            // Act
            await fileService.deleteDirectoryRecursiveAsync('folder');

            // Assert
            const result = await fileService.existsAsync('folder');
            should(result).be.false();
        });

        it('deletes multiple levels', async function() {
            // Arrange
            mockFs({
                'folder': {
                    'folder2': {
                        'file1.md': 'content',
                        'folder3': {
                            'file1.md': 'content',
                            'folder4': { }
                        }
                    },
                    'file1.md': 'content',
                    'file2.md': 'content'
                }
            });

            // Act
            await fileService.deleteDirectoryRecursiveAsync('folder');

            // Assert
            const result = await fileService.existsAsync('folder');
            should(result).be.false();
        });
    });

    describe('deleteDirectoryAsync', function() {
        it('deletes directory', async function() {
            // Arrange
            mockFs({
                'folder': { }
            });

            // Act
            await fileService.deleteDirectoryRecursiveAsync('folder');

            // Assert
            const result = await fileService.existsAsync('folder');
            should(result).be.false();
        });
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
        it('creates directory recursive absolute', async function() {
            // Arrange
            mockFs({ });

            const directory1 = path.join(__dirname, 'folder1');
            const directory2 = path.join(__dirname, 'folder1/folder2');

            // Act
            await fileService.createDirectoryRecursiveAsync(directory2);

            // Assert
            const directory1Exists = fs.existsSync(directory1);
            const directory2Exists = fs.existsSync(directory2);

            should(directory1Exists).be.equal(true, 'directory1 exists');
            should(directory2Exists).be.equal(true, 'directory2 exists');
        });

        it('creates directory recursive relative', async function() {
            // Arrange
            mockFs({ });

            const directory1 = 'folder1';
            const directory2 = 'folder1/folder2';

            // Act
            await fileService.createDirectoryRecursiveAsync(directory2);

            // Assert
            const directory1Exists = fs.existsSync(directory1);
            const directory2Exists = fs.existsSync(directory2);

            should(directory1Exists).be.equal(true, 'directory1 exists');
            should(directory2Exists).be.equal(true, 'directory2 exists');
        });
    });

    describe('createDirectoryAsync', function() {
        xit('creates directory absolute', async function() {
            // Arrange
            mockFs({ });

            const directory = path.join(__dirname, 'folder1');

            // Act
            await fileService.createDirectoryAsync(directory);

            // Assert
            const result = fs.existsSync(directory);

            should(result).be.true();
        });

        it('creates directory relative', async function() {
            // Arrange
            mockFs({ });

            const directory = 'folder1';

            // Act
            await fileService.createDirectoryAsync(directory);

            // Assert
            const result = fs.existsSync(directory);

            should(result).be.true();
        })
    });

    describe('createTempFileAsync', function() {
        it('returns temporary file', async function() {
            // Arrange
            mockFs({ });

            // Act
            const tempFile = await fileService.createTempFileAsync({ postfix: '.html' });

            // Assert
            should(tempFile).be.not.null();
            should(tempFile.path).endWith('.html');
        });

        it('can write to temporary file', async function() {
            // Arrange
            mockFs({ });
            const tempFile = await fileService.createTempFileAsync({ postfix: '.html' });

            // Act
            fs.writeFileSync(tempFile.path, 'content');

            // Assert
            const writtenFile = fs.readFileSync(tempFile.path);
            should(writtenFile.toString()).be.equal('content');
        });

        it('can delete temporary file', async function() {
            // Arrange
            mockFs({ });
            const tempFile = await fileService.createTempFileAsync({ postfix: '.html' });
            fs.writeFileSync(tempFile.path, 'content');

            // Act
            await tempFile.deleteAsync();
            
            // Assert
            const writtenFileExists = fs.existsSync(tempFile.path);
            should(writtenFileExists).be.false();
        });
    });

    describe('createTempDirectoryAsync', function() {
        it('creates temporary directory', async function() {
            // Arrange
            mockFs();

            // Act
            const tempDirectory = await fileService.createTempDirectoryAsync();

            // Assert
            const exists = await fileService.existsAsync(tempDirectory.path);
            should(exists).be.true();
        });

        it('can write files to it', async function() {
            // Arrange
            const tempDirectory = await fileService.createTempDirectoryAsync();
            const file = path.join(tempDirectory.path, 'file1.txt');
            
            // Act
            await fileService.writeFileAsync(file, 'content');

            // Assert
            const exists = await fileService.existsAsync(file);
            should(exists).be.true();
        });

        it('can cleanup', async function() {
            // Arrange
            const tempDirectory = await fileService.createTempDirectoryAsync();
            const file = path.join(tempDirectory.path, 'file1.txt');
            await fileService.writeFileAsync(file, 'content');

            // Act
            await tempDirectory.deleteAsync();

            // Assert
            const exists = await fileService.existsAsync(tempDirectory.path);
            should(exists).be.false();
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

    describe('toAbsoluteFileUrl', function() {
        it('changes file path to absolute file url', function() {
            // Arrange
            const filePath = 'C:\\path\\to\\file.css';

            // Act
            const result = fileService.toAbsoluteFileUrl(filePath);

            // Assert
            should(result).startWith('file://');
            should(result).not.containEql('\\');
        });
    });

    describe('resolveModuleDirectory', function() {
        it('returns resolved module directory', function() {
            // Arrange
            const resolvedPath = require.resolve('mocha');
            const expected = resolvedPath.substr(0, resolvedPath.lastIndexOf(path.sep));

            // Act
            const result = fileService.resolveModuleDirectory('mocha');

            // Assert
            should(result).be.equal(expected);
        });

        it('fails if module does not exist', function() {
            // Act
            const act = () => fileService.resolveModuleDirectory('asdf42fdsa');

            // Assert
            should.throws(act);
        });
    });
});