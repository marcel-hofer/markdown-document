/// <reference path="../include.d.ts" />

import * as should from "should";

import * as path from "path";
import { LayoutService } from "../../src/services/layout-service";
import * as mockFs from "mock-fs";

describe('LayoutService', function() {
    describe('resolveLayoutPathAsync', function() {
        it('returns the path itself if absolute', async function() {
            // Arrange
            const service = new LayoutService();
            mockFs({
                '/path/to/layout.html': 'content'
            });

            // Act
            const result = await service.resolveLayoutPathAsync('/path/to/layout.html', null);

            // Assert
            should(result).be.equal('/path/to/layout.html');
        });

        it('throws if absolute path does not exist', async function() {
            // Arrange
            const service = new LayoutService();
            mockFs({
                '/path/to/layout.html': 'content'
            });

            // Act
            const result = service.resolveLayoutPathAsync('/path/to/layout2.html', null);

            // Assert
            await should(result).be.rejectedWith(Error);
        });

        it('fallbacks to document path', async function() {
            // Arrange
            const service = new LayoutService();
            mockFs({
                'dir/layout.html': 'content'
            });

            // Act
            const result = await service.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.equal(path.normalize('dir/layout.html'));
        });

        it('fallbacks to layout path', async function() {
            // Arrange
            const service = new LayoutService();
            const layoutPath = path.join(service.layoutPath, 'layout.html');

            const files = <any>{ };
            files[layoutPath] = 'content';
            mockFs(files);

            // Act
            const result = await service.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.equal(layoutPath);
        });

        it('throws if no fallback could not be found', async function() {
            // Arrange
            const service = new LayoutService();
            mockFs({ });

            // Act
            const result = service.resolveLayoutPathAsync('layout.html', 'dir/document.md');

            // Assert
            should(result).be.rejectedWith(Error);
        });
    });
});