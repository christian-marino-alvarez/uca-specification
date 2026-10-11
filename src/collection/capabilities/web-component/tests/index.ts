import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { WebComponent } from '../index.js';
import { __ID__, DEFAULT_TAG } from '../constants.js';
import {
    type EventContext,
    type RemovedResult,
    type RenderedResult,
    type UpdatedResult,
    DataType,
    SignalType,
} from '../types.js';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
globalThis.document = dom.window.document;
globalThis.customElements = dom.window.customElements;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.AbortController = dom.window.AbortController;
globalThis.AbortSignal = dom.window.AbortSignal;

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function activateComponent(component: WebComponent, bus: EventTarget): WebComponent {
    component.innervate(bus);
    emitSignal(bus, component.updateEvent, WebComponent.disposition);
    return component;
}

function testWebComponent_IdentityAndDefaults(): void {
    const component = new WebComponent();
    assert.ok(component instanceof Capability);
    assert.strictEqual(component.id, __ID__);
    const { aim, inputs, outputs } = WebComponent.disposition;
    assert.strictEqual(aim.description, WebComponent.AIM);
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(inputs?.[0]?.type, DataType.RENDER_PAYLOAD);
}

function testWebComponent_RenderAndMount(): void {
    const bus = new EventTarget();
    let renderedResult: RenderedResult | undefined;

    bus.addEventListener(SignalType.RENDERED, (event: Event) => {
        renderedResult = (event as CustomEvent<Signal>).detail?.value as RenderedResult;
    });

    const component = activateComponent(new WebComponent('element-1'), bus);
    emitSignal(bus, SignalType.RENDER, {
        elementId: 'element-1',
        tag: 'custom-card',
        containerElement: '#container',
        attributes: { role: 'region', 'data-state': 'active' },
        content: '<span>Hello UCA</span>',
    });

    assert.ok(renderedResult !== undefined);
    assert.strictEqual(renderedResult?.elementId, 'element-1');
    assert.strictEqual(renderedResult?.tag, 'custom-card');

    const mounted = document.getElementById('element-1');
    assert.ok(mounted !== null);
    assert.strictEqual(mounted?.tagName.toLowerCase(), 'custom-card');
    assert.strictEqual(mounted?.getAttribute('role'), 'region');
    assert.strictEqual(mounted?.getAttribute('data-state'), 'active');
    assert.strictEqual(mounted?.innerHTML, '<span>Hello UCA</span>');

    component.denervate();
}

function testWebComponent_UpdateAndContent(): void {
    const bus = new EventTarget();
    let updatedResult: UpdatedResult | undefined;
    let eventReceived: EventContext | undefined;

    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        updatedResult = (event as CustomEvent<Signal>).detail?.value as UpdatedResult;
    });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        eventReceived = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const component = activateComponent(new WebComponent('element-2'), bus);
    emitSignal(bus, SignalType.RENDER, { elementId: 'element-2', containerElement: '#container', content: 'Init' });
    emitSignal(bus, SignalType.UPDATE, {
        elementId: 'element-2',
        attributes: { title: 'Updated Title' },
        content: '<button id="inner-btn" data-action="click-action">Go</button>',
        events: ['click'],
    });

    assert.ok(updatedResult !== undefined);
    assert.strictEqual(updatedResult?.elementId, 'element-2');
    assert.strictEqual(updatedResult?.updated, true);

    const button = document.getElementById('inner-btn');
    button?.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.ok(eventReceived !== undefined);
    assert.strictEqual(eventReceived?.action, 'click-action');

    component.denervate();
}

function testWebComponent_EventForwarding(): void {
    const bus = new EventTarget();
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const component = activateComponent(new WebComponent('btn-1'), bus);
    emitSignal(bus, SignalType.RENDER, { elementId: 'btn-1', containerElement: '#container', events: ['click'] });

    const button = document.getElementById('btn-1');
    button?.dispatchEvent(new dom.window.Event('click'));

    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent?.elementId, 'btn-1');
    assert.strictEqual(capturedEvent?.event, 'click');

    component.denervate();
}

function testWebComponent_EventDelegation(): void {
    const bus = new EventTarget();
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const component = activateComponent(new WebComponent('list-1'), bus);
    emitSignal(bus, SignalType.RENDER, {
        elementId: 'list-1',
        containerElement: '#container',
        content: '<button id="delete-btn" data-action="delete-item">Delete</button>',
        events: ['click'],
    });

    const childButton = document.getElementById('delete-btn');
    childButton?.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent?.elementId, 'delete-btn');
    assert.strictEqual(capturedEvent?.action, 'delete-item');
    assert.strictEqual(capturedEvent?.event, 'click');

    component.denervate();
    document.getElementById('list-1')?.remove();
}

function testWebComponent_Remove(): void {
    const bus = new EventTarget();
    let removedResult: RemovedResult | undefined;

    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        removedResult = (event as CustomEvent<Signal>).detail?.value as RemovedResult;
    });

    const component = activateComponent(new WebComponent('element-3'), bus);
    emitSignal(bus, SignalType.RENDER, { elementId: 'element-3', containerElement: '#container' });
    assert.ok(document.getElementById('element-3') !== null);

    emitSignal(bus, SignalType.REMOVE, { elementId: 'element-3' });
    assert.ok(removedResult !== undefined);
    assert.strictEqual(removedResult?.elementId, 'element-3');
    assert.strictEqual(document.getElementById('element-3'), null);

    component.denervate();
}

function testWebComponent_DenervateDoesNotDestroyDom(): void {
    const bus = new EventTarget();
    const component = activateComponent(new WebComponent('element-persistent'), bus);
    emitSignal(bus, SignalType.RENDER, { elementId: 'element-persistent', containerElement: '#container' });
    assert.ok(document.getElementById('element-persistent') !== null);

    component.denervate();
    assert.ok(document.getElementById('element-persistent') !== null);

    document.getElementById('element-persistent')?.remove();
}

function testWebComponent_SingleCapabilityManagingNElements(): void {
    const bus = new EventTarget();
    const renderedIds: string[] = [];

    bus.addEventListener(SignalType.RENDERED, (event: Event) => {
        const result = (event as CustomEvent<Signal>).detail?.value as RenderedResult;
        if (result?.elementId) {
            renderedIds.push(result.elementId);
        }
    });

    const capability = activateComponent(new WebComponent('web-component'), bus);

    emitSignal(bus, SignalType.RENDER, { elementId: 'header-el', containerElement: '#container', content: 'Header' });
    emitSignal(bus, SignalType.RENDER, { elementId: 'sidebar-el', containerElement: '#container', content: 'Sidebar' });
    emitSignal(bus, SignalType.RENDER, { elementId: 'footer-el', containerElement: '#container', content: 'Footer' });

    assert.strictEqual(renderedIds.length, 3);
    assert.deepStrictEqual(renderedIds, ['header-el', 'sidebar-el', 'footer-el']);
    assert.ok(document.getElementById('header-el') !== null);
    assert.ok(document.getElementById('sidebar-el') !== null);
    assert.ok(document.getElementById('footer-el') !== null);

    capability.denervate();
    document.getElementById('header-el')?.remove();
    document.getElementById('sidebar-el')?.remove();
    document.getElementById('footer-el')?.remove();
}

function runTests(): void {
    console.log('🧪 Testing primitive native WebComponent capability...');
    testWebComponent_IdentityAndDefaults();
    testWebComponent_RenderAndMount();
    testWebComponent_UpdateAndContent();
    testWebComponent_EventForwarding();
    testWebComponent_EventDelegation();
    testWebComponent_Remove();
    testWebComponent_DenervateDoesNotDestroyDom();
    testWebComponent_SingleCapabilityManagingNElements();
    console.log('✅ All WebComponent capability tests passed successfully!');
}

runTests();
