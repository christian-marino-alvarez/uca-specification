import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import {
    type AILanguageModelFactory,
    type AILanguageModelSession,
    type CapabilitiesResult,
    type ChunkResult,
    type PromptResult,
    type StreamEndResult,
    PromptApi,
    SignalType,
} from '../index.js';

function createMockFactory(overrides?: Partial<AILanguageModelFactory>): AILanguageModelFactory {
    const mockSession: AILanguageModelSession = {
        prompt: async (input: string) => `echo: ${input}`,
        promptStreaming: (input: string) => {
            const chunks = [`echo: `, input];
            let index = 0;
            return new ReadableStream<string>({
                pull(controller) {
                    if (index < chunks.length) {
                        controller.enqueue(chunks[index++]);
                    } else {
                        controller.close();
                    }
                },
            });
        },
        destroy: () => {},
    };

    return {
        capabilities: async (): Promise<CapabilitiesResult> => ({ available: 'readily', defaultTemperature: 0.7, maxTemperature: 2.0 }),
        create: async () => mockSession,
        ...overrides,
    };
}

async function testPromptApi_ExistenceAndInheritance(): Promise<void> {
    const promptApi = new PromptApi();
    assert.ok(promptApi instanceof Capability);
    assert.strictEqual(promptApi.id, 'prompt-api');
    assert.strictEqual(typeof PromptApi.AIM, 'string');
    promptApi.denervate();
}

async function testPromptApi_CheckAvailability(): Promise<void> {
    const target = new EventTarget();
    const factory = createMockFactory();
    const promptApi = new PromptApi().innervate(target, { aim: { description: PromptApi.AIM, body: { factory } } });

    let receivedCapabilities: CapabilitiesResult | undefined;
    target.addEventListener(SignalType.CHECKED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<CapabilitiesResult>>;
        receivedCapabilities = customEvent.detail.value;
    });

    target.dispatchEvent(new CustomEvent(SignalType.CHECK, { detail: { source: 'test', property: SignalType.CHECK, timestamp: Date.now() } }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.notStrictEqual(receivedCapabilities, undefined);
    assert.strictEqual(receivedCapabilities?.available, 'readily');
    promptApi.denervate();
}

async function testPromptApi_PromptExecution(): Promise<void> {
    const target = new EventTarget();
    const factory = createMockFactory();
    const promptApi = new PromptApi().innervate(target, { aim: { description: PromptApi.AIM, body: { factory } } });

    let result: PromptResult | undefined;
    target.addEventListener(SignalType.RESPONDED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<PromptResult>>;
        result = customEvent.detail.value;
    });

    const payload = { prompt: 'Hello UCA' };
    target.dispatchEvent(new CustomEvent(SignalType.PROMPT, { detail: { source: 'test', property: SignalType.PROMPT, value: payload, timestamp: Date.now() } }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.notStrictEqual(result, undefined);
    assert.strictEqual(result?.prompt, 'Hello UCA');
    assert.strictEqual(result?.response, 'echo: Hello UCA');
    promptApi.denervate();
}

async function testPromptApi_StreamExecution(): Promise<void> {
    const target = new EventTarget();
    const factory = createMockFactory();
    const promptApi = new PromptApi().innervate(target, { aim: { description: PromptApi.AIM, body: { factory } } });

    const chunks: string[] = [];
    let endResult: StreamEndResult | undefined;

    target.addEventListener(SignalType.CHUNK, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<ChunkResult>>;
        chunks.push(customEvent.detail.value.chunk);
    });
    target.addEventListener(SignalType.STREAM_END, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<StreamEndResult>>;
        endResult = customEvent.detail.value;
    });

    const payload = { prompt: 'Stream test' };
    target.dispatchEvent(new CustomEvent(SignalType.STREAM, { detail: { source: 'test', property: SignalType.STREAM, value: payload, timestamp: Date.now() } }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.deepStrictEqual(chunks, ['echo: ', 'Stream test']);
    assert.strictEqual(endResult?.text, 'echo: Stream test');
    promptApi.denervate();
}

async function testPromptApi_ErrorWhenNotAvailable(): Promise<void> {
    const target = new EventTarget();
    const promptApi = new PromptApi().innervate(target);

    let errorReceived: unknown;
    target.addEventListener(SignalType.ERROR, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        errorReceived = customEvent.detail.value;
    });

    target.dispatchEvent(new CustomEvent(SignalType.CHECK, { detail: { source: 'test', property: SignalType.CHECK, timestamp: Date.now() } }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.notStrictEqual(errorReceived, undefined);
    promptApi.denervate();
}

async function runAllTests(): Promise<void> {
    await testPromptApi_ExistenceAndInheritance();
    await testPromptApi_CheckAvailability();
    await testPromptApi_PromptExecution();
    await testPromptApi_StreamExecution();
    await testPromptApi_ErrorWhenNotAvailable();
    console.log('✔ All PromptApi capability tests passed successfully.');
}

void runAllTests();
