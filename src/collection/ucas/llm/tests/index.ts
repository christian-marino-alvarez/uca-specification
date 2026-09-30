import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Llm } from '../index.js';
import { SignalType, type Body } from '../types.js';
import { __ID__ } from '../constants.js';


function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

async function readEntireStream(stream: ReadableStream<string>): Promise<string[]> {
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

function testLlm_IdentityAndDefaults(): void {
    const llm = new Llm();
    assert.strictEqual(llm.id, __ID__);
    assert.strictEqual(llm.purpose, Llm.PURPOSE);
    assert.ok(llm instanceof Uca);
    llm.innervate();
    assert.ok(llm.disposition.inputs !== undefined);
    assert.strictEqual(llm.disposition.inputs.length, 2);
    assert.ok(llm.disposition.outputs !== undefined);
    assert.strictEqual(llm.disposition.outputs.length, 3);
    llm.denervate();
}

async function testLlm_DedicatedGeminiProvider(): Promise<void> {
    const bus = new EventTarget();
    const llm = new Llm('llm-gemini-test').innervate(bus);
    let capturedStream: ReadableStream<string> | undefined;

    bus.addEventListener(SignalType.STREAM, (event: Event) => {
        capturedStream = (event as CustomEvent<Signal<ReadableStream<string>>>).detail.value;
    });

    emitSignal(bus, SignalType.PROMPT, {
        text: 'Hello dedicated model',
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedStream instanceof ReadableStream);
    const chunks = await readEntireStream(capturedStream);
    assert.deepStrictEqual(chunks, ['Hello dedicated model']);

    llm.denervate();
}

async function testLlm_DedicatedWebPromptProvider(): Promise<void> {
    const bus = new EventTarget();
    const webPromptDisp = Capability.createDisposition<Body>('Dedicated Web Prompt', {
        provider: 'google-web-prompt',
        model: 'gemini-nano',
        systemPrompt: 'You are a helpful assistant',
    });
    const llm = new Llm('llm-prompt-test').innervate(bus, webPromptDisp);

    emitSignal(bus, SignalType.ABORT, {});

    await new Promise((resolve) => setTimeout(resolve, 20));
    const { aim } = llm.disposition;
    const { provider, model, systemPrompt } = aim.body ?? {};
    assert.strictEqual(provider, 'google-web-prompt');
    assert.strictEqual(model, 'gemini-nano');
    assert.strictEqual(systemPrompt, 'You are a helpful assistant');
    assert.notStrictEqual(model, systemPrompt);

    llm.denervate();
}

async function runAllLlmTests(): Promise<void> {
    testLlm_IdentityAndDefaults();
    await testLlm_DedicatedGeminiProvider();
    await testLlm_DedicatedWebPromptProvider();
    console.log('✔ All Llm UCA minimal architecture tests passed successfully.');
}

void runAllLlmTests();
