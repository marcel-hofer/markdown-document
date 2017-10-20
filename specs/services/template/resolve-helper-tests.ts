/// <reference path="../../include.d.ts" />

import * as should from "should";

import { create as createHandlebarsInstance } from "handlebars";

import { TemplateService } from "../../../src/services/template-service";
import { ResolveHelper } from "../../../src/services/template/resolve-helper";

describe('ResolveHelper', function() {
    describe(`{{resolve 'mocha' file='images/error.png'}}`, function() {
        let result: string;

        it(`compile does not fail`, async function() {
            // Arrange
            const handlebars = initHelper();
    
            const template = `{{resolve 'mocha' file='images/error.png'}}`;
            const compiledTemplate = handlebars.compile(template);
    
            // Act
            result = compiledTemplate({});
        });

        it(`starts with 'file://'`, function() {
            // Assert
            should(result).startWith('file://');
        });
        
        it(`ends with 'node_modules/mocha/images/error.png'`, function() {
            // Assert
            should(result).endWith('node_modules/mocha/images/error.png');
        });
    });
});

function initHelper() {
    const instance = createHandlebarsInstance();

    const helper = new ResolveHelper();
    instance.registerHelper(helper.name, helper.onExecute.bind(helper));

    return instance;
}