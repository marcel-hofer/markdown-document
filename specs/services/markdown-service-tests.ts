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

        it('renders code blocks correctly', async function() {
            // Arrange
            const service = new MarkdownService();
            mockFs({
                'document.md': '```js\nvar x = 1;\n```'
            });

            // Act
            const result = await service.renderFileAsync('document.md');

            // Assert
            should(result.trim().replace(/\n/g, ''))
                .be.equal('<pre><code class="language-js"><span class="hljs-keyword">var</span> x = <span class="hljs-number">1</span>;</code></pre>');
        });

        it('renders html blocks correctly', async function() {
            // Arrange
            const service = new MarkdownService(true);
            mockFs({
                'document.md': 'test <strong>wusa</strong>'
            });

            // Act
            const result = await service.renderFileAsync('document.md');

            // Assert
            should(result.trim()).be.equal('<p>test <strong>wusa</strong></p>');
        });
    });
});