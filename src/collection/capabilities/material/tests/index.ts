import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Material } from '../index.js';
import { SignalType, type AppliedResult, type ApplyPayload, type ThemeMode } from '../types.js';
import { __ID__, AIM, STYLE_ELEMENT_ID } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function activateMaterial(material: Material, bus: EventTarget): Material {
    material.innervate(bus);
    emitSignal(bus, material.updateEvent, Material.disposition);
    return material;
}

function testMaterial_IdentityAndPorts(): void {
    const material = new Material();
    assert.strictEqual(material.id, __ID__);
    assert.strictEqual(Material.AIM, AIM);
    assert.ok(material instanceof Capability);
    material.innervate();
    assert.strictEqual(material.disposition.inputs?.length, 2);
    assert.strictEqual(material.disposition.outputs?.length, 1);
    material.denervate();
}

function testMaterial_InnervationInjectsDefaultTokens(): void {
    const bus = new EventTarget();
    let captured: AppliedResult | undefined;
    bus.addEventListener(SignalType.APPLIED, (event: Event) => {
        captured = (event as CustomEvent<Signal<AppliedResult>>).detail.value;
    });

    const material = activateMaterial(new Material('material-test'), bus);
    assert.ok(captured !== undefined);
    assert.strictEqual(captured.theme, 'light');
    assert.strictEqual(captured.tokens['--md-sys-shape-corner-full'], '9999px');

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    assert.ok(styleElement !== null);
    assert.ok(styleElement.textContent?.includes('--md-sys-color-surface: #ffffff'));

    material.denervate();
}

function testMaterial_AppliesDarkThemeOnSignal(): void {
    const bus = new EventTarget();
    let captured: AppliedResult | undefined;
    bus.addEventListener(SignalType.APPLIED, (event: Event) => {
        captured = (event as CustomEvent<Signal<AppliedResult>>).detail.value;
    });

    const material = activateMaterial(new Material('material-theme-test'), bus);
    emitSignal(bus, SignalType.THEME, 'dark');

    assert.ok(captured !== undefined);
    assert.strictEqual(captured.theme, 'dark');
    assert.strictEqual(captured.tokens['--md-sys-color-surface'], '#202124');

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    assert.ok(styleElement?.textContent?.includes('--md-sys-color-surface: #202124'));

    material.denervate();
}

function testMaterial_AppliesCustomSeedColor(): void {
    const bus = new EventTarget();
    let captured: AppliedResult | undefined;
    bus.addEventListener(SignalType.APPLIED, (event: Event) => {
        captured = (event as CustomEvent<Signal<AppliedResult>>).detail.value;
    });

    const material = activateMaterial(new Material('material-seed-test'), bus);
    const payload: ApplyPayload = { seedColor: '#ff0055' };
    emitSignal(bus, SignalType.APPLY, payload);

    assert.ok(captured !== undefined);
    assert.strictEqual(captured.tokens['--md-sys-color-primary'], '#ff0055');

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    assert.ok(styleElement?.textContent?.includes('--md-sys-color-primary: #ff0055'));

    material.denervate();
}

function testMaterial_DenervationRemovesStyleElement(): void {
    const bus = new EventTarget();
    const material = activateMaterial(new Material('material-cleanup-test'), bus);
    assert.ok(document.getElementById(STYLE_ELEMENT_ID) !== null);

    material.denervate();
    assert.strictEqual(document.getElementById(STYLE_ELEMENT_ID), null);
}

function runAllMaterialTests(): void {
    testMaterial_IdentityAndPorts();
    testMaterial_InnervationInjectsDefaultTokens();
    testMaterial_AppliesDarkThemeOnSignal();
    testMaterial_AppliesCustomSeedColor();
    testMaterial_DenervationRemovesStyleElement();
    console.log('✔ All Material capability minimal architecture tests passed successfully.');
}

runAllMaterialTests();
