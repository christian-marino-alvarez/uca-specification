import * as assert from 'node:assert';
import * as Core from '../index.js';

function testCoreExports(): void {
    assert.notStrictEqual(Core.Capability, undefined);
    assert.notStrictEqual(Core.Uca, undefined);
}

testCoreExports();
console.log('✔ All Core index barrel export tests passed successfully.');
