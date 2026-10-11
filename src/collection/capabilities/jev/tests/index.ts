import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { Jev } from '../index.js';
import { SignalType, type Body, type InferResult } from '../types.js';
import { __ID__ } from '../constants.js';
import type { TypeSafeClient } from '@typesafe-ai/sdk';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testJev_IdentityAndDefaults(): void {
    const jev = new Jev();
    assert.strictEqual(jev.id, __ID__);
    assert.ok(jev instanceof Capability);
    jev.innervate();
    assert.strictEqual(jev.disposition.inputs?.length, 2);
    assert.strictEqual(jev.disposition.outputs?.length, 3);
    jev.denervate();
}

function testJev_ConnectSignal(): void {
    const bus = new EventTarget();
    const jev = new Jev('jev-conn').innervate(bus);
    emitSignal(bus, jev.updateEvent, Jev.disposition);
    let connected = false;

    bus.addEventListener(SignalType.CONNECTED, () => {
        connected = true;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'test-key' });
    assert.strictEqual(connected, true);
    jev.denervate();
}

async function testJev_InferWithMockClient(): Promise<void> {
    const bus = new EventTarget();
    const mockClient = {
        systemOne: async (req: unknown) => {
            const parsed = req as { state: unknown; questions: Record<string, unknown> };
            return { valid: true, echoState: parsed.state };
        },
    } as unknown as TypeSafeClient;

    const disposition: Disposition<Body> = { aim: { description: Jev.AIM, body: { client: mockClient } }, reactTo: [SignalType.CONNECT, SignalType.INFER] };
    const jev = new Jev('jev-infer').innervate(bus);
    emitSignal(bus, jev.updateEvent, disposition);
    let capturedResult: InferResult | undefined;

    bus.addEventListener(SignalType.INFERRED, (event: Event) => {
        capturedResult = (event as CustomEvent<Signal<InferResult>>).detail.value;
    });

    emitSignal(bus, SignalType.INFER, {
        state: { user: 'alice' },
        questions: { is_active: { type: 'noul' } },
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedResult !== undefined);
    assert.deepStrictEqual(capturedResult.state, { user: 'alice' });
    assert.strictEqual((capturedResult.answers as any).valid, true);

    jev.denervate();
}

async function testJev_InferHandlesError(): Promise<void> {
    const bus = new EventTarget();
    const failingClient = {
        systemOne: async () => {
            throw new Error('Jev API network failure');
        },
    } as unknown as TypeSafeClient;

    const disposition: Disposition<Body> = { aim: { description: Jev.AIM, body: { client: failingClient } }, reactTo: [SignalType.CONNECT, SignalType.INFER] };
    const jev = new Jev('jev-err').innervate(bus);
    emitSignal(bus, jev.updateEvent, disposition);
    let errorCaptured: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorCaptured = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.INFER, { state: 'bad', questions: {} });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(errorCaptured instanceof Error);
    assert.strictEqual((errorCaptured as Error).message, 'Jev API network failure');

    jev.denervate();
}

async function runAllJevTests(): Promise<void> {
    testJev_IdentityAndDefaults();
    testJev_ConnectSignal();
    await testJev_InferWithMockClient();
    await testJev_InferHandlesError();
    console.log('✔ All Jev capability minimal architecture tests passed successfully.');
}

void runAllJevTests();
