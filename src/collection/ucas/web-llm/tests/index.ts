import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { WebLlm } from '../index.js';
import { __ID__, DEFAULT_LOCAL_PROVIDER, DEFAULT_NUBE_PROVIDER } from '../constants.js';
import { ApiPrompt } from '@uca/capability-api-prompt';
import {
    type DestroyResult,
    type ReadyResult,
    type StreamResult,
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
        availability: async () => 'available',
        create: async () => ({
            prompt: async (text: string) => `local echo: ${text}`,
            promptStreaming: (text: string) => new ReadableStream({
                start(ctrl) {
                    ctrl.enqueue(`local stream: ${text}`);
                    ctrl.close();
                },
            }),
            destroy: () => {},
        }),
    };
}

function uninstallMockBrowserLanguageModel(): void {
    ApiPrompt.resetSharedSession();
    delete (globalThis as unknown as { LanguageModel?: unknown }).LanguageModel;
}

function testWebLlm_IdentityAndDefaults(): void {
    const webLlm = new WebLlm();
    assert.ok(webLlm instanceof Uca);
    assert.strictEqual(webLlm.id, __ID__);
    assert.strictEqual(webLlm.purpose, WebLlm.purpose);
    const { inputs, outputs, aim } = WebLlm.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(inputs?.[0]?.type, DataType.CREATE_PAYLOAD);
    assert.strictEqual(aim.description, WebLlm.purpose);
}

function testWebLlm_Innervation(): void {
    const bus = new EventTarget();
    const webLlm = new WebLlm('custom-web-llm').innervate(bus);
    assert.strictEqual(webLlm.id, 'custom-web-llm');
    assert.strictEqual(webLlm.target, bus);
    webLlm.denervate();
}

async function testWebLlm_CreateContractLocalAndNube(): Promise<void> {
    const bus = new EventTarget();
    const readyResults: ReadyResult[] = [];

    bus.addEventListener(SignalType.READY, (event: Event) => {
        readyResults.push((event as CustomEvent<Signal>).detail?.value as ReadyResult);
    });

    installMockBrowserLanguageModel();
    const webLlm = new WebLlm().innervate(bus);

    emitSignal(bus, SignalType.CREATE, { model: 'nube', provider: 'gemini' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(readyResults.length, 1);
    assert.strictEqual(readyResults[0]?.ready, true);
    assert.strictEqual(readyResults[0]?.model, 'nube');
    assert.strictEqual(readyResults[0]?.provider, 'gemini');

    emitSignal(bus, SignalType.CREATE, { model: 'local' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.strictEqual(readyResults.length, 2);
    assert.strictEqual(readyResults[1]?.ready, true);
    assert.strictEqual(readyResults[1]?.model, 'local');
    assert.strictEqual(readyResults[1]?.provider, DEFAULT_LOCAL_PROVIDER);

    uninstallMockBrowserLanguageModel();
    webLlm.denervate();
}

async function testWebLlm_StreamContractLocal(): Promise<void> {
    const bus = new EventTarget();
    let streamResult: StreamResult | undefined;

    bus.addEventListener(SignalType.STREAMED, (event: Event) => {
        streamResult = (event as CustomEvent<Signal>).detail?.value as StreamResult;
    });

    installMockBrowserLanguageModel();
    const webLlm = new WebLlm().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {
        correlationId: 'c-local',
        streamId: 's-local',
        request: 'Prompt local para Gemini Nano',
        model: 'local',
        imagination: 7,
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(streamResult !== undefined);
    assert.strictEqual(streamResult?.correlationId, 'c-local');
    assert.strictEqual(streamResult?.streamId, 's-local');
    assert.strictEqual(streamResult?.model, 'local');
    assert.strictEqual(streamResult?.provider, DEFAULT_LOCAL_PROVIDER);
    assert.ok(streamResult?.stream instanceof ReadableStream);

    const reader = streamResult.stream.getReader();
    const { value: chunk } = await reader.read();
    assert.ok(typeof chunk === 'string' && chunk.includes('Prompt local para Gemini Nano'));

    uninstallMockBrowserLanguageModel();
    webLlm.denervate();
}

async function testWebLlm_LocalFailsGracefullyWithoutBrowserLanguageModel(): Promise<void> {
    const bus = new EventTarget();
    let errorReceived: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorReceived = (event as CustomEvent<Signal>).detail?.value;
    });

    uninstallMockBrowserLanguageModel();
    const webLlm = new WebLlm().innervate(bus);
    emitSignal(bus, SignalType.CREATE, { model: 'local' });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(errorReceived !== undefined);
    webLlm.denervate();
}

async function testWebLlm_StreamContractNube(): Promise<void> {
    const bus = new EventTarget();
    let streamResult: StreamResult | undefined;
    let interceptedBody: string | undefined;

    bus.addEventListener(SignalType.STREAMED, (event: Event) => {
        streamResult = (event as CustomEvent<Signal>).detail?.value as StreamResult;
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_input, init) => {
        interceptedBody = init?.body as string;
        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode('data: nube token 1\n\n'));
                controller.close();
            },
        });
        return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
    };

    const webLlm = new WebLlm().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {
        correlationId: 'c-nube',
        streamId: 's-nube',
        request: 'Prompt nube para Gemini',
        model: 'nube',
        provider: 'gemini',
        imagination: 3,
        maxTokens: 2048,
        schema: { type: 'object', properties: { answer: { type: 'string' } } },
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(streamResult !== undefined);
    assert.strictEqual(streamResult?.correlationId, 'c-nube');
    assert.strictEqual(streamResult?.model, 'nube');
    assert.strictEqual(streamResult?.provider, 'gemini');
    assert.ok(streamResult?.stream instanceof ReadableStream);

    const reader = streamResult.stream.getReader();
    const { value: chunk } = await reader.read();
    assert.strictEqual(chunk, 'nube token 1');

    assert.ok(interceptedBody !== undefined);
    const parsed = JSON.parse(interceptedBody);
    assert.strictEqual(parsed.imagination, 3);
    assert.strictEqual(parsed.maxTokens, 2048);
    assert.strictEqual(parsed.provider, 'gemini');

    globalThis.fetch = originalFetch;
    webLlm.denervate();
}

async function testWebLlm_DestroyContract(): Promise<void> {
    const bus = new EventTarget();
    let destroyResult: DestroyResult | undefined;

    bus.addEventListener(SignalType.DESTROYED, (event: Event) => {
        destroyResult = (event as CustomEvent<Signal>).detail?.value as DestroyResult;
    });

    const webLlm = new WebLlm().innervate(bus);
    emitSignal(bus, SignalType.DESTROY, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(destroyResult !== undefined);
    assert.strictEqual(destroyResult?.destroyed, true);

    webLlm.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing WebLlm UCA (local Gemini Nano / nube Gemini contracts)...');
    testWebLlm_IdentityAndDefaults();
    testWebLlm_Innervation();
    await testWebLlm_CreateContractLocalAndNube();
    await testWebLlm_StreamContractLocal();
    await testWebLlm_LocalFailsGracefullyWithoutBrowserLanguageModel();
    await testWebLlm_StreamContractNube();
    await testWebLlm_DestroyContract();
    console.log('✅ All WebLlm UCA tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
