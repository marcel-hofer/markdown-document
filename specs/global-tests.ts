/// <reference path="include.d.ts" />

import * as mockFs from "mock-fs";

afterEach(function() {
    mockFs.restore();
});