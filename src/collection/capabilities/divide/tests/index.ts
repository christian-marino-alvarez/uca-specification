import * as assert from 'node:assert';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Divide, SignalType, type Outcome, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testDivide_IdentityAndDefaults(): void {
    const divide = new Divide();
    assert.strictEqual(divide.id, __ID__);
    assert.strictEqual(Divide.AIM, 'Divide dividend by divisor and pulse outcome with result and rest');
    assert.ok(divide instanceof Capability);
    assert.deepStrictEqual(divide.disposition.inputs, [{ signal: SignalType.EVALUATE, type: '[number, number]', description: 'Operands [dividend, divisor]' }]);
    assert.deepStrictEqual(divide.disposition.outputs, [{ signal: SignalType.EVALUATED, type: '{ result: number, rest: number }', description: 'Outcome { result, rest }' }]);
    divide.denervate();
}


function testDivide_CalculatesResultAndRest(): void {
    const bus = new EventTarget();
    const divide = new Divide('divide-test').innervate(bus);
    let outcome: Outcome | undefined = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        outcome = (event as CustomEvent<Signal<Outcome>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, [20, 4]);
    assert.deepStrictEqual(outcome, { result: 5, rest: 0 });

    emitSignal(bus, SignalType.EVALUATE, [10, 3]);
    assert.deepStrictEqual(outcome, { result: 3, rest: 1 });

    emitSignal(bus, SignalType.EVALUATE, [7, 2]);
    assert.deepStrictEqual(outcome, { result: 3, rest: 1 });

    divide.denervate();
}

function testDivide_DivisionByZeroDoesNotPulse(): void {
    const bus = new EventTarget();
    const divide = new Divide('divide-zero').innervate(bus);
    let called = false;
    bus.addEventListener(SignalType.EVALUATED, () => {
        called = true;
    });

    emitSignal(bus, SignalType.EVALUATE, [10, 0]);
    assert.strictEqual(called, false);

    divide.denervate();
}

function testDivide_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition = Capability.createDisposition('Divide fallback', { operands: [100, 25] as const });
    const divide = new Divide('divide-fallback').innervate(bus, disposition);
    let outcome: Outcome | undefined = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        outcome = (event as CustomEvent<Signal<Outcome>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, {});
    assert.deepStrictEqual(outcome, { result: 4, rest: 0 });

    divide.denervate();
}

function testDivide_DynamicReactiveComposition(): void {
    const bus = new EventTarget();
    // Capability B: Divide configured dynamically to reactTo custom signal 'producer.computed'
    const dynamicDisposition = Capability.createDisposition('Dynamic division', {}, ['producer.computed']);
    const divide = new Divide('divide-dynamic').innervate(bus, dynamicDisposition);
    let outcome: Outcome | undefined = undefined;

    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        outcome = (event as CustomEvent<Signal<Outcome>>).detail.value;
    });

    // Capability A (or arbitrary upstream emitter) pulses 'producer.computed'
    emitSignal(bus, 'producer.computed', [42, 7]);
    assert.deepStrictEqual(outcome, { result: 6, rest: 0 });

    divide.denervate();
}

function runAllDivideTests(): void {
    testDivide_IdentityAndDefaults();
    testDivide_CalculatesResultAndRest();
    testDivide_DivisionByZeroDoesNotPulse();
    testDivide_UsesFallbackDispositionAimBody();
    testDivide_DynamicReactiveComposition();
    console.log('✔ All Divide capability minimal architecture tests passed successfully.');
}

runAllDivideTests();
