import * as assert from 'node:assert';
import { createSvg } from '../constants.js';

function testConstants_ShapesByKind(): void {
    assert.ok(createSvg('action').includes('height="40"'));
    assert.ok(createSvg('heading').includes('height="36"'));
    assert.ok(createSvg('input').includes('height="56"'));
    assert.ok(createSvg('media').includes('height="96"'));
}

function testConstants_UnknownKindFallsBackToLine(): void {
    const lineSvg = createSvg('text');
    assert.strictEqual(createSvg(), lineSvg);
    assert.strictEqual(createSvg('unknown-kind'), lineSvg);
}

function testConstants_CompactWidth(): void {
    assert.ok(createSvg('action', undefined, 'narrow').includes('<rect x="0" y="0" width="100%" height="40"'));
}

function testConstants_CustomNumericHeight(): void {
    assert.ok(createSvg('text', 120).includes('height="120"'));
}

function runTests(): void {
    testConstants_ShapesByKind();
    testConstants_UnknownKindFallsBackToLine();
    testConstants_CompactWidth();
    testConstants_CustomNumericHeight();
    console.log('✔ All Skeleton constants tests passed successfully.');
}

runTests();
