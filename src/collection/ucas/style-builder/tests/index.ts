import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import type { Signal } from '../../../../core/types.js';
import { StyleBuilder } from '../index.js';
import { SignalType, type StyleDesignResult } from '../types.js';
import { __ID__ } from '../constants.js';
import { SignalType as ViewSignalType, type ViewVisualResult } from '../../view-builder/types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testStyleBuilder_IdentityAndDefaults(): void {
    const builder = new StyleBuilder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, StyleBuilder.PURPOSE);
    assert.ok(builder instanceof Uca);
    builder.innervate();
    assert.strictEqual(builder.disposition.inputs?.length, 2);
    assert.strictEqual(builder.disposition.outputs?.length, 3);
    builder.denervate();
}

function testStyleBuilder_DesignsStylesFromVisualViewOutcome(): void {
    const bus = new EventTarget();
    // StyleBuilder connects its reactTo directly to ViewBuilder's visual output
    const styleDisposition = StyleBuilder.createDisposition('Dynamic style design', {}, [ViewSignalType.VISUAL]);
    const styler = new StyleBuilder('test-style-builder').innervate(bus, styleDisposition);

    let capturedStyle: StyleDesignResult | undefined;
    bus.addEventListener(SignalType.STYLED, (event: Event) => {
        capturedStyle = (event as CustomEvent<Signal<StyleDesignResult>>).detail.value;
    });

    const mockVisual: ViewVisualResult = {
        title: 'User Profile View',
        elements: [
            { id: 'profile-box', type: 'box' },
            { id: 'avatar-pic', type: 'picture' },
        ],
    };

    // Emit visual outcome from ViewBuilder
    emitSignal(bus, ViewSignalType.VISUAL, { visual: mockVisual, theme: 'dark' });

    assert.ok(capturedStyle !== undefined);
    assert.strictEqual(capturedStyle.viewTitle, 'User Profile View');
    assert.strictEqual(capturedStyle.elementStyles.length, 2);
    assert.strictEqual(capturedStyle.elementStyles[0]?.elementId, 'profile-box');
    assert.strictEqual(capturedStyle.palette?.background, '#0f172a');

    styler.denervate();
}

function runAllStyleBuilderTests(): void {
    testStyleBuilder_IdentityAndDefaults();
    testStyleBuilder_DesignsStylesFromVisualViewOutcome();
    console.log('✔ All StyleBuilder UCA minimal architecture tests passed successfully.');
}

runAllStyleBuilderTests();
