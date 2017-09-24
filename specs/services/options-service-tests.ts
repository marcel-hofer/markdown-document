/// <reference path="../include.d.ts" />

import * as should from "should";

import * as path from "path";
import { default as optionsService, IOptions } from "../../src/services/options-service";

import * as mockFs from "mock-fs";

describe('OptionsService', function() {
    before(function() {
        const phantonPath = require('phantomjs-prebuilt').path;
    });

    describe('consolidateAsync', function() {
        it('fallbacks in correct order', async function() {
            // Arrange
            mockFs({
                'default.html': 'content',
                'document.json': JSON.stringify(<IOptions>{ pdf: { paperFormat: 'A5' }, document: { title: 'title' } }),
                'default.json': JSON.stringify(<IOptions>{ pdf: { paperFormat: 'A6', paperOrientation: 'landscape' } })
            });

            const options = <IOptions>{
                documentPath: 'document.md',
                template: 'default.html'
            };

            // Act
            await optionsService.consolidateAsync(options);

            // Assert
            should(options.documentPath).be.equal('document.md');
            should(options.layout).be.equal('default.html');

            should(options.pdf.phantomPath).not.be.null();
            should(options.pdf.paperFormat).be.equal('A5');
            should(options.pdf.paperOrientation).be.equal('landscape');
            should(options.pdf.paperMargin).be.equal('2cm');

            should(options.document).not.be.null();
            should(options.document.title).be.equal('title');
        });
    });
});