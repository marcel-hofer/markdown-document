/// <reference path="../include.d.ts" />

import * as path from "path";
import * as fs from "fs";

import * as should from "should";

import { default as metadataService, IPdfMetadata } from "../../src/services/metadata-service";

describe('MetadataService', function() {
    describe('getMetadataAsync', function() {
        it('returns metadata for pdf', async function() {
            this.timeout(1000);

            // Arrange
            const pdfFile = path.join(__dirname, '../testfiles/pdf-metadata.pdf');

            // Act
            const result = await metadataService.getMetadataAsync<IPdfMetadata>(pdfFile);

            // Assert
            should(result).not.be.null;
            should(result.Title).be.equal('This is the title');
            should(result.Subject).be.equal('This is the subject');
            should(result.Author).be.equal('john@doe.com;jane@smith.com');
            should(result.Keywords).be.eql(['markdown', 'document', 'pdf']);
        });
    });

    describe('setMetadataAsync', function() {
        const originalFile = path.join(__dirname, '../testfiles/pdf-metadata-empty.pdf');
        const pdfFile = path.join(__dirname, 'pdf-metadata-empty.pdf');
        const tempFile = path.join(__dirname, 'pdf-metadata-empty.pdf_original');

        before(function() {
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        });

        it('can write metadata', async function() {
            this.timeout(1000);

            // Arrange
            fs.createReadStream(originalFile).pipe(fs.createWriteStream(pdfFile));

            // Act
            await metadataService.setMetadataAsync<IPdfMetadata>(pdfFile, {
                Title: 'This is the title',
                Subject: 'This is the subject',
                Author: 'john@doe.com;jane@smith.com',
                Language: 'en',
                Keywords: ['markdown', 'document', 'pdf']
            });
        });

        it('wrote correct metadata', async function() {
            this.timeout(1000);

            // Act
            const result = await metadataService.getMetadataAsync<IPdfMetadata>(pdfFile);

            // Assert
            should(result).not.be.null;
            should(result.Title).be.equal('This is the title');
            should(result.Subject).be.equal('This is the subject');
            should(result.Author).be.equal('john@doe.com;jane@smith.com');
            should(result.Keywords).be.eql(['markdown', 'document', 'pdf']);
        });

        it('did not created a backup file', function() {
            // Assert
            const result = fs.existsSync(tempFile);
            should(result).be.false();
        });
    });
});