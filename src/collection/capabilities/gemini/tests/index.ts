import * as assert from 'node:assert';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Gemini, SignalType, type StreamOutput, type PromptConfig, type Body, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

async function readEntireStream(stream: StreamOutput): Promise<string[]> {
    const reader = stream.getReader();
    const chunks: string[] = [];
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

function testGemini_IdentityAndDefaults(): void {
    const gemini = new Gemini();
    assert.strictEqual(gemini.id, __ID__);
    assert.ok(gemini instanceof Capability);
    assert.deepStrictEqual(gemini.disposition.inputs, [
        { signal: SignalType.CONNECT, type: 'ConnectionConfig', description: 'Establish or configure connection parameters' },
        { signal: SignalType.GENERATE, type: 'PromptConfig', description: 'PromptConfig { text, context, temperature, maxOutputTokens }' },
        { signal: SignalType.DISCONNECT, type: 'void', description: 'Close active connection and clean up resources' },
        { signal: SignalType.ABORT, type: 'void', description: 'Abort ongoing generative stream' },
    ]);
    assert.deepStrictEqual(gemini.disposition.outputs, [
        { signal: SignalType.CONNECTED, type: '{ status: string }', description: 'Connection established notification' },
        { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'ReadableStream<string>' },
        { signal: SignalType.CLOSED, type: '{ closedAt: number }', description: 'Connection closed notification' },
        { signal: SignalType.ERROR, type: 'unknown', description: 'Connection or generation error payload' },
    ]);
    gemini.denervate();
}


async function testGemini_ConnectionLifecycle(): Promise<void> {
    const bus = new EventTarget();
    const gemini = new Gemini('gemini-conn-test').innervate(bus);
    let connectedPayload: unknown;
    let closedPayload: unknown;

    bus.addEventListener(SignalType.CONNECTED, (event: Event) => {
        connectedPayload = (event as CustomEvent<Signal<unknown>>).detail.value;
    });
    bus.addEventListener(SignalType.CLOSED, (event: Event) => {
        closedPayload = (event as CustomEvent<Signal<unknown>>).detail.value;
    });

    emitSignal(bus, SignalType.CONNECT, { model: 'gemini-1.5-pro' });
    assert.deepStrictEqual(connectedPayload, { model: 'gemini-1.5-pro' });

    emitSignal(bus, SignalType.DISCONNECT, {});
    assert.ok(closedPayload !== undefined);

    gemini.denervate();
}

async function testGemini_ProducesReadableStreamFromProvider(): Promise<void> {
    const bus = new EventTarget();
    const disposition = Capability.createDisposition('Custom readable stream provider', {
        streamProvider: () => {
            return new ReadableStream<string>({
                start(controller) {
                    controller.enqueue('Part 1 - ');
                    controller.enqueue('Part 2 - ');
                    controller.enqueue('Done');
                    controller.close();
                },
            });
        },
    });

    const gemini = new Gemini('gemini-streamer').innervate(bus, disposition);
    let capturedStream: StreamOutput | undefined;

    bus.addEventListener(SignalType.STREAM, (event: Event) => {
        const signal = (event as CustomEvent<Signal<StreamOutput>>).detail;
        capturedStream = signal.value;
    });

    emitSignal(bus, SignalType.GENERATE, {
        text: 'Generate streaming response',
        temperature: 0.2,
        maxOutputTokens: 256,
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedStream instanceof ReadableStream);
    const textChunks = await readEntireStream(capturedStream);
    assert.deepStrictEqual(textChunks, ['Part 1 - ', 'Part 2 - ', 'Done']);

    gemini.denervate();
}

async function testGemini_AbortsActiveStream(): Promise<void> {
    const bus = new EventTarget();
    let receivedSignal: AbortSignal | undefined;

    const disposition = Capability.createDisposition<Body>('Provider checking abort', {
        streamProvider: (config: PromptConfig) => {
            receivedSignal = config.signal;
            return new ReadableStream<string>({
                start(controller) {
                    controller.enqueue('initial chunk');
                },
            });
        },
    });

    const gemini = new Gemini('gemini-abort-test').innervate(bus, disposition);
    emitSignal(bus, SignalType.GENERATE, { text: 'Stream to be aborted' });

    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(receivedSignal?.aborted, false);

    emitSignal(bus, SignalType.ABORT, {});
    assert.strictEqual(receivedSignal?.aborted, true);

    gemini.denervate();
}

async function runAllGeminiTests(): Promise<void> {
    testGemini_IdentityAndDefaults();
    await testGemini_ConnectionLifecycle();
    await testGemini_ProducesReadableStreamFromProvider();
    await testGemini_AbortsActiveStream();
    console.log('✔ All Gemini connection & stream capability tests passed successfully.');
}

void runAllGeminiTests();

