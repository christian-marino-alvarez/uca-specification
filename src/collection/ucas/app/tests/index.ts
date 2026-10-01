import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { App } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_Identity(): void {
    const app = new App();
    const { id, purpose } = app;
    assert.strictEqual(id, __ID__);
    assert.strictEqual(purpose, App.purpose);
    assert.ok(app instanceof Uca);
}

function testApp_Disposition(): void {
    const app = new App();
    app.innervate();
    const { disposition } = app;
    const { inputs, outputs } = disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 4);
    app.denervate();
}

function setupLifecycleListeners(bus: EventTarget): { getResults: () => { ready: boolean; started: boolean; stopped: boolean } } {
    let ready = false;
    let started = false;
    let stopped = false;
    bus.addEventListener(SignalType.READY, () => { ready = true; });
    bus.addEventListener(SignalType.STARTED, () => { started = true; });
    bus.addEventListener(SignalType.STOPPED, () => { stopped = true; });
    return { getResults: () => ({ ready, started, stopped }) };
}

function testApp_LifecycleSignals(): void {
    const bus = new EventTarget();
    const app = new App('test-app').innervate(bus);
    const { getResults } = setupLifecycleListeners(bus);

    emitSignal(bus, SignalType.INIT, { title: 'Test App', version: '1.0.0' });
    emitSignal(bus, SignalType.START, {});
    emitSignal(bus, SignalType.STOP, {});

    const { ready, started, stopped } = getResults();
    assert.strictEqual(ready, true);
    assert.strictEqual(started, true);
    assert.strictEqual(stopped, true);
    app.denervate();
}

function runAllAppTests(): void {
    testApp_Identity();
    testApp_Disposition();
    testApp_LifecycleSignals();
    console.log('✔ All App UCA scaffolding tests passed successfully.');
}

runAllAppTests();
