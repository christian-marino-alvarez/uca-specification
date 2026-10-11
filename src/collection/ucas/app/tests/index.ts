import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import { App } from '../index.js';
import { __ID__ } from '../constants.js';
import { Composer } from '@uca/composer';
import { Builder } from '@uca/builder';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { type Cooky, type Signal } from '@uca/core/types';
import { SignalType as ComposerSignalType } from '@uca/composer/types';
import { SignalType as SseSignalType } from '@uca/capability-sse-client/types';

class Probe extends App {
    public declarations(): Cooky {
        return this.catalog();
    }
}

function emit(bus: EventTarget, property: string, value: unknown, source: string): void {
    const detail: Signal = { source, property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail }));
}

function testApp_IdentityAndDefaults(): void {
    const app = new App();
    assert.ok(app instanceof Uca);
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, App.purpose);
    const { aim } = App.disposition;
    assert.strictEqual(aim.description, App.purpose);
}

function testApp_CapabilitiesComposition(): void {
    const app = new Probe();
    const declarations = app.declarations();
    assert.strictEqual(declarations.length, 3);
    const [[FirstImpl, { aim: firstAim }], [SecondImpl, { aim: secondAim }], [ThirdImpl, { aim: thirdAim }]] = declarations;
    assert.strictEqual(FirstImpl, Composer);
    assert.strictEqual(SecondImpl, Builder);
    assert.strictEqual(ThirdImpl, Browser);
    assert.deepStrictEqual(firstAim.body, { id: 'app:composer', request: App.purpose, context: app.context, parentTo: 'app', composition: undefined });
    assert.deepStrictEqual(secondAim.body, { id: 'app:builder', parentTo: 'app' });
    assert.deepStrictEqual(thirdAim.body, { id: 'app:browser' });
}

function testApp_Context(): void {
    const app = new App();
    const { context } = app;
    assert.ok(typeof context === 'string');
    assert.ok(context.includes('Cursor'));
    assert.ok(context.includes('Antigravity'));
}

function testApp_InnervationAndDenervation(): void {
    const bus = new EventTarget();
    let updateFired = false;
    bus.addEventListener(ComposerSignalType.UPDATE, () => { updateFired = true; });

    const app = new App('custom-app').innervate(bus);
    assert.strictEqual(app.id, 'custom-app');
    assert.strictEqual(app.target, bus);
    emit(bus, app.updateEvent, App.disposition, 'client');
    assert.ok(updateFired, 'disposition update should trigger composition');

    app.denervate();
    assert.strictEqual(app.target, undefined);
}

async function testApp_TriggersComposition(): Promise<void> {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('data: [DONE]\n\n');
    try {
        const bus = new EventTarget();
        const requests: string[] = [];
        bus.addEventListener(SseSignalType.STREAM, (event) => {
            const { detail: { value: { request } } } = event as CustomEvent<Signal<{ request: string }>>;
            requests.push(request);
        });
        const app = new App().innervate(bus);
        emit(bus, app.updateEvent, App.disposition, 'client');
        assert.ok(requests.length >= 1);
        assert.match(requests[0], /Cursor/);

        const countBeforeUpdate = requests.length;
        emit(bus, app.updateEvent, { ...App.disposition, aim: { body: { context: 'Mobile' } } }, 'client');
        await Promise.resolve();
        assert.ok(requests.length > countBeforeUpdate);
        assert.match(requests[requests.length - 1], /Mobile/);
        app.denervate();
    } finally {
        globalThis.fetch = originalFetch;
    }
}

async function testApp_PropagatesDetected(): Promise<void> {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('data: [DONE]\n\n');
    try {
        const bus = new EventTarget();
        let updatedContext: string | undefined;
        bus.addEventListener(Capability.updateEvent('app:composer'), (event) => {
            const { detail: { value } } = event as CustomEvent<Signal<{ id?: string; aim?: { body?: { context?: string } } }>>;
            if (value?.aim?.body?.context) {
                updatedContext = value.aim.body.context;
            }
        });
        const app = new App().innervate(bus);
        emit(bus, app.updateEvent, App.disposition, 'client');
        const mockBrowserContext = {
            viewport: { width: 375, height: 812 },
            screen: { width: 375, height: 812, availWidth: 375, availHeight: 812, colorDepth: 24, pixelRatio: 3, orientation: 'portrait-primary' },
            browser: { type: 'Safari', userAgent: 'Mobile', language: 'es', platform: 'iOS', touch: true, maxTouchPoints: 5, colorScheme: 'dark' as const, reducedMotion: false, online: true },
        };
        emit(bus, BrowserSignalType.DETECTED, mockBrowserContext, 'app:browser');
        await Promise.resolve();
        assert.ok(updatedContext?.includes('Viewport 375x812'));
        assert.ok(updatedContext?.includes('Orientación portrait-primary'));
        assert.ok(updatedContext?.includes('Plataforma iOS'));
        app.denervate();
    } finally {
        globalThis.fetch = originalFetch;
    }
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing App UCA (reactive composition root)...');
    testApp_IdentityAndDefaults();
    testApp_Context();
    testApp_CapabilitiesComposition();
    testApp_InnervationAndDenervation();
    await testApp_TriggersComposition();
    await testApp_PropagatesDetected();
    console.log('✅ All App UCA tests passed successfully!');
}

void runTests();

