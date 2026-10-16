import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';
import { allocationSchema, createAllocationSchema, createBindingSchema, createInvocationSchema } from '../schema.js';
import { EventType, type Context } from '../types.js';

const context: Context = { scope: 'app', purpose: 'Explain a concept', fields: { question: 'Question to explain' }, operations: { explain: { description: 'Explain the question', parameters: { request: 'Question content' } } } };
test('Dynamic schemas advertise actual operations, parameters and field choices', () => {
    const schema = createBindingSchema(context), description = JSON.stringify(z.toJSONSchema(schema));
    assert.match(description, /"const":"explain"/); assert.match(description, /"enum":\["question"\]/);
    assert.equal(schema.safeParse({ event: EventType.CLICK, operation: 'explain', arguments: { request: 'question' } }).success, true);
    assert.equal(schema.safeParse({ event: EventType.INPUT, operation: 'explain', arguments: { request: 'question' } }).success, false);
    assert.equal(schema.safeParse({ event: EventType.CLICK, operation: 'explain', arguments: {} }).success, false);
    assert.equal(schema.safeParse({ event: EventType.CLICK, operation: 'explain', arguments: { request: 'question', extra: 'question' } }).success, false);
});
test('Invocation accepts empty content but enforces the declared operation argument contract', () => {
    const schema = createInvocationSchema(context, 'explain');
    assert.equal(schema.safeParse({ scope: 'app', operation: 'explain', arguments: { request: '' } }).success, true);
    assert.equal(schema.safeParse({ scope: 'other', operation: 'explain', arguments: { request: 'Question' } }).success, false);
    assert.equal(schema.safeParse({ scope: 'app', operation: 'explain', arguments: { request: 123 } }).success, false);
    assert.equal(schema.safeParse({ scope: 'app', operation: 'explain', arguments: {} }).success, false);
});

test('Allocation requires both lists and rejects unrelated properties without requiring controls', () => {
    assert.deepEqual(allocationSchema.parse({ fields: [], operations: [] }), { fields: [], operations: [] });
    assert.equal(allocationSchema.safeParse({ fields: [] }).success, false);
    assert.equal(allocationSchema.safeParse({ operations: [] }).success, false);
    assert.equal(allocationSchema.safeParse({ fields: [], operations: [], position: 'header' }).success, false);
});

test('Dynamic allocation publishes only declared names and rejects invented responsibilities', () => {
    const schema = createAllocationSchema(context), { properties, required, additionalProperties, description } = z.toJSONSchema(schema);
    assert.deepEqual(properties?.fields, { type: 'array', items: { type: 'string', enum: ['question'] } });
    assert.deepEqual(properties?.operations, { type: 'array', items: { type: 'string', enum: ['explain'] } });
    assert.deepEqual(required, ['fields', 'operations']); assert.equal(additionalProperties, false); assert.match(description ?? '', /cross-area bindings/);
    assert.equal(schema.safeParse({ fields: ['question'], operations: ['explain'] }).success, true);
    assert.equal(schema.safeParse({ fields: ['invented'], operations: ['explain'] }).success, false);
    assert.equal(schema.safeParse({ fields: ['question'], operations: ['invented'] }).success, false);
    assert.equal(schema.safeParse({ fields: [], operations: [] }).success, true);
});

test('Child allocation cannot expand its parent even when other names exist globally', () => {
    const { fields, operations } = context;
    const expanded: Context = { ...context, fields: { ...fields, locale: 'Response language' }, operations: { ...operations, inspect: { description: 'Inspect concept', parameters: {} } } };
    const schema = createAllocationSchema(expanded, { fields: ['question', 'invented'], operations: ['explain', 'invented'] });
    assert.equal(schema.safeParse({ fields: ['question'], operations: ['explain'] }).success, true);
    assert.equal(schema.safeParse({ fields: ['locale'], operations: ['explain'] }).success, false);
    assert.equal(schema.safeParse({ fields: ['question'], operations: ['inspect'] }).success, false);
    assert.equal(schema.safeParse({ fields: ['invented'], operations: ['invented'] }).success, false);
});

test('Empty parent allocation permits only empty arrays and exposes zero-item limits', () => {
    const schema = createAllocationSchema(context, { fields: [], operations: [] }), { properties } = z.toJSONSchema(schema);
    assert.deepEqual(schema.parse({ fields: [], operations: [] }), { fields: [], operations: [] });
    assert.equal(schema.safeParse({ fields: ['question'], operations: [] }).success, false);
    assert.equal(schema.safeParse({ fields: [], operations: ['explain'] }).success, false);
    assert.deepEqual(properties?.fields, { type: 'array', items: { type: 'string' }, maxItems: 0 });
    assert.deepEqual(properties?.operations, { type: 'array', items: { type: 'string' }, maxItems: 0 });
});

test('Empty context does not admit invented names from a parent allocation', () => {
    const schema = createAllocationSchema({ ...context, fields: {}, operations: {} }, { fields: ['question'], operations: ['explain'] });
    assert.deepEqual(schema.parse({ fields: [], operations: [] }), { fields: [], operations: [] });
    assert.equal(schema.safeParse({ fields: ['question'], operations: ['explain'] }).success, false);
});

test('Local action responsibility preserves shared fields for bindings captured elsewhere', () => {
    const previous = structuredClone(context), allocation = { fields: [], operations: ['explain'] };
    assert.deepEqual(createAllocationSchema(context, allocation).parse(allocation), allocation);
    assert.equal(createBindingSchema(context).safeParse({ event: EventType.CLICK, operation: 'explain', arguments: { request: 'question' } }).success, true);
    assert.deepEqual(context, previous);
});
