import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import { type Signal } from '@uca/core/types';
import { ApiPrompt } from '../index.js';
import { __ID__, AIM } from '../constants.js';
import {
    type AvailabilityOptions,
    type AvailabilityResult,
    type CreateOptions,
    type DestroyResult,
    type DownloadProgressPayload,
    type PromptResult,
    type ReadyResult,
    type StreamResult,
    AvailabilityStatus,
    DataType,
    SignalType,
} from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function installMockBrowserLanguageModel(): void {
    ApiPrompt.resetSharedSession();
    (globalThis as unknown as { LanguageModel: unknown }).LanguageModel = {
        availability: async () => AvailabilityStatus.AVAILABLE,
        create: async (options?: CreateOptions) => {
            if (options?.monitor) {
                const monitor = new EventTarget();
                options.monitor(monitor as unknown as Parameters<typeof options.monitor>[0]);
                monitor.dispatchEvent(Object.assign(new Event('downloadprogress'), { loaded: 50, total: 100 }));
                monitor.dispatchEvent(Object.assign(new Event('downloadprogress'), { loaded: 100, total: 100 }));
            }
            return {
                prompt: async (text: string) => `browser echo: ${typeof text === 'string' ? text : JSON.stringify(text)}`,
                promptStreaming: (text: string) => new ReadableStream({
                    start(ctrl) {
                        const content = typeof text === 'string' ? text : JSON.stringify(text);
                        ctrl.enqueue(`browser stream: ${content}`);
                        ctrl.close();
                    },
                }),
                destroy: () => {},
            };
        },
    };
}

function uninstallMockBrowserLanguageModel(): void {
    ApiPrompt.resetSharedSession();
    delete (globalThis as unknown as { LanguageModel?: unknown }).LanguageModel;
}

function testApiPrompt_IdentityAndDefaults(): void {
    const model = new ApiPrompt();
    assert.ok(model instanceof Capability);
    assert.strictEqual(model.id, __ID__);
    assert.strictEqual(ApiPrompt.AIM, AIM);
    const { inputs, outputs, aim } = ApiPrompt.disposition;
    assert.strictEqual(inputs?.length, 5);
    assert.strictEqual(outputs?.length, 7);
    assert.strictEqual(inputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, AIM);
}

function testApiPrompt_Innervation(): void {
    const bus = new EventTarget();
    const model = new ApiPrompt('custom-prompt').innervate(bus);
    assert.strictEqual(model.id, 'custom-prompt');
    assert.strictEqual(model.target, bus);
    model.denervate();
}

async function testApiPrompt_AvailabilityContract(): Promise<void> {
    const bus = new EventTarget();
    let checked: AvailabilityResult | undefined;
    bus.addEventListener(SignalType.CHECKED, (event: Event) => {
        checked = (event as CustomEvent<Signal>).detail?.value as AvailabilityResult;
    });

    installMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    const contract: AvailabilityOptions = {
        expectedInputs: [{ type: 'text', languages: ['en', 'es'] }],
        expectedOutputs: [{ type: 'text', languages: ['es'] }],
    };

    emitSignal(bus, SignalType.CHECK, contract);
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(checked !== undefined);
    assert.strictEqual(checked?.status, AvailabilityStatus.AVAILABLE);
    assert.strictEqual(checked?.available, true);
    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function testApiPrompt_DownloadAndCreateFlow(): Promise<void> {
    const bus = new EventTarget();
    const progresses: DownloadProgressPayload[] = [];
    let ready: ReadyResult | undefined;

    bus.addEventListener(SignalType.DOWNLOADING, (event: Event) => {
        progresses.push((event as CustomEvent<Signal>).detail?.value as DownloadProgressPayload);
    });
    bus.addEventListener(SignalType.READY, (event: Event) => {
        ready = (event as CustomEvent<Signal>).detail?.value as ReadyResult;
    });

    installMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    emitSignal(bus, SignalType.CREATE, { systemPrompt: 'You are helpful' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(progresses.length, 2);
    assert.strictEqual(progresses[0]?.percentage, 50);
    assert.strictEqual(progresses[1]?.percentage, 100);
    assert.ok(ready !== undefined);
    assert.strictEqual(ready?.ready, true);

    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function testApiPrompt_StreamReturnsReadableStreamDirectly(): Promise<void> {
    const bus = new EventTarget();
    let streamResult: StreamResult | undefined;

    bus.addEventListener(SignalType.STREAMED, (event: Event) => {
        streamResult = (event as CustomEvent<Signal>).detail?.value as StreamResult;
    });

    installMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    emitSignal(bus, SignalType.STREAM, { correlationId: 'c-stream', streamId: 's-42', prompt: 'Hola mundo' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(streamResult !== undefined);
    assert.strictEqual(streamResult?.correlationId, 'c-stream');
    assert.strictEqual(streamResult?.streamId, 's-42');
    assert.ok(streamResult?.stream instanceof ReadableStream);

    const reader = streamResult.stream.getReader();
    const { value: chunk, done: firstDone } = await reader.read();
    assert.strictEqual(firstDone, false);
    assert.strictEqual(chunk, 'browser stream: Hola mundo');

    const { done: secondDone } = await reader.read();
    assert.strictEqual(secondDone, true);

    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function testApiPrompt_PromptExecution(): Promise<void> {
    const bus = new EventTarget();
    let promptResult: PromptResult | undefined;

    bus.addEventListener(SignalType.RESPONDED, (event: Event) => {
        promptResult = (event as CustomEvent<Signal>).detail?.value as PromptResult;
    });

    installMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    emitSignal(bus, SignalType.PROMPT, { correlationId: 'c-prompt', prompt: 'Test prompt' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(promptResult !== undefined);
    assert.strictEqual(promptResult?.correlationId, 'c-prompt');
    assert.strictEqual(promptResult?.response, 'browser echo: Test prompt');

    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function testApiPrompt_MultimodalPromptExecution(): Promise<void> {
    const bus = new EventTarget();
    let streamResult: StreamResult | undefined;

    bus.addEventListener(SignalType.STREAMED, (event: Event) => {
        streamResult = (event as CustomEvent<Signal>).detail?.value as StreamResult;
    });

    installMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    const multimodalPrompt = [
        {
            role: 'user',
            content: [
                { type: 'text', value: 'Describe esta imagen' },
                { type: 'image', value: { width: 100, height: 100 } },
            ],
        },
    ];

    emitSignal(bus, SignalType.STREAM, { correlationId: 'c-multi', streamId: 's-multi', prompt: multimodalPrompt });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(streamResult !== undefined);
    assert.strictEqual(streamResult?.correlationId, 'c-multi');
    assert.ok(streamResult?.stream instanceof ReadableStream);

    const reader = streamResult.stream.getReader();
    const { value: chunk } = await reader.read();
    assert.ok(typeof chunk === 'string' && chunk.includes('Describe esta imagen'));

    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function testApiPrompt_ErrorInNonBrowserEnvironment(): Promise<void> {
    const bus = new EventTarget();
    let errorDetail: { action: string; error: string } | undefined;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorDetail = (event as CustomEvent<Signal>).detail?.value as { action: string; error: string };
    });

    uninstallMockBrowserLanguageModel();
    const model = new ApiPrompt().innervate(bus);
    emitSignal(bus, SignalType.STREAM, { correlationId: 'c-err', prompt: 'test' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(errorDetail !== undefined);
    assert.ok(errorDetail?.error.includes('browser environments'));

    model.denervate();
}

async function testApiPrompt_DestroyContract(): Promise<void> {
    const bus = new EventTarget();
    let destroyed = false;

    bus.addEventListener(SignalType.DESTROYED, () => {
        destroyed = true;
    });

    const model = new ApiPrompt().innervate(bus);
    emitSignal(bus, SignalType.DESTROY, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(destroyed, true);
    model.denervate();
}

async function testApiPrompt_PersistentSessionContract(): Promise<void> {
    installMockBrowserLanguageModel();
    const bus = new EventTarget();
    let destroyedResult: boolean | undefined;

    bus.addEventListener(SignalType.DESTROYED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        const { destroyed } = (detail?.value ?? {}) as DestroyResult;
        destroyedResult = destroyed;
    });

    const model = new ApiPrompt();
    model.innervate(bus, { aim: { description: 'test', body: { persistentSession: true, autoLoad: true } }, reactTo: [] });
    await new Promise((resolve) => setTimeout(resolve, 20));

    emitSignal(bus, SignalType.DESTROY, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(destroyedResult, false);
    uninstallMockBrowserLanguageModel();
    model.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing ApiPrompt Capability with ReadableStream & Logging...');
    testApiPrompt_IdentityAndDefaults();
    testApiPrompt_Innervation();
    await testApiPrompt_AvailabilityContract();
    await testApiPrompt_DownloadAndCreateFlow();
    await testApiPrompt_StreamReturnsReadableStreamDirectly();
    await testApiPrompt_PromptExecution();
    await testApiPrompt_MultimodalPromptExecution();
    await testApiPrompt_ErrorInNonBrowserEnvironment();
    await testApiPrompt_DestroyContract();
    await testApiPrompt_PersistentSessionContract();
    console.log('✅ All ApiPrompt Capability tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
