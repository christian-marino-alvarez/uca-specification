import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { ScaffoldComposer } from '../index.js';
import { DataType, SignalType } from '../types.js';
import { __ID__, DEFAULT_SCAFFOLD } from '../constants.js';

function createTestBus(): EventTarget {
    const bus = new EventTarget();
    try { setMaxListeners(50, bus); } catch { }
    return bus;
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testScaffoldComposer_IdentityAndDefaults(): void {
    const composer = new ScaffoldComposer();
    assert.ok(composer instanceof Uca);
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, ScaffoldComposer.purpose);
    const { inputs, outputs, aim } = composer.disposition;
    assert.strictEqual(inputs?.length, 5);
    assert.strictEqual(inputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(outputs?.[0]?.type, DataType.SCAFFOLD);
    assert.strictEqual(aim.description, ScaffoldComposer.purpose);
}

function testScaffoldComposer_InnervationAndCooky(): void {
    const bus = createTestBus();
    const composer = new ScaffoldComposer().innervate(bus);
    assert.notStrictEqual(composer.target, undefined);
    assert.notStrictEqual(composer.disposition, undefined);
    composer.denervate();
}

function testScaffoldComposer_CreateSignalRequestsSynthesis(): void {
    const bus = createTestBus();
    let capturedStream: unknown;

    bus.addEventListener('llm-web.stream', (event: Event) => {
        capturedStream = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ScaffoldComposer('scaffold-composer').innervate(bus);
    emitSignal(bus, SignalType.CREATE, {});

    assert.ok(capturedStream !== undefined);
    const streamPayload = capturedStream as { purpose?: string; aim?: unknown; determinism?: number; imagination?: number; model?: string; correlationId?: string };
    assert.strictEqual(streamPayload.purpose, ScaffoldComposer.purpose);
    assert.ok(streamPayload.aim !== undefined);
    assert.strictEqual(streamPayload.determinism, 90);
    assert.strictEqual(streamPayload.imagination, 10);
    assert.strictEqual(streamPayload.model, undefined);
    assert.ok(streamPayload.correlationId?.startsWith('create:'));
    composer.denervate();
}

async function testScaffoldComposer_LlmResponsePulsesCreated(): Promise<void> {
    const bus = createTestBus();
    let capturedCreated: unknown;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedCreated = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ScaffoldComposer('scaffold-composer').innervate(bus);
    const mockData = {
        purpose: 'Synthesized Architecture',
        ucas: {
            header: { parentTo: 'app', purpose: 'Site header navigation' },
            login: { parentTo: 'header', purpose: 'User authentication' },
        },
        theme: {
            global: ':root { --color-primary: #10b981; }',
            header: { layout: 'cluster' },
        },
    };

    emitSignal(bus, 'llm-web.response', {
        response: JSON.stringify(mockData),
        data: mockData,
        sourceId: 'llm-web:scaffold-composer',
        correlationId: 'create:scaffold-composer-1',
    });

    assert.ok(capturedCreated !== undefined);
    const { scaffold } = (capturedCreated as { scaffold?: { purpose: string; ucas: Record<string, { parentTo: string }>; theme: { global: string } } }) ?? {};
    assert.strictEqual(scaffold?.purpose, 'Synthesized Architecture');
    assert.strictEqual(scaffold?.ucas?.header?.parentTo, 'app');
    assert.strictEqual(scaffold?.ucas?.login?.parentTo, 'header');
    assert.ok(typeof scaffold?.theme?.global === 'string' && scaffold?.theme?.global.includes('--color-primary: #10b981'));

    composer.denervate();
}

async function testScaffoldComposer_UpdatePulsesUpdated(): Promise<void> {
    const bus = createTestBus();
    let capturedUpdated: unknown;

    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        capturedUpdated = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ScaffoldComposer('scaffold-composer').innervate(bus);
    const mockData = {
        purpose: 'Updated Architecture',
        ucas: {
            sidebar: { parentTo: 'app', purpose: 'Contextual actions' },
        },
        theme: {
            global: ':root { --color-primary: #3b82f6; }',
        },
    };

    emitSignal(bus, 'llm-web.response', {
        response: JSON.stringify(mockData),
        data: mockData,
        sourceId: 'llm-web:scaffold-composer',
        correlationId: 'update:scaffold-composer-1',
    });

    assert.ok(capturedUpdated !== undefined);
    const { scaffold } = (capturedUpdated as { scaffold?: { purpose: string } }) ?? {};
    assert.strictEqual(scaffold?.purpose, 'Updated Architecture');

    composer.denervate();
}

async function testScaffoldComposer_InvalidSchemaAppliesDefaultScaffold(): Promise<void> {
    const bus = createTestBus();
    let capturedCreated: unknown;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedCreated = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ScaffoldComposer('scaffold-composer').innervate(bus);
    const mockCorruptedData = {
        corrupted: true,
    };

    emitSignal(bus, 'llm-web.response', {
        response: JSON.stringify(mockCorruptedData),
        data: mockCorruptedData,
        sourceId: 'llm-web:scaffold-composer',
        correlationId: 'create:scaffold-composer-1',
    });

    assert.ok(capturedCreated !== undefined);
    const { scaffold } = (capturedCreated as { scaffold?: { purpose: string; ucas: Record<string, unknown>; theme: { global: string } } }) ?? {};
    assert.strictEqual(scaffold?.purpose, '');
    assert.deepStrictEqual(scaffold?.ucas, {});
    assert.deepStrictEqual(scaffold?.theme, { global: '' });

    composer.denervate();
}

async function testScaffoldComposer_GraphStreamPulsesStreamAndCreated(): Promise<void> {
    const bus = createTestBus();
    let capturedStream: unknown;
    let capturedCreated: unknown;

    bus.addEventListener(SignalType.STREAM, (event: Event) => {
        capturedStream = (event as CustomEvent<Signal>).detail?.value;
    });

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedCreated = (event as CustomEvent<Signal>).detail?.value;
    });

    const composer = new ScaffoldComposer('scaffold-composer').innervate(bus);

    const stream = new ReadableStream<{ key: string; value: unknown }>({
        start(controller) {
            controller.enqueue({ key: 'global', value: ':root { --primary: #3b82f6; }' });
            controller.enqueue({ key: 'header', value: { parentTo: 'app', purpose: 'Navigation bar' } });
            controller.close();
        },
    });

    emitSignal(bus, 'graph.stream', { stream, streamId: 'create:scaffold-composer:1' });

    assert.ok(capturedStream !== undefined);
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.ok(capturedCreated !== undefined);
    const { scaffold } = (capturedCreated as { scaffold?: { ucas: Record<string, { parentTo: string }>; theme: { global: string } } }) ?? {};
    assert.strictEqual(scaffold?.ucas?.header?.parentTo, 'app');
    assert.strictEqual(scaffold?.theme?.global, ':root { --primary: #3b82f6; }');

    composer.denervate();
}

async function run(): Promise<void> {
    console.log('🧪 Testing ScaffoldComposer UCA (scaffold only, reacts to App)...');
    testScaffoldComposer_IdentityAndDefaults();
    testScaffoldComposer_InnervationAndCooky();
    testScaffoldComposer_CreateSignalRequestsSynthesis();
    await testScaffoldComposer_LlmResponsePulsesCreated();
    await testScaffoldComposer_UpdatePulsesUpdated();
    await testScaffoldComposer_InvalidSchemaAppliesDefaultScaffold();
    await testScaffoldComposer_GraphStreamPulsesStreamAndCreated();
    console.log('✅ ScaffoldComposer tests passed successfully!');
}

run();

