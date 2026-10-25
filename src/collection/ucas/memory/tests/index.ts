import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { LocalStorage } from '@uca/capability-local-storage';
import { Memory } from '../index.js';
import { __ID__ } from '../constants.js';
import { bodySchema } from '../schema.js';
import { type RetrievedResult, type SavedResult, SignalType } from '../types.js';

const createFallbackStorage = (): Storage => {
    const store = new Map<string, string>();
    return {
        get length(): number { return store.size; },
        clear: (): void => { store.clear(); },
        getItem: (key: string): string | null => store.get(key) ?? null,
        key: (index: number): string | null => Array.from(store.keys())[index] ?? null,
        removeItem: (key: string): void => { store.delete(key); },
        setItem: (key: string, value: string): void => { store.set(key, String(value)); },
    };
};

class TestableMemory extends Memory {
    public exposeCatalog(): ReturnType<Memory['catalog']> {
        return this.catalog();
    }
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testMemory_IdentityAndDisposition(): void {
    const memory = new Memory();
    assert.strictEqual(memory.id, __ID__);
    assert.strictEqual(memory.purpose, Memory.purpose);
    assert.ok(memory instanceof Uca);
    const { inputs, outputs } = Memory.disposition;
    assert.strictEqual(inputs?.length, 4);
    assert.strictEqual(outputs?.length, 5);
}

function testMemory_SchemaValidation(): void {
    const parsed = bodySchema.parse({});
    assert.strictEqual(parsed.namespace, 'uca');
}

function testMemory_CatalogComposition(): void {
    const memory = new TestableMemory('test-mem');
    const catalog = memory.exposeCatalog();
    assert.strictEqual(catalog.length, 1);
    const [StorageClass, disposition] = catalog[0];
    assert.strictEqual(StorageClass, LocalStorage);
    const { aim } = disposition;
    const { id } = (aim.body ?? {}) as { id?: string };
    assert.strictEqual(id, 'test-mem:local-storage');
}

function testMemory_SaveAndRetrieveObjects(): void {
    const bus = new EventTarget();
    const storage = createFallbackStorage();
    const memory = new Memory('composer:memory').innervate(bus);
    emitSignal(bus, memory.updateEvent, {
        ...Memory.disposition,
        aim: { description: Memory.purpose, body: { namespace: 'composer', storage } },
    });

    let saved: SavedResult | undefined;
    let retrieved: RetrievedResult | undefined;
    bus.addEventListener(SignalType.SAVED, (event: Event) => {
        saved = (event as CustomEvent<Signal<SavedResult>>).detail.value;
    });
    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        retrieved = (event as CustomEvent<Signal<RetrievedResult>>).detail.value;
    });

    const layoutPayload = {
        media: { minWidth: 1024, orientation: 'landscape-primary' },
        layout: { canvasRoot: { width: 'full', height: 'screen' } },
    };

    emitSignal(bus, SignalType.SAVE, { id: 'composer:memory', key: 'app:desktop', value: layoutPayload, sessionId: 'corr-1' });
    assert.ok(saved);
    assert.strictEqual(saved.key, 'app:desktop');
    assert.strictEqual(saved.sessionId, 'corr-1');
    assert.deepStrictEqual(saved.value, layoutPayload);

    emitSignal(bus, SignalType.GET, { id: 'composer:memory', key: 'app:desktop', sessionId: 'corr-2' });
    assert.ok(retrieved);
    assert.strictEqual(retrieved.key, 'app:desktop');
    assert.strictEqual(retrieved.sessionId, 'corr-2');
    assert.deepStrictEqual(retrieved.value, layoutPayload);

    memory.denervate();
}

function testMemory_RemoveAndClear(): void {
    const bus = new EventTarget();
    const storage = createFallbackStorage();
    const memory = new Memory('builder:memory').innervate(bus);
    emitSignal(bus, memory.updateEvent, {
        ...Memory.disposition,
        aim: { description: Memory.purpose, body: { namespace: 'builder', storage } },
    });

    let retrieved: RetrievedResult | undefined;
    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        retrieved = (event as CustomEvent<Signal<RetrievedResult>>).detail.value;
    });

    emitSignal(bus, SignalType.SAVE, { key: 'area-1', value: { status: 'built' } });
    emitSignal(bus, SignalType.REMOVE, { key: 'area-1' });
    emitSignal(bus, SignalType.GET, { key: 'area-1' });
    assert.strictEqual(retrieved?.value, null);

    emitSignal(bus, SignalType.SAVE, { key: 'area-2', value: { status: 'subdivided' } });
    emitSignal(bus, SignalType.CLEAR, undefined);
    emitSignal(bus, SignalType.GET, { key: 'area-2' });
    assert.strictEqual(retrieved?.value, null);

    memory.denervate();
}

function runTests(): void {
    console.log('🧪 Testing Memory UCA (autonomous cognitive memory unit)...');
    testMemory_IdentityAndDisposition();
    testMemory_SchemaValidation();
    testMemory_CatalogComposition();
    testMemory_SaveAndRetrieveObjects();
    testMemory_RemoveAndClear();
    console.log('✅ All Memory UCA tests passed successfully!');
}

runTests();
