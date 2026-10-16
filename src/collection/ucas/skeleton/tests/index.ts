import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Skeleton } from '../index.js';
import { __ID__, FRAME_BORDER } from '../constants.js';
import { type RenderedResult, SignalType } from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function capture<T>(bus: EventTarget, property: string): T[] {
    const received: T[] = [];
    bus.addEventListener(property, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<T>>;
        const { value } = detail ?? {};
        if (value) { received.push(value); }
    });
    return received;
}

function testSkeleton_IdentityAndDisposition(): void {
    const skeleton = new Skeleton();
    assert.strictEqual(skeleton.id, __ID__);
    assert.ok(skeleton instanceof Capability);
    const { inputs, outputs, reactTo } = Skeleton.disposition;
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(outputs?.length, 5);
    assert.deepStrictEqual(reactTo, [
        SignalType.RENDER,
        SignalType.REMOVE,
        PictureSignalType.CREATED,
    ]);
}

function testSkeleton_RenderDelegatesToPicture(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-render').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    const pictures = capture<{ elementId: string; parentTo: string; src: string }>(bus, PictureSignalType.RENDER);
    const rendered = capture<RenderedResult>(bus, SignalType.RENDERED);
    emitSignal(bus, SignalType.RENDER, { id: 'skeleton-render', areaId: 'hero', kind: 'action' });
    const [picture] = pictures;
    const { elementId, parentTo, src } = picture ?? {};
    assert.strictEqual(elementId, 'hero:skeleton-pic');
    assert.strictEqual(parentTo, 'hero');
    assert.ok(src?.includes('height="40"'));
    assert.strictEqual(rendered.length, 0);
    emitSignal(bus, PictureSignalType.CREATED, { elementId: 'hero:skeleton-pic' });
    assert.deepStrictEqual(rendered, [{ areaId: 'hero', elementId: 'hero:skeleton-pic' }]);
    skeleton.denervate();
}

function testSkeleton_RemoveDelegatesToPicture(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-remove').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    const removed = capture<{ elementId: string }>(bus, PictureSignalType.REMOVE);
    emitSignal(bus, SignalType.REMOVE, { id: 'skeleton-remove', areaId: 'hero' });
    assert.deepStrictEqual(removed, [{ elementId: 'hero:skeleton-pic' }]);
    skeleton.denervate();
}

function testSkeleton_IgnoresSignalsForOtherIds(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-own').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    const pictures = capture<unknown>(bus, PictureSignalType.RENDER);
    emitSignal(bus, SignalType.RENDER, { id: 'another-skeleton', areaId: 'hero' });
    assert.strictEqual(pictures.length, 0);
    skeleton.denervate();
}

function testSkeleton_InertAfterDenervate(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-inert').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    skeleton.denervate();
    const pictures = capture<unknown>(bus, PictureSignalType.RENDER);
    emitSignal(bus, SignalType.RENDER, { areaId: 'hero' });
    assert.strictEqual(pictures.length, 0);
}

function testSkeleton_FramesAreaOnlyWhileLoading(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-frame').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    const updates = capture<{ elementId: string; qualities: Record<string, string> }>(bus, BoxSignalType.UPDATE);
    const areaQualities = { width: 'full', spacing: 'small' };
    emitSignal(bus, SignalType.RENDER, { id: 'skeleton-frame', areaId: 'card', areaQualities });
    emitSignal(bus, SignalType.REMOVE, { id: 'skeleton-frame', areaId: 'card', areaQualities });
    assert.deepStrictEqual(updates, [
        { elementId: 'card', qualities: { ...areaQualities, border: FRAME_BORDER } },
        { elementId: 'card', qualities: areaQualities },
    ]);
    skeleton.denervate();
}

function testSkeleton_WithoutAreaQualitiesLeavesBoxUntouched(): void {
    const bus = new EventTarget();
    const skeleton = new Skeleton('skeleton-plain').innervate(bus);
    emitSignal(bus, skeleton.updateEvent, Skeleton.disposition);
    const updates = capture<unknown>(bus, BoxSignalType.UPDATE);
    emitSignal(bus, SignalType.RENDER, { id: 'skeleton-plain', areaId: 'root' });
    emitSignal(bus, SignalType.REMOVE, { id: 'skeleton-plain', areaId: 'root' });
    assert.strictEqual(updates.length, 0);
    skeleton.denervate();
}

function runTests(): void {
    testSkeleton_IdentityAndDisposition();
    testSkeleton_RenderDelegatesToPicture();
    testSkeleton_RemoveDelegatesToPicture();
    testSkeleton_IgnoresSignalsForOtherIds();
    testSkeleton_InertAfterDenervate();
    testSkeleton_FramesAreaOnlyWhileLoading();
    testSkeleton_WithoutAreaQualitiesLeavesBoxUntouched();
    console.log('✔ All Skeleton capability tests passed successfully.');
}

runTests();
