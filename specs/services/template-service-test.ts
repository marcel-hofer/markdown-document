/// <reference path="../include.d.ts" />

import * as should from "should";

import * as path from "path";
import { TemplateService } from "../../src/services/template-service";
import * as mockFs from "mock-fs";

describe('TemplateService', function() {
    describe('resolveTemplatePathAsync', function() {
        it('returns the path itself if absolute', async function() {
            // Arrange
            const service = new TemplateService();
            mockFs({
                '/path/to/template.html': 'content'
            });

            // Act
            const result = await service.resolveTemplatePathAsync('/path/to/template.html', null);

            // Assert
            should(result).be.equal('/path/to/template.html');
        });

        it('throws if absolute path does not exist', async function() {
            // Arrange
            const service = new TemplateService();
            mockFs({
                '/path/to/template.html': 'content'
            });

            // Act
            const result = service.resolveTemplatePathAsync('/path/to/template2.html', null);

            // Assert
            await should(result).be.rejectedWith(Error);
        });

        it('fallbacks to document path', async function() {
            // Arrange
            const service = new TemplateService();
            mockFs({
                'dir/template.html': 'content'
            });

            // Act
            const result = await service.resolveTemplatePathAsync('template.html', 'dir/document.md');

            // Assert
            should(result).be.equal(path.normalize('dir/template.html'));
        });

        it('fallbacks to template path', async function() {
            // Arrange
            const service = new TemplateService();
            const templatePath = path.join(service.templatePath, 'template.html');

            const files = <any>{ };
            files[templatePath] = 'content';
            mockFs(files);

            // Act
            const result = await service.resolveTemplatePathAsync('template.html', 'dir/document.md');

            // Assert
            should(result).be.equal(templatePath);
        });

        it('throws if no fallback could not be found', async function() {
            // Arrange
            const service = new TemplateService();
            mockFs({ });

            // Act
            const result = service.resolveTemplatePathAsync('template.html', 'dir/document.md');

            // Assert
            should(result).be.rejectedWith(Error);
        });
    });
});