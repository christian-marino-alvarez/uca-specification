import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import { Toggle } from '../index.js';
import { SignalType, type Body } from '../types.js';

function emitSignal(toggle: Toggle, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    toggle.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testToggle_Existence(): void {
    const toggle = new Toggle('agree-terms');
    assert.ok(toggle instanceof Uca);
    assert.strictEqual(document.querySelector('ext-toggle'), null);
    assert.strictEqual(toggle.purpose, 'Represent a binary state selection switchable by interaction');
    toggle.denervate();
}

function testToggle_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Newsletter subscription toggle',
            body: {
                checked: true,
                label: 'Subscribe to newsletter',
                title: 'Subscription state',
                disabled: false,
            },
        },
    };
    const toggle = new Toggle().innervate(undefined, disposition);
    emitSignal(toggle, 'element.rendered', { container });
    const element = container.querySelector('ext-toggle');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.hasAttribute('checked'), true);
    assert.strictEqual(element?.getAttribute('title'), 'Subscription state');
    assert.strictEqual(element?.hasAttribute('disabled'), false);
    assert.strictEqual(element?.textContent, 'Subscribe to newsletter');
    toggle.denervate();
    container.remove();
}

function testToggle_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const toggle = new Toggle().innervate();
    emitSignal(toggle, 'element.rendered', { container, attributes: { title: 'v1' } });
    const element = container.querySelector('ext-toggle');
    assert.strictEqual(element?.getAttribute('title'), 'v1');
    emitSignal(toggle, 'element.updated', { attributes: { title: 'v2' } });
    assert.strictEqual(element?.getAttribute('title'), 'v2');
    toggle.denervate();
    container.remove();
}

function testToggle_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const toggle = new Toggle().innervate();
    emitSignal(toggle, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-toggle'), null);
    emitSignal(toggle, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-toggle'), null);
    toggle.denervate();
    container.remove();
}

function testToggle_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Domain toggle test',
            body: {
                checked: false,
                label: 'Dark mode',
                title: 'Toggle theme',
                disabled: false,
            },
        },
    };
    const toggle = new Toggle().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    toggle.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    toggle.target?.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent).detail?.value });
    });
    toggle.target?.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent).detail?.value });
    });
    toggle.target?.addEventListener(SignalType.CHANGED, (event: Event) => {
        captured.push({ property: SignalType.CHANGED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(toggle, 'element.rendered', { container });
    emitSignal(toggle, 'element.updated', {});
    emitSignal(toggle, SignalType.CHANGE, { checked: true });
    emitSignal(toggle, 'element.removed', {});
    assert.strictEqual(captured.length, 4);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, { ...disposition.aim.body, checked: true });
    assert.deepStrictEqual(captured[3].value, disposition.aim.body);
    toggle.denervate();
    container.remove();
}

function testToggle_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Terms agreement',
            body: {
                label: 'Accept terms',
                checked: true,
            },
        },
    };
    const toggle = new Toggle().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    toggle.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(toggle, SignalType.CREATE, { container });
    const element = container.querySelector('ext-toggle');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.hasAttribute('checked'), true);
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    emitSignal(toggle, SignalType.REMOVE, {});
    assert.strictEqual(container.querySelector('ext-toggle'), null);
    toggle.denervate();
    container.remove();
}

function testToggle_ReactsToComponentEvent(): void {
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Toggle event reaction',
            body: {
                label: 'Enable notifications',
                checked: false,
            },
        },
    };
    const toggle = new Toggle('toggle-event-test').innervate(undefined, disposition);
    let capturedChange: unknown = undefined;
    toggle.target?.addEventListener(SignalType.CHANGED, (event: Event) => {
        capturedChange = (event as CustomEvent).detail?.value;
    });
    emitSignal(toggle, 'component.event', { id: 'toggle-event-test', event: 'click', checked: true });
    assert.deepStrictEqual(capturedChange, {
        label: 'Enable notifications',
        checked: true,
    });
    toggle.denervate();
}

function runAllToggleTests(): void {
    testToggle_Existence();
    testToggle_RenderMaterializesCustomElementWithOptions();
    testToggle_UpdateViaSignal();
    testToggle_RemoveDestroysFromDom();
    testToggle_PulsesDomainSignalsPassingProperties();
    testToggle_ReactsToDomainRequestSignals();
    testToggle_ReactsToComponentEvent();
    console.log('✔ All Toggle UCA minimal architecture tests passed successfully.');
}

runAllToggleTests();
