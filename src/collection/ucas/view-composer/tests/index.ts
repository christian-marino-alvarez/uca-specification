import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { ViewComposer, SignalType, DataType, __ID__, PURPOSE } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewComposer_IdentityAndDefaults(): void {
    const composer = new ViewComposer();
    assert.ok(composer instanceof Uca);
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    const { inputs, outputs, aim } = composer.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, PURPOSE);
}

function testViewComposer_InnervationAndCooky(): void {
    const bus = new EventTarget();
    const composer = new ViewComposer().innervate(bus);
    assert.notStrictEqual(composer.target, undefined);
    assert.notStrictEqual(composer.disposition, undefined);
    composer.denervate();
}

function testViewComposer_PulsesDomainSignals(): void {
    const bus = new EventTarget();
    const captured: { property: string; value: unknown }[] = [];

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent<Signal>).detail?.value });
    });

    const composer = new ViewComposer('test-composer').innervate(bus);
    emitSignal(bus, SignalType.UPDATE, { title: 'Updated View' });
    emitSignal(bus, SignalType.REMOVE, {});

    assert.ok(captured.length >= 3);
    assert.strictEqual(captured[0]?.property, SignalType.CREATED);
    assert.strictEqual(captured[1]?.property, SignalType.UPDATED);
    assert.strictEqual(captured[2]?.property, SignalType.REMOVED);

    composer.denervate();
}

function runAllViewComposerTests(): void {
    testViewComposer_IdentityAndDefaults();
    testViewComposer_InnervationAndCooky();
    testViewComposer_PulsesDomainSignals();
    console.log('✔ All ViewComposer UCA minimal scaffolding tests passed successfully.');
}

runAllViewComposerTests();
