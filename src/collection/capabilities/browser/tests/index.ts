import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Browser } from '../index.js';
import { __ID__, AIM } from '../constants.js';
import { SignalType, type BrowserContext } from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const detail: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail }));
}

function testBrowser_IdentityAndDisposition(): void {
    const browser = new Browser();
    assert.strictEqual(browser.id, __ID__);
    assert.strictEqual(Browser.AIM, AIM);
    assert.ok(browser instanceof Capability);
    const { inputs, outputs } = Browser.disposition;
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(outputs?.length, 3);
}

function testBrowser_InnervationIsPure(): void {
    const bus = new EventTarget();
    let detectedCalled = false;
    bus.addEventListener(SignalType.DETECTED, () => { detectedCalled = true; });
    const browser = new Browser('browser:pure');
    browser.innervate(bus);
    assert.strictEqual(detectedCalled, false);
    browser.denervate();
}

function testBrowser_DetectContext(): void {
    const bus = new EventTarget();
    let captured: BrowserContext | undefined;
    bus.addEventListener(SignalType.DETECTED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<BrowserContext>>;
        captured = customEvent.detail.value;
    });
    const browser = new Browser('browser:detect');
    browser.innervate(bus);
    emitSignal(bus, browser.updateEvent, Browser.disposition);
    emitSignal(bus, SignalType.DETECT, undefined);
    assert.ok(captured);
    assert.strictEqual(typeof captured.viewport.width, 'number');
    assert.strictEqual(typeof captured.screen.width, 'number');
    browser.denervate();
}

function testBrowser_DestroySignal(): void {
    const bus = new EventTarget();
    let destroyed = false;
    bus.addEventListener(SignalType.DESTROYED, () => { destroyed = true; });
    const browser = new Browser('browser:destroy');
    browser.innervate(bus);
    emitSignal(bus, browser.updateEvent, Browser.disposition);
    emitSignal(bus, SignalType.DESTROY, undefined);
    assert.strictEqual(destroyed, true);
    browser.denervate();
}

function runTests(): void {
    console.log('🧪 Testing Browser capability...');
    testBrowser_IdentityAndDisposition();
    testBrowser_InnervationIsPure();
    testBrowser_DetectContext();
    testBrowser_DestroySignal();
    console.log('✔ All Browser capability tests passed successfully.');
}

runTests();
