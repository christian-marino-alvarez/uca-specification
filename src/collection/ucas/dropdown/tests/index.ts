import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Dropdown } from '../index.js';

function emitSignal(dropdown: Dropdown, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    dropdown.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testDropdown_Existence(): void {
    const dropdown = new Dropdown('country-dropdown');
    assert.ok(dropdown instanceof Uca);
    assert.strictEqual(document.querySelector('ext-dropdown'), null);
    dropdown.denervate();
}

function testDropdown_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const items = ['Option 1', 'Option 2', 'Option 3'];
    const body = {
        value: 'Option 1',
        items,
        placeholder: 'Choose option',
        disabled: true,
        required: true,
        fontSize: 14,
        fontFamily: 'sans-serif',
        color: '#111111',
        backgroundColor: '#ffffff',
    };
    const disposition = Capability.createDisposition('Country dropdown element', body);
    const dropdown = new Dropdown().innervate(undefined, disposition);
    emitSignal(dropdown, 'element.rendered', { container });
    const element = container.querySelector('ext-dropdown');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('value'), 'Option 1');
    assert.strictEqual(element?.getAttribute('placeholder'), 'Choose option');
    assert.strictEqual(element?.getAttribute('disabled'), '');
    assert.strictEqual(element?.getAttribute('required'), '');
    assert.ok(element?.getAttribute('data-options')?.includes('Option 1'));
    assert.strictEqual(element?.getAttribute('data-font-size'), '14');
    assert.strictEqual(element?.getAttribute('data-font-family'), 'sans-serif');
    assert.strictEqual(element?.getAttribute('data-color'), '#111111');
    assert.strictEqual(element?.getAttribute('data-background-color'), '#ffffff');
    dropdown.denervate();
    container.remove();
}

function testDropdown_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const dropdown = new Dropdown().innervate();
    emitSignal(dropdown, 'element.rendered', { container, attributes: { value: 'initial' } });
    const element = container.querySelector('ext-dropdown');
    assert.strictEqual(element?.getAttribute('value'), 'initial');
    emitSignal(dropdown, 'element.updated', { attributes: { value: 'updated' } });
    assert.strictEqual(element?.getAttribute('value'), 'updated');
    dropdown.denervate();
    container.remove();
}

function testDropdown_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const dropdown = new Dropdown().innervate();
    emitSignal(dropdown, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-dropdown'), null);
    emitSignal(dropdown, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-dropdown'), null);
    dropdown.denervate();
    container.remove();
}

function testDropdown_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Dropdown with domain properties', {
        value: 'option-1',
        items: ['option-1', 'option-2'],
        placeholder: 'Select...',
        required: true,
    });
    const dropdown = new Dropdown().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    dropdown.target?.addEventListener('dropdown.created', (event: Event) => {
        captured.push({ property: 'dropdown.created', value: (event as CustomEvent).detail?.value });
    });
    dropdown.target?.addEventListener('dropdown.updated', (event: Event) => {
        captured.push({ property: 'dropdown.updated', value: (event as CustomEvent).detail?.value });
    });
    dropdown.target?.addEventListener('dropdown.removed', (event: Event) => {
        captured.push({ property: 'dropdown.removed', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(dropdown, 'element.rendered', { container });
    emitSignal(dropdown, 'element.updated', {});
    emitSignal(dropdown, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    dropdown.denervate();
    container.remove();
}

function testDropdown_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Dropdown with domain properties', {
        value: 'active-option',
    });
    const dropdown = new Dropdown().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    dropdown.target?.addEventListener('dropdown.created', (event: Event) => {
        captured.push({ property: 'dropdown.created', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(dropdown, 'dropdown.create', { container });
    const element = container.querySelector('ext-dropdown');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('value'), 'active-option');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, { value: 'active-option' });
    emitSignal(dropdown, 'dropdown.remove', {});
    assert.strictEqual(container.querySelector('ext-dropdown'), null);
    dropdown.denervate();
    container.remove();
}

function runAllDropdownTests(): void {
    testDropdown_Existence();
    testDropdown_RenderMaterializesCustomElementWithOptions();
    testDropdown_UpdateViaSignal();
    testDropdown_RemoveDestroysFromDom();
    testDropdown_PulsesDomainSignalsPassingProperties();
    testDropdown_ReactsToDomainRequestSignals();
    console.log('✔ All Dropdown UCA minimal architecture tests passed successfully.');
}

runAllDropdownTests();
