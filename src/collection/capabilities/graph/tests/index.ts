import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import { DispositionSignal, type Disposition, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { Graph, SignalType, DataType, __ID__, AIM, type ResolvedResult, type RetryPayload } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testGraph_IdentityAndDefaults(): void {
    const graph = new Graph();
    assert.ok(graph instanceof Capability);
    assert.strictEqual(graph.id, __ID__);
    assert.strictEqual(Graph.AIM, AIM);
    const { inputs, outputs, aim } = graph.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(inputs?.[0]?.type, DataType.RESOLVE_PAYLOAD);
    assert.strictEqual(inputs?.[1]?.type, DataType.STREAM_CHUNK_PAYLOAD);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(outputs?.[0]?.type, DataType.RESOLVED_RESULT);
    assert.strictEqual(outputs?.[1]?.type, DataType.UCA_DETECTED_PAYLOAD);
    assert.strictEqual(outputs?.[2]?.type, DataType.RETRY_PAYLOAD);
    assert.strictEqual(aim.description, AIM);
}

function testGraph_ResolveDispatchesDispositionsAndBuildsGraph(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-test').innervate(bus);
    const updates: DispositionUpdatePayload[] = [];
    let capturedResolved: ResolvedResult | undefined;

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        updates.push((event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value);
    });

    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        capturedResolved = (event as CustomEvent<Signal<ResolvedResult>>).detail.value;
    });

    const mockUcas: Record<string, Disposition> = {
        'uca:1': { aim: { description: 'Producer' }, outputs: [{ signal: 'uca:1.ready', type: 'string' }] },
        'uca:2': { aim: { description: 'Consumer' }, reactTo: ['uca:1.ready'] },
    };

    emitSignal(bus, SignalType.RESOLVE, { ucas: mockUcas });

    assert.strictEqual(updates.length, 2);
    assert.strictEqual(updates[0]?.id, 'uca:1');
    assert.strictEqual(updates[1]?.id, 'uca:2');

    assert.ok(capturedResolved);
    assert.strictEqual(capturedResolved?.graph.nodes.length, 2);
    assert.strictEqual(capturedResolved?.graph.edges.length, 1);
    assert.strictEqual(capturedResolved?.graph.edges[0]?.fromNode, 'uca:1');
    assert.strictEqual(capturedResolved?.graph.edges[0]?.toNode, 'uca:2');

    graphCap.denervate();
}

function testGraph_ValidatesZodResponseSchema(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-zod-test').innervate(bus);
    let capturedResolved: ResolvedResult | undefined;

    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        capturedResolved = (event as CustomEvent<Signal<ResolvedResult>>).detail.value;
    });

    const validPayload = {
        data: {
            ucas: [
                {
                    id: 'box:center-container',
                    disposition: {
                        aim: { description: 'Center title', body: { text: 'Title' } },
                        reactTo: ['action:trigger-button.triggered'],
                    },
                },
            ],
            answer: 'Ontological view ready',
        },
        metadata: { tokens: 120 },
    };

    emitSignal(bus, SignalType.RESOLVE, { data: validPayload });
    assert.ok(capturedResolved !== undefined);
    assert.strictEqual(capturedResolved?.answer, 'Ontological view ready');
    assert.ok(capturedResolved?.ucas['box:center-container'] !== undefined);
    graphCap.denervate();
}

function testGraph_ReceivesStreamingAlphasAndDispatchesUcasImmediately(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-stream-test').innervate(bus);
    const dispatchedUcas: string[] = [];
    let capturedResolved: ResolvedResult | undefined;

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        const payload = (event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value;
        dispatchedUcas.push(payload.id);
    });

    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        capturedResolved = (event as CustomEvent<Signal<ResolvedResult>>).detail.value;
    });

    // Stream first UCA alpha tokens
    emitSignal(bus, SignalType.CHUNK, { text: '{"data":{"ucas":[{"id":"box:card",' });
    assert.strictEqual(dispatchedUcas.length, 0);

    emitSignal(bus, SignalType.CHUNK, { text: '"disposition":{"aim":{"description":"Card","body":{"text":"Hello"}},"reactTo":["action:btn.triggered"]}},' });
    // First UCA has completed and must be dispatched into the nervous system immediately!
    assert.strictEqual(dispatchedUcas.length, 1);
    assert.strictEqual(dispatchedUcas[0], 'box:card');

    // Stream second UCA
    emitSignal(bus, SignalType.CHUNK, { text: '{"id":"action:btn","disposition":{"aim":{"description":"Button","body":{"label":"Click"}},"reactTo":[]}}' });
    assert.strictEqual(dispatchedUcas.length, 2);
    assert.strictEqual(dispatchedUcas[1], 'action:btn');

    // Close stream
    emitSignal(bus, SignalType.CHUNK, { text: '],"answer":"All done"},"metadata":{"tokens":50}}' });
    emitSignal(bus, SignalType.COMPLETED, undefined);

    assert.ok(capturedResolved !== undefined);
    assert.strictEqual(capturedResolved?.answer, 'All done');
    assert.strictEqual(capturedResolved?.graph.nodes.length, 2);

    graphCap.denervate();
}

function testGraph_DiscardsInvalidUcaAndEmitsRetry(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-retry-test').innervate(bus);
    const retrySignals: RetryPayload[] = [];
    const dispatchedUcas: string[] = [];

    bus.addEventListener(SignalType.RETRY, (event: Event) => {
        retrySignals.push((event as CustomEvent<Signal<RetryPayload>>).detail.value);
    });

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        const payload = (event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value;
        dispatchedUcas.push(payload.id);
    });

    // Stream candidate that is missing required 'aim' in disposition
    const invalidChunk = '{"data":{"ucas":[{"id":"invalid:item","disposition":{"invalidField":"bad"}}]}}';
    emitSignal(bus, SignalType.CHUNK, { text: invalidChunk });

    assert.strictEqual(dispatchedUcas.length, 0);
    assert.strictEqual(retrySignals.length, 1);
    assert.ok(retrySignals[0]?.reason?.includes('Invalid UCA'));

    graphCap.denervate();
}

function testGraph_ReceivesPromptApiStreamChunksAndDetectsUcas(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-prompt-api-test').innervate(bus);
    const detectedUcas: string[] = [];

    bus.addEventListener(SignalType.UCA_DETECTED, (event: Event) => {
        const payload = (event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value;
        detectedUcas.push(payload.id);
    });

    emitSignal(bus, SignalType.CHUNK_PROMPT_API, { text: '{"data":{"ucas":[{"id":"box:overview","disposition":{"aim":{"description":"Overview","body":{"text":"UCA"}},"reactTo":[]}}' });
    assert.strictEqual(detectedUcas.length, 1);
    assert.strictEqual(detectedUcas[0], 'box:overview');

    emitSignal(bus, SignalType.STREAM_END_PROMPT_API, undefined);
    graphCap.denervate();
}

function runAllGraphTests(): void {
    testGraph_IdentityAndDefaults();
    testGraph_ResolveDispatchesDispositionsAndBuildsGraph();
    testGraph_ValidatesZodResponseSchema();
    testGraph_ReceivesStreamingAlphasAndDispatchesUcasImmediately();
    testGraph_DiscardsInvalidUcaAndEmitsRetry();
    testGraph_ReceivesPromptApiStreamChunksAndDetectsUcas();
    console.log('✔ All Graph capability tests passed successfully.');
}

runAllGraphTests();
