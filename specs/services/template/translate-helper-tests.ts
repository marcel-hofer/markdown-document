/// <reference path="../../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import { create as createHandlebarsInstance } from "handlebars";

import { TemplateService } from "../../../src/services/template-service";
import { TranslateHelper } from "../../../src/services/template/translate-helper";

describe('TranslateHelper', function() {
    describe('handlebars helper', function() {
        it(`{{i18n 'title'}}`, async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelper();
    
            const template = `Title: {{i18n 'title'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({});
    
            // Assert
            should(result).be.equal('Title: This is the title');
        });
    
        it(`{{i18n 'pageOf' current=currentPage max=42}}`, async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelper();
    
            const template = `Pages: {{i18n 'pageOf' current=currentPage max=42}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({ currentPage: 24 });
    
            // Assert
            should(result).be.equal('Pages: Page 24 of 42');
        });
    
        it(`{{i18n 'count' count=1}} or {{i18n 'count' count=five}}`, async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelper();
    
            const template = `Count: {{i18n 'count' count=1}} or {{i18n 'count' count=five}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({ five: 5 });
    
            // Assert
            should(result).be.equal('Count: singular or plural');
        });
    });
    
    describe('languages', function() {
        it('displays correct language', async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelper('de');
    
            const template = `German: {{i18n 'title'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({ });
    
            // Assert
            should(result).be.equal('German: Das ist der titel');
        });
    
        it('displays fallback language', async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelper('de');
    
            const template = `Fallback: {{i18n 'subtitle'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({ });
    
            // Assert
            should(result).be.equal('Fallback: This is the subtitle');
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
            const handlebars = await initHelper('de');

            // Assert
            const template = `Result: {{i18n 'title'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            const result = compiledTemplate({ });
    
            // Assert
            should(result).be.equal('Result: This is the title');

        });

        it('does not throw when no translation file exists', async function() {
            // Arrange
            mockFs({ });

            // Act
            const handlebars = await initHelper('de');
            
            // Assert
            const template = `Result: {{i18n 'title'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            const result = compiledTemplate({ });
    
            // Assert
            should(result).be.equal('Result: title');
        });
    })
});

function mockTranslations() {
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

async function initHelper(language: string = 'en') {
    const instance = createHandlebarsInstance();

    const helper = new TranslateHelper('document', language);
    await helper.init();
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}