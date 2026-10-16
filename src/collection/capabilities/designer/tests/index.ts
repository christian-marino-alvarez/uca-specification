import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Signal } from '@uca/core/types';
import { SignalType as LlmSignalType, type InferPayload } from '@uca/llm/types';
import { Designer } from '../index.js';
import { SignalType } from '../types.js';
import { outputSchema } from '../schema.js';

const emit = (bus: EventTarget, source: string, property: string, value: unknown) => bus.dispatchEvent(new CustomEvent(property, { detail: { source, property, value } }));
test('Designer owns the complete initial design inference and preserves request ownership', () => {
    const bus = new EventTarget(), requests: Signal<InferPayload>[] = [], results: Signal[] = [], designer = new Designer('composer:designer').innervate(bus);
    bus.addEventListener(LlmSignalType.INFER, (event) => requests.push((event as CustomEvent<Signal<InferPayload>>).detail));
    bus.addEventListener(SignalType.DESIGNED, (event) => results.push((event as CustomEvent<Signal>).detail));
    emit(bus, 'test', designer.updateEvent, { ...Designer.disposition, aim: { description: Designer.AIM, body: { llm: 'composer:llm' } } });
    emit(bus, 'composer', SignalType.DESIGN, { areaId: 'root', purpose: 'Explain UCA', brief: 'Clear learning experience', correlationId: 'request' });
    const { value, targetId } = requests[0]; assert.equal(targetId, 'composer:llm'); assert.ok(value.outputSchema); assert.match(value.goal, /spatial/); assert.ok(value.contextSchema.const);
    emit(bus, 'other:llm', LlmSignalType.INFERRED, { correlationId: value.correlationId, data: {} }); assert.equal(results.length, 0);
    emit(bus, 'composer:llm', LlmSignalType.INFERRED, { correlationId: value.correlationId, data: { name: 'Design' } });
    assert.equal(results[0].targetId, 'composer'); assert.equal((results[0].value as { correlationId: string }).correlationId, 'request'); designer.denervate();
});
test('A design cannot omit operational composition or distinct hierarchy responsibilities', () => {
    assert.equal(outputSchema.safeParse({ name: 'Only a color palette' }).success, false);
    const transmitted = JSON.stringify(outputSchema.toJSONSchema());
    assert.match(transmitted, /maxWidth/); assert.match(transmitted, /principles/); assert.match(transmitted, /hierarchy/);
});
