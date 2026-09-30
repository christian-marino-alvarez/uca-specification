import * as assert from 'node:assert';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Equal, SignalType, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testEqual_IdentityAndDefaults(): void {
    const equal = new Equal();
    assert.strictEqual(equal.id, __ID__);
    assert.ok(equal instanceof Capability);
    assert.deepStrictEqual(equal.disposition.inputs, [{ signal: SignalType.EVALUATE, type: 'Operands', description: 'Operands [first, second]' }]);
    assert.deepStrictEqual(equal.disposition.outputs, [{ signal: SignalType.EVALUATED, type: 'boolean', description: 'Boolean result of equality evaluation' }]);
    equal.denervate();
}


function testEqual_EvaluatesDirectArrayOperandsReturningBoolean(): void {
    const bus = new EventTarget();
    const equal = new Equal('equal-test').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });
    emitSignal(bus, SignalType.EVALUATE, [5, 5]);
    assert.strictEqual(result, true);
    emitSignal(bus, SignalType.EVALUATE, [5, 10]);
    assert.strictEqual(result, false);
    equal.denervate();
}

function testEqual_EvaluatesPayloadObjectOperands(): void {
    const bus = new EventTarget();
    const equal = new Equal().innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });
    emitSignal(bus, SignalType.EVALUATE, { operands: ['active', 'active'] });
    assert.strictEqual(result, true);
    emitSignal(bus, SignalType.EVALUATE, { operands: ['active', 'inactive'] });
    assert.strictEqual(result, false);
    equal.denervate();
}

function testEqual_FallbackToDispositionOperands(): void {
    const bus = new EventTarget();
    const disposition = Capability.createDisposition('Equality check', { operands: [42, 42] as const });
    const equal = new Equal().innervate(bus, disposition);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });
    emitSignal(bus, SignalType.EVALUATE, {});
    assert.strictEqual(result, true);
    equal.denervate();
}

function testEqual_IgnoresInvalidOperands(): void {
    const bus = new EventTarget();
    const equal = new Equal().innervate(bus);
    let called = false;
    bus.addEventListener(SignalType.EVALUATED, () => {
        called = true;
    });
    emitSignal(bus, SignalType.EVALUATE, [1]);
    assert.strictEqual(called, false);
    equal.denervate();
}

function runAllEqualTests(): void {
    testEqual_IdentityAndDefaults();
    testEqual_EvaluatesDirectArrayOperandsReturningBoolean();
    testEqual_EvaluatesPayloadObjectOperands();
    testEqual_FallbackToDispositionOperands();
    testEqual_IgnoresInvalidOperands();
    console.log('✔ All Equal capability minimal architecture tests passed successfully.');
}

runAllEqualTests();
