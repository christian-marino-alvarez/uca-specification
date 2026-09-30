import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import type { Signal } from '../../../../core/types.js';
import { App } from '../index.js';
import { SignalType, type AppExecutionResult } from '../types.js';
import { __ID__ } from '../constants.js';
import { SignalType as StyleSignalType, type StyleDesignResult } from '../../style-builder/types.js';

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

function testApp_InitAndGenerateFlow(): void {
    const bus = new EventTarget();
    const app = new App('app-demo').innervate(bus);

    let readyReceived = false;
    let executionResult: AppExecutionResult | undefined;

    bus.addEventListener(SignalType.READY, () => {
        readyReceived = true;
    });

    bus.addEventListener(SignalType.RENDERED, (event: Event) => {
        executionResult = (event as CustomEvent<Signal<AppExecutionResult>>).detail.value;
    });

    emitSignal(bus, SignalType.INIT, {});
    assert.strictEqual(readyReceived, true);

    const mockStyleResult: StyleDesignResult = {
        viewTitle: 'Demo App View',
        palette: { primary: '#2563eb' },
        elementStyles: [{ elementId: 'box-1', theme: 'light', classes: ['ext-box'] }],
    };

    // Simulate completion from the composed StyleBuilder
    emitSignal(bus, StyleSignalType.STYLED, mockStyleResult);

    assert.ok(executionResult !== undefined);
    assert.strictEqual(executionResult.style.viewTitle, 'Demo App View');
    assert.strictEqual(executionResult.style.elementStyles.length, 1);

    app.denervate();
}

function runAllAppTests(): void {
    testApp_IdentityAndDefaults();
    testApp_InitAndGenerateFlow();
    console.log('✔ All App UCA minimal architecture tests passed successfully.');
}

runAllAppTests();
