/// <reference path="../include.d.ts" />

import * as should from "should";
import * as fs from "fs";
import * as path from "path";

import { TempPath } from "../../src/helpers/temp-path";

describe('TempPath', function() {
    describe('deleteAsync', function() {
        it('executes callback', async function() {
            // Arrange
            let callbackExecuted = false;
            const tempPath = new TempPath('file.md', () => callbackExecuted = true)

            // Act
            await tempPath.deleteAsync();

            // Assert
            should(callbackExecuted).be.true();
        });

        it('does not execute callback if nothing defined', async function() {
            // Arrange
            const tempPath = new TempPath('file.md');

            // Act
            await tempPath.deleteAsync();
        });
    });
});