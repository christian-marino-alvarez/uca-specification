import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { Header } from '../index.js';
import { __ID__, DEFAULT_GOAL } from '../constants.js';
import {
    type ChunkResult,
    type CreatedResult,
    DataType,
    SignalType,
} from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testHeader_IdentityAndDefaults(): void {
    const header = new Header();
    assert.ok(header instanceof Uca);
    assert.strictEqual(header.id, __ID__);
    assert.strictEqual(header.purpose, Header.purpose);
    const { inputs, outputs, aim } = Header.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.PAYLOAD);
    assert.strictEqual(aim.description, Header.purpose);
}

function testHeader_Innervation(): void {
    const bus = new EventTarget();
    const header = new Header('custom-header').innervate(bus);
    assert.strictEqual(header.id, 'custom-header');
    assert.strictEqual(header.target, bus);
    header.denervate();
}

async function testHeader_DelegatesToScaffold(): Promise<void> {
    const bus = new EventTarget();
    let scaffoldPayload: Record<string, unknown> | undefined;

    bus.addEventListener(ScaffoldSignalType.STREAM, (event: Event) => {
        scaffoldPayload = (event as CustomEvent<Signal>).detail?.value as Record<string, unknown>;
    });

    const header = new Header().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.ok(scaffoldPayload !== undefined);
    assert.strictEqual(scaffoldPayload.id, 'header:scaffold');
    assert.strictEqual(scaffoldPayload.request, DEFAULT_GOAL);
    header.denervate();
}

async function testHeader_TransducesScaffoldSignals(): Promise<void> {
    const bus = new EventTarget();
    const chunks: ChunkResult[] = [];
    let created: CreatedResult | undefined;

    bus.addEventListener(SignalType.CHUNK, (event: Event) => {
        chunks.push((event as CustomEvent<Signal>).detail?.value as ChunkResult);
    });

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        created = (event as CustomEvent<Signal>).detail?.value as CreatedResult;
    });

    const header = new Header().innervate(bus);

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'header:stream:123',
        chunk: { brandLogo: { purpose: 'Brand visual identity', parentTo: 'headerSection' } },
    });

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'other:stream:999',
        chunk: { ignored: { purpose: 'Ignored', parentTo: null } },
    });

    emitSignal(bus, ScaffoldSignalType.CREATED, {
        correlationId: 'header:stream:123',
        scaffold: { brandLogo: { purpose: 'Brand visual identity', parentTo: 'headerSection' } },
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.strictEqual(chunks.length, 1);
    assert.deepStrictEqual(chunks[0]?.chunk, { brandLogo: { purpose: 'Brand visual identity', parentTo: 'headerSection' } });
    assert.ok(created !== undefined);
    assert.deepStrictEqual(created.scaffold, { brandLogo: { purpose: 'Brand visual identity', parentTo: 'headerSection' } });

    header.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing Header UCA (specialized layout disposition & scaffolding)...');
    testHeader_IdentityAndDefaults();
    testHeader_Innervation();
    await testHeader_DelegatesToScaffold();
    await testHeader_UsesCacheWhenAvailable();
    await testHeader_TransducesScaffoldSignals();
    console.log('✅ All Header UCA tests passed successfully!');
}

function setupCreatedCapture(bus: EventTarget): { get: () => CreatedResult | undefined } {
    let result: CreatedResult | undefined;
    bus.addEventListener(SignalType.CREATED, (e: Event) => {
        result = (e as CustomEvent<Signal>).detail?.value as CreatedResult;
    });
    return { get: () => result };
}

async function testHeader_UsesCacheWhenAvailable(): Promise<void> {
    const bus = new EventTarget();
    const capture = setupCreatedCapture(bus);
    globalThis.localStorage.setItem('uca:header', JSON.stringify({ brandLogo: {} }));
    const header = new Header().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});
    await new Promise((r) => setTimeout(r, 15));
    assert.ok(capture.get()?.scaffold?.brandLogo !== undefined);
    globalThis.localStorage.removeItem('uca:header');
    header.denervate();
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
