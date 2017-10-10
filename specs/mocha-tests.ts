/// <reference path="include.d.ts" />

import * as should from "should";
import * as q from "q";

describe('mocha', function() {
    it('should test correctly', function() {
        should(1).be.equal(1);
        should('test').be.equal('test');
    });

    it('should await promise', async function() {
        let result = await createPromise('delay', 10);
        should(result).be.equal('delay');
    })
});

function createPromise(value: string, delay: number = 50) {
    let deferred = q.defer<string>();
    setTimeout(() => deferred.resolve(value), delay);
    return deferred.promise;
}