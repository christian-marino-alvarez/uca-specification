import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { Gemini } from '../index.js';
import { SignalType, type Body, type GenerateResult } from '../types.js';
import { __ID__ } from '../constants.js';
import type { GoogleGenAI } from '@google/genai';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testGemini_IdentityAndDefaults(): void {
    const gemini = new Gemini();
    assert.strictEqual(gemini.id, __ID__);
    assert.ok(gemini instanceof Capability);
    gemini.innervate();
    assert.strictEqual(gemini.disposition.inputs?.length, 3);
    assert.strictEqual(gemini.disposition.outputs?.length, 5);
    gemini.denervate();
}

function testGemini_ConnectSignal(): void {
    const bus = new EventTarget();
    const gemini = new Gemini('gemini-conn').innervate(bus);
    let connected = false;

    bus.addEventListener(SignalType.CONNECTED, () => {
        connected = true;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'test-key' });
    assert.strictEqual(connected, true);
    gemini.denervate();
}

async function testGemini_GenerateWithMockClient(): Promise<void> {
    const bus = new EventTarget();
    const mockClient = {
        models: {
            generateContent: async () => ({
                text: JSON.stringify({ ucas: { 'center-box': { aim: { description: 'box' } } } }),
                usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20 },
            }),
        },
    } as unknown as GoogleGenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: { client: mockClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const gemini = new Gemini('gemini-gen').innervate(bus, disposition);
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

    gemini.denervate();
}

async function testGemini_GenerateHandlesError(): Promise<void> {
    const bus = new EventTarget();
    const failingClient = {
        models: {
            generateContent: async () => {
                throw new Error('Gemini API rate limit exceeded');
            },
        },
    } as unknown as GoogleGenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: { client: failingClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const gemini = new Gemini('gemini-err').innervate(bus, disposition);
    let errorCaptured: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorCaptured = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, { prompt: 'bad' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(errorCaptured instanceof Error);
    assert.strictEqual((errorCaptured as Error).message, 'Gemini API rate limit exceeded');

    gemini.denervate();
}

async function runAllGeminiTests(): Promise<void> {
    testGemini_IdentityAndDefaults();
    testGemini_ConnectSignal();
    await testGemini_GenerateWithMockClient();
    await testGemini_GenerateHandlesError();
    console.log('✔ All Gemini capability minimal architecture tests passed successfully.');
}

void runAllGeminiTests();
