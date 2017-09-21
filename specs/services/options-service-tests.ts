/// <reference path="../include.d.ts" />

import * as should from "should";

import * as path from "path";
import { default as optionsService, IOptions } from "../../src/services/options-service";

import * as mockFs from "mock-fs";

describe('OptionsService', function() {
    describe('consolidateAsync', function() {
        it('fallbacks in correct order', async function() {
            // Arrange
            mockFs({
                'default.html': 'content',
                'document-props.json': JSON.stringify(<IOptions>{ paperFormat: 'A5' }),
                'default-props.json': JSON.stringify(<IOptions>{ paperFormat: 'A6', paperOrientation: 'landscape' })
            });

            const options = <IOptions>{
                document: 'document.md',
                template: 'default.html'
            };

            // Act
            await optionsService.consolidateAsync(options);

            // Assert
            should(options.document).be.equal('document.md');
            should(options.template).be.equal('default.html');
            should(options.paperFormat).be.equal('A5');
            should(options.paperOrientation).be.equal('landscape');
            should(options.paperBorder).be.equal('2cm');
        });
    });
});