import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ScaffoldComposerSignalType } from '@uca/scaffold-composer/types';
import type { Scaffold } from '@uca/scaffold-composer/types';
import { App } from '../index.js';
import { SignalType, DataType } from '../types.js';
import { __ID__ } from '../constants.js';

function createTestBus(): EventTarget {
    const bus = new EventTarget();
    try { setMaxListeners(50, bus); } catch { }
    return bus;
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_IdentityAndDefaults(): void {
    const app = new App();
    assert.ok(app instanceof Uca);
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, App.purpose);
    const { inputs, outputs, aim } = app.disposition;
    assert.strictEqual(inputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, App.purpose);
}

function testApp_InnervationAndCooky(): void {
    const bus = createTestBus();
    const app = new App().innervate(bus);
    assert.notStrictEqual(app.target, undefined);
    assert.notStrictEqual(app.disposition, undefined);
    app.denervate();
}

function testApp_CreateSignalRequestsScaffold(): void {
    const bus = createTestBus();
    let capturedScaffoldCreate: unknown;

    bus.addEventListener(ScaffoldComposerSignalType.CREATE, (event: Event) => {
        capturedScaffoldCreate = (event as CustomEvent<Signal>).detail?.value;
    });

    const app = new App('app-test').innervate(bus);
    emitSignal(bus, SignalType.CREATE, {});
    assert.ok(capturedScaffoldCreate !== undefined);
    app.denervate();
}

async function testApp_ReceivesScaffoldCreatedAndEmitsCreated(): Promise<void> {
    const bus = createTestBus();
    let appCreated: unknown;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        appCreated = (event as CustomEvent<Signal>).detail?.value;
    });

    const app = new App('app-test').innervate(bus);

    const scaffold: Scaffold = {
        purpose: 'Interactive knowledge exploration workbench',
        ucas: {
            header: { parentTo: 'app', purpose: 'Introduce UCA' },
            hero: { parentTo: 'header', purpose: 'Overview' },
        },
        theme: {
            global: ':root { --color: red; }',
            header: { layout: 'stack' },
        },
    };

    emitSignal(bus, ScaffoldComposerSignalType.CREATED, { scaffold });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(appCreated !== undefined);
    const { scaffold: received } = (appCreated as { scaffold?: Scaffold }) ?? {};
    assert.strictEqual(received?.purpose, scaffold.purpose);
    assert.strictEqual(received?.ucas?.header?.parentTo, 'app');
    assert.strictEqual(received?.ucas?.hero?.parentTo, 'header');

    app.denervate();
}

async function testApp_ReceivesScaffoldUpdatedAndEmitsUpdated(): Promise<void> {
    const bus = createTestBus();
    let appUpdated: unknown;

    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        appUpdated = (event as CustomEvent<Signal>).detail?.value;
    });

    const app = new App('app-test').innervate(bus);

    const scaffold: Scaffold = {
        purpose: 'Updated knowledge exploration workbench',
        ucas: {
            footer: { parentTo: 'app', purpose: 'Footer links' },
        },
        theme: {
            global: ':root { --color: blue; }',
        },
    };

    emitSignal(bus, ScaffoldComposerSignalType.UPDATED, { scaffold });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(appUpdated !== undefined);
    const { scaffold: received } = (appUpdated as { scaffold?: Scaffold }) ?? {};
    assert.strictEqual(received?.purpose, scaffold.purpose);

    app.denervate();
}

async function testApp_ReceivesScaffoldStreamAsFinalObjects(): Promise<void> {
    const bus = createTestBus();
    const app = new App('app-test').innervate(bus);
    const received: { key: string; value: unknown }[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown, value?: unknown) => {
        const match = String(message).match(/scaffold node "(.+)"/);
        if (match) { received.push({ key: match[1], value }); }
    };

    const stream = new ReadableStream<{ key: string; value: unknown }>({
        start(controller) {
            controller.enqueue({ key: 'global', value: ':root { --color: red; }' });
            controller.enqueue({ key: 'header', value: { parentTo: 'app', purpose: 'Navigation' } });
            controller.close();
        },
    });

    emitSignal(bus, ScaffoldComposerSignalType.STREAM, { streamId: 'create:scaffold-composer:1', stream });
    await new Promise((resolve) => setTimeout(resolve, 20));
    console.log = originalLog;

    assert.strictEqual(received.length, 2);
    assert.deepStrictEqual(received[0], { key: 'global', value: ':root { --color: red; }' });
    assert.deepStrictEqual(received[1], { key: 'header', value: { parentTo: 'app', purpose: 'Navigation' } });

    app.denervate();
}

async function runAllAppTests(): Promise<void> {
    console.log('🧪 Testing App UCA (coordinating with ScaffoldComposer only)...');
    testApp_IdentityAndDefaults();
    testApp_InnervationAndCooky();
    testApp_CreateSignalRequestsScaffold();
    await testApp_ReceivesScaffoldCreatedAndEmitsCreated();
    await testApp_ReceivesScaffoldUpdatedAndEmitsUpdated();
    await testApp_ReceivesScaffoldStreamAsFinalObjects();
    console.log('✅ All App UCA tests passed successfully!');
}

runAllAppTests();
