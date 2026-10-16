import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';
import { StreamTransformer } from '../index.js';
import { __ID__, AIM } from '../constants.js';
import { Mode, SignalType, type RecoveryRequest, type ValidationRequest, type ErrorResult } from '../types.js';
import { collect, createHarness, emit, observe, textStream } from './support.js';
import './parser.js';

const schema = z.record(z.string(), z.object({ purpose: z.string() }));
const invalidMiddle = '{"first":{"purpose":"one"},"second":{"purpose":false},"third":{"purpose":"three"}}';

test('identity and declared reactive ports', () => {
    const transformer = new StreamTransformer();
    const { id } = transformer;
    const { AIM: aim, disposition } = StreamTransformer;
    const { inputs, outputs } = disposition;
    assert.equal(id, __ID__); assert.equal(aim, AIM);
    assert.equal(inputs?.length, 5); assert.equal(outputs?.length, 4);
});

test('schema recovery retains the invalid entry until the correction passes', async () => {
    const harness = createHarness(); const { bus, start, dispose } = harness;
    const attempts: number[] = [];
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId, attempt, context }) => {
        assert.deepEqual(context, { purpose: 'layout' }); attempts.push(attempt);
        emit(bus, SignalType.REPAIR, { requestId, value: { second: { purpose: 'two' } } });
    });
    const result = await collect(start({ stream: textStream([...invalidMiddle]), schema, context: { purpose: 'layout' } }));
    assert.deepEqual(result, [{ first: { purpose: 'one' } }, { second: { purpose: 'two' } }, { third: { purpose: 'three' } }]);
    assert.deepEqual(attempts, [1]); dispose();
});

test('one coalesced fragment preserves valid siblings around a repaired entry', async () => {
    const { bus, start, dispose } = createHarness();
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId }) => emit(bus, SignalType.REPAIR, { requestId, value: { second: { purpose: 'two' } } }));
    const result = await collect(start({ stream: textStream([invalidMiddle]), schema }));
    assert.deepEqual(result.map((entry) => Object.keys(entry)[0]), ['first', 'second', 'third']);
    dispose();
});

test('exhausted repair rejects output instead of dropping an invalid item', async () => {
    const { bus, start, dispose } = createHarness(); const attempts: number[] = []; const errors: ErrorResult[] = [];
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId, attempt }) => {
        attempts.push(attempt); emit(bus, SignalType.REPAIR, { requestId, value: { second: { purpose: false } } });
    });
    observe<ErrorResult>(bus, SignalType.ERROR, (value) => errors.push(value));
    await assert.rejects(collect(start({ stream: textStream([invalidMiddle]), schema, correlationId: 'failure', maxAttempts: 2 })));
    assert.deepEqual(attempts, [1, 2]); assert.equal(errors.length, 1);
    assert.equal(errors[0]?.correlationId, 'failure'); dispose();
});

test('repair cannot replace an accepted identifier', async () => {
    const { bus, start, dispose } = createHarness();
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId }) => emit(bus, SignalType.REPAIR, { requestId, value: { first: { purpose: 'wrong slot' } } }));
    await assert.rejects(collect(start({ stream: textStream([invalidMiddle]), schema, maxAttempts: 1 })), /cannot replace an accepted identifier/);
    dispose();
});

test('document mode repairs a whole graph and validates it again', async () => {
    const { bus, start, dispose } = createHarness(); const attempts: number[] = [];
    const graph = schema.refine((value) => Object.keys(value).length === 2, 'Two nodes are required');
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId, attempt }) => {
        attempts.push(attempt); emit(bus, SignalType.REPAIR, { requestId, value: { first: { purpose: 'one' }, second: { purpose: 'two' } } });
    });
    const result = await collect(start({ stream: textStream(['{"first":{"purpose":"one"}}']), schema: graph, mode: Mode.DOCUMENT }));
    assert.equal(result.length, 1); assert.deepEqual(Object.keys(result[0]), ['first', 'second']);
    assert.deepEqual(attempts, [1]); dispose();
});

test('unanswered validation times out with its correlation and context', async () => {
    const { bus, start, dispose } = createHarness(false); const errors: ErrorResult[] = [];
    observe<ErrorResult>(bus, SignalType.ERROR, (value) => errors.push(value));
    await assert.rejects(collect(start({ stream: textStream(['{"first":{"purpose":"one"}}']), schema, timeoutMs: 5, correlationId: 'timeout', context: 'original' })), /timed out/);
    assert.equal(errors[0]?.correlationId, 'timeout'); assert.equal(errors[0]?.context, 'original'); dispose();
});

test('late and wrong-stage responses cannot release the pending queue position', async () => {
    const { bus, start, dispose } = createHarness(false);
    observe<ValidationRequest>(bus, SignalType.VALIDATE, ({ requestId, value }) => {
        emit(bus, SignalType.ACCEPT, { requestId: 'stale-request', value });
        emit(bus, SignalType.REPAIR, { requestId, value });
    });
    await assert.rejects(collect(start({ stream: textStream(['{"first":{}}']), schema, timeoutMs: 5 })), /timed out/);
    dispose();
});

test('explicit cancellation interrupts a pending validation without a recovery error', async () => {
    const { bus, start, dispose } = createHarness(false); const errors: ErrorResult[] = [];
    observe<ValidationRequest>(bus, SignalType.VALIDATE, () => emit(bus, SignalType.CANCEL, { correlationId: 'cancel' }));
    observe<ErrorResult>(bus, SignalType.ERROR, (value) => errors.push(value));
    await assert.rejects(collect(start({ stream: textStream(['{"first":{}}']), schema, correlationId: 'cancel' })), { name: 'AbortError' });
    assert.equal(errors.length, 0); dispose();
});

test('denervation settles outstanding waits and rejects future reads', async () => {
    const { bus, transformer, start, dispose } = createHarness(false);
    observe<ValidationRequest>(bus, SignalType.VALIDATE, () => transformer.denervate());
    await assert.rejects(collect(start({ stream: textStream(['{"first":{}}']), schema })), { name: 'AbortError' });
    dispose();
});

test('parent abort signal interrupts pending recovery', async () => {
    const { bus, start, dispose } = createHarness(); const controller = new AbortController();
    observe<RecoveryRequest>(bus, SignalType.RECOVER, () => controller.abort());
    await assert.rejects(collect(start({ stream: textStream([invalidMiddle]), schema, signal: controller.signal })), { name: 'AbortError' });
    dispose();
});

test('locked source is a readable rejection with structured transformation error', async () => {
    const { bus, start, dispose } = createHarness(); const errors: ErrorResult[] = [];
    const source = textStream(['{}']); const reader = source.getReader();
    observe<ErrorResult>(bus, SignalType.ERROR, (value) => errors.push(value));
    await assert.rejects(collect(start({ stream: source, correlationId: 'locked' })), TypeError);
    assert.equal(errors[0]?.correlationId, 'locked'); reader.releaseLock(); dispose();
});

test('an empty rejected map can recover into one named entry', async () => {
    const { bus, start, dispose } = createHarness();
    const required = schema.refine((value) => Object.keys(value).length > 0, 'At least one entry is required');
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId }) => emit(bus, SignalType.REPAIR, { requestId, value: { first: { purpose: 'one' } } }));
    assert.deepEqual(await collect(start({ stream: textStream(['{}']), schema: required })), [{ first: { purpose: 'one' } }]);
    dispose();
});

test('repair can correct an invalid unpublished identifier', async () => {
    const { bus, start, dispose } = createHarness();
    const identifiers = z.record(z.string().regex(/^[a-z]+$/), z.object({ purpose: z.string() }));
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId }) => emit(bus, SignalType.REPAIR, { requestId, value: { valid: { purpose: 'one' } } }));
    assert.deepEqual(await collect(start({ stream: textStream(['{"bad-id":{"purpose":"one"}}']), schema: identifiers })), [{ valid: { purpose: 'one' } }]);
    dispose();
});

test('renamed repairs reserve their identifier against later original entries', async () => {
    const { bus, start, dispose } = createHarness(); const requests: RecoveryRequest[] = [];
    observe<RecoveryRequest>(bus, SignalType.RECOVER, (request) => {
        requests.push(request); const { requestId } = request;
        emit(bus, SignalType.REPAIR, { requestId, value: { [requests.length === 1 ? 'second' : 'third']: { purpose: 'fixed' } } });
    });
    const result = await collect(start({ stream: textStream(['{"first":{"purpose":false},"second":{"purpose":"two"}}']), schema }));
    assert.deepEqual(result.map((value) => Object.keys(value)[0]), ['second', 'third']);
    assert.deepEqual(requests[1]?.acceptedKeys, ['second']); dispose();
});

test('a repair cannot inject multiple entries into one pending position', async () => {
    const { bus, start, dispose } = createHarness();
    observe<RecoveryRequest>(bus, SignalType.RECOVER, ({ requestId }) => emit(bus, SignalType.REPAIR, { requestId, value: { alpha: { purpose: 'one' }, beta: { purpose: 'two' } } }));
    await assert.rejects(collect(start({ stream: textStream([invalidMiddle]), schema, maxAttempts: 1 })), /contain one key/);
    dispose();
});

test('consumer cancellation releases validation and cancels the source', async () => {
    const { bus, start, dispose } = createHarness(false); let cancelled = false;
    let validated!: () => void; const validation = new Promise<void>((resolve) => { validated = resolve; });
    observe<ValidationRequest>(bus, SignalType.VALIDATE, () => validated());
    const source = new ReadableStream<string>({ start(controller) { controller.enqueue('{"first":{}}'); }, cancel() { cancelled = true; } });
    const reader = start({ stream: source, schema }).getReader(); const pending = reader.read();
    await validation; await reader.cancel();
    assert.deepEqual(await pending, { done: true, value: undefined }); assert.equal(cancelled, true); dispose();
});
