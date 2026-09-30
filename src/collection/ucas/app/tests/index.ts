import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import type { Signal } from '../../../../core/types.js';
import { App } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_IdentityAndDefaults(): void {
    const app = new App();
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, App.PURPOSE);
    assert.ok(app instanceof Uca);
    app.innervate();
    assert.strictEqual(app.disposition.inputs?.length, 3);
    assert.strictEqual(app.disposition.outputs?.length, 3);
    app.denervate();
}

function testApp_LifecycleSignals(): void {
    const bus = new EventTarget();
    const app = new App('test-app').innervate(bus);
    let readyReceived = false;
    let startedReceived = false;
    let stoppedReceived = false;

    bus.addEventListener(SignalType.READY, () => {
        readyReceived = true;
    });
    bus.addEventListener(SignalType.STARTED, () => {
        startedReceived = true;
    });
    bus.addEventListener(SignalType.STOPPED, () => {
        stoppedReceived = true;
    });

    emitSignal(bus, SignalType.INIT, {});
    assert.strictEqual(readyReceived, true);

    emitSignal(bus, SignalType.START, {});
    assert.strictEqual(startedReceived, true);

    emitSignal(bus, SignalType.STOP, {});
    assert.strictEqual(stoppedReceived, true);

    app.denervate();
}

function runAllAppTests(): void {
    testApp_IdentityAndDefaults();
    testApp_LifecycleSignals();
    console.log('✔ All App UCA minimal architecture tests passed successfully.');
}

runAllAppTests();
