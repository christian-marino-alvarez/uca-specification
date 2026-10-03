import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as ViewComposerSignalType, type ComposePayload } from '@uca/view-composer';
import { App, SignalType, DataType, __ID__, PURPOSE } from '../index.js';

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
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, PURPOSE);
}

function testApp_InnervationAndCooky(): void {
    const bus = new EventTarget();
    const app = new App().innervate(bus);
    assert.notStrictEqual(app.target, undefined);
    assert.notStrictEqual(app.disposition, undefined);
    app.denervate();
}

function testApp_PulsesDomainSignals(): void {
    const bus = new EventTarget();
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
    assert.strictEqual(captured[0]?.property, SignalType.CREATED);
    assert.strictEqual(captured[1]?.property, SignalType.UPDATED);
    assert.strictEqual(captured[2]?.property, SignalType.REMOVED);

    app.denervate();
}

function testApp_InnervateTriggersViewComposer(): void {
    const bus = new EventTarget();
    let capturedCompose: ComposePayload | undefined;

    bus.addEventListener(ViewComposerSignalType.COMPOSE, (event: Event) => {
        const signal = (event as CustomEvent<Signal>).detail;
        capturedCompose = signal?.value as ComposePayload;
    });

    const app = new App('app-orchestrator').innervate(bus);

    assert.ok(capturedCompose !== undefined);
    assert.ok(capturedCompose?.request?.includes('UCA'));
    assert.ok(capturedCompose?.documentation?.includes('Universal Cognitive Architecture'));

    app.denervate();
}

function runAllAppTests(): void {
    testApp_IdentityAndDefaults();
    testApp_InnervationAndCooky();
    testApp_PulsesDomainSignals();
    testApp_InnervateTriggersViewComposer();
    console.log('✔ All App UCA scaffolding and ViewComposer orchestration tests passed successfully.');
}

runAllAppTests();
