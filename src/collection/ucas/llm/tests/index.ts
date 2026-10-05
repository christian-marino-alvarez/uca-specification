import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import { Llm } from '../index.js';
import { SignalType, DataType } from '../types.js';
import { __ID__, DEFAULT_OPENAI_MODEL, DEFAULT_GEMINI_MODEL } from '../constants.js';

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

function testLlm_TransducesInferToGeminiGenerateByDefault(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let geminiPayload: unknown = undefined;

    bus.addEventListener(GeminiSignalType.GENERATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        geminiPayload = detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        request: 'What is the speed of light?',
    });

    assert.notStrictEqual(geminiPayload, undefined);
    const { prompt, model } = geminiPayload as { prompt: string; model?: string };
    assert.strictEqual(prompt, 'What is the speed of light?');
    assert.strictEqual(model, DEFAULT_GEMINI_MODEL);
    llm.denervate();
}

function testLlm_TransducesInferToOpenaiGenerateWhenRequested(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let openaiPayload: unknown = undefined;

    bus.addEventListener(OpenaiSignalType.GENERATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        openaiPayload = detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        request: 'What is the speed of light?',
        provider: 'openai',
        model: DEFAULT_OPENAI_MODEL,
    });

    assert.notStrictEqual(openaiPayload, undefined);
    const { prompt, model } = openaiPayload as { prompt: string; model?: string };
    assert.strictEqual(prompt, 'What is the speed of light?');
    assert.strictEqual(model, DEFAULT_OPENAI_MODEL);
    llm.denervate();
}

function testLlm_TransducesOpenaiGeneratedToLlmInferred(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let generatedResult: unknown = undefined;

    bus.addEventListener(SignalType.INFERRED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        generatedResult = detail.value;
    });

    emitSignal(bus, OpenaiSignalType.GENERATED, {
        prompt: 'hello',
        text: 'Hello world!',
        data: { message: 'Hello world!' },
        model: DEFAULT_OPENAI_MODEL,
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
    let geminiConfig: unknown = undefined;
    let openaiConfig: unknown = undefined;
    let connectedStatus: unknown = undefined;

    bus.addEventListener(GeminiSignalType.CONNECT, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        geminiConfig = detail.value;
    });
    bus.addEventListener(OpenaiSignalType.CONNECT, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        openaiConfig = detail.value;
    });
    bus.addEventListener(SignalType.CONNECTED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        connectedStatus = detail.value;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'secret-key' });
    assert.deepStrictEqual(geminiConfig, { apiKey: 'secret-key' });
    assert.deepStrictEqual(openaiConfig, { apiKey: 'secret-key' });

    emitSignal(bus, OpenaiSignalType.CONNECTED, { status: 'ready' });
    assert.strictEqual(connectedStatus, 'connected');
    llm.denervate();
}

function testLlm_TransducesErrors(): void {
    const bus = new EventTarget();
    const llm = new Llm('llm-test').innervate(bus);
    let errorReceived: unknown = undefined;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        const { detail } = event as CustomEvent<Signal>;
        errorReceived = detail.value;
    });

    emitSignal(bus, OpenaiSignalType.ERROR, new Error('OpenAI rate limit'));
    assert.ok(errorReceived instanceof Error);
    assert.strictEqual((errorReceived as Error).message, 'OpenAI rate limit');
    llm.denervate();
}

function runAllLlmTests(): void {
    testLlm_IdentityAndDefaults();
    testLlm_TransducesInferToGeminiGenerateByDefault();
    testLlm_TransducesInferToOpenaiGenerateWhenRequested();
    testLlm_TransducesOpenaiGeneratedToLlmInferred();
    testLlm_TransducesConnectAndConnected();
    testLlm_TransducesErrors();
    console.log('✔ All LLM UCA cognitive reasoning tests passed successfully.');
}

runAllLlmTests();
