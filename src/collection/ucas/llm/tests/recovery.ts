import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';
import { createRepairRequest } from '../recovery.js';
import { createContextSchema, inferenceSchema } from '../schema.js';

test('Repair preserves the five-field contract, original context and structured validation issues', () => {
    const original = { outputSchema: z.toJSONSchema(z.object({ title: z.string() })), contextSchema: createContextSchema({ parentTo: 'area' }, { Item: { type: 'object' } }), purpose: 'Search', goal: 'Build search', limits: { depth: 1 }, provider: 'gemini' as const, model: 'test-model' };
    const { error } = z.object({ title: z.string() }).safeParse({ title: 7 });
    const repaired = createRepairRequest(original, { requestId: 'repair-1', value: { title: 7 }, error, attempt: 1 });
    const { contextSchema, sessionId, purpose, model, outputSchema } = inferenceSchema.parse(repaired);
    const { const: facts, $defs } = (contextSchema ?? {}) as { const?: unknown; $defs?: unknown };
    assert.deepEqual(facts, { original: { parentTo: 'area' }, correction: { originalGoal: original.goal, rejected: { title: 7 }, error: { message: error!.message, issues: error!.issues }, attempt: 1 } });
    assert.deepEqual([$defs, sessionId, purpose, model, outputSchema], [(original.contextSchema as { $defs?: unknown }).$defs, 'repair-1', 'Search', 'test-model', original.outputSchema]);
});
