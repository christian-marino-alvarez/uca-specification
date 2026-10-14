import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { LocalStorage } from '@uca/capability-local-storage';
import { SignalType as StorageSignalType, type StoredItem } from '@uca/capability-local-storage/types';
import { __ID__, DEFAULT_NAMESPACE, DEFAULT_PURPOSE, FALLBACK_STORAGE } from './constants.js';
import {
    type Body,
    type GetPayload,
    type RemovePayload,
    type SavePayload,
    DataType,
    SignalType,
} from './types.js';

export class Memory extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Memory.purpose,
            body: { namespace: DEFAULT_NAMESPACE },
        },
        reactTo: [
            SignalType.SAVE,
            SignalType.GET,
            SignalType.REMOVE,
            SignalType.CLEAR,
            StorageSignalType.SAVED,
            StorageSignalType.RETRIEVED,
            StorageSignalType.REMOVED,
            StorageSignalType.CLEARED,
            StorageSignalType.ERROR,
            ...LocalStorage.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.SAVE, type: DataType.SAVE_PAYLOAD, description: 'Persist disposition or state under a key' },
            { signal: SignalType.GET, type: DataType.GET_PAYLOAD, description: 'Retrieve persisted disposition or state by key' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Remove persisted entry by key' },
            { signal: SignalType.CLEAR, type: DataType.VOID, description: 'Clear all entries in memory storage' },
        ],
        outputs: [
            { signal: SignalType.SAVED, type: DataType.SAVED_RESULT, description: 'Confirmation of saved memory entry' },
            { signal: SignalType.RETRIEVED, type: DataType.RETRIEVED_RESULT, description: 'Retrieved and deserialized memory entry' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Confirmation of removed memory entry' },
            { signal: SignalType.CLEARED, type: DataType.VOID, description: 'Confirmation of cleared memory' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Memory storage error notification' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        const { aim } = this.disposition;
        const { namespace = DEFAULT_NAMESPACE, storage } = aim.body ?? {};
        const activeStorage = (storage as Storage | undefined) ?? (typeof localStorage !== 'undefined' ? localStorage : FALLBACK_STORAGE);
        const body = { id: `${id}:local-storage`, prefix: `${namespace}:`, storage: activeStorage };
        return [[LocalStorage, { aim: { description: LocalStorage.AIM, body }, reactTo: [...LocalStorage.disposition.reactTo ?? []] }]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.SAVE:
                this.handleSave(value);
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
            case StorageSignalType.SAVED:
                this.handleStorageSaved(value);
                break;
            case StorageSignalType.RETRIEVED:
                this.handleStorageRetrieved(value);
                break;
            case StorageSignalType.REMOVED:
                this.handleStorageRemoved(value);
                break;
            case StorageSignalType.CLEARED:
                this.handleStorageCleared();
                break;
            case StorageSignalType.ERROR:
                this.handleStorageError(value);
                break;
            default:
                break;
        }
    }

    private handleSave(value: unknown): void {
        const { key, value: itemValue, correlationId } = (value ?? {}) as SavePayload;
        const storageId = `${this.id}:local-storage`;
        this.pulse(StorageSignalType.SET, { id: storageId, targetId: this.id, key, value: itemValue, correlationId });
    }

    private handleGet(value: unknown): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as GetPayload);
        const { key, correlationId } = payload;
        const storageId = `${this.id}:local-storage`;
        this.pulse(StorageSignalType.GET, { id: storageId, targetId: this.id, key, correlationId });
    }

    private handleRemove(value: unknown): void {
        const payload = typeof value === 'string' ? { key: value } : ((value ?? {}) as RemovePayload);
        const { key, correlationId } = payload;
        const storageId = `${this.id}:local-storage`;
        this.pulse(StorageSignalType.REMOVE, { id: storageId, targetId: this.id, key, correlationId });
    }

    private handleClear(): void {
        const storageId = `${this.id}:local-storage`;
        this.pulse(StorageSignalType.CLEAR, { id: storageId, targetId: this.id });
    }

    private handleStorageSaved(value: unknown): void {
        const { key, value: rawValue, correlationId } = (value ?? {}) as StoredItem & { correlationId?: string };
        const parsed = this.deserializeValue(rawValue);
        this.pulse(SignalType.SAVED, { key, value: parsed, ...(correlationId !== undefined && { correlationId }) });
    }

    private handleStorageRetrieved(value: unknown): void {
        const { key, value: rawValue, correlationId } = (value ?? {}) as StoredItem & { correlationId?: string };
        const parsed = this.deserializeValue(rawValue);
        this.pulse(SignalType.RETRIEVED, { key, value: parsed, ...(correlationId !== undefined && { correlationId }) });
    }

    private handleStorageRemoved(value: unknown): void {
        const { key, correlationId } = (value ?? {}) as { key: string; correlationId?: string };
        this.pulse(SignalType.REMOVED, { key, ...(correlationId !== undefined && { correlationId }) });
    }

    private handleStorageCleared(): void {
        this.pulse(SignalType.CLEARED, undefined);
    }

    private handleStorageError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private deserializeValue(raw: string | null | undefined): unknown {
        if (raw === null || raw === undefined) { return null; }
        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
}
