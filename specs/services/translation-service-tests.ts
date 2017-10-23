/// <reference path="../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import { TranslationService } from "../../src/services/translation-service";

describe('TranslationService', function() {
    describe('languages', function() {
        it('displays correct language', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            const result = service.translate('title');
    
            // Assert
            should(result).be.equal('Das ist der titel');
        });
    
        it('displays fallback language', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            const result = service.translate('subtitle');
    
            // Assert
            should(result).be.equal('This is the subtitle');
        });
    });

    describe('layouts without translations', function() {
        it('does not throw when only fallback file exists', async function() {
            // Arrange
            mockFs({
                'document': {
                    'i18n': {
                        'en.json': `{ 
                            "title": "This is the title"
                        }`
                    }
                }
            });

            // Act
            const service = await initServiceAsync('de');

            // Assert
            const result = service.translate('title');
            should(result).be.equal('This is the title');

        });

        it('does not throw when no translation file exists', async function() {
            // Arrange
            mockFs({ });

            // Act
            const service = await initServiceAsync('de');
            
            // Assert
            const result = service.translate('title');
            should(result).be.equal('title');
        });
    });
});

export function mockTranslations() {
    mockFs({
        'document': {
            'i18n': {
                'en.json': `{ 
                    "title": "This is the title", 
                    "subtitle": "This is the subtitle",
                    "pageOf": "Page {{current}} of {{max}}",
                    "count": "singular",
                    "count_plural": "plural"
                }`,
                'de.json': `{ 
                    "title": "Das ist der titel"
                }`
            }
        }
    });
}

export async function initServiceAsync(language: string = 'en') {
    const service = new TranslationService('document', language);
    await service.initAsync();

    return service;
}