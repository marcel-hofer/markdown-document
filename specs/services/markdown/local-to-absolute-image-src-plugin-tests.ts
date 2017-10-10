/// <reference path="../../include.d.ts" />

import * as should from "should";

import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');

import { LocalToAbsoluteImageSrcPlugin } from "../../../src/services/markdown/local-to-absolute-image-src-plugin";

// TODO: Tests are based on os.platform() - change to fake os
describe('LocalToAbsoluteLinkPlugin', function() {
    let md: IRemarkable = null;
    beforeEach(function() {
        md = new Remarkable({ });
        md.use(LocalToAbsoluteImageSrcPlugin.register);
    });

    it('does not change http:// image sources', function() {
        // Arrange
        const document = `![alt text](http://domain.com/image.jpeg)`;

        // Act
        const result = md.render(document, { path: '/path/to/document.md' });
        
        // Assert
        should(result.trim()).be.equal('<p><img src="http://domain.com/image.jpeg" alt="alt text"></p>');
    });

    it('does not change https:// image sources', function() {
        // Arrange
        const document = `![alt text](https://domain.com/image.jpeg)`;

        // Act
        const result = md.render(document, { path: '/path/to/document.md' });
        
        // Assert
        should(result.trim()).be.equal('<p><img src="https://domain.com/image.jpeg" alt="alt text"></p>');
    });

    it('changes local image source', function() {
        // Arrange
        const document = `![alt text](folder/image.jpeg)`;

        // Act
        const result = md.render(document, { path: 'C:\\path\\to\\document.md' });
        
        // Assert
        should(result.trim()).be.equal('<p><img src="file:///C:/path/to/folder/image.jpeg" alt="alt text"></p>');
    });
});