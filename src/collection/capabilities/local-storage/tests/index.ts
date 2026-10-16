import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { test } from 'node:test';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { LocalStorage } from '../index.js';
import { DataType, Operation, SignalType, type Body, type StoredItem, type StorageError } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function activateLocalStorage(bus: EventTarget, cap: LocalStorage, disposition?: Disposition<Body>): LocalStorage {
    cap.innervate(bus);
    emitSignal(bus, cap.updateEvent, disposition ?? LocalStorage.disposition);
    return cap;
}

function testLocalStorage_IdentityAndDefaults(): void {
    const storageCap = new LocalStorage();
    assert.strictEqual(storageCap.id, __ID__);
    assert.strictEqual(storageCap.disposition.aim.description, LocalStorage.AIM);
    assert.ok(storageCap instanceof Capability);
    storageCap.innervate();
    const { inputs, outputs } = storageCap.disposition;
    assert.strictEqual(inputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.ITEM_PAYLOAD);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(outputs?.[0]?.type, DataType.STORED_ITEM);
    storageCap.denervate();
}

function testLocalStorage_SetAndGet(): void {
    const bus = new EventTarget();
    const storageCap = activateLocalStorage(bus, new LocalStorage('test-storage'));
    let capturedSaved: StoredItem | undefined;
    let capturedRetrieved: StoredItem | undefined;

    bus.addEventListener(SignalType.SAVED, (event: Event) => {
        capturedSaved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });
    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        capturedRetrieved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });

    emitSignal(bus, SignalType.SET, { key: 'username', value: 'alice' });
    assert.deepStrictEqual(capturedSaved, { key: 'username', value: 'alice' });

    emitSignal(bus, SignalType.GET, { key: 'username' });
    assert.deepStrictEqual(capturedRetrieved, { key: 'username', value: 'alice' });

    storageCap.denervate();
}

function testLocalStorage_GetMissingKeyReturnsNull(): void {
    const bus = new EventTarget();
    const storageCap = activateLocalStorage(bus, new LocalStorage('test-storage'));
    let capturedRetrieved: StoredItem | undefined;

    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        capturedRetrieved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });

    emitSignal(bus, SignalType.GET, 'non-existent-key');
    assert.deepStrictEqual(capturedRetrieved, { key: 'non-existent-key', value: null });

    storageCap.denervate();
}

function testLocalStorage_RemoveItem(): void {
    const bus = new EventTarget();
    const storageCap = activateLocalStorage(bus, new LocalStorage('test-storage'));
    let capturedRemoved: { key: string } | undefined;
    let capturedRetrieved: StoredItem | undefined;

    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        capturedRemoved = (event as CustomEvent<Signal<{ key: string }>>).detail.value;
    });
    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        capturedRetrieved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });

    emitSignal(bus, SignalType.SET, { key: 'temp', value: 'delete-me' });
    emitSignal(bus, SignalType.REMOVE, { key: 'temp' });
    assert.deepStrictEqual(capturedRemoved, { key: 'temp' });

    emitSignal(bus, SignalType.GET, { key: 'temp' });
    assert.deepStrictEqual(capturedRetrieved, { key: 'temp', value: null });

    storageCap.denervate();
}

function testLocalStorage_Clear(): void {
    const bus = new EventTarget();
    const storageCap = activateLocalStorage(bus, new LocalStorage('test-storage'));
    let clearedCalled = false;
    let capturedRetrieved: StoredItem | undefined;

    bus.addEventListener(SignalType.CLEARED, () => {
        clearedCalled = true;
    });
    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        capturedRetrieved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });

    emitSignal(bus, SignalType.SET, { key: 'item-1', value: 'val-1' });
    emitSignal(bus, SignalType.CLEAR, {});
    assert.strictEqual(clearedCalled, true);

    emitSignal(bus, SignalType.GET, { key: 'item-1' });
    assert.deepStrictEqual(capturedRetrieved, { key: 'item-1', value: null });

    storageCap.denervate();
}

function testLocalStorage_PrefixSupport(): void {
    const bus = new EventTarget();
    const disposition: Disposition<Body> = {
        aim: { description: 'Prefixed storage', body: { prefix: 'app:v1:' } },
        reactTo: [...LocalStorage.disposition.reactTo ?? []],
    };
    const storageCap = activateLocalStorage(bus, new LocalStorage('prefixed-storage'), disposition);
    let capturedRetrieved: StoredItem | undefined;

    bus.addEventListener(SignalType.RETRIEVED, (event: Event) => {
        capturedRetrieved = (event as CustomEvent<Signal<StoredItem>>).detail.value;
    });

    emitSignal(bus, SignalType.SET, { key: 'session', value: 'token-123' });
    assert.strictEqual(localStorage.getItem('app:v1:session'), 'token-123');

    emitSignal(bus, SignalType.GET, { key: 'session' });
    assert.deepStrictEqual(capturedRetrieved, { key: 'session', value: 'token-123' });

    storageCap.denervate();
}

function testLocalStorage_ErrorWhenMissingKey(): void {
    const bus = new EventTarget();
    const storageCap = activateLocalStorage(bus, new LocalStorage('error-storage'));
    let capturedError: StorageError | undefined;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal<StorageError>>).detail.value;
    });

    emitSignal(bus, SignalType.SET, { key: '', value: 'missing-key' });
    assert.strictEqual(capturedError?.operation, 'set');
    assert.ok(capturedError?.error instanceof Error);
    const { message } = capturedError.error;
    assert.strictEqual(message, 'Storage not available or missing key');

    storageCap.denervate();
}

function runAllLocalStorageTests(): void {
    testLocalStorage_IdentityAndDefaults();
    testLocalStorage_SetAndGet();
    testLocalStorage_GetMissingKeyReturnsNull();
    testLocalStorage_RemoveItem();
    testLocalStorage_Clear();
    testLocalStorage_PrefixSupport();
    testLocalStorage_ErrorWhenMissingKey();
    console.log('✔ All LocalStorage capability minimal architecture tests passed successfully.');
}

runAllLocalStorageTests();

const FAILURE_CASES = [
    { property: SignalType.SET, operation: Operation.SET, method: 'setItem' },
    { property: SignalType.GET, operation: Operation.GET, method: 'getItem' },
    { property: SignalType.REMOVE, operation: Operation.REMOVE, method: 'removeItem' },
    { property: SignalType.CLEAR, operation: Operation.CLEAR, method: 'clear' },
] as const;

const createStorage = (): Storage => ({
    length: 0,
    key: () => null,
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
    clear: () => undefined,
});

const captureSignals = (bus: EventTarget): Signal[] => {
    const signals: Signal[] = [];
    bus.addEventListener('*', (event) => { const { detail } = event as CustomEvent<Signal>; signals.push(detail); });
    return signals;
};

const activateStorage = (bus: EventTarget, storage: Storage): LocalStorage => activateLocalStorage(bus, new LocalStorage('failing-storage'), {
    ...LocalStorage.disposition, aim: { description: LocalStorage.AIM, body: { storage } },
});

const assertFailure = (signals: Signal[], error: unknown, operation: Operation): void => {
    assert.strictEqual(signals.length, 1);
    const [{ property, targetId, value }] = signals;
    assert.strictEqual(property, SignalType.ERROR);
    assert.strictEqual(targetId, 'requester');
    assert.deepStrictEqual(value, { operation, error, key: 'entry', correlationId: 'pending-commit' });
};

FAILURE_CASES.forEach(({ property, operation, method }) => test(`${operation} preserves correlation and recipient when the storage backend throws`, () => {
    const bus = new EventTarget(), failure = new DOMException('Storage quota exhausted', 'QuotaExceededError');
    const storage = { ...createStorage(), [method]: () => { throw failure; } }, capability = activateStorage(bus, storage);
    const signals = captureSignals(bus);
    emitSignal(bus, property, { key: 'entry', value: 'content', correlationId: 'pending-commit', targetId: 'requester' });
    assertFailure(signals, failure, operation);
    capability.denervate();
}));

test('serialization errors remain correlated storage failures without a write acknowledgement', () => {
    const bus = new EventTarget(), failure = new Error('Cannot serialize entry'), capability = activateStorage(bus, createStorage());
    const signals = captureSignals(bus), value = { toJSON: () => { throw failure; } };
    emitSignal(bus, SignalType.SET, { key: 'entry', value, correlationId: 'pending-commit', targetId: 'requester' });
    assertFailure(signals, failure, Operation.SET);
    capability.denervate();
});
