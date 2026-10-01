import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import { Picture } from '../index.js';
import type { Body } from '../types.js';

function emitSignal(picture: Picture, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    picture.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testPicture_Existence(): void {
    const picture = new Picture('hero-picture');
    assert.ok(picture instanceof Uca);
    assert.strictEqual(document.querySelector('ext-picture'), null);
    picture.denervate();
}

function testPicture_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Hero banner picture',
            body: {
                source: 'https://example.com/banner.jpg',
                alt: 'Hero banner',
                dimensions: { width: 800, height: 600 },
                quality: 95,
                sharpness: 8,
            },
        },
    };
    const picture = new Picture().innervate(undefined, disposition);
    emitSignal(picture, 'element.rendered', { container });
    const element = container.querySelector('ext-picture');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('src'), 'https://example.com/banner.jpg');
    assert.strictEqual(element?.getAttribute('alt'), 'Hero banner');
    assert.strictEqual(element?.getAttribute('width'), '800');
    assert.strictEqual(element?.getAttribute('height'), '600');
    assert.strictEqual(element?.getAttribute('data-quality'), '95');
    assert.strictEqual(element?.getAttribute('data-sharpness'), '8');
    picture.denervate();
    container.remove();
}

function testPicture_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const picture = new Picture().innervate();
    emitSignal(picture, 'element.rendered', { container, attributes: { src: 'https://example.com/old.png' } });
    const element = container.querySelector('ext-picture');
    assert.strictEqual(element?.getAttribute('src'), 'https://example.com/old.png');
    emitSignal(picture, 'element.updated', { attributes: { src: 'https://example.com/new.png' } });
    assert.strictEqual(element?.getAttribute('src'), 'https://example.com/new.png');
    picture.denervate();
    container.remove();
}

function testPicture_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const picture = new Picture().innervate();
    emitSignal(picture, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-picture'), null);
    emitSignal(picture, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-picture'), null);
    picture.denervate();
    container.remove();
}

function testPicture_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Picture with domain properties',
            body: {
                source: 'https://example.com/art.png',
                alt: 'Artwork',
                dimensions: { width: 400, height: 300 },
                quality: 90,
                sharpness: 5,
            },
        },
    };
    const picture = new Picture().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    picture.target?.addEventListener('picture.created', (event: Event) => {
        captured.push({ property: 'picture.created', value: (event as CustomEvent).detail?.value });
    });
    picture.target?.addEventListener('picture.updated', (event: Event) => {
        captured.push({ property: 'picture.updated', value: (event as CustomEvent).detail?.value });
    });
    picture.target?.addEventListener('picture.removed', (event: Event) => {
        captured.push({ property: 'picture.removed', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(picture, 'element.rendered', { container });
    emitSignal(picture, 'element.updated', {});
    emitSignal(picture, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    picture.denervate();
    container.remove();
}

function testPicture_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition: Disposition<Body> = {
        aim: {
            description: 'Picture with domain properties',
            body: {
                source: 'https://example.com/photo.png',
                alt: 'Photo',
            },
        },
    };
    const picture = new Picture().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    picture.target?.addEventListener('picture.created', (event: Event) => {
        captured.push({ property: 'picture.created', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(picture, 'picture.create', { container });
    const element = container.querySelector('ext-picture');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('src'), 'https://example.com/photo.png');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, { source: 'https://example.com/photo.png', alt: 'Photo' });
    emitSignal(picture, 'picture.remove', {});
    assert.strictEqual(container.querySelector('ext-picture'), null);
    picture.denervate();
    container.remove();
}

function runAllPictureTests(): void {
    testPicture_Existence();
    testPicture_RenderMaterializesCustomElementWithOptions();
    testPicture_UpdateViaSignal();
    testPicture_RemoveDestroysFromDom();
    testPicture_PulsesDomainSignalsPassingProperties();
    testPicture_ReactsToDomainRequestSignals();
    console.log('✔ All Picture UCA minimal architecture tests passed successfully.');
}

runAllPictureTests();
