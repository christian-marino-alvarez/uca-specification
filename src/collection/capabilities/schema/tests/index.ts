import assert from 'node:assert/strict';
import { z } from 'zod';
import { Schema } from '../index.js';
import { SignalType } from '../types.js';
import type { Signal } from '@uca/core/types';
const bus = new EventTarget();
const signals: Signal[] = [];
bus.addEventListener('*', (event) => signals.push((event as CustomEvent<Signal>).detail));
const schema = new Schema('owner:schema').innervate(bus);
function emit(property: string, value: unknown): void {
    bus.dispatchEvent(new CustomEvent(property, { detail: { source: 'test', property, value, timestamp: Date.now() } }));
}
emit(schema.updateEvent, Schema.disposition);
const contract = z.object({ name: z.string() }).strict();
emit(SignalType.VALIDATE, { id: schema.id, schema: contract, value: { name: 'Valid' }, context: 'request' });
emit(SignalType.VALIDATE, { id: schema.id, schema: contract, value: { name: 1 }, context: 'invalid' });
emit(SignalType.VALIDATE, { id: 'another:schema', schema: contract, value: { name: 'Ignored' } });
assert.equal(signals.filter(({ property }) => property === SignalType.VALIDATED).length, 1);
assert.equal(signals.filter(({ property }) => property === SignalType.ERROR).length, 1);
assert.deepEqual(signals.find(({ property }) => property === SignalType.VALIDATED)?.value, { value: { name: 'Valid' }, context: 'request' });
assert.equal(signals.find(({ property }) => property === SignalType.VALIDATED)?.targetId, 'owner');
schema.denervate();
console.log('Schema validation and Core routing passed');
