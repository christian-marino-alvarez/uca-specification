import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import { List } from '../index.js';
import type { Body } from '../types.js';

function emitSignal(list: List, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    list.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testList_Existence(): void {
    const list = new List('text-list');
    assert.ok(list instanceof Uca);
    assert.strictEqual(document.querySelector('ext-list'), null);
    list.denervate();
}

function testList_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const items = ['First item', 'Second item', 'Third item'];
    const body = {
        items,
        ordered: true,
        fontSize: 16,
        spacing: '8px',
        alignment: 'right' as const,
        color: '#222222',
        backgroundColor: '#f5f5f5',
    };
    const disposition: Disposition<Body> = {
        aim: { description: 'Numbered list of items', body },
    };
    const list = new List().innervate(undefined, disposition);
    emitSignal(list, 'element.rendered', { container });
    const element = container.querySelector('ext-list');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('data-ordered'), 'true');
    assert.strictEqual(element?.getAttribute('data-font-size'), '16');
    assert.strictEqual(element?.getAttribute('data-spacing'), '8px');
    assert.strictEqual(element?.getAttribute('data-alignment'), 'right');
    assert.strictEqual(element?.getAttribute('data-color'), '#222222');
    assert.strictEqual(element?.getAttribute('data-background-color'), '#f5f5f5');
    assert.ok(element?.getAttribute('data-items')?.includes('First item'));
    list.denervate();
    container.remove();
}

function testList_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const list = new List().innervate();
    emitSignal(list, 'element.rendered', { container, attributes: { 'data-items': JSON.stringify(['A']) } });
    const element = container.querySelector('ext-list');
    assert.strictEqual(element?.getAttribute('data-items'), JSON.stringify(['A']));
    emitSignal(list, 'element.updated', { attributes: { 'data-items': JSON.stringify(['A', 'B']) } });
    assert.strictEqual(element?.getAttribute('data-items'), JSON.stringify(['A', 'B']));
    list.denervate();
    container.remove();
}

function testList_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const list = new List().innervate();
    emitSignal(list, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-list'), null);
    emitSignal(list, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-list'), null);
    list.denervate();
    container.remove();
}

function testList_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'List with domain properties',
            body: {
                items: ['First', 'Second'],
                ordered: true,
                fontSize: 14,
                spacing: 8,
                alignment: 'left' as const,
                color: '#111111',
                backgroundColor: '#eeeeee',
            },
        },
    };
    const list = new List().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    list.target?.addEventListener('list.created', (event: Event) => {
        captured.push({ property: 'list.created', value: (event as CustomEvent).detail?.value });
    });
    list.target?.addEventListener('list.updated', (event: Event) => {
        captured.push({ property: 'list.updated', value: (event as CustomEvent).detail?.value });
    });
    list.target?.addEventListener('list.removed', (event: Event) => {
        captured.push({ property: 'list.removed', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(list, 'element.rendered', { container });
    emitSignal(list, 'element.updated', {});
    emitSignal(list, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    list.denervate();
    container.remove();
}

function testList_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'List with domain properties',
            body: {
                items: ['Item A', 'Item B'],
            },
        },
    };
    const list = new List().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    list.target?.addEventListener('list.created', (event: Event) => {
        captured.push({ property: 'list.created', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(list, 'list.create', { container });
    const element = container.querySelector('ext-list');
    assert.notStrictEqual(element, null);
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, { items: ['Item A', 'Item B'] });
    emitSignal(list, 'list.remove', {});
    assert.strictEqual(container.querySelector('ext-list'), null);
    list.denervate();
    container.remove();
}

function runAllListTests(): void {
    testList_Existence();
    testList_RenderMaterializesCustomElementWithOptions();
    testList_UpdateViaSignal();
    testList_RemoveDestroysFromDom();
    testList_PulsesDomainSignalsPassingProperties();
    testList_ReactsToDomainRequestSignals();
    console.log('✔ All List UCA minimal architecture tests passed successfully.');
}

runAllListTests();
