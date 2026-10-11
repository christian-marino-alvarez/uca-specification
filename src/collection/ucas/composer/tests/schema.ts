import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nodeSchema, schemaForParent } from '../schema.js';
import { CHILDREN } from './constants.js';

test('The composition contract requires purpose, context and spatial dimensions', () => {
    assert.equal(nodeSchema.safeParse({ purpose: 'Navigate' }).success, false);
    assert.equal(nodeSchema.safeParse(CHILDREN.navigation).success, true);
    assert.equal(nodeSchema.safeParse({ ...CHILDREN.navigation, style: 'display:flex' }).success, false);
});

test('A host can receive only immediate children and cannot reproduce itself', () => {
    const schema = schemaForParent('app');
    assert.equal(schema.safeParse(CHILDREN).success, true);
    assert.equal(schema.safeParse({ app: CHILDREN.navigation }).success, false);
    assert.equal(schema.safeParse({ nested: { ...CHILDREN.navigation, parentTo: 'navigation' } }).success, false);
});

test('Schema accepts flat NDJSON objects and converts numeric dimensions into percentages', () => {
    const schema = schemaForParent('app');
    const flatChunk = { id: 'app:menu-bar', purpose: 'Menu', context: 'Top', parentTo: 'app', dimensions: { width: 1.0, height: 0.05 } };
    const parsed = schema.safeParse(flatChunk);
    assert.equal(parsed.success, true);
    if (parsed.success) {
        assert.deepEqual(parsed.data, {
            'app:menu-bar': {
                purpose: 'Menu',
                context: 'Top',
                parentTo: 'app',
                dimensions: { width: '100%', height: '5%' },
            },
        });
    }
});

