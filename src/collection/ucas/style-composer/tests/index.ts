import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as CssSignalType, type CssRule } from '@uca/capability-css';
import { SignalType as GraphSignalType } from '@uca/capability-graph';
import { SignalType as PromptApiSignalType } from '@uca/capability-prompt-api';
import {
    StyleComposer,
    SignalType,
    DataType,
    __ID__,
    PURPOSE,
    type ThemeComposedResult,
    type UcaStyledResult,
} from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testStyleComposer_IdentityAndDefaults(): void {
    const composer = new StyleComposer();
    assert.ok(composer instanceof Uca);
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    const { inputs, outputs, aim } = composer.disposition;
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(inputs?.[0]?.type, DataType.COMPOSE_THEME_PAYLOAD);
    assert.strictEqual(inputs?.[1]?.type, DataType.STYLE_UCA_PAYLOAD);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.THEME_COMPOSED_RESULT);
    assert.strictEqual(outputs?.[1]?.type, DataType.UCA_STYLED_RESULT);
    assert.strictEqual(aim.description, PURPOSE);
}

function testStyleComposer_ComposeThemeGeneratesAndAppliesCssRules(): void {
    const bus = new EventTarget();
    const composer = new StyleComposer('test-styler').innervate(bus);
    let capturedTheme: ThemeComposedResult | undefined;
    const capturedCssRules: CssRule[] = [];

    bus.addEventListener(SignalType.THEME_COMPOSED, (event: Event) => {
        capturedTheme = (event as CustomEvent<Signal<ThemeComposedResult>>).detail.value;
    });
    bus.addEventListener(CssSignalType.CREATE, (event: Event) => {
        capturedCssRules.push((event as CustomEvent<Signal<CssRule>>).detail.value);
    });

    emitSignal(bus, SignalType.COMPOSE_THEME, { purpose: 'Agentic platform' });

    assert.ok(capturedTheme !== undefined);
    assert.ok((capturedTheme?.rules.length ?? 0) >= 2);
    assert.ok(capturedCssRules.some((rule) => rule.selector === ':root'));
    assert.ok(capturedCssRules.some((rule) => rule.selector === 'body'));
    composer.denervate();
}

function testStyleComposer_UcaDetectedGeneratesSpecificStyles(): void {
    const bus = new EventTarget();
    const composer = new StyleComposer('test-styler').innervate(bus);
    let capturedUcaStyled: UcaStyledResult | undefined;
    const capturedCssRules: CssRule[] = [];

    bus.addEventListener(SignalType.UCA_STYLED, (event: Event) => {
        capturedUcaStyled = (event as CustomEvent<Signal<UcaStyledResult>>).detail.value;
    });
    bus.addEventListener(CssSignalType.CREATE, (event: Event) => {
        capturedCssRules.push((event as CustomEvent<Signal<CssRule>>).detail.value);
    });

    const mockUca = { id: 'box:explanation-card', disposition: { aim: { description: 'Explanation card' } } };
    emitSignal(bus, GraphSignalType.UCA_DETECTED, mockUca);

    assert.ok(capturedUcaStyled !== undefined);
    assert.strictEqual(capturedUcaStyled?.id, 'box:explanation-card');
    assert.ok(capturedCssRules.some((rule) => rule.selector === 'ext-box#explanation-card'));
    composer.denervate();
}

function testStyleComposer_PromptApiRespondedUpdatesCssRules(): void {
    const bus = new EventTarget();
    const composer = new StyleComposer('test-styler').innervate(bus);
    const updatedRules: CssRule[] = [];

    bus.addEventListener(CssSignalType.UPDATE, (event: Event) => {
        updatedRules.push((event as CustomEvent<Signal<CssRule>>).detail.value);
    });

    const mockResponse = {
        prompt: 'test',
        response: '{"selector": ":root", "declarations": {"--accent-primary": "#00ff88"}}',
    };
    emitSignal(bus, PromptApiSignalType.RESPONDED, mockResponse);

    assert.strictEqual(updatedRules.length, 1);
    assert.strictEqual(updatedRules[0]?.selector, ':root');
    assert.strictEqual(updatedRules[0]?.declarations['--accent-primary'], '#00ff88');
    composer.denervate();
}

function runAllStyleComposerTests(): void {
    testStyleComposer_IdentityAndDefaults();
    testStyleComposer_ComposeThemeGeneratesAndAppliesCssRules();
    testStyleComposer_UcaDetectedGeneratesSpecificStyles();
    testStyleComposer_PromptApiRespondedUpdatesCssRules();
    console.log('✔ All StyleComposer UCA minimal architecture tests passed successfully.');
}

runAllStyleComposerTests();
