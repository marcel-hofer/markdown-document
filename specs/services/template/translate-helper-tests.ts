/// <reference path="../../include.d.ts" />

import * as should from "should";
import * as mockFs from "mock-fs";

import { create as createHandlebarsInstance } from "handlebars";

import { TemplateService } from "../../../src/services/template-service";
import { TranslateHelper } from "../../../src/services/template/translate-helper";

import { mockTranslations, initServiceAsync } from "../translation-service-tests";

describe('TranslateHelper', function() {
    describe('handlebars helper', function() {
        it(`{{i18n 'title'}}`, async function() {
            // Arrange
            mockTranslations();
            const handlebars = await initHelperAsync();
    
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
            const handlebars = await initHelperAsync();
    
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
            const handlebars = await initHelperAsync();
    
            const template = `Count: {{i18n 'count' count=1}} or {{i18n 'count' count=five}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            const result = compiledTemplate({ five: 5 });
    
            // Assert
            should(result).be.equal('Count: singular or plural');
        });
    });
});

async function initHelperAsync(language: string = 'en') {
    const instance = createHandlebarsInstance();

    const service = await initServiceAsync(language);
    const helper = new TranslateHelper(service);
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}