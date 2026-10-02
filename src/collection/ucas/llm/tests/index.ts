import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini';
import { Llm, SignalType, DataType, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testLlm_IdentityAndDefaults(): void {
    const llm = new Llm();
    assert.strictEqual(llm.id, __ID__);
    assert.strictEqual(llm.purpose, Llm.purpose);
    assert.ok(llm instanceof Uca);
    llm.innervate();
    const { inputs, outputs } = llm.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(inputs?.[0]?.type, DataType.INFER_PAYLOAD);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(outputs?.[0]?.type, DataType.INFER_RESULT);
    llm.denervate();
}

function testLlm_TransducesInferToGeminiGenerate(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let geminiPayload: unknown = undefined;

    bus.addEventListener(GeminiSignalType.GENERATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        geminiPayload = detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        request: 'What is the speed of light?',
        model: 'gemini-2.5-flash',
    });

    assert.notStrictEqual(geminiPayload, undefined);
    const { prompt, model } = geminiPayload as { prompt: string; model?: string };
    assert.strictEqual(prompt, 'What is the speed of light?');
    assert.strictEqual(model, 'gemini-2.5-flash');
    llm.denervate();
}

function testLlm_TransducesGeminiGeneratedToLlmInferred(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let generatedResult: unknown = undefined;

    bus.addEventListener(SignalType.INFERRED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        generatedResult = detail.value;
    });

    emitSignal(bus, GeminiSignalType.GENERATED, {
        prompt: 'hello',
        text: 'Hello world!',
        data: { message: 'Hello world!' },
        model: 'gemini-2.5-flash',
    });

    assert.notStrictEqual(generatedResult, undefined);
    const { response, data } = generatedResult as { response?: string; data?: Record<string, unknown> };
    assert.strictEqual(response, 'Hello world!');
    assert.deepStrictEqual(data, { message: 'Hello world!' });
    llm.denervate();
}

function testLlm_TransducesConnectAndConnected(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let connectConfig: unknown = undefined;
    let connectedStatus: unknown = undefined;

    bus.addEventListener(GeminiSignalType.CONNECT, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        connectConfig = detail.value;
    });
    bus.addEventListener(SignalType.CONNECTED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        connectedStatus = detail.value;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'secret-key', defaultModel: 'gemini-2.5-flash' });
    assert.deepStrictEqual(connectConfig, { apiKey: 'secret-key', defaultModel: 'gemini-2.5-flash' });

    emitSignal(bus, GeminiSignalType.CONNECTED, { status: 'ready' });
    assert.strictEqual(connectedStatus, 'connected');
    llm.denervate();
}

function testLlm_TransducesGeminiError(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let errorReceived: unknown = undefined;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        errorReceived = detail.value;
    });

    emitSignal(bus, GeminiSignalType.ERROR, new Error('Rate limit exceeded'));
    assert.ok(errorReceived instanceof Error);
    assert.strictEqual((errorReceived as Error).message, 'Rate limit exceeded');
    llm.denervate();
}

function testLlm_AgnosticInferPayload(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-agnostic').innervate(bus);
    let capturedGenerate: unknown = undefined;
    let capturedGenerated: unknown = undefined;

    bus.addEventListener(GeminiSignalType.GENERATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedGenerate = detail.value;
    });
    bus.addEventListener(SignalType.INFERRED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedGenerated = detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        request: 'Diseña una vista de catálogo',
        model: 'gemini-2.5-flash',
        role: 'arquitecto de software',
        expectations: { type: 'object' },
    });

    assert.notStrictEqual(capturedGenerate, undefined);
    const { prompt, model, systemInstruction, schema } = capturedGenerate as { prompt: string; model?: string; systemInstruction?: string; schema?: unknown };
    assert.strictEqual(model, 'gemini-2.5-flash');
    assert.strictEqual(prompt, 'Diseña una vista de catálogo');
    assert.strictEqual(systemInstruction, 'arquitecto de software');
    assert.deepStrictEqual(schema, { type: 'object' });

    emitSignal(bus, GeminiSignalType.GENERATED, {
        prompt,
        text: '{"view": "catalog"}',
        data: { view: 'catalog' },
        model: 'gemini-2.5-flash',
    });

    assert.notStrictEqual(capturedGenerated, undefined);
    const { response, data } = capturedGenerated as { response?: string; data?: Record<string, unknown> };
    assert.strictEqual(response, '{"view": "catalog"}');
    assert.deepStrictEqual(data, { view: 'catalog' });
    llm.denervate();
}

function testLlm_FallbackModel(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-fallback');
    llm.innervate(bus);
    const { aim } = llm.disposition;
    aim.body = { model: 'gemini-fallback-model' };

    let capturedGenerate: unknown = undefined;
    bus.addEventListener(GeminiSignalType.GENERATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedGenerate = detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        request: 'Fallback test',
    });

    const { model: m1 } = capturedGenerate as { model?: string };
    assert.strictEqual(m1, 'gemini-fallback-model');

    emitSignal(bus, SignalType.INFER, {
        request: 'Override test',
        model: 'gemini-custom',
    });

    const { model: m2 } = capturedGenerate as { model?: string };
    assert.strictEqual(m2, 'gemini-custom');

    llm.denervate();
}

function runAllLlmTests(): void {
    testLlm_IdentityAndDefaults();
    testLlm_TransducesInferToGeminiGenerate();
    testLlm_TransducesGeminiGeneratedToLlmInferred();
    testLlm_TransducesConnectAndConnected();
    testLlm_TransducesGeminiError();
    testLlm_AgnosticInferPayload();
    testLlm_FallbackModel();
    console.log('✔ All LLM UCA cognitive reasoning tests passed successfully.');
}

runAllLlmTests();
