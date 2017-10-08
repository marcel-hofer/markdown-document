/// <reference path="include.d.ts" />

import * as should from "should";

import { IOptions, MarkdownDocument } from "../src/markdown-document";

describe('MarkdownDocument', function() {
    it('constructor throws no exception', function() {
        // Arrange
        const options = <IOptions>{ documentPath: 'example.md' };

        // Act
        const document = new MarkdownDocument(options);
    });
});