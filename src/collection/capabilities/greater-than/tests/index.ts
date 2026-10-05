import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { GreaterThan } from '../index.js';
import { SignalType, type Body } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testGreaterThan_IdentityAndDefaults(): void {
    const gt = new GreaterThan();
    assert.strictEqual(gt.id, __ID__);
    assert.strictEqual(GreaterThan.AIM, 'Evaluate whether first operand is greater than second operand');
    assert.ok(gt instanceof Capability);
    gt.denervate();
}

function testGreaterThan_EvaluatesDirectArrayOperands(): void {
    const bus = new EventTarget();
    const gt = new GreaterThan('gt-test').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, [10, 5]);
    assert.strictEqual(result, true);

    emitSignal(bus, SignalType.EVALUATE, [3, 8]);
    assert.strictEqual(result, false);

    emitSignal(bus, SignalType.EVALUATE, [7, 7]);
    assert.strictEqual(result, false);

    gt.denervate();
}

function testGreaterThan_EvaluatesObjectPayload(): void {
    const bus = new EventTarget();
    const gt = new GreaterThan('gt-obj').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, { operands: [15, 12] });
    assert.strictEqual(result, true);

    gt.denervate();
}

function testGreaterThan_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = { aim: { description: 'Compare with fallback', body: { operands: [20, 10] as const } }, reactTo: [SignalType.EVALUATE] };
    const gt = new GreaterThan('gt-fallback').innervate(bus, disposition);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, {});
    assert.strictEqual(result, true);

    gt.denervate();
}

function runAllGreaterThanTests(): void {
    testGreaterThan_IdentityAndDefaults();
    testGreaterThan_EvaluatesDirectArrayOperands();
    testGreaterThan_EvaluatesObjectPayload();
    testGreaterThan_UsesFallbackDispositionAimBody();
    console.log('✔ All GreaterThan capability minimal architecture tests passed successfully.');
}

runAllGreaterThanTests();
