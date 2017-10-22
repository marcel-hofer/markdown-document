/// <reference path="../../include.d.ts" />

import * as should from "should";

import { create as createHandlebarsInstance } from "handlebars";

import { LookupHelper } from "../../../src/services/template/lookup-helper";

describe('LookupHelper', function() {
    it(`can lookup single object`, function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `{{lookup user 'name'}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ user: { id: 42, name: 'John' }});

        // Assert
        should(result).be.equal('John');
    });

    it(`can lookup array`, function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `
            {{#each (lookup data 'users') as |x|}}
                {{x.name}},
            {{/each}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({ 
            data: {
                users: [
                    { id: 42, name: 'John' },
                    { id: 43, name: 'David' }
                ]
            }
        });

        // Assert
        should(result.replace(/\s/g, '')).be.equal('John,David,');
    });

    it(`can lookup array by array values`, function() {
        // Arrange
        const handlebars = initHelper();
        
        const template = `
            {{#each users as |user|}}
                {{user}}:
                {{#each (lookup ../data user) as |number|}}
                    {{number}},
                {{/each}}
            {{/each}}`;
        const compiledTemplate = handlebars.compile(template);

        // Act
        const result = compiledTemplate({
            users: ['john', 'david'],
            data: {
                john: [1, 2, 3],
                david: [4, 5, 6]
            }
        });

        // Assert
        should(result.replace(/\s/g, '')).be.equal('john:1,2,3,david:4,5,6,');
    });
});

function initHelper() {
    const instance = createHandlebarsInstance();

    const helper = new LookupHelper();
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}