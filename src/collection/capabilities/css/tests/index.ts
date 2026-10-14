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
    assert.strictEqual(DESIGN_TOKENS.tone.$type, 'color');
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
    assert.ok(tokensElement?.textContent?.includes('--uca-tone-brand: #2563eb;'));

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
        radius: 'medium',
        direction: 'column',
        alignment: 'center',
    });

    assert.strictEqual(declarations['width'], DESIGN_TOKENS.dimensions.third.$value);
    assert.strictEqual(declarations['height'], DESIGN_TOKENS.dimensions.auto.$value);
    assert.strictEqual(declarations['padding'], DESIGN_TOKENS.spacing.medium.$value);
    assert.strictEqual(declarations['background-color'], DESIGN_TOKENS.surface.brand.$value);
    assert.strictEqual(declarations['font-family'], DESIGN_TOKENS.typeface.sans.$value);
    assert.strictEqual(declarations['font-size'], DESIGN_TOKENS.textSize.medium.$value);
    assert.strictEqual(declarations['box-shadow'], DESIGN_TOKENS.elevation.card.$value);
    assert.strictEqual(declarations['border-radius'], DESIGN_TOKENS.radius.medium.$value);
    assert.strictEqual(declarations['flex-direction'], DESIGN_TOKENS.direction.column.$value);
    assert.strictEqual(declarations['align-items'], DESIGN_TOKENS.alignment.center.$value);
    assert.strictEqual(declarations['justify-content'], 'center');
}

function testCss_TranslatesGapIndependentlyFromSpacing(): void {
    const independent = Css.translateQualities({ spacing: 'large', gap: 'small' });
    assert.strictEqual(independent['padding'], DESIGN_TOKENS.spacing.large.$value);
    assert.strictEqual(independent['gap'], DESIGN_TOKENS.spacing.small.$value);
    assert.strictEqual(Css.translateQualities({ spacing: 'medium' })['gap'], DESIGN_TOKENS.spacing.medium.$value);
    assert.strictEqual(Css.translateQualities({})['gap'], undefined);
}

function testCss_TranslatesBorderToken(): void {
    assert.strictEqual(Css.translateQualities({ border: 'outline' })['border'], DESIGN_TOKENS.border.outline.$value);
    assert.strictEqual(Css.translateQualities({ border: 'none' })['border'], 'none');
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
        qualities: { width: 'third', spacing: 'medium', tone: 'surface' },
    });

    assert.ok(appliedResult !== undefined);
    assert.strictEqual(appliedResult?.elementId, 'card-1');
    assert.strictEqual(appliedResult?.declarations['padding'], '1rem');

    const styleElement = document.getElementById(`${STYLE_PREFIX}card-1`);
    assert.ok(styleElement !== null);
    assert.ok(styleElement?.textContent?.includes('#card-1 {'));
    assert.ok(styleElement?.textContent?.includes('padding: 1rem;'));

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
        qualities: { tone: 'brand', radius: 'full' },
    });

    assert.ok(resolvedResult !== undefined);
    assert.strictEqual(resolvedResult?.elementId, 'btn-1');
    assert.strictEqual(resolvedResult?.declarations['background-color'], '#2563eb');
    assert.strictEqual(resolvedResult?.declarations['border-radius'], '9999px');
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
            tone: {
                $type: 'color',
                brand: { $value: '#ff0000', $description: 'Theme brand red' },
                surface: { $value: '#000000', $description: 'Theme surface black' },
            },
        },
    });

    assert.ok(themedResult !== undefined);
    assert.strictEqual(themedResult?.updated, true);

    const tokensElement = document.getElementById(TOKENS_STYLE_ID);
    assert.ok(tokensElement?.textContent?.includes('--uca-tone-brand: #ff0000;'));
    assert.ok(tokensElement?.textContent?.includes('--uca-tone-surface: #000000;'));

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
    emitSignal(bus, SignalType.APPLY, { elementId: 'footer-el', qualities: { width: 'full', tone: 'dark' } });

    assert.ok(document.getElementById(`${STYLE_PREFIX}header-el`) !== null);
    assert.ok(document.getElementById(`${STYLE_PREFIX}sidebar-el`) !== null);
    assert.ok(document.getElementById(`${STYLE_PREFIX}footer-el`) !== null);

    document.getElementById(`${STYLE_PREFIX}header-el`)?.remove();
    document.getElementById(`${STYLE_PREFIX}sidebar-el`)?.remove();
    document.getElementById(`${STYLE_PREFIX}footer-el`)?.remove();
    css.denervate();
}

function testCss_GeneratesResponsiveBaseRulesAndBoundedDimensions(): void {
    const baseCss = Css.generateTokensCss();
    assert.ok(baseCss.includes('min-width: 0;'));
    assert.ok(baseCss.includes('max-width: 100%;'));
    assert.ok(baseCss.includes('img { max-width: 100%; height: auto; display: block; }'));
    assert.strictEqual(Css.translateQualities({ width: 'half' })['max-width'], '100%');
    assert.strictEqual(Css.translateQualities({ width: 'wide' })['max-width'], '768px');
}

function runTests(): void {
    console.log('🧪 Testing autonomous peer qualities Css capability (W3C DTCG)...');
    testCss_IdentityAndDefaults();
    testCss_ResolvesSchemaOnDemand();
    testCss_DoesNotMountTokensUponInnervation();
    testCss_MountsTokensOnLifecycleEvent();
    testCss_TranslatesQualitiesDeterministically();
    testCss_TranslatesBorderToken();
    testCss_TranslatesGapIndependentlyFromSpacing();
    testCss_GeneratesResponsiveBaseRulesAndBoundedDimensions();
    testCss_AppliesStyleForNeighborUca();
    testCss_ResolvesStyleOnDemand();
    testCss_UpdatesThemeTokensWithDtcgFormat();
    testCss_RemovesElementStyle();
    testCss_MultipleAutonomousNeighborUcas();
    console.log('✅ All Css capability tests passed successfully!');
}

runTests();

