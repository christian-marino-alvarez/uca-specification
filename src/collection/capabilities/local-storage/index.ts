import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_PREFIX, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type ItemPayload,
    type KeyPayload,
    type StorageError,
    DataType,
    SignalType,
} from './types.js';

export class LocalStorage extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: LocalStorage.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.SET, type: DataType.ITEM_PAYLOAD, description: 'Store a key-value string item in localStorage' },
            { signal: SignalType.GET, type: DataType.KEY_PAYLOAD, description: 'Retrieve a string item by key from localStorage' },
            { signal: SignalType.REMOVE, type: DataType.KEY_PAYLOAD, description: 'Remove an item by key from localStorage' },
            { signal: SignalType.CLEAR, type: DataType.VOID, description: 'Clear all entries in localStorage' },
        ],
        outputs: [
            { signal: SignalType.SAVED, type: DataType.STORED_ITEM, description: 'Emits saved key and string value confirmation' },
            { signal: SignalType.RETRIEVED, type: DataType.STORED_ITEM, description: 'Emits retrieved key and string value or null' },
            { signal: SignalType.REMOVED, type: DataType.KEY_PAYLOAD, description: 'Emits removed key confirmation' },
            { signal: SignalType.CLEARED, type: DataType.VOID, description: 'Emits storage cleared confirmation' },
            { signal: SignalType.ERROR, type: DataType.ERROR, description: 'Emits storage access or operation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.SET:
                this.handleSet(value);
                break;
            case SignalType.GET:
                this.handleGet(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case SignalType.CLEAR:
                this.handleClear();
                break;
        }
    }

    private handleSet(value: unknown): void {
        const payload = (value ?? {}) as ItemPayload;
        const { key, value: itemValue } = payload;
        const { aim } = this.disposition;
        const { ownerId } = (aim.body ?? {}) as Body;
        if (ownerId && key !== ownerId) { return; }
        const storage = this.resolveStorage();
        if (!storage || !key) {
            this.pulseError('set', 'Storage not available or missing key', key);
            return;
        }
        const serialized = typeof itemValue === 'object' && itemValue !== null ? JSON.stringify(itemValue) : String(itemValue);
        storage.setItem(this.resolveKey(key), serialized);
        this.pulse(SignalType.SAVED, { key, value: serialized });
    }

    private handleGet(value: unknown): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as KeyPayload);
        const { key } = payload;
        const storage = this.resolveStorage();
        if (!storage || !key) {
            this.pulseError('get', 'Storage not available or missing key', key);
            return;
        }
        const retrieved = storage.getItem(this.resolveKey(key));
        this.pulse(SignalType.RETRIEVED, { key, value: retrieved });
    }

    private handleRemove(value: unknown): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as KeyPayload);
        const { key } = payload;
        const storage = this.resolveStorage();
        if (!storage || !key) {
            this.pulseError('remove', 'Storage not available or missing key', key);
            return;
        }
        storage.removeItem(this.resolveKey(key));
        this.pulse(SignalType.REMOVED, { key });
    }

    private handleClear(): void {
        const storage = this.resolveStorage();
        if (!storage) {
            this.pulseError('clear', 'Storage not available');
            return;
        }
        storage.clear();
        this.pulse(SignalType.CLEARED, undefined);
    }

    private resolveStorage(): Storage | undefined {
        const { aim } = this.disposition;
        const { storage } = aim.body ?? {};
        if (storage) {
            return storage;
        }
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
            return globalThis.localStorage;
        }
        return typeof localStorage !== 'undefined' ? localStorage : undefined;
    }

    private resolveKey(key: string): string {
        const { aim } = this.disposition;
        const { prefix = DEFAULT_PREFIX } = aim.body ?? {};
        return `${prefix}${key}`;
    }

    private pulseError(operation: string, error: unknown, key?: string): void {
        const payload: StorageError = { operation, error, ...(key !== undefined && { key }) };
        this.pulse(SignalType.ERROR, payload);
    }
}

