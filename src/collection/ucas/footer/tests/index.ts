import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { Footer } from '../index.js';
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

function testFooter_IdentityAndDefaults(): void {
    const footer = new Footer();
    assert.ok(footer instanceof Uca);
    assert.strictEqual(footer.id, __ID__);
    assert.strictEqual(footer.purpose, Footer.purpose);
    const { inputs, outputs, aim } = Footer.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.PAYLOAD);
    assert.strictEqual(aim.description, Footer.purpose);
}

function testFooter_Innervation(): void {
    const bus = new EventTarget();
    const footer = new Footer('custom-footer').innervate(bus);
    assert.strictEqual(footer.id, 'custom-footer');
    assert.strictEqual(footer.target, bus);
    footer.denervate();
}

async function testFooter_DelegatesToScaffold(): Promise<void> {
    const bus = new EventTarget();
    let scaffoldPayload: Record<string, unknown> | undefined;

    bus.addEventListener(ScaffoldSignalType.STREAM, (event: Event) => {
        scaffoldPayload = (event as CustomEvent<Signal>).detail?.value as Record<string, unknown>;
    });

    const footer = new Footer().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.ok(scaffoldPayload !== undefined);
    assert.strictEqual(scaffoldPayload.id, 'footer:scaffold');
    assert.strictEqual(scaffoldPayload.request, DEFAULT_GOAL);
    footer.denervate();
}

function setupCreatedCapture(bus: EventTarget): { get: () => CreatedResult | undefined } {
    let result: CreatedResult | undefined;
    bus.addEventListener(SignalType.CREATED, (e: Event) => {
        result = (e as CustomEvent<Signal>).detail?.value as CreatedResult;
    });
    return { get: () => result };
}

async function testFooter_UsesCacheWhenAvailable(): Promise<void> {
    const bus = new EventTarget();
    const capture = setupCreatedCapture(bus);
    globalThis.localStorage.setItem('uca:footer', JSON.stringify({ copyrightNotice: {} }));
    const footer = new Footer().innervate(bus);
    emitSignal(bus, SignalType.STREAM, {});
    await new Promise((r) => setTimeout(r, 15));
    assert.ok(capture.get()?.scaffold?.copyrightNotice !== undefined);
    globalThis.localStorage.removeItem('uca:footer');
    footer.denervate();
}

async function testFooter_TransducesScaffoldSignals(): Promise<void> {
    const bus = new EventTarget();
    const chunks: ChunkResult[] = [];
    let created: CreatedResult | undefined;

    bus.addEventListener(SignalType.CHUNK, (event: Event) => {
        chunks.push((event as CustomEvent<Signal>).detail?.value as ChunkResult);
    });

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        created = (event as CustomEvent<Signal>).detail?.value as CreatedResult;
    });

    const footer = new Footer().innervate(bus);

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'footer:stream:789',
        chunk: { copyrightNotice: { purpose: 'Legal copyright and attribution', parentTo: 'footer' } },
    });

    emitSignal(bus, ScaffoldSignalType.CHUNK, {
        correlationId: 'other:stream:999',
        chunk: { ignored: { purpose: 'Ignored', parentTo: null } },
    });

    emitSignal(bus, ScaffoldSignalType.CREATED, {
        correlationId: 'footer:stream:789',
        scaffold: { copyrightNotice: { purpose: 'Legal copyright and attribution', parentTo: 'footer' } },
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.strictEqual(chunks.length, 1);
    assert.deepStrictEqual(chunks[0]?.chunk, { copyrightNotice: { purpose: 'Legal copyright and attribution', parentTo: 'footer' } });
    assert.ok(created !== undefined);
    assert.deepStrictEqual(created.scaffold, { copyrightNotice: { purpose: 'Legal copyright and attribution', parentTo: 'footer' } });

    footer.denervate();
}

function testFooter_InheritedContextDisposition(): void {
    const bus = new EventTarget();
    const disposition = { aim: { description: 'Parent', body: { context: 'App Master Purpose' } } };
    const footer = new Footer('footer').innervate(bus, disposition as never);
    const { registry } = footer as unknown as { registry: Map<string, Uca> };
    const scaffold = registry.get('footer:scaffold');
    assert.strictEqual((footer as unknown as Record<string, unknown>).resolveContext, undefined);
    assert.strictEqual(scaffold?.context, `App Master Purpose → ${Footer.purpose}`);
    footer.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing Footer UCA (specialized layout disposition & scaffolding)...');
    testFooter_IdentityAndDefaults();
    testFooter_Innervation();
    testFooter_InheritedContextDisposition();
    await testFooter_DelegatesToScaffold();
    await testFooter_UsesCacheWhenAvailable();
    await testFooter_TransducesScaffoldSignals();
    console.log('✅ All Footer UCA tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
