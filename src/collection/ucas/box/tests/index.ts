import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import type { LifecycleContext } from '@uca/capability-web-component';
import { Box } from '../index.js';
import type { Body } from '../types.js';

function testBox_Existence(): void {
    const box = new Box();
    assert.ok(box instanceof Uca);
    assert.strictEqual(document.querySelector('ext-box'), null);
    assert.strictEqual('element' in box, false);
    box.denervate();
}

function testBox_InnervationDoesNotMaterializeDom(): void {
    const box = new Box();
    box.innervate();
    assert.notStrictEqual(box.target, undefined);
    assert.strictEqual(document.querySelector('ext-box'), null);
    box.denervate();
}

function emitSignal(box: Box, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    box.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testBox_ReactionMaterializesCustomElement(): void {
    const container = DomHarness.createContainer();
    const box = new Box().innervate();
    emitSignal(box, 'element.rendered', { container, text: 'Hello Box UCA' });
    const element = container.querySelector('ext-box');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.textContent, 'Hello Box UCA');
    box.denervate();
    container.remove();
}

function testBox_CustomElementIsGenuine(): void {
    const container = DomHarness.createContainer();
    const box = new Box().innervate();
    emitSignal(box, 'element.rendered', { container, text: 'Genuine' });
    const customElementCtor = customElements.get('ext-box');
    assert.notStrictEqual(customElementCtor, undefined);
    assert.ok(container.querySelector('ext-box') instanceof customElementCtor!);
    box.denervate();
    container.remove();
}

function listenConnected(box: Box, callback: (context?: LifecycleContext) => void): void {
    box.target?.addEventListener('element.connected', (event: Event) => {
        const detail = (event as CustomEvent<Signal<LifecycleContext>>).detail;
        callback(detail.value);
    });
}

function testBox_ReactiveLifecyclePulseIntoNervousSystem(): void {
    const container = DomHarness.createContainer();
    const box = new Box().innervate();
    let captured: LifecycleContext | undefined = undefined;
    listenConnected(box, (context) => { captured = context; });
    emitSignal(box, 'element.rendered', { container, text: 'Lifecycle' });
    const received = captured as LifecycleContext | undefined;
    assert.strictEqual(received?.tag, 'ext-box');
    assert.strictEqual(received?.id, 'box');
    box.denervate();
    container.remove();
}

function testBox_TwoInstancesAreIsolated(): void {
    const [containerA, containerB] = [DomHarness.createContainer(), DomHarness.createContainer()];
    const [boxA, boxB] = [new Box('box-a').innervate(), new Box('box-b').innervate()];
    assert.notStrictEqual(boxA.target, boxB.target);
    emitSignal(boxA, 'element.rendered', { container: containerA, text: 'A only' });
    assert.notStrictEqual(containerA.querySelector('ext-box'), null);
    assert.strictEqual(containerB.querySelector('ext-box'), null);
    boxA.denervate();
    boxB.denervate();
    containerA.remove();
    containerB.remove();
}

function assertHeaderAndBody(container: HTMLElement): void {
    const header = container.querySelector('#box-card-header');
    const body = container.querySelector('#box-card-body');
    assert.strictEqual(header?.textContent, 'Updated Header');
    assert.strictEqual(body?.textContent, 'Card Body');
}

function testBox_GeneratesMultipleBoxesByUniqueId(): void {
    const container = DomHarness.createContainer();
    const box = new Box().innervate();
    emitSignal(box, 'element.rendered', { id: 'box-card-header', container, text: 'Header' });
    emitSignal(box, 'element.rendered', { id: 'box-card-body', container, text: 'Card Body' });
    emitSignal(box, 'element.updated', { id: 'box-card-header', text: 'Updated Header' });
    assertHeaderAndBody(container);
    box.denervate();
    container.remove();
}

function testBox_RenderMaterializesContainerWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Box container',
            body: {
                text: 'Box inner content',
                role: 'region',
                className: 'card-container',
                hidden: true,
            },
        },
    };
    const box = new Box().innervate(undefined, disposition);
    emitSignal(box, 'element.rendered', { container });
    const element = container.querySelector('ext-box');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('text'), 'Box inner content');
    assert.strictEqual(element?.getAttribute('role'), 'region');
    assert.strictEqual(element?.getAttribute('class'), 'card-container');
    assert.strictEqual(element?.getAttribute('hidden'), '');
    box.denervate();
    container.remove();
}

function testBox_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Box with domain properties',
            body: {
                role: 'main',
                className: 'layout-box',
                hidden: false,
            },
        },
    };
    const box = new Box().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    box.target?.addEventListener('box.created', (event: Event) => {
        captured.push({ property: 'box.created', value: (event as CustomEvent).detail?.value });
    });
    box.target?.addEventListener('box.updated', (event: Event) => {
        captured.push({ property: 'box.updated', value: (event as CustomEvent).detail?.value });
    });
    box.target?.addEventListener('box.removed', (event: Event) => {
        captured.push({ property: 'box.removed', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(box, 'element.rendered', { container });
    emitSignal(box, 'element.updated', {});
    emitSignal(box, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0], { property: 'box.created', value: { role: 'main', className: 'layout-box', hidden: false } });
    assert.deepStrictEqual(captured[1], { property: 'box.updated', value: { role: 'main', className: 'layout-box', hidden: false } });
    assert.deepStrictEqual(captured[2], { property: 'box.removed', value: { role: 'main', className: 'layout-box', hidden: false } });
    box.denervate();
    container.remove();
}

function testBox_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Box container',
            body: {
                role: 'region',
                className: 'card-view',
                hidden: true,
            },
        },
    };
    const box = new Box().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    box.target?.addEventListener('box.created', (event: Event) => {
        captured.push({ property: 'box.created', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(box, 'box.create', { container });
    const element = container.querySelector('ext-box');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('role'), 'region');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, { role: 'region', className: 'card-view', hidden: true });
    emitSignal(box, 'box.remove', {});
    assert.strictEqual(container.querySelector('ext-box'), null);
    box.denervate();
    container.remove();
}

function runAllBoxTests(): void {
    testBox_Existence();
    testBox_InnervationDoesNotMaterializeDom();
    testBox_ReactionMaterializesCustomElement();
    testBox_CustomElementIsGenuine();
    testBox_ReactiveLifecyclePulseIntoNervousSystem();
    testBox_TwoInstancesAreIsolated();
    testBox_GeneratesMultipleBoxesByUniqueId();
    testBox_RenderMaterializesContainerWithOptions();
    testBox_PulsesDomainSignalsPassingProperties();
    testBox_ReactsToDomainRequestSignals();
    console.log('✔ All Box UCA minimal architecture tests passed successfully.');
}

runAllBoxTests();
