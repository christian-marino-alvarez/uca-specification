import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import { DispositionSignal, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { Graph, SignalType, DataType, __ID__, AIM, type UcaItem, type UcaStreamPayload } from '../index.js';

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
    assert.strictEqual(inputs?.length, 1);
    assert.strictEqual(inputs?.[0]?.type, DataType.STREAM_DECODED_PAYLOAD);
    assert.strictEqual(outputs?.length, 2);
    assert.strictEqual(outputs?.[0]?.type, DataType.UCA_STREAM_PAYLOAD);
    assert.strictEqual(outputs?.[1]?.type, DataType.UNKNOWN);
    assert.strictEqual(aim.description, AIM);
}

async function testGraph_DiscardsInvalidUcaCandidate(): Promise<void> {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-discard-test').innervate(bus);
    const dispatchedUcas: string[] = [];

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        const payload = (event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value;
        dispatchedUcas.push(payload.id);
    });

    bus.addEventListener(SignalType.UCA_STREAM, (event: Event) => {
        const payload = (event as CustomEvent<Signal<UcaStreamPayload>>).detail.value;
        payload.stream.pipeTo(new WritableStream());
    });

    const stream = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('{"data":{"ucas":[{"id":"invalid:item","disposition":{"invalidField":"bad"}}]}}');
            controller.close();
        },
    });

    emitSignal(bus, SignalType.STREAM_DECODED, { stream });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(dispatchedUcas.length, 0);

    graphCap.denervate();
}

async function testGraph_ProcessesDecodedWebStreamViaTransformAndWritable(): Promise<void> {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-stream-decoded-test').innervate(bus);
    const detectedUcas: string[] = [];

    bus.addEventListener(SignalType.UCA_STREAM, (event: Event) => {
        const payload = (event as CustomEvent<Signal<UcaStreamPayload>>).detail.value;
        const { stream } = payload;
        const writable = new WritableStream<UcaItem>({
            write(uca) {
                detectedUcas.push(uca.id);
            },
        });
        stream.pipeTo(writable);
    });

    const stream = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('{"data":{"ucas":[{"id":"box:stream-card",');
            controller.enqueue('"disposition":{"aim":{"description":"Stream Card","body":{"text":"Streamed"}},"reactTo":[]}},');
            controller.enqueue('{"id":"list:items","disposition":{"aim":{"description":"List","body":{"items":["A","B"]}},"reactTo":[]}}');
            controller.enqueue('],"answer":"Stream success"},"metadata":{"tokens":30}}');
            controller.close();
        },
    });

    emitSignal(bus, SignalType.STREAM_DECODED, { stream });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(detectedUcas.length, 2);
    assert.strictEqual(detectedUcas[0], 'box:stream-card');
    assert.strictEqual(detectedUcas[1], 'list:items');

    graphCap.denervate();
}

async function testGraph_ProcessesMultipleStreamsInParallelWithIsolatedQueues(): Promise<void> {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-multi-stream-test').innervate(bus);
    const streamAUcas: string[] = [];
    const streamBUcas: string[] = [];

    bus.addEventListener(SignalType.UCA_STREAM, (event: Event) => {
        const payload = (event as CustomEvent<Signal<UcaStreamPayload>>).detail.value;
        const { stream, streamId } = payload;
        const writable = new WritableStream<UcaItem>({
            write(uca) {
                if (streamId === 'stream-A') { streamAUcas.push(uca.id); }
                if (streamId === 'stream-B') { streamBUcas.push(uca.id); }
            },
        });
        stream.pipeTo(writable);
    });

    const streamA = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('{"data":{"ucas":[{"id":"box:stream-a",');
            controller.enqueue('"disposition":{"aim":{"description":"A","body":{}},"reactTo":[]}}');
            controller.enqueue('],"answer":"Ans A"}}');
            controller.close();
        },
    });

    const streamB = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('{"data":{"ucas":[{"id":"box:stream-b",');
            controller.enqueue('"disposition":{"aim":{"description":"B","body":{}},"reactTo":[]}}');
            controller.enqueue('],"answer":"Ans B"}}');
            controller.close();
        },
    });

    emitSignal(bus, SignalType.STREAM_DECODED, { streamId: 'stream-A', stream: streamA });
    emitSignal(bus, SignalType.STREAM_DECODED, { streamId: 'stream-B', stream: streamB });

    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(streamAUcas.length, 1);
    assert.strictEqual(streamAUcas[0], 'box:stream-a');
    assert.strictEqual(streamBUcas.length, 1);
    assert.strictEqual(streamBUcas[0], 'box:stream-b');

    graphCap.denervate();
}

async function runAllGraphTests(): Promise<void> {
    testGraph_IdentityAndDefaults();
    await testGraph_DiscardsInvalidUcaCandidate();
    await testGraph_ProcessesDecodedWebStreamViaTransformAndWritable();
    await testGraph_ProcessesMultipleStreamsInParallelWithIsolatedQueues();
    console.log('✔ All Graph capability tests passed successfully.');
}

runAllGraphTests();
