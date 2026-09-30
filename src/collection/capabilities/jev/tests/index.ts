import * as assert from 'node:assert';
import { Capability } from '../../../../core/capability.js';
import type { Signal, Disposition } from '../../../../core/types.js';
import {
    Jev,
    SignalType,
    type StreamOutput,
    type GraphChunk,
    type Body,
    type DomainDispositionsPayload,
    __ID__,
} from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

async function readEntireStream(stream: StreamOutput): Promise<GraphChunk[]> {
    const reader = stream.getReader();
    const chunks: GraphChunk[] = [];
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        if (value !== undefined) {
            chunks.push(value);
        }
    }
    return chunks;
}

function testJev_IdentityAndDefaults(): void {
    const jev = new Jev();
    assert.strictEqual(jev.id, __ID__);
    assert.ok(jev instanceof Capability);
    assert.ok(jev.disposition.inputs !== undefined);
    assert.strictEqual(jev.disposition.inputs.length, 4);
    assert.strictEqual(jev.disposition.inputs[1]?.signal, SignalType.GRAPH);
    assert.ok(jev.disposition.outputs !== undefined);
    assert.strictEqual(jev.disposition.outputs.length, 4);
    assert.strictEqual(jev.disposition.outputs[1]?.signal, SignalType.STREAM);
    jev.denervate();
}

async function testJev_ConnectionLifecycle(): Promise<void> {
    const bus = new EventTarget();
    const jev = new Jev('jev-conn').innervate(bus);
    let connectedPayload: unknown;
    let closedPayload: unknown;

    bus.addEventListener(SignalType.CONNECTED, (event: Event) => {
        connectedPayload = (event as CustomEvent<Signal<unknown>>).detail.value;
    });
    bus.addEventListener(SignalType.CLOSED, (event: Event) => {
        closedPayload = (event as CustomEvent<Signal<unknown>>).detail.value;
    });

    emitSignal(bus, SignalType.CONNECT, { model: 'jev-system-one' });
    assert.deepStrictEqual(connectedPayload, { model: 'jev-system-one' });

    emitSignal(bus, SignalType.DISCONNECT, {});
    assert.ok(closedPayload !== undefined);

    jev.denervate();
}

async function testJev_ProducesGraphTopologyStream(): Promise<void> {
    const bus = new EventTarget();
    const sampleDispositions: Disposition[] = [
        Capability.createDisposition('Producer UCA', {}, [], {
            outputs: [{ signal: 'producer.output', type: 'number' }],
        }),
        Capability.createDisposition('Consumer UCA', {}, [], {
            inputs: [{ signal: 'producer.output', type: 'number' }],
        }),
    ];

    const jev = new Jev('jev-topologist').innervate(bus);
    let capturedStream: StreamOutput | undefined;

    bus.addEventListener(SignalType.STREAM, (event: Event) => {
        capturedStream = (event as CustomEvent<Signal<StreamOutput>>).detail.value;
    });

    emitSignal(bus, SignalType.GRAPH, {
        domain: 'arithmetic-domain',
        dispositions: sampleDispositions,
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedStream instanceof ReadableStream);
    const chunks = await readEntireStream(capturedStream);
    assert.strictEqual(chunks.length, 3);
    assert.strictEqual(chunks[0]?.type, 'meta');
    assert.strictEqual(chunks[1]?.type, 'node');
    assert.strictEqual(chunks[2]?.type, 'node');

    jev.denervate();
}

async function testJev_AbortsActiveStream(): Promise<void> {
    const bus = new EventTarget();
    let receivedSignal: AbortSignal | undefined;

    const disposition = Capability.createDisposition<Body>('Jev abort checker', {
        resolver: (_payload: DomainDispositionsPayload, signal?: AbortSignal) => {
            receivedSignal = signal;
            return new ReadableStream<GraphChunk>({
                start(controller) {
                    controller.enqueue({ type: 'meta', payload: { status: 'waiting' } });
                },
            });
        },
    });

    const jev = new Jev('jev-abort-test').innervate(bus, disposition);
    emitSignal(bus, SignalType.GRAPH, { domain: 'test', dispositions: [] });

    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(receivedSignal?.aborted, false);

    emitSignal(bus, SignalType.ABORT, {});
    assert.strictEqual(receivedSignal?.aborted, true);

    jev.denervate();
}

async function runAllJevTests(): Promise<void> {
    testJev_IdentityAndDefaults();
    await testJev_ConnectionLifecycle();
    await testJev_ProducesGraphTopologyStream();
    await testJev_AbortsActiveStream();
    console.log('✔ All Jev graph streaming capability tests passed successfully.');
}

void runAllJevTests();
