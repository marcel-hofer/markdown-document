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

    describe('custom translations', function() {
        it('should overwrite existing key', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            service.overwriteTranslations({
                title: 'My custom translation'
            })
    
            // Assert
            const result = service.translate('title');
            should(result).be.equal('My custom translation');
        });

        it('should extend non existing keys (with fallback)', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            service.overwriteTranslations({
                subtitle: 'My custom translation'
            })
    
            // Assert
            const result = service.translate('subtitle');
            should(result).be.equal('My custom translation');

            const result2 = service.translate('title');
            should(result2).be.equal('Das ist der titel');
        });

        it('should extend non existing keys (without fallback)', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            service.overwriteTranslations({
                invalid: 'My custom translation'
            })
    
            // Assert
            const result = service.translate('invalid');
            should(result).be.equal('My custom translation');
        });

        it('should work deep', async function() {
            // Arrange
            mockTranslations();
            const service = await initServiceAsync('de');
    
            // Act
            service.overwriteTranslations({
                child: {
                    title: 'My custom translation'
                }
            })
    
            // Assert
            const result = service.translate('child.title');
            should(result).be.equal('My custom translation');
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