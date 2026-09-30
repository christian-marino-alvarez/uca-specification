import * as assert from 'node:assert';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import {
    GoogleWebPrompt,
    SignalType,
    type PromptAdapter,
    type PromptSession,
    type StreamOutput,
    type Body,
    type AvailabilityResult,
    __ID__,
} from '../index.js';

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

function testGoogleWebPrompt_IdentityAndDefaults(): void {
    const prompt = new GoogleWebPrompt();
    assert.strictEqual(prompt.id, __ID__);
    assert.ok(prompt instanceof Capability);
    assert.ok(prompt.disposition.inputs !== undefined);
    assert.strictEqual(prompt.disposition.inputs.length, 5);
    assert.strictEqual(prompt.disposition.inputs[0]?.signal, SignalType.CHECK);
    assert.ok(prompt.disposition.outputs !== undefined);
    assert.strictEqual(prompt.disposition.outputs.length, 5);
    assert.strictEqual(prompt.disposition.outputs[0]?.signal, SignalType.STATUS);
    prompt.denervate();
}

async function testGoogleWebPrompt_CheckAvailability(): Promise<void> {
    const bus = new EventTarget();
    const mockAdapter: PromptAdapter = {
        availability: async () => 'available',
        create: async () => { throw new Error('Not implemented'); },
    };
    const disposition = Capability.createDisposition<Body>('Check test', { adapter: mockAdapter });
    const prompt = new GoogleWebPrompt('prompt-check').innervate(bus, disposition);

    let statusResult: AvailabilityResult | undefined;
    bus.addEventListener(SignalType.STATUS, (event: Event) => {
        statusResult = (event as CustomEvent<Signal<AvailabilityResult>>).detail.value;
    });

    emitSignal(bus, SignalType.CHECK, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.deepStrictEqual(statusResult, { available: true, status: 'available' });
    prompt.denervate();
}

async function testGoogleWebPrompt_GenerateStreamingResponse(): Promise<void> {
    const bus = new EventTarget();
    let sessionDestroyed = false;

    const mockSession: PromptSession = {
        prompt: async (input) => `Echo: ${input}`,
        promptStreaming: (input) => {
            return new ReadableStream<string>({
                start(controller) {
                    controller.enqueue(`Local chunk 1 for: ${input} - `);
                    controller.enqueue('Local chunk 2');
                    controller.close();
                },
            });
        },
        destroy: () => {
            sessionDestroyed = true;
        },
    };

    const mockAdapter: PromptAdapter = {
        availability: async () => 'available',
        create: async () => mockSession,
    };

    const disposition = Capability.createDisposition<Body>('Stream test', { adapter: mockAdapter });
    const prompt = new GoogleWebPrompt('prompt-streamer').innervate(bus, disposition);
    let capturedStream: StreamOutput | undefined;

    bus.addEventListener(SignalType.STREAM, (event: Event) => {
        capturedStream = (event as CustomEvent<Signal<StreamOutput>>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, { text: 'Hello Gemini Nano' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedStream instanceof ReadableStream);
    const textChunks = await readEntireStream(capturedStream);
    assert.deepStrictEqual(textChunks, ['Local chunk 1 for: Hello Gemini Nano - ', 'Local chunk 2']);

    emitSignal(bus, SignalType.DESTROY, {});
    assert.strictEqual(sessionDestroyed, true);

    prompt.denervate();
}

async function testGoogleWebPrompt_AbortCancelsActiveGeneration(): Promise<void> {
    const bus = new EventTarget();
    let signalAborted = false;

    const mockSession: PromptSession = {
        prompt: async () => '',
        promptStreaming: (_input, options) => {
            options?.signal?.addEventListener('abort', () => {
                signalAborted = true;
            });
            return new ReadableStream<string>({
                start() { /* keep stream open */ },
            });
        },
        destroy: () => {},
    };

    const mockAdapter: PromptAdapter = {
        availability: async () => 'available',
        create: async () => mockSession,
    };

    const disposition = Capability.createDisposition<Body>('Abort test', { adapter: mockAdapter });
    const prompt = new GoogleWebPrompt('prompt-abort').innervate(bus, disposition);

    emitSignal(bus, SignalType.GENERATE, { text: 'Stream to abort' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    emitSignal(bus, SignalType.ABORT, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(signalAborted, true);
    prompt.denervate();
}

async function testGoogleWebPrompt_ErrorEmitsSignal(): Promise<void> {
    const bus = new EventTarget();
    const mockAdapter: PromptAdapter = {
        availability: async () => { throw new Error('Availability failure'); },
        create: async () => { throw new Error('Creation failure'); },
    };

    const disposition = Capability.createDisposition<Body>('Error test', { adapter: mockAdapter });
    const prompt = new GoogleWebPrompt('prompt-err').innervate(bus, disposition);
    let capturedError: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal<unknown>>).detail.value;
    });

    emitSignal(bus, SignalType.CHECK, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(capturedError instanceof Error);
    assert.strictEqual((capturedError as Error).message, 'Availability failure');
    prompt.denervate();
}

async function runAllGoogleWebPromptTests(): Promise<void> {
    testGoogleWebPrompt_IdentityAndDefaults();
    await testGoogleWebPrompt_CheckAvailability();
    await testGoogleWebPrompt_GenerateStreamingResponse();
    await testGoogleWebPrompt_AbortCancelsActiveGeneration();
    await testGoogleWebPrompt_ErrorEmitsSignal();
    console.log('✔ All GoogleWebPrompt capability tests passed successfully.');
}

void runAllGoogleWebPromptTests();
