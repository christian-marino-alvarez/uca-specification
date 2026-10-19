import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { Capability } from '@uca/core/capability';
import type { ICapability, Signal } from '@uca/core/types';
import type { Scenario } from './types.js';

export function preparePrimitiveDom(): void {
    const { window } = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>');
    const { document, customElements, HTMLElement, HTMLStyleElement, AbortController, AbortSignal } = window;
    Object.assign(globalThis, {
        window,
        document,
        customElements,
        HTMLElement,
        HTMLStyleElement,
        AbortController,
        AbortSignal,
        getComputedStyle: window.getComputedStyle.bind(window),
    });
}

export function emit(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = {
        source: 'test',
        property,
        value,
    };
    bus.dispatchEvent(new CustomEvent(property, {
        detail: signal,
    }));
}

export function dispose(unit: ICapability): void {
    if ('registry' in unit) {
        const { registry } = unit as ICapability & { registry: Map<string, ICapability> };
        registry.forEach(dispose);
    }
    unit.denervate();
}

export function verifyPrimitive(scenario: Scenario): void {
    const { create, disposition, signals, body, patch, tag, updatedTag = tag } = scenario;
    test(`${create().id}: reactive domain lifecycle and native representation`, () => {
        preparePrimitiveDom();
        const bus = new EventTarget();
        const unit = create().innervate(bus);
        const { id } = unit;
        const errors: unknown[] = [];
        const created: unknown[] = [];
        const updated: unknown[] = [];
        const removed: unknown[] = [];
        bus.addEventListener(signals.ERROR, (event) => errors.push(Capability.readPayload(event)));
        bus.addEventListener(signals.CREATED, (event) => {
            assert.ok(document.getElementById(id)?.isConnected);
            created.push(Capability.readPayload(event));
        });
        bus.addEventListener(signals.UPDATED, (event) => updated.push(Capability.readPayload(event)));
        bus.addEventListener(signals.REMOVED, (event) => removed.push(Capability.readPayload(event)));
        emit(bus, unit.updateEvent, disposition);
        assert.equal(document.getElementById(id), null);
        emit(bus, signals.RENDER, {
            ...body,
            parentId: 'app',
            context: {
                areaId: 'app',
            },
        });
        assert.equal(document.getElementById(id)?.localName, tag);
        assert.equal(document.getElementById(id)?.parentElement?.id, 'app');
        assert.equal(created.length, 1);
        assert.ok(!(created[0] as Record<string, unknown>).tag);
        emit(bus, signals.UPDATE, {
            ...body,
            ...patch,
            parentId: 'app',
            context: {
                areaId: 'app',
            },
        });
        assert.equal(document.getElementById(id)?.localName, updatedTag);
        assert.equal(updated.length, 1);
        assert.equal(created.length, 1);
        emit(bus, signals.REMOVE, {});
        assert.equal(document.getElementById(id), null);
        assert.equal(removed.length, 1);
        assert.deepEqual(errors, []);
        assert.ok(!Object.hasOwn(Object.getPrototypeOf(unit), 'innervate'));
        assert.ok(!Object.hasOwn(Object.getPrototypeOf(unit), 'denervate'));
        dispose(unit);
    });
}
