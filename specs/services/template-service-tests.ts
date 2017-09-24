/// <reference path="../include.d.ts" />

import * as should from "should";

import { TemplateService } from "../../src/services/template-service";

describe('TemplateService', function() {
    describe('applyTemplate', function() {
        it('applies template', function() {
            // Arrange
            const service = new TemplateService();

            const template = 'Hello {{firstname}} {{lastname}}';
            const data = {
                firstname: 'John',
                lastname: 'Doe'
            };

            // Act
            const result = service.applyTemplate(template, data);

            // Assert
            should(result).be.equal('Hello John Doe');
        });
    });
});