/// <reference path="../../include.d.ts" />

import * as should from "should";

import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');

import { CaptionPlugin } from "../../../src/services/markdown/caption-plugin";

describe('CaptionPlugin', function() {
    describe('regex', function() {
        const tests = [
            // Optimal case
            { input: '@(caption table:Abc)', match: true, type: 'table', title: 'Abc' },

            // Whitespace cases
            { input: '@(caption table :Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table: Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table:Abc )', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption  table:Abc)', match: true, type: 'table', title: 'Abc' },
            { input: '@(caption table:Abc) ', match: true, type: 'table', title: 'Abc' },
            { input: ' @(caption table:Abc)', match: true, type: 'table', title: 'Abc' },

            // Special cases
            { input: '@(caption figure:Abc)', match: true, type: 'figure', title: 'Abc' },
            { input: '@(caption table:This is an awesome table)', match: true, type: 'table', title: 'This is an awesome table' },
            { input: '@(caption table:A:b:c)', match: true, type: 'table', title: 'A:b:c' },
            { input: '@(caption table:A(b)c)', match: true, type: 'table', title: 'A(b)c' },

            // Non-matching cases
            { input: '# Title', match: false, type: '', title: '' },
            { input: '(caption table:Abc)', match: false, type: '', title: '' },
            { input: '@caption table:Abc', match: false, type: '', title: '' },
            { input: '@(caption table:Abc', match: false, type: '', title: '' },
            { input: '@(caption table)', match: false, type: '', title: '' }
        ];

        for (let test of tests) {
            let testName = `'${test.input}'`;
            if (test.match) {
                testName += ` should return type='${test.type}', title='${test.title}'`;
            } else {
                testName  += ' should not match'
            }

            it(testName, function() {
                // Arrange

                // Act
                const match = CaptionPlugin.regex.exec(test.input);
                
                // Assert
                if (test.match) {
                    should(match).not.be.null();

                    should(match[1]).be.equal(test.type);
                    should(match[2]).be.equal(test.title);
                } else {
                    should(match).be.null();
                }
            });
        }
    });
});