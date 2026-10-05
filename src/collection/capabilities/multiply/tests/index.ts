import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { Multiply } from '../index.js';
import { SignalType, type Body } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testMultiply_IdentityAndDefaults(): void {
    const multiply = new Multiply();
    assert.strictEqual(multiply.id, __ID__);
    assert.strictEqual(Multiply.AIM, 'Multiply multiplier and multiplicand and pulse product');
    assert.ok(multiply instanceof Capability);
    multiply.denervate();
}

function testMultiply_CalculatesProduct(): void {
    const bus = new EventTarget();
    const multiply = new Multiply('multiply-test').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<number>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, [6, 7]);
    assert.strictEqual(result, 42);

    emitSignal(bus, SignalType.EVALUATE, [5, -3]);
    assert.strictEqual(result, -15);

    multiply.denervate();
}

function testMultiply_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = { aim: { description: 'Multiply fallback', body: { operands: [8, 9] as const } }, reactTo: [SignalType.EVALUATE] };
    const multiply = new Multiply('multiply-fallback').innervate(bus, disposition);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<number>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, {});
    assert.strictEqual(result, 72);

    multiply.denervate();
}

function runAllMultiplyTests(): void {
    testMultiply_IdentityAndDefaults();
    testMultiply_CalculatesProduct();
    testMultiply_UsesFallbackDispositionAimBody();
    console.log('✔ All Multiply capability minimal architecture tests passed successfully.');
}

runAllMultiplyTests();
