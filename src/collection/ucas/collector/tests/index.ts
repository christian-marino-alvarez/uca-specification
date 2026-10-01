import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import { Collector } from '../index.js';
import { SignalType, type Body } from '../types.js';
import { DEFAULT_TRIGGER_SIGNAL } from '../constants.js';

function emitSignal(collector: Collector, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    collector.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testCollector_Existence(): void {
    const collector = new Collector('checkout-collector');
    assert.ok(collector instanceof Uca);
    assert.strictEqual(document.querySelector('ext-collector'), null);
    assert.strictEqual(collector.purpose, 'Aggregate and encapsulate interactive input data collection');
    collector.denervate();
}

function testCollector_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Registration data collection',
            body: {
                name: 'user-registration',
                title: 'User Registration Form',
                disabled: false,
            },
        },
    };
    const collector = new Collector().innervate(undefined, disposition);
    emitSignal(collector, 'element.rendered', { container });
    const element = container.querySelector('ext-collector');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('name'), 'user-registration');
    assert.strictEqual(element?.getAttribute('title'), 'User Registration Form');
    assert.strictEqual(element?.hasAttribute('disabled'), false);
    collector.denervate();
    container.remove();
}

function testCollector_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const collector = new Collector().innervate();
    emitSignal(collector, 'element.rendered', { container, attributes: { name: 'v1' } });
    const element = container.querySelector('ext-collector');
    assert.strictEqual(element?.getAttribute('name'), 'v1');
    emitSignal(collector, 'element.updated', { attributes: { name: 'v2' } });
    assert.strictEqual(element?.getAttribute('name'), 'v2');
    collector.denervate();
    container.remove();
}

function testCollector_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const collector = new Collector().innervate();
    emitSignal(collector, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-collector'), null);
    emitSignal(collector, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-collector'), null);
    collector.denervate();
    container.remove();
}

function testCollector_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Domain collector test',
            body: {
                name: 'login-data',
                title: 'Login Collector',
                disabled: false,
            },
        },
    };
    const collector = new Collector().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    collector.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    collector.target?.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent).detail?.value });
    });
    collector.target?.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent).detail?.value });
    });
    collector.target?.addEventListener(SignalType.SUBMITTED, (event: Event) => {
        captured.push({ property: SignalType.SUBMITTED, value: (event as CustomEvent).detail?.value });
    });
    collector.target?.addEventListener(SignalType.RESETTED, (event: Event) => {
        captured.push({ property: SignalType.RESETTED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(collector, 'element.rendered', { container });
    emitSignal(collector, 'element.updated', {});
    emitSignal(collector, SignalType.SUBMIT, { username: 'alice', accepted: true });
    emitSignal(collector, SignalType.RESET, {});
    emitSignal(collector, 'element.removed', {});
    assert.strictEqual(captured.length, 5);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, { ...disposition.aim.body, data: { username: 'alice', accepted: true } });
    assert.deepStrictEqual(captured[3].value, disposition.aim.body);
    assert.deepStrictEqual(captured[4].value, disposition.aim.body);
    collector.denervate();
    container.remove();
}

function testCollector_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Contact collection',
            body: {
                name: 'contact-collector',
                title: 'Contact Collector',
            },
        },
    };
    const collector = new Collector().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    collector.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(collector, SignalType.CREATE, { container });
    const element = container.querySelector('ext-collector');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('name'), 'contact-collector');
    assert.strictEqual(element?.getAttribute('title'), 'Contact Collector');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    emitSignal(collector, SignalType.REMOVE, {});
    assert.strictEqual(container.querySelector('ext-collector'), null);
    collector.denervate();
    container.remove();
}

function testCollector_ReactsToActionTriggeredSignal(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Checkout collection',
            body: { name: 'checkout' },
        },
    };
    const collector = new Collector().innervate(bus, disposition);
    let submittedData: unknown = undefined;
    bus.addEventListener(SignalType.SUBMITTED, (event: Event) => {
        submittedData = (event as CustomEvent).detail?.value;
    });
    const actionSignal: Signal = {
        source: 'action',
        property: DEFAULT_TRIGGER_SIGNAL,
        value: { payload: 'trigger-action' },
        timestamp: Date.now(),
    };
    bus.dispatchEvent(new CustomEvent(DEFAULT_TRIGGER_SIGNAL, { detail: actionSignal }));
    assert.notStrictEqual(submittedData, undefined);
    collector.denervate();
}

function runAllCollectorTests(): void {
    testCollector_Existence();
    testCollector_RenderMaterializesCustomElementWithOptions();
    testCollector_UpdateViaSignal();
    testCollector_RemoveDestroysFromDom();
    testCollector_PulsesDomainSignalsPassingProperties();
    testCollector_ReactsToDomainRequestSignals();
    testCollector_ReactsToActionTriggeredSignal();
    console.log('✔ All Collector UCA minimal architecture tests passed successfully.');
}

runAllCollectorTests();
