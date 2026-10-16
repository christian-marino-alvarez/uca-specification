import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_PREFIX, MISSING_STORAGE, MISSING_STORAGE_OR_KEY, OPERATIONS } from './constants.js';
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
        reactTo: [
            SignalType.SET,
            SignalType.GET,
            SignalType.REMOVE,
            SignalType.CLEAR,
        ],
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
        const { property, value, source } = signal;
        try {
            switch (property) {
                case SignalType.SET:
                    this.handleSet(value, source);
                    break;
                case SignalType.GET:
                    this.handleGet(value, source);
                    break;
                case SignalType.REMOVE:
                    this.handleRemove(value, source);
                    break;
                case SignalType.CLEAR:
                    this.handleClear();
                    break;
            }
        }
        catch (error) {
            this.handleError(signal, error);
        }
    }

    private serializeValue(value: unknown): string {
        return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
    }

    private handleSet(value: unknown, source: string): void {
        const { key, value: raw, id: _target, targetId, ...rest } = (value ?? {}) as ItemPayload;
        const storage = this.resolveStorage();
        if (!storage || !key) {
            throw new Error(MISSING_STORAGE_OR_KEY);
        }
        const serialized = this.serializeValue(raw);
        storage.setItem(this.resolveKey(key), serialized);
        this.pulse(SignalType.SAVED, { ...rest, key, value: serialized }, targetId ?? source);
    }

    private handleGet(value: unknown, source: string): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as KeyPayload);
        const { key, id: _target, targetId, ...rest } = payload;
        const storage = this.resolveStorage();
        if (!storage || !key) {
            throw new Error(MISSING_STORAGE_OR_KEY);
        }
        const retrieved = storage.getItem(this.resolveKey(key));
        this.pulse(SignalType.RETRIEVED, { ...rest, key, value: retrieved }, targetId ?? source);
    }

    private handleRemove(value: unknown, source: string): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as KeyPayload);
        const { key, id: _target, targetId, ...rest } = payload;
        const storage = this.resolveStorage();
        if (!storage || !key) {
            throw new Error(MISSING_STORAGE_OR_KEY);
        }
        storage.removeItem(this.resolveKey(key));
        this.pulse(SignalType.REMOVED, { ...rest, key }, targetId ?? source);
    }

    private handleClear(): void {
        const storage = this.resolveStorage();
        if (!storage) {
            throw new Error(MISSING_STORAGE);
        }
        const { aim } = this.disposition;
        const { prefix = DEFAULT_PREFIX } = aim.body ?? {};
        prefix ? this.clearPrefixedKeys(storage, prefix) : storage.clear();
        this.pulse(SignalType.CLEARED, undefined);
    }

    private clearPrefixedKeys(storage: Storage, prefix: string): void {
        const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
        keys.filter((key): key is string => Boolean(key?.startsWith(prefix))).forEach((key) => storage.removeItem(key));
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

    private handleError(signal: Signal, error: unknown): void {
        const { property, value, source } = signal;
        const { key, correlationId, targetId } = (typeof value === 'string' ? { key: value } : value ?? {}) as KeyPayload;
        const operation = OPERATIONS[property as keyof typeof OPERATIONS];
        const payload: StorageError = { operation, error, ...(key !== undefined && { key }), ...(correlationId !== undefined && { correlationId }) };
        this.pulse(SignalType.ERROR, payload, targetId ?? source);
    }
}

