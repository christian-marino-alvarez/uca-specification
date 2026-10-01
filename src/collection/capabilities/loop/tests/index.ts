import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Loop, SignalType, type IterationContext, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testLoop_IdentityAndDefaults(): void {
    const loop = new Loop();
    assert.strictEqual(loop.id, __ID__);
    assert.ok(loop instanceof Capability);
    loop.innervate();
    assert.ok(loop.disposition.inputs !== undefined);
    assert.strictEqual(loop.disposition.inputs.length, 3);
    assert.strictEqual(loop.disposition.inputs[0]?.type, 'LoopOptions');
    assert.ok(loop.disposition.outputs !== undefined);
    assert.strictEqual(loop.disposition.outputs.length, 2);
    assert.strictEqual(loop.disposition.outputs[0]?.type, 'IterationContext');
    loop.denervate();
}


function testLoop_IteratesOverArrayItemsDirectly(): void {
    const bus = new EventTarget();
    const loop = new Loop('loop-test').innervate(bus);
    const iterations: IterationContext<string>[] = [];
    let completed = false;

    bus.addEventListener(SignalType.ITERATION, (event: Event) => {
        const signal = (event as CustomEvent<Signal<IterationContext<string>>>).detail;
        iterations.push(signal.value);
    });

    bus.addEventListener(SignalType.COMPLETED, () => {
        completed = true;
    });

    emitSignal(bus, SignalType.START, ['first', 'second', 'third']);

    assert.strictEqual(iterations.length, 3);
    assert.strictEqual(completed, true);
    assert.deepStrictEqual(iterations[0], {
        index: 0,
        item: 'first',
        total: 3,
        isFirst: true,
        isLast: false,
    });
    assert.deepStrictEqual(iterations[2], {
        index: 2,
        item: 'third',
        total: 3,
        isFirst: false,
        isLast: true,
    });

    loop.denervate();
}

function testLoop_IteratesWithCountPayload(): void {
    const bus = new EventTarget();
    const loop = new Loop('loop-count').innervate(bus);
    const iterations: IterationContext<number>[] = [];
    let completedTotal = 0;

    bus.addEventListener(SignalType.ITERATION, (event: Event) => {
        const signal = (event as CustomEvent<Signal<IterationContext<number>>>).detail;
        iterations.push(signal.value);
    });

    bus.addEventListener(SignalType.COMPLETED, (event: Event) => {
        const signal = (event as CustomEvent<Signal<{ total: number }>>).detail;
        completedTotal = signal.value.total;
    });

    emitSignal(bus, SignalType.START, { count: 4 });

    assert.strictEqual(iterations.length, 4);
    assert.strictEqual(completedTotal, 4);
    assert.strictEqual(iterations[0].item, 0);
    assert.strictEqual(iterations[3].item, 3);

    loop.denervate();
}

function testLoop_UsesFallbackDispositionAimBody(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = { aim: { description: 'Loop fallback items', body: { items: ['alpha', 'beta'] } }, reactTo: [SignalType.START] };
    const loop = new Loop('loop-fallback').innervate(bus, disposition);
    const iterations: IterationContext<string>[] = [];

    bus.addEventListener(SignalType.ITERATION, (event: Event) => {
        const signal = (event as CustomEvent<Signal<IterationContext<string>>>).detail;
        iterations.push(signal.value);
    });

    emitSignal(bus, SignalType.START, {});

    assert.strictEqual(iterations.length, 2);
    assert.strictEqual(iterations[0].item, 'alpha');
    assert.strictEqual(iterations[1].item, 'beta');

    loop.denervate();
}

function runAllLoopTests(): void {
    testLoop_IdentityAndDefaults();
    testLoop_IteratesOverArrayItemsDirectly();
    testLoop_IteratesWithCountPayload();
    testLoop_UsesFallbackDispositionAimBody();
    console.log('✔ All Loop capability minimal architecture tests passed successfully.');
}

runAllLoopTests();
