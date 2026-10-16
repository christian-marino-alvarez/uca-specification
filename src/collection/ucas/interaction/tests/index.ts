import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import type { Signal } from '@uca/core/types';
import { Interaction } from '../index.js';
import { SignalType, EventType, type Context, type Binding, type Handle, type Invocation, type Bound } from '../types.js';

const context: Context = { scope: 'profile', purpose: 'Submit the current message', fields: { draft: 'Current message', topic: 'Selected topic' }, operations: { 'profile.submit': { description: 'Submit a message', parameters: { message: 'Message to submit' } } } };
const binding: Binding = { event: EventType.CLICK, operation: 'profile.submit', arguments: { message: 'draft' } };
function emit(bus: EventTarget, property: string, value: unknown): void {
    bus.dispatchEvent(new CustomEvent(property, { detail: { source: 'test', property, value } }));
}
function fixture() {
    const { window } = new JSDOM('', { url: 'https://interaction.test' });
    Object.assign(globalThis, { sessionStorage: window.sessionStorage, localStorage: window.localStorage });
    const bus = new EventTarget(), signals: Signal[] = [];
    bus.addEventListener('*', (event) => signals.push((event as CustomEvent<Signal>).detail));
    const interaction = new Interaction(`interaction-${crypto.randomUUID()}`).innervate(bus);
    emit(bus, interaction.updateEvent, Interaction.disposition);
    return { bus, signals, window, interaction };
}
const invocations = (signals: Signal[]): Invocation[] => signals.filter(({ property }) => property === SignalType.INVOKED).map(({ value }) => value as Invocation);
const handle = (bus: EventTarget, payload: Partial<Handle>): void => emit(bus, SignalType.HANDLE, { context, ...payload });

test('Typing stores current scoped values in session memory and only a click invokes the operation', () => {
    const { bus, signals, window, interaction } = fixture();
    assert.deepEqual(invocations(signals), []);
    handle(bus, { event: EventType.INPUT, field: 'draft', value: 'First' });
    handle(bus, { event: EventType.CHANGE, field: 'draft', value: 'Current' });
    assert.deepEqual(invocations(signals), []); assert.equal(window.localStorage.length, 0); assert.equal(window.sessionStorage.length, 1);
    handle(bus, { event: EventType.CLICK, interaction: binding });
    assert.deepEqual(invocations(signals), [{ scope: 'profile', operation: 'profile.submit', arguments: { message: 'Current' } }]);
    interaction.denervate(); window.close();
});

test('Unfilled fields remain empty strings for the owning application to interpret', () => {
    const { bus, signals, interaction, window } = fixture();
    handle(bus, { event: EventType.CLICK, interaction: binding });
    assert.deepEqual(invocations(signals), [{ scope: 'profile', operation: 'profile.submit', arguments: { message: '' } }]);
    interaction.denervate(); window.close();
});

test('Unknown fields, operations and mismatched parameter names never invoke an operation', () => {
    const { bus, signals, interaction, window } = fixture();
    handle(bus, { event: EventType.INPUT, field: 'missing', value: 'Ignored' });
    handle(bus, { event: EventType.CLICK, interaction: { ...binding, operation: 'missing' } });
    handle(bus, { event: EventType.CLICK, interaction: { ...binding, arguments: { message: 'missing' } } });
    handle(bus, { event: EventType.CLICK, interaction: { ...binding, arguments: { unexpected: 'draft' } } });
    assert.deepEqual(invocations(signals), []);
    assert.equal(signals.filter(({ property }) => property === SignalType.ERROR).length, 4);
    interaction.denervate(); window.close();
});

test('Scope separates current values and all declared parameters resolve independently', () => {
    const { bus, signals, interaction, window } = fixture();
    handle(bus, { event: EventType.INPUT, field: 'draft', value: 'Profile' });
    handle(bus, { event: EventType.INPUT, field: 'draft', value: 'Other', context: { ...context, scope: 'other' } });
    handle(bus, { event: EventType.CHANGE, field: 'topic', value: 'UCA' });
    const operation = { description: 'Submit topic and message', parameters: { message: 'Message', category: 'Topic' } };
    handle(bus, { event: EventType.CLICK, context: { ...context, operations: { 'profile.submit': operation } }, interaction: { ...binding, arguments: { message: 'draft', category: 'topic' } } });
    assert.deepEqual(invocations(signals), [{ scope: 'profile', operation: 'profile.submit', arguments: { message: 'Profile', category: 'UCA' } }]);
    interaction.denervate(); window.close();
});

test('Field binding hydrates saved input or establishes an initial value without invoking operations', () => {
    const { bus, signals, interaction, window } = fixture();
    emit(bus, SignalType.BIND, { context, field: 'draft', initialValue: 'Suggested', correlationId: 'first-mount' });
    handle(bus, { event: EventType.INPUT, field: 'draft', value: 'Edited' });
    emit(bus, SignalType.BIND, { context, field: 'draft', initialValue: 'Different suggestion', correlationId: 'remount' });
    const hydrated = signals.filter(({ property }) => property === SignalType.BOUND).map(({ value }) => value);
    assert.deepEqual(hydrated, [{ scope: 'profile', field: 'draft', value: 'Suggested', correlationId: 'first-mount' }, { scope: 'profile', field: 'draft', value: 'Edited', correlationId: 'remount' }]);
    assert.deepEqual(invocations(signals), []);
    handle(bus, { event: EventType.CLICK, interaction: binding }); assert.equal(invocations(signals)[0].arguments.message, 'Edited');
    interaction.denervate(); window.close();
});

test('JSON-looking text preserves its string value through storage, hydration and invocation', () => {
    const { bus, signals, interaction, window } = fixture();
    ['123', 'null', 'true', '"quoted"'].forEach((value) => {
        handle(bus, { event: EventType.INPUT, field: 'draft', value });
        emit(bus, SignalType.BIND, { context, field: 'draft', initialValue: 'Ignored', correlationId: value });
        handle(bus, { event: EventType.CLICK, interaction: binding });
        assert.equal((signals.findLast(({ property }) => property === SignalType.BOUND)?.value as Bound).value, value);
        assert.equal(invocations(signals).at(-1)?.arguments.message, value);
    });
    interaction.denervate(); window.close();
});
