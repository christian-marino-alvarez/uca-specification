import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { LessThan, SignalType, type Body, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testLessThan_IdentityAndDefaults(): void {
    const lt = new LessThan();
    assert.strictEqual(lt.id, __ID__);
    assert.strictEqual(LessThan.AIM, 'Evaluate whether first operand is less than second operand');
    assert.ok(lt instanceof Capability);
    lt.denervate();
}

function testLessThan_EvaluatesDirectArrayOperands(): void {
    const bus = new EventTarget();
    const lt = new LessThan('lt-test').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, [3, 8]);
    assert.strictEqual(result, true);

    emitSignal(bus, SignalType.EVALUATE, [10, 5]);
    assert.strictEqual(result, false);

    emitSignal(bus, SignalType.EVALUATE, [7, 7]);
    assert.strictEqual(result, false);

    lt.denervate();
}

function testLessThan_EvaluatesObjectPayload(): void {
    const bus = new EventTarget();
    const lt = new LessThan('lt-obj').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, { operands: [4, 9] });
    assert.strictEqual(result, true);

    lt.denervate();
}

function testLessThan_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = { aim: { description: 'Compare with fallback', body: { operands: [5, 15] as const } }, reactTo: [SignalType.EVALUATE] };
    const lt = new LessThan('lt-fallback').innervate(bus, disposition);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, {});
    assert.strictEqual(result, true);

    lt.denervate();
}

function runAllLessThanTests(): void {
    testLessThan_IdentityAndDefaults();
    testLessThan_EvaluatesDirectArrayOperands();
    testLessThan_EvaluatesObjectPayload();
    testLessThan_UsesFallbackDispositionAimBody();
    console.log('✔ All LessThan capability minimal architecture tests passed successfully.');
}

runAllLessThanTests();
