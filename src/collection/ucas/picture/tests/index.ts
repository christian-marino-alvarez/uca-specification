import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Picture } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__ } from '../constants.js';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="container"></div></body></html>');
globalThis.document = dom.window.document as unknown as Document;
globalThis.customElements = dom.window.customElements;
globalThis.HTMLElement = dom.window.HTMLElement as unknown as typeof HTMLElement;
globalThis.HTMLStyleElement = dom.window.HTMLStyleElement as unknown as typeof HTMLStyleElement;
globalThis.AbortController = dom.window.AbortController;
globalThis.AbortSignal = dom.window.AbortSignal;

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testPicture_IdentityAndDefaults(): void {
    const picture = new Picture();
    assert.strictEqual(picture.id, __ID__);
    assert.strictEqual(picture.purpose, Picture.purpose);
    assert.ok(picture instanceof Uca);
    assert.strictEqual(Picture.disposition.inputs?.length, 3);
    assert.strictEqual(Picture.disposition.outputs?.length, 4);
}

function testPicture_CapabilitiesCompositionInCooky(): void {
    class TestablePicture extends Picture {
        public exposeCapabilities(): ReturnType<Picture['catalog']> {
            return this.catalog();
        }
    }
    const picture = new TestablePicture('test-picture');
    const capabilities = picture.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testPicture_RenderAndMount(): void {
    const bus = new EventTarget();
    let createdReceived = false;

    bus.addEventListener(SignalType.CREATED, () => {
        createdReceived = true;
    });

    const picture = new Picture('my-picture').innervate(bus);
    emitSignal(bus, Capability.updateEvent('my-picture'), Picture.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        src: 'https://example.com/photo.png',
        alt: 'Sample photo',
        qualities: { width: 'full', shape: 'medium' },
    });

    assert.ok(createdReceived);
    const element = document.getElementById('my-picture') as HTMLImageElement;
    assert.ok(element);
    assert.strictEqual(element.tagName.toLowerCase(), 'img');
    assert.strictEqual(element.src, 'https://example.com/photo.png');
    assert.strictEqual(element.alt, 'Sample photo');
    picture.denervate();
}

function runTests(): void {
    console.log('🧪 Testing Picture UCA (autonomous visual image unit)...');
    testPicture_IdentityAndDefaults();
    testPicture_CapabilitiesCompositionInCooky();
    testPicture_RenderAndMount();
    console.log('✅ All Picture UCA tests passed successfully!');
}

runTests();
