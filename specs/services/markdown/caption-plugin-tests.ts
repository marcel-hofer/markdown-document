/// <reference path="../../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');

import { CaptionPlugin, ICaptionMeta } from "../../../src/services/markdown/caption-plugin";
import { IncludePlugin } from "../../../src/services/markdown/include-plugin";
const RemarkableKatex = require('remarkable-katex');

describe('CaptionPlugin', function() {
    describe('REGEX', function() {
        const tests = [
            // Optimal case
            { input: '@(caption table:Abc)', match: true, type: 'table', title: 'Abc' },

            // Whitespace cases
            { input: '@(caption table :Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table: Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table:Abc )', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption  table:Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table:Abc) ', match: true, type: 'table', title: 'Abc' },
            { input: ' @(caption table:Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '    @(caption table:Abc)', match: true, type: 'table', title: 'Abc' },

            // Special cases
            { input: '@(caption figure:Abc)', match: true, type: 'figure', title: 'Abc' },
            { input: '@(caption table:This is an awesome table)', match: true, type: 'table', title: 'This is an awesome table' },
            { input: '@(caption table:A:b:c)', match: true, type: 'table', title: 'A:b:c' },
            { input: '@(caption table:A(b)c)', match: true, type: 'table', title: 'A(b)c' },

            // Non-matching cases
            { input: '# Title', match: false, type: '', title: '' },
            { input: '(caption table:Abc)', match: false, type: '', title: '' },
            { input: '@caption table:Abc', match: false, type: '', title: '' },
            { input: '@(caption table:Abc', match: false, type: '', title: '' },
            { input: '@(caption table)', match: false, type: '', title: '' }
        ];

        for (let test of tests) {
            let testName = `'${test.input}'`;
            if (test.match) {
                testName += ` should return type='${test.type}', title='${test.title}'`;
            } else {
                testName  += ' should not match'
            }

            it(testName, function() {
                // Arrange

                // Act
                const match = CaptionPlugin.REGEX.exec(test.input);
                
                // Assert
                if (test.match) {
                    should(match).not.be.null();

                    should(match[1]).be.equal(test.type);
                    should(match[2]).be.equal(test.title);
                } else {
                    should(match).be.null();
                }
            });
        }
    });

    describe('plugin', function() {
        let md: IRemarkable = null;
        beforeEach(function() {
            md = new Remarkable({ });
            md.use(CaptionPlugin.register);
        });

        it('creates empty meta', function() {
            // Assert
            should(md.meta).not.be.null();
            should(md.meta.captions).not.be.null();
        });

        it('renders correct html', function() {
            // Arrange
            const document = `@(caption table:Abc)`;

            // Act
            const result = md.render(document);

            // Assert
            should(result).be.equal('<a name="table-1"></a><div class="caption caption-table">Abc</div>');
        });

        it('adds metadata for single caption', function() {
            // Arrange
            const document = `@(caption table:Abc)`;
            
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'table', [
                { index: 1, link: 'table-1', title: 'Abc' }
            ]);
        });

        it('adds metadata for muliple captions of same type', function() {
            // Arrange
            const document = `@(caption table:Abc)
            @(caption table:Cba)`;
            
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'table', [
                { index: 1, link: 'table-1', title: 'Abc' },
                { index: 2, link: 'table-2', title: 'Cba' }
            ]);
        });

        it('adds metadata for multiple captions of different types', function() {
            // Arrange
            const document = `@(caption table:Abc)
            @(caption figure:Cba)`;
            
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'table', [
                { index: 1, link: 'table-1', title: 'Abc' }
            ]);
            assertMetadata(md, 'figure', [
                { index: 1, link: 'figure-1', title: 'Cba' }
            ]);
        });

        xit('works when using with images', function() {
            // Arrange
            const document = `@(caption figure:Abc)
![alt text](image.png)
@(caption figure:Cba)`;
            
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'figure', [
                { index: 1, link: 'figure-1', title: 'Abc' },
                { index: 2, link: 'figure-2', title: 'Cba' }
            ]);
        });

        xit('works when using with tables', function() {
            // Arrange
            const document = `@(caption table:Abc)
| | Col 1 | Col 2|
|---|---|
| Row 1 | Row 2 |
@(caption table:Cba)`;
                        
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'table', [
                { index: 1, link: 'table-1', title: 'Abc' },
                { index: 2, link: 'table-2', title: 'Cba' }
            ]);
        });

        it('works when using with code', function() {
            // Arrange
            const document = `@(caption code:Abc)
\`\`\`javascript
var value = 42;
alert(value.toString());
\`\`\`
@(caption code:Cba)`;
                        
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'code', [
                { index: 1, link: 'code-1', title: 'Abc' },
                { index: 2, link: 'code-2', title: 'Cba' }
            ]);
        });

        xit('works when using with formulas', function() {
            // Arrange
            md.use(RemarkableKatex);
            const document = `@(caption formula:Abc)
$$
f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi
$$
@(caption formula:Cba)`;
                        
            // Act
            const result = md.render(document);

            // Assert
            assertMetadata(md, 'formula', [
                { index: 1, link: 'formula-1', title: 'Abc' },
                { index: 2, link: 'formula-2', title: 'Cba' }
            ]);
        });

        it('works together with include plugin', function() {
            // Arrange
            md.use(IncludePlugin.register);

            const document = `@(caption table:Abc)
            @(include file1.md)`;
            mockFs({
                'file1.md': '@(caption table:Cba)'
            });

            // Act
            const result = md.render(document, { path: 'document.md' });
            
            // Assert
            assertMetadata(md, 'table', [
                { index: 1, link: 'table-1', title: 'Abc' },
                { index: 2, link: 'table-2', title: 'Cba' }
            ]);
        });
    });
});

function assertMetadata(md: IRemarkable, type: string, meta: ICaptionMeta[]) {
    should(md.meta.captions[type]).not.be.undefined();

    const result: ICaptionMeta[] = md.meta.captions[type];
    should(result).be.deepEqual(meta);
}