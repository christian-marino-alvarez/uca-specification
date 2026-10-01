import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as JevSignalType } from '@uca/capability-jev';
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
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(inputs?.[0]?.type, DataType.GENERATE_PAYLOAD);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.GENERATION_RESULT);
    llm.denervate();
}

function testLlm_TransducesGenerateToJevInfer(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let jevInferPayload: unknown = undefined;

    bus.addEventListener(JevSignalType.INFER, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        jevInferPayload = detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, {
        request: 'What is the speed of light?',
        model: 'gemini-1.5-pro',
    });

    assert.notStrictEqual(jevInferPayload, undefined);
    const { state, questions, model } = jevInferPayload as { state: unknown; questions: unknown; model?: string };
    assert.deepStrictEqual(state, { request: 'What is the speed of light?' });
    assert.strictEqual(model, 'gemini-1.5-pro');
    assert.deepStrictEqual(questions, { response: { type: 'string' } });
    llm.denervate();
}

function testLlm_TransducesJevInferredToLlmGenerated(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let generatedResult: unknown = undefined;

    bus.addEventListener(SignalType.GENERATED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        generatedResult = detail.value;
    });

    emitSignal(bus, JevSignalType.INFERRED, {
        state: { request: 'hello' },
        answers: { response: 'Hello world!' },
        model: 'test-model',
    });

    assert.notStrictEqual(generatedResult, undefined);
    const { response, data } = generatedResult as { response?: string; data?: Record<string, unknown> };
    assert.strictEqual(response, 'Hello world!');
    assert.deepStrictEqual(data, { response: 'Hello world!' });
    llm.denervate();
}

function testLlm_TransducesConnectAndConnected(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let connectConfig: unknown = undefined;
    let connectedStatus: unknown = undefined;

    bus.addEventListener(JevSignalType.CONNECT, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        connectConfig = detail.value;
    });
    bus.addEventListener(SignalType.CONNECTED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        connectedStatus = detail.value;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'secret-key', defaultModel: 'gemini-pro' });
    assert.deepStrictEqual(connectConfig, { apiKey: 'secret-key', defaultModel: 'gemini-pro' });

    emitSignal(bus, JevSignalType.CONNECTED, { status: 'ready' });
    assert.strictEqual(connectedStatus, 'connected');
    llm.denervate();
}

function testLlm_TransducesJevError(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let errorReceived: unknown = undefined;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        errorReceived = detail.value;
    });

    emitSignal(bus, JevSignalType.ERROR, new Error('Rate limit exceeded'));
    assert.ok(errorReceived instanceof Error);
    assert.strictEqual((errorReceived as Error).message, 'Rate limit exceeded');
    llm.denervate();
}

function testLlm_AgnosticGeneratePayload(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-agnostic').innervate(bus);
    let capturedInfer: unknown = undefined;
    let capturedGenerated: unknown = undefined;

    bus.addEventListener(JevSignalType.INFER, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedInfer = detail.value;
    });
    bus.addEventListener(SignalType.GENERATED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedGenerated = detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, {
        request: 'Diseña una vista de catálogo',
        model: 'claude-3-7-sonnet',
        imagination: 8,
        role: 'arquitecto de software',
        format: 'json',
        depth: 6,
    });

    assert.notStrictEqual(capturedInfer, undefined);
    const { state, questions, model } = capturedInfer as { state: any; questions: any; model?: string };
    assert.strictEqual(model, 'claude-3-7-sonnet');
    assert.strictEqual(state.request, 'Diseña una vista de catálogo');
    assert.strictEqual(state.imagination, 8);
    assert.strictEqual(state.role, 'arquitecto de software');
    assert.strictEqual(state.depth, 6);
    assert.strictEqual(questions.response.type, 'json');

    emitSignal(bus, JevSignalType.INFERRED, {
        state,
        answers: { response: '{"view": "catalog"}' },
        model: 'claude-3-7-sonnet',
    });

    assert.notStrictEqual(capturedGenerated, undefined);
    const { response, data } = capturedGenerated as { response?: string; data?: Record<string, unknown> };
    assert.strictEqual(response, '{"view": "catalog"}');
    assert.deepStrictEqual(data, { response: '{"view": "catalog"}' });
    llm.denervate();
}

function testLlm_FallbackModelAndLimit(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-fallback');
    llm.innervate(bus);
    const { aim } = llm.disposition;
    aim.body = { model: 'default-fallback-model', limit: 4096 };

    let capturedInfer: unknown = undefined;
    bus.addEventListener(JevSignalType.INFER, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        capturedInfer = detail.value;
    });

    // Caso 1: model y limit son null o undefined -> usa fallback del disposition
    emitSignal(bus, SignalType.GENERATE, {
        request: 'Fallback test',
        model: null,
        limit: undefined,
    });

    const { model: m1, limit: l1 } = capturedInfer as { model?: string; limit?: number };
    assert.strictEqual(m1, 'default-fallback-model');
    assert.strictEqual(l1, 4096);

    // Caso 2: model y limit especificados -> prevalecen sobre el fallback
    emitSignal(bus, SignalType.GENERATE, {
        request: 'Override test',
        model: 'custom-model',
        limit: 1024,
    });

    const { model: m2, limit: l2 } = capturedInfer as { model?: string; limit?: number };
    assert.strictEqual(m2, 'custom-model');
    assert.strictEqual(l2, 1024);

    llm.denervate();
}

function runAllLlmTests(): void {
    testLlm_IdentityAndDefaults();
    testLlm_TransducesGenerateToJevInfer();
    testLlm_TransducesJevInferredToLlmGenerated();
    testLlm_TransducesConnectAndConnected();
    testLlm_TransducesJevError();
    testLlm_AgnosticGeneratePayload();
    testLlm_FallbackModelAndLimit();
    console.log('✔ All LLM UCA cognitive reasoning tests passed successfully.');
}

runAllLlmTests();

