import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { Content } from '../index.js';
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

function testContent_IdentityAndDefaults(): void {
    const content = new Content();
    assert.ok(content instanceof Uca);
    assert.strictEqual(content.id, __ID__);
    assert.strictEqual(content.purpose, Content.purpose);
    const { inputs, outputs, aim } = Content.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.PAYLOAD);
    assert.strictEqual(aim.description, Content.purpose);
}

function testContent_Innervation(): void {
    const bus = new EventTarget();
    const content = new Content('custom-content').innervate(bus);
    assert.strictEqual(content.id, 'custom-content');
    assert.strictEqual(content.target, bus);
    content.denervate();
}

async function testContent_DelegatesToScaffold(): Promise<void> {
    const bus = new EventTarget();
    let scaffoldPayload: Record<string, unknown> | undefined;

    bus.addEventListener(ScaffoldSignalType.STREAM, (event: Event) => {
        scaffoldPayload = (event as CustomEvent<Signal>).detail?.value as Record<string, unknown>;
    });

    const content = new Content().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.ok(scaffoldPayload !== undefined);
    assert.strictEqual(scaffoldPayload.id, 'content:scaffold');
    assert.strictEqual(scaffoldPayload.request, DEFAULT_GOAL);
    content.denervate();
}

function setupCreatedCapture(bus: EventTarget): { get: () => CreatedResult | undefined } {
    let result: CreatedResult | undefined;
    bus.addEventListener(SignalType.CREATED, (e: Event) => {
        result = (e as CustomEvent<Signal>).detail?.value as CreatedResult;
    });
    return { get: () => result };
}

async function testContent_UsesCacheWhenAvailable(): Promise<void> {
    const bus = new EventTarget();
    const capture = setupCreatedCapture(bus);
    globalThis.localStorage.setItem('uca:content', JSON.stringify({ heroBanner: {} }));
    const content = new Content().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});
    await new Promise((r) => setTimeout(r, 15));
    assert.ok(capture.get()?.scaffold?.heroBanner !== undefined);
    globalThis.localStorage.removeItem('uca:content');
    content.denervate();
}

async function testContent_TransducesScaffoldSignals(): Promise<void> {
    const bus = new EventTarget();
    const chunks: ChunkResult[] = [];
    let created: CreatedResult | undefined;

    bus.addEventListener(SignalType.CHUNK, (event: Event) => {
        chunks.push((event as CustomEvent<Signal>).detail?.value as ChunkResult);
    });

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        created = (event as CustomEvent<Signal>).detail?.value as CreatedResult;
    });

    const content = new Content().innervate(bus);

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'content:stream:456',
        chunk: { heroBanner: { purpose: 'Main value proposition banner', parentTo: 'content' } },
    });

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'other:stream:999',
        chunk: { ignored: { purpose: 'Ignored', parentTo: null } },
    });

    emitSignal(bus, ScaffoldSignalType.CREATED, {
        correlationId: 'content:stream:456',
        scaffold: { heroBanner: { purpose: 'Main value proposition banner', parentTo: 'content' } },
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.strictEqual(chunks.length, 1);
    assert.deepStrictEqual(chunks[0]?.chunk, { heroBanner: { purpose: 'Main value proposition banner', parentTo: 'content' } });
    assert.ok(created !== undefined);
    assert.deepStrictEqual(created.scaffold, { heroBanner: { purpose: 'Main value proposition banner', parentTo: 'content' } });

    content.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing Content UCA (specialized layout disposition & scaffolding)...');
    testContent_IdentityAndDefaults();
    testContent_Innervation();
    await testContent_DelegatesToScaffold();
    await testContent_UsesCacheWhenAvailable();
    await testContent_TransducesScaffoldSignals();
    console.log('✅ All Content UCA tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
