import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import type OpenAI from 'openai';
import { Openai } from '../index.js';
import { SignalType, type Body, type GenerateResult } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testOpenai_IdentityAndDefaults(): void {
    const openai = new Openai();
    assert.strictEqual(openai.id, __ID__);
    assert.ok(openai instanceof Capability);
    openai.innervate();
    assert.strictEqual(openai.disposition.inputs?.length, 3);
    assert.strictEqual(openai.disposition.outputs?.length, 5);
    openai.denervate();
}

function testOpenai_ConnectSignal(): void {
    const bus = new EventTarget();
    const openai = new Openai('openai-conn').innervate(bus);
    let connected = false;

    bus.addEventListener(SignalType.CONNECTED, () => {
        connected = true;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'test-key' });
    assert.strictEqual(connected, true);
    openai.denervate();
}

async function testOpenai_GenerateWithMockClient(): Promise<void> {
    const bus = new EventTarget();
    const mockClient = {
        chat: {
            completions: {
                create: async () => ({
                    choices: [{ message: { content: JSON.stringify({ ucas: { 'center-box': { aim: { description: 'box' } } } }) } }],
                    usage: { prompt_tokens: 10, completion_tokens: 20 },
                }),
            },
        },
    } as unknown as OpenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Openai.AIM, body: { client: mockClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const openai = new Openai('openai-gen').innervate(bus, disposition);
    let capturedResult: GenerateResult | undefined;

    bus.addEventListener(SignalType.GENERATED, (event: Event) => {
        capturedResult = (event as CustomEvent<Signal<GenerateResult>>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, {
        prompt: 'Crear vista',
        schema: { type: 'object' },
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedResult !== undefined);
    assert.strictEqual(capturedResult.prompt, 'Crear vista');
    assert.ok(capturedResult.data !== undefined);
    const data = capturedResult.data as { ucas: Record<string, unknown> };
    assert.ok(data.ucas['center-box']);

    openai.denervate();
}

async function testOpenai_GenerateHandlesError(): Promise<void> {
    const bus = new EventTarget();
    const failingClient = {
        chat: {
            completions: {
                create: async () => {
                    throw new Error('OpenAI API rate limit exceeded');
                },
            },
        },
    } as unknown as OpenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Openai.AIM, body: { client: failingClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const openai = new Openai('openai-err').innervate(bus, disposition);
    let errorCaptured: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorCaptured = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, { prompt: 'bad' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(errorCaptured instanceof Error);
    assert.strictEqual((errorCaptured as Error).message, 'OpenAI API rate limit exceeded');

    openai.denervate();
}

async function runAllOpenaiTests(): Promise<void> {
    testOpenai_IdentityAndDefaults();
    testOpenai_ConnectSignal();
    await testOpenai_GenerateWithMockClient();
    await testOpenai_GenerateHandlesError();
    console.log('✔ All OpenAI capability minimal architecture tests passed successfully.');
}

void runAllOpenaiTests();
