import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Capability } from '@uca/core/capability';
import type { Cooky, Signal } from '@uca/core/types';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Render } from '../index.js';
import { SignalType, type MountContext } from '../types.js';

class DisconnectedRender extends Render {
    protected override catalog(): Cooky {
        return [];
    }
}

function emit(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = {
        source: 'test',
        property,
        value,
    };
    bus.dispatchEvent(new CustomEvent(property, {
        detail: signal,
    }));
}

test('area confirmation waits for Box.CREATED and is emitted once', () => {
    const bus = new EventTarget();
    const render = new DisconnectedRender('render').innervate(bus);
    const confirmations: unknown[] = [];
    let mount: MountContext | undefined;
    bus.addEventListener(BoxSignalType.RENDER, (event) => {
        const payload = Capability.readPayload<{ context: MountContext }>(event);
        mount = payload?.context;
    });
    bus.addEventListener(SignalType.AREA_CREATED, (event) => {
        confirmations.push(Capability.readPayload(event));
    });
    emit(bus, render.updateEvent, Render.disposition);
    emit(bus, SignalType.RENDER, {
        mode: 'deterministic',
        containerElement: '#app',
        areas: [{ id: 'child', parentId: 'app' }],
        context: { correlationId: 'operation', context: { task: 'Preserve context' } },
    });
    assert.ok(mount);
    assert.equal(confirmations.length, 0);
    const connected = {
        elementId: 'child',
        context: mount,
    };
    emit(bus, BoxSignalType.CREATED, connected);
    emit(bus, BoxSignalType.CREATED, connected);
    assert.deepEqual(confirmations, [{
        area: { id: 'child', parentId: 'app' },
        correlationId: 'operation',
        context: { task: 'Preserve context' },
    }]);
    render.denervate();
});
