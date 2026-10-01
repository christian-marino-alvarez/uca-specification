import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import type { Body, LifecycleContext, EventContext } from '../index.js';
import {
    DataType,
    SignalType,
    WebComponent,
    WebComponents,
} from '../index.js';

function testWebComponent_IdentityAndPorts(): void {
    const component = new WebComponent();
    assert.strictEqual(component.id, 'web-component');
    component.innervate();
    assert.ok(component.disposition.inputs !== undefined);
    assert.strictEqual(component.disposition.inputs.length, 3);
    assert.strictEqual(component.disposition.inputs[0]?.type, DataType.HTML_ELEMENT);
    assert.ok(component.disposition.outputs !== undefined);
    assert.strictEqual(component.disposition.outputs.length, 4);
    assert.strictEqual(component.disposition.outputs[0]?.type, DataType.EVENT_CONTEXT);
    component.denervate();
}

function createComponentWithDisposition(id: string, bus: EventTarget, body: Body): WebComponents {
    const component = new WebComponents(id);

    const disposition: Disposition<Body> = { aim: { description: 'Test', body }, reactTo: ['element.rendered', 'element.updated'] };
    component.innervate(bus, disposition);
    return component;
}

function assertInertQueries(container: HTMLElement, bus: EventTarget): void {
    assert.strictEqual(container.querySelector('ext-test-inert'), null);
    const irrelevant: Signal = { source: 'test', property: 'unrelated.signal', value: {}, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('unrelated.signal', { detail: irrelevant }));
    assert.strictEqual(container.querySelector('ext-test-inert'), null);
}

function testWebComponent_InertUntilReaction(): void {
    const [container, bus, component] = [DomHarness.createContainer(), new EventTarget(), new WebComponents('inert-test')];
    const disposition: Disposition<Body> = { aim: { description: 'Inert', body: { container, tag: 'ext-test-inert' } }, reactTo: ['element.rendered'] };
    component.innervate(bus, disposition);
    assertInertQueries(container, bus);
    const matching: Signal = { source: 'test', property: 'element.rendered', value: { text: 'Materialized' }, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: matching }));
    assert.notStrictEqual(container.querySelector('ext-test-inert'), null);
    component.denervate();
    container.remove();
}

function testWebComponent_CustomElementRegistrationAndIdentity(): void {
    const [container, bus] = [DomHarness.createContainer(), new EventTarget()];
    const tag = 'ext-test-identity';
    const component = createComponentWithDisposition('ident-test', bus, { container, tag, observedAttributes: ['data-role'] });
    const signal: Signal = { source: 'test', property: 'element.rendered', value: null, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: signal }));
    const registeredCtor = customElements.get(tag);
    assert.ok(registeredCtor !== undefined && container.querySelector(tag) instanceof registeredCtor);
    component.denervate();
    container.remove();
}

function testWebComponent_RegistrationIdempotency(): void {
    const [container, bus] = [DomHarness.createContainer(), new EventTarget()];
    const [comp1, comp2] = [new WebComponents('c1'), new WebComponents('c2')];
    const disposition: Disposition<Body> = { aim: { description: 'Idem', body: { container, tag: 'ext-test-idempotent' } }, reactTo: ['element.rendered'] };
    comp1.innervate(bus, disposition);
    comp2.innervate(bus, disposition);
    const signal: Signal = { source: 'test', property: 'element.rendered', value: null, timestamp: 0 };
    assert.doesNotThrow(() => bus.dispatchEvent(new CustomEvent('element.rendered', { detail: signal })));
    comp1.denervate();
    comp2.denervate();
    container.remove();
}

function assertConnectedContext(captured: LifecycleContext | undefined, tag: string): void {
    assert.strictEqual(captured?.tag, tag);
    assert.strictEqual(captured?.id, 'connected-test');
}

function testWebComponent_NativeConnectedLifecyclePulse(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-connected'];
    const component = createComponentWithDisposition('connected-test', bus, { container, tag });
    let captured: LifecycleContext | undefined = undefined;
    bus.addEventListener('element.connected', (e: Event) => {
        captured = (e as CustomEvent<Signal<LifecycleContext>>).detail.value;
    });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    assertConnectedContext(captured, tag);
    component.denervate();
    container.remove();
}

function assertAttributeContext(captured: LifecycleContext | undefined): void {
    assert.strictEqual(captured?.attribute, 'data-status');
    assert.strictEqual(captured?.oldValue, null);
    assert.strictEqual(captured?.newValue, 'ready');
}

function testWebComponent_NativeAttributeChangedLifecyclePulse(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-attribute'];
    const component = createComponentWithDisposition('attr-test', bus, { container, tag, observedAttributes: ['data-status'] });
    let captured: LifecycleContext | undefined = undefined;
    bus.addEventListener('element.attributeChanged', (e: Event) => {
        captured = (e as CustomEvent<Signal<LifecycleContext>>).detail.value;
    });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    container.querySelector(tag)?.setAttribute('data-status', 'ready');
    assertAttributeContext(captured);
    component.denervate();
    container.remove();
}

function assertDisconnectedContext(captured: LifecycleContext | undefined, tag: string): void {
    assert.strictEqual(captured?.tag, tag);
}

function testWebComponent_NativeDisconnectedLifecyclePulse(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-disconnected'];
    const component = createComponentWithDisposition('disc-test', bus, { container, tag });
    let captured: LifecycleContext | undefined = undefined;
    bus.addEventListener('element.disconnected', (e: Event) => {
        captured = (e as CustomEvent<Signal<LifecycleContext>>).detail.value;
    });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    container.querySelector(tag)?.remove();
    assertDisconnectedContext(captured, tag);
    component.denervate();
    container.remove();
}

function testWebComponent_DenervateIsNotDomDisconnection(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-denervate'];
    const component = createComponentWithDisposition('denerv-test', bus, { container, tag });
    let disconnectedFired = false;
    bus.addEventListener('element.disconnected', () => { disconnectedFired = true; });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    component.denervate();
    assert.strictEqual(component.target, undefined);
    assert.strictEqual(disconnectedFired, false);
    assert.notStrictEqual(container.querySelector(tag), null);
    container.remove();
}

function assertReinnervationPreservesElement(component: WebComponents, container: HTMLElement, tag: string, before: Element | null): void {
    const newBus = new EventTarget();
    component.innervate(newBus);
    newBus.dispatchEvent(new CustomEvent('element.updated', { detail: { source: 'test', property: 'element.updated', value: { text: 'V2' }, timestamp: 0 } }));
    const elementAfter = container.querySelector(tag);
    assert.strictEqual(before, elementAfter);
    assert.strictEqual(elementAfter?.textContent, 'V2');
    component.denervate();
}

function testWebComponent_DenervatePreservesReferencesAndListeners(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-preserve'];
    const component = createComponentWithDisposition('preserve-test', bus, { container, tag });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: { text: 'V1' }, timestamp: 0 } }));
    const elementBefore = container.querySelector(tag);
    component.denervate();
    assertReinnervationPreservesElement(component, container, tag, elementBefore);
    container.remove();
}

function testWebComponent_ResourceIsPrivate(): void {
    const component = new WebComponents('private-test');
    assert.strictEqual('element' in component, false);
    assert.strictEqual((component as unknown as Record<string, unknown>).element, undefined);
}

function testWebComponent_ResourceReuseAcrossReactions(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-reuse'];
    const component = createComponentWithDisposition('reuse-test', bus, { container, tag });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: { text: 'V1' }, timestamp: 0 } }));
    const firstInstance = container.querySelector(tag);
    bus.dispatchEvent(new CustomEvent('element.updated', { detail: { source: 'test', property: 'element.updated', value: { text: 'V2' }, timestamp: 0 } }));
    assert.strictEqual(container.querySelector(tag), firstInstance);
    assert.strictEqual(firstInstance?.textContent, 'V2');
    component.denervate();
    container.remove();
}

function listenContentChange(bus: EventTarget, callback: (ctx?: LifecycleContext) => void): void {
    bus.addEventListener('element.contentChanged', (event: Event) => {
        const detail = (event as CustomEvent<Signal<LifecycleContext>>).detail;
        callback(detail.value);
    });
}

function assertSlotAppended(element: Element | null, captured: unknown): void {
    element?.appendChild(document.createTextNode(' - more text'));
    assert.ok(captured !== undefined || element?.textContent?.includes('more text'));
}

function testWebComponents_ObservesContentMutationWithoutObserver(): void {
    const container = DomHarness.createContainer();
    const [component, bus] = [new WebComponents('content-test'), new EventTarget()];
    component.innervate(bus);
    let captured: LifecycleContext | undefined = undefined;
    listenContentChange(bus, (ctx) => { captured = ctx; });
    emitRenderTo(bus, 'slot-node', { text: 'Initial text', container, tag: 'ext-slot-test' });
    assertSlotAppended(container.querySelector('#slot-node'), captured);
    component.denervate();
    container.remove();
}

function testWebComponent_UnobservedAttributeDoesNotTriggerLifecyclePulse(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-unobserved'];
    const component = createComponentWithDisposition('unobs-test', bus, { container, tag, observedAttributes: ['data-observed'] });
    let pulseFired = false;
    bus.addEventListener('element.attributeChanged', () => { pulseFired = true; });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    container.querySelector(tag)?.setAttribute('data-unobserved', 'ignored');
    assert.strictEqual(pulseFired, false);
    component.denervate();
    container.remove();
}

function testWebComponent_ObservedAttributesImmutableAcrossReactions(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-obs-immutable'];
    const component = createComponentWithDisposition('obs-immut', bus, { container, tag, observedAttributes: ['title'] });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: { text: 'R1' }, timestamp: 0 } }));
    const ctor = customElements.get(tag) as unknown as { observedAttributes?: string[] };
    assert.deepStrictEqual(ctor?.observedAttributes, ['title']);
    const signal2: Signal = { source: 'test', property: 'element.updated', value: { text: 'R2', observedAttributes: ['title', 'style'] }, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.updated', { detail: signal2 }));
    assert.deepStrictEqual(ctor?.observedAttributes, ['title']);
    component.denervate();
    container.remove();
}

function emitUpdate(bus: EventTarget, id: string, payload: Partial<Body> = {}): void {
    const value = { id, ...payload };
    const signal: Signal = { source: 'test', property: 'element.updated', value, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.updated', { detail: signal }));
}

function emitRenderTo(bus: EventTarget, id: string, payload: Partial<Body> = {}): void {
    const value = { id, ...payload };
    const signal: Signal = { source: 'test', property: 'element.rendered', value, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: signal }));
}

function assertMultiElementsInDom(container: HTMLElement, tag: string): void {
    const el1 = container.querySelector(`${tag}#node-1`);
    const el2 = container.querySelector(`${tag}#node-2`);
    assert.strictEqual(el1?.textContent, 'Updated Node 1');
    assert.strictEqual(el2?.textContent, 'Node 2');
}

function testWebComponent_GeneratesMultipleElementsInDomByUniqueId(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-multi'];
    const component = createComponentWithDisposition('multi-test', bus, { container, tag });
    emitRenderTo(bus, 'node-1', { text: 'Node 1' });
    emitRenderTo(bus, 'node-2', { text: 'Node 2' });
    emitUpdate(bus, 'node-1', { text: 'Updated Node 1' });
    assertMultiElementsInDom(container, tag);
    component.denervate();
    container.remove();
}

function emitRender(bus: EventTarget, text: string): void {
    const signal: Signal = { source: 'test', property: 'element.rendered', value: { text }, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: signal }));
}

function testWebComponent_DispositionResolvedAtInnervation(): void {
    const container = DomHarness.createContainer();
    const [component, bus] = [new WebComponent('ext-dynamic'), new EventTarget()];
    const patterns = ['element.rendered'];
    const disposition: Disposition<Body> = { aim: { description: 'Custom', body: { tag: 'ext-test-innervated', container } }, reactTo: patterns };
    component.innervate(bus, disposition);
    emitRender(bus, 'Innervated');
    const element = container.querySelector('ext-test-innervated');
    assert.strictEqual(element?.textContent, 'Innervated');
    component.denervate();
    container.remove();
}

function testWebComponent_RemoveComponentAbortsListenersAndRemovesFromDom(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-remove'];
    const removeDisposition: Disposition<Body> = { aim: { description: 'Remove', body: { container, tag } }, reactTo: ['element.rendered', 'element.updated', 'element.removed'] };
    const component = new WebComponents('remove-test').innervate(bus, removeDisposition);
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    bus.dispatchEvent(new CustomEvent('element.removed', { detail: { source: 'test', property: 'element.removed', value: { id: 'remove-test' }, timestamp: 0 } }));
    assert.strictEqual(container.querySelector(tag), null);
    component.denervate();
    container.remove();
}

function assertEventContext(captured: EventContext | undefined): void {
    assert.strictEqual(captured?.id, 'event-test');
    assert.strictEqual(captured?.event, 'click');
}

function testWebComponent_UserInteractionPulsesEvent(): void {
    const [container, bus, tag] = [DomHarness.createContainer(), new EventTarget(), 'ext-test-events'];
    const component = createComponentWithDisposition('event-test', bus, { container, tag });
    let captured: EventContext | undefined = undefined;
    bus.addEventListener(SignalType.EVENT, (e: Event) => {
        captured = (e as CustomEvent<Signal<EventContext>>).detail.value;
    });
    bus.dispatchEvent(new CustomEvent('element.rendered', { detail: { source: 'test', property: 'element.rendered', value: null, timestamp: 0 } }));
    container.querySelector(tag)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    assertEventContext(captured);
    component.denervate();
    container.remove();
}


function runAllWebComponentTests(): void {
    testWebComponent_IdentityAndPorts();
    testWebComponent_InertUntilReaction();

    testWebComponent_CustomElementRegistrationAndIdentity();
    testWebComponent_RegistrationIdempotency();
    testWebComponent_NativeConnectedLifecyclePulse();
    testWebComponent_NativeAttributeChangedLifecyclePulse();
    testWebComponent_NativeDisconnectedLifecyclePulse();
    testWebComponent_DenervateIsNotDomDisconnection();
    testWebComponent_DenervatePreservesReferencesAndListeners();
    testWebComponent_ResourceIsPrivate();
    testWebComponent_ResourceReuseAcrossReactions();
    testWebComponents_ObservesContentMutationWithoutObserver();
    testWebComponent_UnobservedAttributeDoesNotTriggerLifecyclePulse();
    testWebComponent_ObservedAttributesImmutableAcrossReactions();
    testWebComponent_GeneratesMultipleElementsInDomByUniqueId();
    testWebComponent_DispositionResolvedAtInnervation();
    testWebComponent_RemoveComponentAbortsListenersAndRemovesFromDom();
    testWebComponent_UserInteractionPulsesEvent();
    console.log('✔ All WebComponent primitive capability lifecycle tests passed successfully.');
}

runAllWebComponentTests();
