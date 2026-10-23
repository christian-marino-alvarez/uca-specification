import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Css } from '../index.js';
import {
    type AppliedResult,
    type RemovedResult,
    type ResolvedResult,
    type ThemedResult,
    SignalType,
} from '../types.js';
import {
    __ID__,
    DESIGN_TOKENS,
    STYLE_PREFIX,
    TOKENS_STYLE_ID,
} from '../constants.js';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="card-1"></div><div id="nav-1"></div></body></html>');
globalThis.document = dom.window.document as unknown as Document;
globalThis.HTMLElement = dom.window.HTMLElement as unknown as typeof HTMLElement;
globalThis.HTMLStyleElement = dom.window.HTMLStyleElement as unknown as typeof HTMLStyleElement;

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function activateCss(css: Css, bus: EventTarget): Css {
    css.innervate(bus);
    emitSignal(bus, css.updateEvent, Css.disposition);
    return css;
}

function testCss_IdentityAndDefaults(): void {
    const css = new Css();
    assert.strictEqual(css.id, __ID__);
    assert.strictEqual(Css.AIM, 'Apply a modular CSS stylesheet architecture based on W3C Design Tokens (DTCG), injecting root token definitions and scoped atomic style rules for autonomous elements');
    assert.ok(css instanceof Capability);
    assert.strictEqual(Css.disposition.inputs?.length, 6);
    assert.strictEqual(Css.disposition.outputs?.length, 7);
    assert.strictEqual(DESIGN_TOKENS.spacing.$type, 'dimension');
    assert.strictEqual(DESIGN_TOKENS.surface.$type, 'color');
    assert.strictEqual(DESIGN_TOKENS.elevation.$type, 'shadow');
    assert.deepStrictEqual(Css.disposition.aim.body?.tokens, DESIGN_TOKENS);
}

function testCss_ResolvesSchemaOnDemand(): void {
    const bus = new EventTarget();
    let schemaResult: { tokens: unknown; summary: string } | undefined;

    bus.addEventListener(SignalType.SCHEMA_RESOLVED, (event: Event) => {
        schemaResult = (event as CustomEvent<Signal>).detail?.value as { tokens: unknown; summary: string };
    });

    const css = activateCss(new Css('css-schema-test'), bus);
    emitSignal(bus, SignalType.SCHEMA, {});

    assert.ok(schemaResult !== undefined);
    assert.ok(schemaResult?.tokens !== undefined);
    assert.ok(schemaResult?.summary.includes('Design tokens:'));
    assert.strictEqual(document.getElementById(TOKENS_STYLE_ID), null);

    css.denervate();
}

function testCss_DoesNotMountTokensUponInnervation(): void {
    const bus = new EventTarget();
    const css = activateCss(new Css('css-token-test'), bus);
    const tokensElement = document.getElementById(TOKENS_STYLE_ID);
    assert.strictEqual(tokensElement, null);
    css.denervate();
}

function testCss_MountsTokensOnLifecycleEvent(): void {
    const bus = new EventTarget();
    const css = activateCss(new Css('css-lifecycle-test'), bus);
    assert.strictEqual(document.getElementById(TOKENS_STYLE_ID), null);

    emitSignal(bus, SignalType.MOUNT, {});
    const tokensElement = document.getElementById(TOKENS_STYLE_ID);
    assert.ok(tokensElement !== null);
    assert.ok(tokensElement?.textContent?.includes('--uca-spacing-medium: 1rem;'));
    assert.ok(tokensElement?.textContent?.includes('--uca-surface-surface:'));

    tokensElement?.remove();
    css.denervate();
}

function testCss_TranslatesQualitiesDeterministically(): void {
    const declarations = Css.translateQualities({
        width: 'third',
        height: 'auto',
        spacing: 'medium',
        surface: 'brand',
        typeface: 'sans',
        textSize: 'medium',
        elevation: 'card',
        shape: 'medium',
        direction: 'column',
        alignment: 'center',
        distribution: 'center',
    });

    assert.strictEqual(declarations['width'], `var(--uca-dimensions-third, ${DESIGN_TOKENS.dimensions.third.$value})`);
    assert.strictEqual(declarations['height'], `var(--uca-dimensions-auto, ${DESIGN_TOKENS.dimensions.auto.$value})`);
    assert.strictEqual(declarations['padding'], `var(--uca-spacing-medium, ${DESIGN_TOKENS.spacing.medium.$value})`);
    assert.strictEqual(declarations['background-color'], `var(--uca-surface-brand, ${DESIGN_TOKENS.surface.brand.$value})`);
    assert.strictEqual(declarations['font-family'], `var(--uca-typeface-sans, ${DESIGN_TOKENS.typeface.sans.$value})`);
    assert.strictEqual(declarations['font-size'], `var(--uca-textSize-medium, ${DESIGN_TOKENS.textSize.medium.$value})`);
    assert.strictEqual(declarations['box-shadow'], `var(--uca-elevation-card, ${DESIGN_TOKENS.elevation.card.$value})`);
    assert.strictEqual(declarations['border-radius'], `var(--uca-shape-medium, ${DESIGN_TOKENS.shape.medium.$value})`);
    assert.strictEqual(declarations['flex-direction'], `var(--uca-direction-column, ${DESIGN_TOKENS.direction.column.$value})`);
    assert.strictEqual(declarations['align-items'], `var(--uca-alignment-center, ${DESIGN_TOKENS.alignment.center.$value})`);
    assert.strictEqual(declarations['justify-content'], `var(--uca-distribution-center, ${DESIGN_TOKENS.distribution.center.$value})`);
}

function testCss_TranslatesGapIndependentlyFromSpacing(): void {
    const independent = Css.translateQualities({ spacing: 'large', gap: 'small' });
    assert.strictEqual(independent['padding'], `var(--uca-spacing-large, ${DESIGN_TOKENS.spacing.large.$value})`);
    assert.strictEqual(independent['gap'], `var(--uca-spacing-small, ${DESIGN_TOKENS.spacing.small.$value})`);
    assert.strictEqual(Css.translateQualities({ spacing: 'medium' })['gap'], undefined);
    assert.strictEqual(Css.translateQualities({})['gap'], undefined);
}

function testCss_TranslatesOutlineToken(): void {
    assert.strictEqual(Css.translateQualities({ outline: 'dashed' })['border'], `var(--uca-outline-dashed, ${DESIGN_TOKENS.outline.dashed.$value})`);
    assert.strictEqual(Css.translateQualities({ outline: 'none' })['border'], `var(--uca-outline-none, ${DESIGN_TOKENS.outline.none.$value})`);
    assert.strictEqual(Css.translateQualities({})['border'], undefined);
}

function testCss_AppliesStyleForNeighborUca(): void {
    const bus = new EventTarget();
    let appliedResult: AppliedResult | undefined;

    bus.addEventListener(SignalType.APPLIED, (event: Event) => {
        appliedResult = (event as CustomEvent<Signal>).detail?.value as AppliedResult;
    });

    const css = activateCss(new Css('css-apply-test'), bus);
    emitSignal(bus, SignalType.APPLY, {
        elementId: 'card-1',
        qualities: { width: 'third', spacing: 'medium', surface: 'surface' },
    });

    assert.ok(appliedResult !== undefined);
    assert.strictEqual(appliedResult?.elementId, 'card-1');
    assert.strictEqual(appliedResult?.declarations['padding'], `var(--uca-spacing-medium, ${DESIGN_TOKENS.spacing.medium.$value})`);

    const styleElement = document.getElementById(`${STYLE_PREFIX}card-1`);
    assert.ok(styleElement !== null);
    assert.ok(styleElement?.textContent?.includes('#card-1 {'));
    assert.ok(styleElement?.textContent?.includes('padding: var(--uca-spacing-medium, 1rem);'));

    css.denervate();
    styleElement?.remove();
}

function testCss_ResolvesStyleOnDemand(): void {
    const bus = new EventTarget();
    let resolvedResult: ResolvedResult | undefined;

    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        resolvedResult = (event as CustomEvent<Signal>).detail?.value as ResolvedResult;
    });

    const css = activateCss(new Css('css-resolve-test'), bus);
    emitSignal(bus, SignalType.RESOLVE, {
        elementId: 'btn-1',
        qualities: { surface: 'brand', shape: 'full' },
    });

    assert.ok(resolvedResult !== undefined);
    assert.strictEqual(resolvedResult?.elementId, 'btn-1');
    assert.strictEqual(resolvedResult?.declarations['background-color'], `var(--uca-surface-brand, ${DESIGN_TOKENS.surface.brand.$value})`);
    assert.strictEqual(resolvedResult?.declarations['border-radius'], `var(--uca-shape-full, ${DESIGN_TOKENS.shape.full.$value})`);
    assert.ok(resolvedResult?.cssText.includes('#btn-1 {'));

    css.denervate();
}

function testCss_UpdatesThemeTokensWithDtcgFormat(): void {
    const bus = new EventTarget();
    let themedResult: ThemedResult | undefined;

    bus.addEventListener(SignalType.THEMED, (event: Event) => {
        themedResult = (event as CustomEvent<Signal>).detail?.value as ThemedResult;
    });

    const css = activateCss(new Css('css-theme-test'), bus);
    emitSignal(bus, SignalType.THEME, {
        tokens: {
            surface: {
                $type: 'color',
                brand: { $value: '#ff0000', $description: 'Theme brand red' },
                surface: { $value: '#000000', $description: 'Theme surface black' },
            },
        },
    });

    assert.ok(themedResult !== undefined);
    assert.strictEqual(themedResult?.updated, true);

    const tokensElement = document.getElementById(TOKENS_STYLE_ID);
    assert.ok(tokensElement?.textContent?.includes('--uca-surface-brand: #ff0000;'));
    assert.ok(tokensElement?.textContent?.includes('--uca-surface-surface: #000000;'));

    css.denervate();
}

function testCss_RemovesElementStyle(): void {
    const bus = new EventTarget();
    let removedResult: RemovedResult | undefined;

    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        removedResult = (event as CustomEvent<Signal>).detail?.value as RemovedResult;
    });

    const css = activateCss(new Css('css-remove-test'), bus);
    emitSignal(bus, SignalType.APPLY, {
        elementId: 'nav-1',
        qualities: { height: 'screen' },
    });
    assert.ok(document.getElementById(`${STYLE_PREFIX}nav-1`) !== null);

    emitSignal(bus, SignalType.REMOVE, { elementId: 'nav-1' });
    assert.ok(removedResult !== undefined);
    assert.strictEqual(removedResult?.elementId, 'nav-1');
    assert.strictEqual(document.getElementById(`${STYLE_PREFIX}nav-1`), null);

    css.denervate();
}

function testCss_MultipleAutonomousNeighborUcas(): void {
    const bus = new EventTarget();
    const css = activateCss(new Css('css-neighbors-test'), bus);

    emitSignal(bus, SignalType.APPLY, { elementId: 'header-el', qualities: { width: 'full', spacing: 'small' } });
    emitSignal(bus, SignalType.APPLY, { elementId: 'sidebar-el', qualities: { width: 'quarter', spacing: 'medium' } });
    emitSignal(bus, SignalType.APPLY, { elementId: 'footer-el', qualities: { width: 'full', surface: 'dark' } });

    assert.ok(document.getElementById(`${STYLE_PREFIX}header-el`) !== null);
    assert.ok(document.getElementById(`${STYLE_PREFIX}sidebar-el`) !== null);
    assert.ok(document.getElementById(`${STYLE_PREFIX}footer-el`) !== null);

    document.getElementById(`${STYLE_PREFIX}header-el`)?.remove();
    document.getElementById(`${STYLE_PREFIX}sidebar-el`)?.remove();
    document.getElementById(`${STYLE_PREFIX}footer-el`)?.remove();
    css.denervate();
}

function testCss_PreservesExplicitGeometryWithoutGlobalLayout(): void {
    const baseCss = Css.generateTokensCss();
    assert.ok(baseCss.includes('*, *::before, *::after { box-sizing: border-box; }'));
    assert.ok(baseCss.includes('ext-uca'));
    assert.ok(baseCss.includes('display: block;'));
    assert.ok(baseCss.includes('input, button, select, textarea, a'));
    assert.doesNotMatch(baseCss, /(?:^|[;{])\s*#app/);
    assert.deepStrictEqual(Css.translateQualities({}), { 'box-sizing': 'border-box' });
    assert.deepStrictEqual(Css.translateQualities({ width: 'half' }), { 'box-sizing': 'border-box', width: `var(--uca-dimensions-half, ${DESIGN_TOKENS.dimensions.half.$value})` });
    assert.deepStrictEqual(Css.translateQualities({ width: 'wide' }), { 'box-sizing': 'border-box', width: `var(--uca-dimensions-wide, ${DESIGN_TOKENS.dimensions.wide.$value})` });
    assert.deepStrictEqual(Css.translateQualities({ width: 'narrow' }), { 'box-sizing': 'border-box', width: `var(--uca-dimensions-narrow, ${DESIGN_TOKENS.dimensions.narrow.$value})` });
}

function runTests(): void {
    console.log('🧪 Testing autonomous peer qualities Css capability (W3C DTCG)...');
    testCss_IdentityAndDefaults();
    testCss_ResolvesSchemaOnDemand();
    testCss_DoesNotMountTokensUponInnervation();
    testCss_MountsTokensOnLifecycleEvent();
    testCss_TranslatesQualitiesDeterministically();
    testCss_TranslatesOutlineToken();
    testCss_TranslatesGapIndependentlyFromSpacing();
    testCss_PreservesExplicitGeometryWithoutGlobalLayout();
    testCss_AppliesStyleForNeighborUca();
    testCss_ResolvesStyleOnDemand();
    testCss_UpdatesThemeTokensWithDtcgFormat();
    testCss_RemovesElementStyle();
    testCss_MultipleAutonomousNeighborUcas();
    console.log('✅ All Css capability tests passed successfully!');
}

runTests();


import { test } from 'node:test';
import { qualitiesSchema } from '../schema.js';
import { ControlType } from '../types.js';

test('Token contracts reject unknown names and preserve relative dimensions', () => {
    assert.strictEqual(qualitiesSchema.safeParse({ outline: 'default' }).success, false);
    assert.strictEqual(qualitiesSchema.safeParse({ surface: 'unavailable' }).success, false);
    assert.strictEqual(qualitiesSchema.safeParse({ outline: 'subtle', width: '80%', textSize: 'medium' }).success, true);
    assert.strictEqual(Css.translateQualities({ outline: 'default' }).border, undefined);
    assert.strictEqual(Css.translateQualities({ width: '80%' }).width, '80%');
});

test('Input without qualities keeps native presentation and accessible states', () => {
    const bus = new EventTarget(), css = activateCss(new Css('control-input'), bus);
    emitSignal(bus, SignalType.APPLY, { elementId: 'field', qualities: {}, control: ControlType.INPUT });
    const stylesheet = document.getElementById(`${STYLE_PREFIX}field`)?.textContent ?? '';
    assert.ok(stylesheet.includes('#field { box-sizing: border-box; }'));
    assert.ok(stylesheet.includes('#field:focus-visible { outline: auto; }'));
    assert.ok(stylesheet.includes('#field:disabled { cursor: not-allowed; }'));
    assert.doesNotMatch(stylesheet, /appearance|width|height|padding|background|color|font|shadow|radius|hover|placeholder|transition/);
    css.denervate();
});

test('Action without qualities keeps native presentation and accessible states', () => {
    const bus = new EventTarget(), css = activateCss(new Css('control-action'), bus);
    emitSignal(bus, SignalType.APPLY, { elementId: 'submit', qualities: {}, control: ControlType.ACTION });
    const stylesheet = document.getElementById(`${STYLE_PREFIX}submit`)?.textContent ?? '';
    assert.ok(stylesheet.includes('#submit { box-sizing: border-box; }'));
    assert.ok(stylesheet.includes('#submit:focus-visible { outline: auto; }'));
    assert.ok(stylesheet.includes('#submit:disabled { cursor: not-allowed; }'));
    assert.doesNotMatch(stylesheet, /appearance|width|height|padding|background|color|font|shadow|radius|hover|active|transition|justify-content/);
    css.denervate();
});

test('Control styling preserves explicit tokens without complementing omitted qualities', () => {
    const bus = new EventTarget(), css = activateCss(new Css('explicit-control'), bus);
    emitSignal(bus, SignalType.APPLY, { elementId: 'explicit', control: ControlType.ACTION, qualities: { width: 'half', spacing: 'small', surface: 'dark', shape: 'none', typeface: 'serif', outline: 'strong' } });
    const stylesheet = document.getElementById(`${STYLE_PREFIX}explicit`)?.textContent ?? '';
    assert.ok(stylesheet.includes(`width: var(--uca-dimensions-half, ${DESIGN_TOKENS.dimensions.half.$value});`));
    assert.ok(stylesheet.includes(`padding: var(--uca-spacing-small, ${DESIGN_TOKENS.spacing.small.$value});`));
    assert.ok(stylesheet.includes(`background-color: var(--uca-surface-dark, ${DESIGN_TOKENS.surface.dark.$value});`));
    assert.ok(stylesheet.includes(`border-radius: var(--uca-shape-none, ${DESIGN_TOKENS.shape.none.$value});`));
    assert.ok(stylesheet.includes(`font-family: var(--uca-typeface-serif, ${DESIGN_TOKENS.typeface.serif.$value});`));
    assert.ok(stylesheet.includes(`border: var(--uca-outline-strong, ${DESIGN_TOKENS.outline.strong.$value});`));
    assert.doesNotMatch(stylesheet, /max-width|gap:|box-shadow|font-size|font-weight|justify-content/);
    css.denervate();
});

test('Foreground and surface are independent without legacy aliases', () => {
    const explicit = Css.translateQualities({ surface: 'dark', textColor: 'light' });
    assert.strictEqual(explicit['background-color'], `var(--uca-surface-dark, ${DESIGN_TOKENS.surface.dark.$value})`);
    assert.strictEqual(explicit['color'], `var(--uca-textColor-light, ${DESIGN_TOKENS.textColor.light.$value})`);
    assert.deepStrictEqual(Css.translateQualities({ textColor: 'brand' }), { 'box-sizing': 'border-box', color: `var(--uca-textColor-brand, ${DESIGN_TOKENS.textColor.brand.$value})` });
    assert.deepStrictEqual(Css.translateQualities({ surface: 'brand' }), { 'box-sizing': 'border-box', 'background-color': `var(--uca-surface-brand, ${DESIGN_TOKENS.surface.brand.$value})` });
    assert.strictEqual(Css.translateQualities({ surface: 'transparent' })['background-color'], 'var(--uca-surface-transparent, transparent)');
});

test('Typography controls text without selecting a container layout', () => {
    const translated = Css.translateQualities({ fontWeight: 'semibold', lineHeight: 'relaxed', textAlign: 'center' });
    assert.deepStrictEqual(translated, {
        'box-sizing': 'border-box',
        'font-weight': `var(--uca-fontWeight-semibold, ${DESIGN_TOKENS.fontWeight.semibold.$value})`,
        'line-height': `var(--uca-lineHeight-relaxed, ${DESIGN_TOKENS.lineHeight.relaxed.$value})`,
        'text-align': `var(--uca-textAlign-center, ${DESIGN_TOKENS.textAlign.center.$value})`,
    });
});

test('Explicit main-axis distribution overrides alignment without changing its cross axis', () => {
    const translated = Css.translateQualities({ direction: 'column', alignment: 'center', distribution: 'start', wrap: 'wrap' });
    assert.strictEqual(translated['flex-direction'], `var(--uca-direction-column, ${DESIGN_TOKENS.direction.column.$value})`);
    assert.strictEqual(translated['align-items'], `var(--uca-alignment-center, ${DESIGN_TOKENS.alignment.center.$value})`);
    assert.strictEqual(translated['justify-content'], `var(--uca-distribution-start, ${DESIGN_TOKENS.distribution.start.$value})`);
    assert.strictEqual(translated['flex-wrap'], `var(--uca-wrap-wrap, ${DESIGN_TOKENS.wrap.wrap.$value})`);
    assert.strictEqual(translated['display'], 'flex');
    assert.deepStrictEqual(Css.translateQualities({ distribution: 'evenly' }), {
        'box-sizing': 'border-box',
        display: 'flex',
        'justify-content': `var(--uca-distribution-evenly, ${DESIGN_TOKENS.distribution.evenly.$value})`,
    });
    assert.strictEqual(Css.translateQualities({ gap: 'large' })['display'], 'flex');
});

test('Axis spacing and automatic outer margins do not imply gaps or alignment', () => {
    const translated = Css.translateQualities({ spacing: 'small', spacingInline: 'large', spacingBlock: 'none', marginInline: 'auto' });
    assert.deepStrictEqual(translated, {
        'box-sizing': 'border-box',
        padding: `var(--uca-spacing-small, ${DESIGN_TOKENS.spacing.small.$value})`,
        'padding-inline': `var(--uca-spacing-large, ${DESIGN_TOKENS.spacing.large.$value})`,
        'padding-block': `var(--uca-spacing-none, ${DESIGN_TOKENS.spacing.none.$value})`,
        'margin-inline': 'auto',
    });
    assert.strictEqual(Css.translateQualities({ marginInline: 'medium' })['margin-inline'], `var(--uca-spacing-medium, ${DESIGN_TOKENS.spacing.medium.$value})`);
});

test('Size constraints preserve literal values and resolve viewport dimensions by axis', () => {
    const translated = Css.translateQualities({ width: 'full', maxWidth: '48rem', minWidth: '0', minHeight: 'screen' });
    assert.deepStrictEqual(translated, {
        'box-sizing': 'border-box',
        width: `var(--uca-dimensions-full, ${DESIGN_TOKENS.dimensions.full.$value})`,
        'max-width': '48rem',
        'min-width': '0',
        'min-height': '100vh',
    });
    assert.strictEqual(Css.translateQualities({ maxWidth: 'screen' })['max-width'], '100vw');
    assert.strictEqual(Css.translateQualities({})['max-width'], undefined);
});

test('Explicit control typography and foreground override neutral inheritance without a theme', () => {
    const bus = new EventTarget(), css = activateCss(new Css('control-inheritance'), bus);
    emitSignal(bus, SignalType.APPLY, { elementId: 'inherited', control: ControlType.INPUT, qualities: { textColor: 'dark', fontWeight: 'bold', lineHeight: 'tight' } });
    const stylesheet = document.getElementById(`${STYLE_PREFIX}inherited`)?.textContent ?? '';
    assert.ok(stylesheet.includes(`color: var(--uca-textColor-dark, ${DESIGN_TOKENS.textColor.dark.$value});`));
    assert.ok(stylesheet.includes(`font-weight: var(--uca-fontWeight-bold, ${DESIGN_TOKENS.fontWeight.bold.$value});`));
    assert.ok(stylesheet.includes(`line-height: var(--uca-lineHeight-tight, ${DESIGN_TOKENS.lineHeight.tight.$value});`));
    assert.doesNotMatch(stylesheet, /background|radius|padding|font-family/);
    css.denervate();
});

test('Removing parent styles cleans actual descendants while preserving unrelated styles', () => {
    const bus = new EventTarget(), css = activateCss(new Css('subtree-styles'), bus), parent = document.createElement('div');
    parent.id = 'subtree'; parent.innerHTML = '<div id="child"><span id="nestedChild"></span></div><span></span>'; document.body.appendChild(parent);
    ['subtree', 'child', 'nestedChild', 'subtree-unrelated'].forEach((elementId) => emitSignal(bus, SignalType.APPLY, { elementId, qualities: { spacing: 'small' } }));
    emitSignal(bus, SignalType.REMOVE, { elementId: 'subtree' });
    ['subtree', 'child', 'nestedChild'].forEach((elementId) => assert.strictEqual(document.getElementById(`${STYLE_PREFIX}${elementId}`), null));
    assert.ok(document.getElementById(`${STYLE_PREFIX}subtree-unrelated`)); assert.ok(document.getElementById(TOKENS_STYLE_ID));
    assert.strictEqual(document.getElementById('subtree'), parent); assert.ok(document.getElementById('nestedChild'));
    parent.remove(); document.getElementById(`${STYLE_PREFIX}subtree-unrelated`)?.remove(); css.denervate();
});

test('Removing styles without a document still confirms the requested element', () => {
    const currentDocument = document, bus = new EventTarget(), css = activateCss(new Css('headless-removal'), bus), removed: unknown[] = [];
    bus.addEventListener(SignalType.REMOVED, (event) => { const { detail: { value } } = event as CustomEvent<Signal>; removed.push(value); });
    Reflect.deleteProperty(globalThis, 'document');
    try {
        emitSignal(bus, SignalType.REMOVE, { elementId: 'headless-element' });
        assert.deepStrictEqual(removed, [{ elementId: 'headless-element', removed: true }]);
    }
    finally {
        Object.assign(globalThis, { document: currentDocument }); css.denervate();
    }
});
