/// <reference path="../../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import * as handlebars from "handlebars";

import { TemplateService } from "../../../src/services/template-service";
import { TranslateHelper } from "../../../src/services/template/translate-helper";

describe('TranslateHelper', function() {
    it(`{{i18n 'title'}}`, async function() {
        // Arrange
        mockTranslations();
        await initHelper();

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
        await initHelper();

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
        await initHelper();

        const template = `Count: {{i18n 'count' count=1}} or {{i18n 'count' count=five}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ five: 5 });

        // Assert
        should(result).be.equal('Count: singular or plural');
    });
});

function mockTranslations() {
    mockFs({
        'document': {
            'i18n': {
                'en.json': `{ 
                    "title": "This is the title", 
                    "pageOf": "Page {{current}} of {{max}}",
                    "count": "singular",
                    "count_plural": "plural"
                }`
            }
        }
    });
}

async function initHelper() {
    const helper = new TranslateHelper('document');
    await helper.init();
    helper.register();
}