import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Css, SignalType, type CssRule, __ID__ } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testCss_IdentityAndDefaults(): void {
    const css = new Css();
    assert.strictEqual(css.id, __ID__);
    assert.strictEqual(Css.AIM, 'Create and manage reusable OOCSS rules as independent style resources');
    assert.ok(css instanceof Capability);
    css.innervate();
    assert.strictEqual(css.disposition.inputs?.length, 3);
    assert.strictEqual(css.disposition.outputs?.length, 4);
    css.denervate();
}

function testCss_CreatesOocssRuleAndPulsesCreated(): void {
    const bus = new EventTarget();
    const css = new Css('css-create-test').innervate(bus);
    let capturedRule: CssRule | undefined;

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        capturedRule = (event as CustomEvent<Signal<CssRule>>).detail.value;
    });

    const stackRule: CssRule = {
        selector: '.stack',
        declarations: {
            display: 'flex',
            'flex-direction': 'column',
        },
    };

    emitSignal(bus, SignalType.CREATE, stackRule);

    assert.ok(capturedRule !== undefined);
    assert.strictEqual(capturedRule.selector, '.stack');
    assert.strictEqual(capturedRule.declarations['display'], 'flex');

    const rules = css.getRules();
    assert.strictEqual(rules.length, 1);
    assert.ok(rules[0]?.includes('.stack'));
    assert.ok(rules[0]?.includes('flex-direction: column'));

    css.denervate();
}

function testCss_UpdatesExistingRuleAndPulsesUpdated(): void {
    const bus = new EventTarget();
    const css = new Css('css-update-test').innervate(bus);
    let updatedRule: CssRule | undefined;

    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        updatedRule = (event as CustomEvent<Signal<CssRule>>).detail.value;
    });

    emitSignal(bus, SignalType.CREATE, {
        selector: '.surface',
        declarations: { background: '#ffffff' },
    });

    emitSignal(bus, SignalType.UPDATE, {
        selector: '.surface',
        declarations: { background: '#0f172a', color: '#ffffff' },
    });

    assert.ok(updatedRule !== undefined);
    assert.strictEqual(updatedRule.declarations['background'], '#0f172a');
    assert.strictEqual(updatedRule.declarations['color'], '#ffffff');

    const rules = css.getRules();
    assert.strictEqual(rules.length, 1);
    assert.ok(rules[0]?.includes('#0f172a'));

    css.denervate();
}

function testCss_RemovesRuleAndPulsesRemoved(): void {
    const bus = new EventTarget();
    const css = new Css('css-remove-test').innervate(bus);
    let removedSelector: string | undefined;

    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        removedSelector = (event as CustomEvent<Signal<string>>).detail.value;
    });

    emitSignal(bus, SignalType.CREATE, {
        selector: '.temporary',
        declarations: { opacity: '0.5' },
    });
    assert.strictEqual(css.getRules().length, 1);

    emitSignal(bus, SignalType.REMOVE, '.temporary');

    assert.strictEqual(removedSelector, '.temporary');
    assert.strictEqual(css.getRules().length, 0);

    css.denervate();
}

function testCss_ManagesMultipleOocssRulesInSingleInstance(): void {
    const bus = new EventTarget();
    const css = new Css('css-multi-test').innervate(bus);

    const rulesToCreate: CssRule[] = [
        { selector: '.box', declarations: { display: 'flex' } },
        { selector: '.stack', declarations: { 'flex-direction': 'column' } },
        { selector: '.surface', declarations: { background: 'var(--surface)' } },
        { selector: '.rounded', declarations: { 'border-radius': '0.5rem' } },
        { selector: '.gap-medium', declarations: { gap: '1rem' } },
    ];

    for (const rule of rulesToCreate) {
        emitSignal(bus, SignalType.CREATE, rule);
    }

    const rules = css.getRules();
    assert.strictEqual(rules.length, 5);

    css.denervate();
}

function testCss_DenervatePreservesCssResourcesAndReinnervateReuses(): void {
    const bus1 = new EventTarget();
    const css = new Css('css-lifecycle-test').innervate(bus1);

    emitSignal(bus1, SignalType.CREATE, {
        selector: '.persistent-stack',
        declarations: { display: 'flex' },
    });
    assert.strictEqual(css.getRules().length, 1);

    // Denervate does not destroy stylesheet rules
    css.denervate();
    assert.strictEqual(css.getRules().length, 1);

    // Reinnervate on new bus reuses existing resource
    const bus2 = new EventTarget();
    css.innervate(bus2);
    assert.strictEqual(css.getRules().length, 1);
    assert.ok(css.getRules()[0]?.includes('.persistent-stack'));

    css.denervate();
}

function runAllCssTests(): void {
    testCss_IdentityAndDefaults();
    testCss_CreatesOocssRuleAndPulsesCreated();
    testCss_UpdatesExistingRuleAndPulsesUpdated();
    testCss_RemovesRuleAndPulsesRemoved();
    testCss_ManagesMultipleOocssRulesInSingleInstance();
    testCss_DenervatePreservesCssResourcesAndReinnervateReuses();
    console.log('✔ All Css capability minimal architecture tests passed successfully.');
}

runAllCssTests();
