/// <reference path="../include.d.ts" />

import * as path from "path";

import * as should from "should";

import { MetadataService } from "../../src/services/metadata-service";

describe.only('MetadataService', function() {
    const pdfFile = path.join(__dirname, '../testfiles/pdf-metadata.pdf');

    describe('getMetadataAsync', function() {
        it('returns metadata', async function() {
            this.timeout(15000);

            // Arrange
            const service = new MetadataService();

            // Act
            const result = await service.getMetadataAsync(pdfFile);
            console.log(result);

            // Assert
            should(result).not.be.null;
        });
    });
});