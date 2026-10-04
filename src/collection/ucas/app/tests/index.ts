import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ConceptComposerSignalType } from '@uca/concept-composer';
import { SignalType as ViewComposerSignalType } from '@uca/view-composer';
import { App, SignalType, DataType, __ID__, PURPOSE } from '../index.js';

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
    assert.strictEqual(app.purpose, PURPOSE);
    const { inputs, outputs, aim } = app.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, PURPOSE);
}

function testApp_InnervationAndCooky(): void {
    const bus = createTestBus();
    const app = new App().innervate(bus);
    assert.notStrictEqual(app.target, undefined);
    assert.notStrictEqual(app.disposition, undefined);
    app.denervate();
}

function testApp_PulsesDomainSignals(): void {
    const bus = createTestBus();
    const captured: { property: string; value: unknown }[] = [];

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent<Signal>).detail?.value });
    });

    const app = new App('app-scaffold').innervate(bus);
    emitSignal(bus, SignalType.UPDATE, {});
    emitSignal(bus, SignalType.REMOVE, {});

    assert.ok(captured.length >= 3);
    assert.ok(captured.some((c) => c.property === SignalType.CREATED));
    assert.ok(captured.some((c) => c.property === SignalType.UPDATED));
    assert.ok(captured.some((c) => c.property === SignalType.REMOVED));

    app.denervate();
}

function testApp_InnervateTriggersConceptComposer(): void {
    const bus = createTestBus();
    let capturedCreate: unknown;

    bus.addEventListener(ConceptComposerSignalType.CREATE, (event: Event) => {
        capturedCreate = (event as CustomEvent<Signal>).detail?.value;
    });

    const app = new App('app-composer-test').innervate(bus);
    assert.ok(capturedCreate !== undefined);
    app.denervate();
}

function testApp_ReactsToConceptComposerAndFinalView(): void {
    const bus = createTestBus();
    const capturedUpdates: unknown[] = [];

    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        capturedUpdates.push((event as CustomEvent<Signal>).detail?.value);
    });

    const app = new App('app-flow-test').innervate(bus);
    emitSignal(bus, ConceptComposerSignalType.CREATED, { concept: { theme: { name: 'TestTheme' } } });
    emitSignal(bus, ViewComposerSignalType.CREATED, { title: 'Final View' });

    assert.ok(capturedUpdates.length >= 2);
    app.denervate();
}

async function runAllAppTests(): Promise<void> {
    testApp_IdentityAndDefaults();
    testApp_InnervationAndCooky();
    testApp_PulsesDomainSignals();
    testApp_InnervateTriggersConceptComposer();
    testApp_ReactsToConceptComposerAndFinalView();
    console.log('✔ All App UCA lifecycle and ConceptComposer/ViewComposer scaffolding tests passed successfully.');
}

runAllAppTests();
