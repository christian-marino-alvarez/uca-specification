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
    assert.strictEqual(outputs?.length, 5);
    app.denervate();
}

function setupLifecycleListeners(bus: EventTarget): { getResults: () => { ready: boolean; started: boolean; stopped: boolean; viewComposed: boolean } } {
    let ready = false;
    let started = false;
    let stopped = false;
    let viewComposed = false;
    bus.addEventListener(SignalType.READY, () => { ready = true; });
    bus.addEventListener(SignalType.STARTED, () => { started = true; });
    bus.addEventListener(SignalType.STOPPED, () => { stopped = true; });
    bus.addEventListener(SignalType.VIEW_COMPOSED, () => { viewComposed = true; });
    return { getResults: () => ({ ready, started, stopped, viewComposed }) };
}

function testApp_LifecycleSignals(): void {
    const bus = new EventTarget();
    const app = new App('test-app').innervate(bus);
    const { getResults } = setupLifecycleListeners(bus);

    emitSignal(bus, SignalType.INIT, { title: 'Test App', version: '1.0.0' });
    emitSignal(bus, SignalType.START, {});
    emitSignal(bus, SignalType.STOP, {});

    const { ready, started, stopped, viewComposed } = getResults();
    assert.strictEqual(ready, true);
    assert.strictEqual(started, true);
    assert.strictEqual(stopped, true);
    assert.strictEqual(viewComposed, true);
    app.denervate();
}

function testApp_InitialViewSchemaAndDispositions(): void {
    const app = new App();
    const { properties } = App.VIEW_SCHEMA;
    assert.ok(properties.ucas);
    const initialView = app.createInitialView();
    const { 'query-input': input, 'query-button': button } = initialView;
    const { body: inputBody } = input.aim as { body?: { placeholder?: string } };
    const { placeholder } = inputBody ?? {};
    const { body: buttonBody } = button.aim as { body?: { label?: string } };
    const { label } = buttonBody ?? {};
    assert.strictEqual(placeholder, 'que quieres conocer de la Uca');
    assert.strictEqual(label, 'Consultar');
}

function runAllAppTests(): void {
    testApp_Identity();
    testApp_Disposition();
    testApp_LifecycleSignals();
    testApp_InitialViewSchemaAndDispositions();
    console.log('✔ All App UCA scaffolding and view composition tests passed successfully.');
}

runAllAppTests();
