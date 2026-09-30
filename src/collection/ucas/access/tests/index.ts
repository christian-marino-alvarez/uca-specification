import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Access } from '../index.js';
import { SignalType } from '../types.js';

function emitSignal(access: Access, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    access.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testAccess_Existence(): void {
    const access = new Access('main-access');
    assert.ok(access instanceof Uca);
    assert.strictEqual(document.querySelector('ext-access'), null);
    assert.strictEqual(access.purpose, 'Represent reference connection to an identifiable source via an interactive label and identifying title');
    access.denervate();
}

function testAccess_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Resource reference access', {
        source: 'https://example.com/docs',
        label: 'Read Documentation',
        title: 'Documentation resource',
    });
    const access = new Access().innervate(undefined, disposition);
    emitSignal(access, 'element.rendered', { container });
    const element = container.querySelector('ext-access');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.textContent, 'Read Documentation');
    assert.strictEqual(element?.getAttribute('href'), 'https://example.com/docs');
    assert.strictEqual(element?.getAttribute('title'), 'Documentation resource');
    access.denervate();
    container.remove();
}

function testAccess_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const access = new Access().innervate();
    emitSignal(access, 'element.rendered', { container, text: 'Initial', attributes: { href: 'https://example.com/1' } });
    const element = container.querySelector('ext-access');
    assert.strictEqual(element?.getAttribute('href'), 'https://example.com/1');
    assert.strictEqual(element?.textContent, 'Initial');
    emitSignal(access, 'element.updated', { text: 'Updated Label', attributes: { href: 'https://example.com/2' } });
    assert.strictEqual(element?.getAttribute('href'), 'https://example.com/2');
    assert.strictEqual(element?.textContent, 'Updated Label');
    access.denervate();
    container.remove();
}

function testAccess_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const access = new Access().innervate();
    emitSignal(access, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-access'), null);
    emitSignal(access, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-access'), null);
    access.denervate();
    container.remove();
}

function testAccess_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Domain access test', {
        source: 'https://github.com',
        label: 'GitHub',
        title: 'Source repository',
    });
    const access = new Access().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    access.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    access.target?.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent).detail?.value });
    });
    access.target?.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(access, 'element.rendered', { container });
    emitSignal(access, 'element.updated', {});
    emitSignal(access, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    access.denervate();
    container.remove();
}

function testAccess_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Navigation resource access', {
        source: 'https://example.com/guide',
        label: 'User Guide',
        title: 'Documentation guide',
    });
    const access = new Access().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    access.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(access, SignalType.CREATE, { container });
    const element = container.querySelector('ext-access');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.textContent, 'User Guide');
    assert.strictEqual(element?.getAttribute('href'), 'https://example.com/guide');
    assert.strictEqual(element?.getAttribute('title'), 'Documentation guide');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    emitSignal(access, SignalType.REMOVE, {});
    assert.strictEqual(container.querySelector('ext-access'), null);
    access.denervate();
    container.remove();
}

function runAllAccessTests(): void {
    testAccess_Existence();
    testAccess_RenderMaterializesCustomElementWithOptions();
    testAccess_UpdateViaSignal();
    testAccess_RemoveDestroysFromDom();
    testAccess_PulsesDomainSignalsPassingProperties();
    testAccess_ReactsToDomainRequestSignals();
    console.log('✔ All Access UCA minimal architecture tests passed successfully.');
}

runAllAccessTests();
