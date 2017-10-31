/// <reference path="../../include.d.ts" />

import * as should from "should";

import { create as createHandlebarsInstance } from "handlebars";

import { IsEmptyHelper } from "../../../src/services/template/is-empty-helper";

class CustomClass {
    public value: number;

    constructor(value?: number) {
        if (value) {
            this.value = value;
        }
    }
}

describe('IsEmptyHelper', function() {
    const tests: { context: any, expectedResult: string }[] = [
        { context: { }, expectedResult: 'true' },
        { context: { data: null }, expectedResult: 'true' },
        { context: { data: [] }, expectedResult: 'true' },
        { context: { data: [1, 2, 3] }, expectedResult: 'false' },
        { context: { data: { } }, expectedResult: 'true' },
        { context: { data: { a: 1, b: 2, c: 3 } }, expectedResult: 'false' },
        
        { context: { data: 'not null' }, expectedResult: 'false' },
        { context: { data: 42 }, expectedResult: 'false' },
        { context: { data: new CustomClass() }, expectedResult: 'true' },
        { context: { data: new CustomClass(42) }, expectedResult: 'false' },
    ];

    for (let test of tests) {
        const name = `${JSON.stringify(test.context.data)} returns ${test.expectedResult}`;

        it(name, function() {
            // Arrange
            const handlebars = initHelper();
            
            const template = `{{isEmpty data}}`;
            const compiledTemplate = handlebars.compile(template);

            // Act
            const result = compiledTemplate(test.context);

            // Assert
            should(result).be.equal(test.expectedResult);
        });
    }

    it('works with #if', function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `{{#if (isEmpty data)}}yes!{{/if}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ data: null });

        // Assert
        should(result).be.equal('yes!');
    });
});

function initHelper() {
    const instance = createHandlebarsInstance();

    const helper = new IsEmptyHelper();
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}