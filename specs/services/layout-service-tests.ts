/// <reference path="../include.d.ts" />

import * as should from "should";

import * as path from "path";
import { default as layoutService, IDocumentInformation } from "../../src/services/layout-service";
import * as mockFs from "mock-fs";

describe('LayoutService', function() {
    describe('resolveLayoutPathAsync', function() {
        it('returns the path itself if absolute', async function() {
            // Arrange
            mockFs({
                '/path/to/layout.html': 'content'
            });

            // Act
            const result = await layoutService.resolveLayoutPathAsync('/path/to/layout.html', null);

            // Assert
            should(result).be.equal('/path/to/layout.html');
        });

        it('throws if absolute path does not exist', async function() {
            // Arrange
            mockFs({
                '/path/to/layout.html': 'content'
            });

            // Act
            const result = layoutService.resolveLayoutPathAsync('/path/to/layout2.html', null);

            // Assert
            await should(result).be.rejectedWith(Error);
        });

        it('fallbacks to document path', async function() {
            // Arrange
            mockFs({
                'dir/layout.html': 'content'
            });

            // Act
            const result = await layoutService.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.equal(path.normalize('dir/layout.html'));
        });

        it('fallbacks to layout path', async function() {
            // Arrange
            const layoutPath = path.join(layoutService.layoutPath, 'layout.html');

            const files = <any>{ };
            files[layoutPath] = 'content';
            mockFs(files);

            // Act
            const result = await layoutService.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.equal(layoutPath);
        });

        it('throws if no fallback could not be found', async function() {
            // Arrange
            mockFs({ });

            // Act
            const result = layoutService.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.rejectedWith(Error);
        });
    });

    describe('applyLayoutAsync', function() {
        it('can apply template data', async function() {
            // Arrange
            mockFs({
                'layout.html': '{{document/title}} - {{markdown}} - {{otherProp}}'
            });

            const info = <IDocumentInformation>{
                title: 'awesome title'
            };

            const additionalData = {
                otherProp: 42
            };

            // Act
            const result = await layoutService.applyLayoutAsync('layout.html', 'markdown-html', info, additionalData);

            // Assert
            should(result).be.equal('awesome title - markdown-html - 42');
        });
    });
});