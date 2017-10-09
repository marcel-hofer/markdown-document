/// <reference path="../include.d.ts" />

import * as should from "should";

import { TemplateService } from "../../src/services/template-service";

describe('TemplateService', function() {
    describe('applyTemplateAsync', function() {
        it('applies template', async function() {
            // Arrange
            const service = new TemplateService({ layout: 'document' });

            const template = 'Hello {{firstname}} {{lastname}}';
            const data = {
                firstname: 'John',
                lastname: 'Doe'
            };

            // Act
            const result = await service.applyTemplateAsync(template, data);

            // Assert
            should(result).be.equal('Hello John Doe');
        });
    });
});