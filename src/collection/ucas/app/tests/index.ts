import assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Composer } from '@uca/composer';
import { SignalType as ComposerSignalType } from '@uca/composer/types';
import type { Signal } from '@uca/core/types';
import { App } from '../index.js';
import { __ID__, DEFAULT_CONTEXT, DEFAULT_LANGUAGE, DEFAULT_NAME } from '../constants.js';
import { bodySchema } from '../schema.js';
import { type Body, DataType, SignalType } from '../types.js';

class TestableApp extends App {
    public exposeCatalog(): ReturnType<App['catalog']> {
        return this.catalog();
    }
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const detail = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail }));
}

function testApp_Identity(): void {
    const app = new App();
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, App.purpose);
    assert.ok(app instanceof Uca);
}

function testApp_Disposition(): void {
    const { aim, inputs, outputs } = App.disposition;
    const { body } = aim;
    assert.strictEqual(body?.name, DEFAULT_NAME);
    assert.strictEqual(body?.purpose, App.purpose);
    assert.strictEqual(body?.context, DEFAULT_CONTEXT);
    assert.strictEqual(body?.language, DEFAULT_LANGUAGE);
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(outputs?.length, 3);
}

function testApp_SchemaDefaults(): void {
    const defaultParsed = bodySchema.parse({});
    assert.strictEqual(defaultParsed.name, 'App');
    assert.strictEqual(defaultParsed.language, 'es-ES');
}

function testApp_SchemaCustom(): void {
    const validBody = {
        name: 'DashboardApp',
        purpose: 'Manage metrics',
        context: 'Finance',
        language: 'en-US',
        dimensions: { width: 1920, height: 1080 },
    };
    const parsed = bodySchema.parse(validBody);
    assert.strictEqual(parsed.name, 'DashboardApp');
    assert.strictEqual(parsed.language, 'en-US');
}

function testApp_CapabilitiesInCooky(): void {
    const app = new TestableApp('custom-app');
    const catalog = app.exposeCatalog();
    assert.strictEqual(catalog.length, 2);
    assert.strictEqual(catalog[0][0], Browser);
    assert.strictEqual(catalog[1][0], Composer);
}

function testApp_CapturesDimensionsOnDisposition(): void {
    const bus = new EventTarget();
    let detectedPayload: Body | undefined;
    bus.addEventListener(SignalType.DIMENSIONS_DETECTED, (event) => {
        const { detail } = event as CustomEvent<Signal<Body>>;
        detectedPayload = detail?.value;
    });
    const app = new App('main-app').innervate(bus);
    emitSignal(bus, app.updateEvent, App.disposition);
    assert.ok(detectedPayload?.dimensions?.screen);
    assert.strictEqual(typeof detectedPayload.language, 'string');
    assert.strictEqual(detectedPayload.context, DEFAULT_CONTEXT);
    app.denervate();
}

function testApp_RespondsToDetectSignal(): void {
    const bus = new EventTarget();
    const captured: Body[] = [];
    bus.addEventListener(SignalType.DIMENSIONS_DETECTED, (event) => {
        const { detail } = event as CustomEvent<Signal<Body>>;
        if (detail?.value) { captured.push(detail.value); }
    });
    const app = new App('detect-app').innervate(bus);
    emitSignal(bus, app.updateEvent, App.disposition);
    emitSignal(bus, SignalType.DETECT, undefined);
    assert.strictEqual(captured.length, 2);
    app.denervate();
}

function testApp_HandlesBrowserChanged(): void {
    const bus = new EventTarget();
    let changedPayload: Body | undefined;
    bus.addEventListener(SignalType.DIMENSIONS_CHANGED, (event) => {
        const { detail } = event as CustomEvent<Signal<Body>>;
        changedPayload = detail?.value;
    });
    const app = new App('change-app').innervate(bus);
    emitSignal(bus, app.updateEvent, App.disposition);
    const mock = { viewport: { width: 375, height: 667 }, screen: { width: 375, height: 667, pixelRatio: 2, orientation: 'portrait-primary' }, browser: { type: 'mock', userAgent: 'test', language: 'fr-FR', platform: 'test' } };
    emitSignal(bus, BrowserSignalType.CHANGED, mock);
    assert.strictEqual(changedPayload?.dimensions?.pixelRatio, 2);
    assert.strictEqual(changedPayload?.language, 'fr-FR');
    app.denervate();
}

function testApp_TriggersComposerOnDetection(): void {
    const bus = new EventTarget();
    let composePayload: unknown;
    bus.addEventListener(ComposerSignalType.COMPOSE, (event) => {
        const { detail } = event as CustomEvent<Signal<unknown>>;
        composePayload = detail?.value;
    });
    const app = new App('compose-app').innervate(bus);
    emitSignal(bus, app.updateEvent, App.disposition);
    assert.ok(composePayload);
    app.denervate();
}

function testApp_EmitsLayoutComposed(): void {
    const bus = new EventTarget();
    let layoutResult: unknown;
    bus.addEventListener(SignalType.LAYOUT_COMPOSED, (event) => {
        const { detail } = event as CustomEvent<Signal<{ layout: unknown }>>;
        layoutResult = detail?.value?.layout;
    });
    const app = new App('layout-app').innervate(bus);
    emitSignal(bus, app.updateEvent, App.disposition);
    emitSignal(bus, ComposerSignalType.COMPOSED, { layout: { root: 'Box' } });
    assert.deepStrictEqual(layoutResult, { root: 'Box' });
    app.denervate();
}

function runTests(): void {
    console.log('🧪 Testing App UCA (autonomous environmental container)...');
    testApp_Identity();
    testApp_Disposition();
    testApp_SchemaDefaults();
    testApp_SchemaCustom();
    testApp_CapabilitiesInCooky();
    testApp_CapturesDimensionsOnDisposition();
    testApp_RespondsToDetectSignal();
    testApp_HandlesBrowserChanged();
    testApp_TriggersComposerOnDetection();
    testApp_EmitsLayoutComposed();
    console.log('✅ All App UCA tests passed successfully!');
}

runTests();
