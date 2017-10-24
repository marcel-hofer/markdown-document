/// <reference path="../../include.d.ts" />

import * as should from "should";

import { create as createHandlebarsInstance } from "handlebars";

import { ConcatHelper } from "../../../src/services/template/concat-helper";

describe('ConcatHelper', function() {
    it('concats single literal', function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `{{concat 'a'}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ });

        // Assert
        should(result).be.equal('a');
    });

    it('concats two literals', function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `{{concat 'a' 'b'}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ });

        // Assert
        should(result).be.equal('ab');
    });

    it('concats literal with variable', function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `{{concat 'a' value}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ value: 'b' });

        // Assert
        should(result).be.equal('ab');
    });
});

function initHelper() {
    const instance = createHandlebarsInstance();

    const helper = new ConcatHelper();
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}