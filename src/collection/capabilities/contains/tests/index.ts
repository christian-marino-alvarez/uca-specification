import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { Contains, SignalType, type Body, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testContains_IdentityAndDefaults(): void {
    const contains = new Contains();
    assert.strictEqual(contains.id, __ID__);
    assert.strictEqual(Contains.AIM, 'Evaluate whether container string or array includes the target element');
    assert.ok(contains instanceof Capability);
    contains.denervate();
}

function testContains_StringSubstring(): void {
    const bus = new EventTarget();
    const contains = new Contains('contains-str').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, ['hello world', 'world']);
    assert.strictEqual(result, true);

    emitSignal(bus, SignalType.EVALUATE, ['hello world', 'bye']);
    assert.strictEqual(result, false);

    contains.denervate();
}

function testContains_ArrayItem(): void {
    const bus = new EventTarget();
    const contains = new Contains('contains-arr').innervate(bus);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, [['apple', 'banana', 'cherry'], 'banana']);
    assert.strictEqual(result, true);

    emitSignal(bus, SignalType.EVALUATE, [['apple', 'banana', 'cherry'], 'grape']);
    assert.strictEqual(result, false);

    contains.denervate();
}

function testContains_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = { aim: { description: 'Contains fallback', body: { operands: ['universe', 'verse'] as const } }, reactTo: [SignalType.EVALUATE] };
    const contains = new Contains('contains-fallback').innervate(bus, disposition);
    let result: unknown = undefined;
    bus.addEventListener(SignalType.EVALUATED, (event: Event) => {
        result = (event as CustomEvent<Signal<boolean>>).detail.value;
    });

    emitSignal(bus, SignalType.EVALUATE, {});
    assert.strictEqual(result, true);

    contains.denervate();
}

function runAllContainsTests(): void {
    testContains_IdentityAndDefaults();
    testContains_StringSubstring();
    testContains_ArrayItem();
    testContains_UsesFallbackDispositionAimBody();
    console.log('✔ All Contains capability minimal architecture tests passed successfully.');
}

runAllContainsTests();
