import * as assert from 'node:assert';
import { __DEFAULT_TAG__, __DEFAULT_OBSERVED_ATTRIBUTES__, __DEFAULT_DOM_EVENTS__ } from '../constants.js';

function testConstants_DefaultTag(): void {
    assert.strictEqual(__DEFAULT_TAG__, 'ext-component');
}

function testConstants_DefaultObservedAttributes(): void {
    assert.ok(Array.isArray(__DEFAULT_OBSERVED_ATTRIBUTES__));
    assert.ok(__DEFAULT_OBSERVED_ATTRIBUTES__.includes('class'));
    assert.ok(__DEFAULT_OBSERVED_ATTRIBUTES__.includes('style'));
    assert.ok(__DEFAULT_OBSERVED_ATTRIBUTES__.includes('hidden'));
    assert.ok(__DEFAULT_OBSERVED_ATTRIBUTES__.includes('title'));
    assert.ok(__DEFAULT_OBSERVED_ATTRIBUTES__.includes('tag'));
}

function testConstants_DefaultDomEvents(): void {
    assert.ok(Array.isArray(__DEFAULT_DOM_EVENTS__));
    assert.ok(__DEFAULT_DOM_EVENTS__.includes('click'));
    assert.ok(__DEFAULT_DOM_EVENTS__.includes('input'));
    assert.ok(__DEFAULT_DOM_EVENTS__.includes('change'));
}

function runAllConstantTests(): void {
    testConstants_DefaultTag();
    testConstants_DefaultObservedAttributes();
    testConstants_DefaultDomEvents();

    console.log('✔ All WebComponent constants tests passed successfully.');
}

runAllConstantTests();
