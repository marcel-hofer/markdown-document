/// <reference path="../../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');

import { IncludePlugin } from "../../../src/services/markdown/include-plugin";

describe('IncludePlugin', function() {
    let md: IRemarkable = null;
    beforeEach(function() {
        md = new Remarkable({ });
        md.use(IncludePlugin.register);
    });

    it('does nothing when no include defined', function() {
        // Arrange
        const document = `# title`;

        // Act
        const result = md.render(document, { path: 'document.md' });
        
        // Assert
        should(result.trim()).be.equal('<h1>title</h1>');
    });
    
    it('includes single file', function() {
        // Arrange
        const document = `# title
@(include file1.md)`;
        mockFs({
            'file1.md': '## subtitle'
        });

        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle</h2>');
    });

    it('includes multiple files', function() {
        // Arrange
        const document = `# title
@(include file1.md)
@(include file2.md)`;
        mockFs({
            'file1.md': '## subtitle 1',
            'file2.md': '## subtitle 2'
        });

        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle 1</h2>\n<h2>subtitle 2</h2>');
    });
    
    it('includes file in included file', function() {
        // Arrange
        const document = `# title
@(include file1.md)`;
        mockFs({
            'file1.md': `## subtitle 1
@(include file2.md)`,
            'file2.md': '## subtitle 2'
        });

        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle 1</h2>\n<h2>subtitle 2</h2>');
    });
    
    it('includes file in included file relative to current location', function() {
        // Arrange
        const document = `# title
@(include folder1/file1.md)`;
        mockFs({
            'folder1/file1.md': `## subtitle 1
@(include folder2/file2.md)`,
            'folder1/folder2/file2.md': '## subtitle 2'
        });

        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle 1</h2>\n<h2>subtitle 2</h2>');
    });
    
    it('includes same file multiple times (no loop)', function() {
        // Arrange
        const document = `# title
@(include file1.md)
@(include file1.md)`;
        mockFs({
            'file1.md': `## subtitle`
        });
        
        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle</h2>\n<h2>subtitle</h2>');
    });
    
    it('includes same file multiple times (no loop - deep)', function() {
        // Arrange
        const document = `# title
@(include file1.md)
@(include file2.md)`;
        mockFs({
            'file1.md': `## subtitle 1
@(include file2.md)`,
            'file2.md': `## subtitle 2
@(include file3.md)`,
            'file3.md': `## subtitle 3`
        });
        
        // Act
        const result = md.render(document, { path: 'document.md' });

        // Assert
        should(result.trim()).be.equal('<h1>title</h1>\n<h2>subtitle 1</h2>\n<h2>subtitle 2</h2>\n<h2>subtitle 3</h2>\n<h2>subtitle 2</h2>\n<h2>subtitle 3</h2>');
    });
    
    it('throws exception when file could not be found', function() {
        // Arrange
        const document = `# title
@(include file1.md)`;
        mockFs({
            'file2.md': '## subtitle'
        });

        // Act
        const act = () => md.render(document, { path: 'document.md' });

        // Assert
        should.throws(act);
    });
    
    it('throws exception on include loop (main document)', function() {
        // Arrange
        const document = `# title
@(include file1.md)`;
        mockFs({
            'file1.md': `## subtitle
@(include document.md)`
        });

        // Act
        const act = () => md.render(document, { path: 'document.md' });

        // Assert
        should.throws(act);
    });
    
    it('throws exception on include loop (sub document)', function() {
        // Arrange
        const document = `# title
@(include file1.md)`;
        mockFs({
            'file1.md': `## subtitle
@(include file2.md)`,
            'file2.md': `## subtitle
@(include file1.md)`
        });

        // Act
        const act = () => md.render(document, { path: 'document.md' });

        // Assert
        should.throws(act);
    });
});