import { IndexedDatabase } from '@uca/capability-indexed-db';
import {
    SignalType as StorageSignalType,
    type Entry,
} from '@uca/capability-indexed-db/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    DEFAULT_MAX_AGE,
    DEFAULT_MAX_ENTRIES,
    DEFAULT_NAMESPACE,
    DEFAULT_PURPOSE,
    ENTRY_PREFIX,
    HASH_ALGORITHM,
    __ID__,
} from './constants.js';
import {
    cacheResultSchema,
    recallSchema,
    rememberSchema,
} from './schema.js';
import {
    type Body,
    type CacheContext,
    type GetPayload,
    type Remember,
    type RemovePayload,
    type SavePayload,
    type StoredEntry,
    CacheOperation,
    DataType,
    SignalType,
    StorageStage,
} from './types.js';

export class Memory extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Memory.purpose,
            body: {
                namespace: DEFAULT_NAMESPACE,
            },
        },
        reactTo: [
            SignalType.RECALL,
            SignalType.REMEMBER,
            SignalType.SAVE,
            SignalType.GET,
            SignalType.REMOVE,
            SignalType.CLEAR,
            ...Memory.reactToStorage(),
        ],
        inputs: [
            { signal: SignalType.RECALL, type: DataType.RECALL, schema: recallSchema },
            { signal: SignalType.REMEMBER, type: DataType.REMEMBER, schema: rememberSchema },
            { signal: SignalType.SAVE, type: DataType.SAVE_PAYLOAD },
            { signal: SignalType.GET, type: DataType.GET_PAYLOAD },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD },
            { signal: SignalType.CLEAR, type: DataType.VOID },
        ],
        outputs: [
            { signal: SignalType.RECALLED, type: DataType.CACHE_RESULT, schema: cacheResultSchema },
            { signal: SignalType.REMEMBERED, type: DataType.CACHE_RESULT, schema: cacheResultSchema },
            { signal: SignalType.SAVED, type: DataType.RESULT },
            { signal: SignalType.RETRIEVED, type: DataType.RESULT },
            { signal: SignalType.REMOVED, type: DataType.RESULT },
            { signal: SignalType.CLEARED, type: DataType.VOID },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN },
        ],
    };

    private static reactToStorage(): string[] {
        const {
            reactTo = [],
        } = IndexedDatabase.disposition;
        return [
            ...reactTo,
            StorageSignalType.SAVED,
            StorageSignalType.RETRIEVED,
            StorageSignalType.REMOVED,
            StorageSignalType.CLEARED,
            StorageSignalType.LISTED,
            StorageSignalType.ERROR,
        ];
    }

    private static normalize(value: unknown): unknown {
        if (Array.isArray(value)) {
            return value.map((item) => Memory.normalize(item));
        }
        if (value === null || typeof value !== 'object') {
            return value;
        }
        const record = value as Record<string, unknown>;
        return Object.fromEntries(Object.keys(record).sort().map((key) => [key, Memory.normalize(record[key])]));
    }

    private static async hash(identity: string): Promise<string> {
        const bytes = new TextEncoder().encode(identity);
        const digest = await crypto.subtle.digest(HASH_ALGORITHM, bytes);
        const hexadecimal = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
        return `${ENTRY_PREFIX}${hexadecimal}`;
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        const { aim } = this.disposition;
        const { namespace = DEFAULT_NAMESPACE } = aim.body ?? {};
        return [
            [IndexedDatabase, this.createStorageDisposition(`${id}:indexed-db`, namespace)],
        ];
    }

    protected override react(signal: Signal): void | Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.RECALL:
                this.handleRecall(signal);
                break;
            case SignalType.REMEMBER:
                this.handleRemember(signal);
                break;
            case SignalType.SAVE:
                this.handleSave(value);
                break;
            case SignalType.GET:
                this.handleGet(signal);
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
                this.handleStorageRetrieved(signal);
                break;
            case StorageSignalType.REMOVED:
                this.handleStorageRemoved(value);
                break;
            case StorageSignalType.CLEARED:
                this.handleStorageCleared();
                break;
            case StorageSignalType.LISTED:
                this.handleStorageListed(value);
                break;
            case StorageSignalType.ERROR:
                this.handleStorageError(value);
                break;
        }
    }

    private handleStorageCleared(): void {
        this.pulse(SignalType.CLEARED, undefined);
    }

    private createStorageDisposition(id: string, namespace: string): Disposition {
        return {
            ...IndexedDatabase.disposition,
            aim: {
                description: IndexedDatabase.AIM,
                body: {
                    id,
                    databaseName: namespace,
                },
            },
        };
    }

    private handleRecall(signal: Signal): void {
        const { value, source: recipient } = signal;
        const cache: CacheContext = { operation: CacheOperation.RECALL, recipient, request: value as Remember };
        this.resolveIdentity(cache);
    }

    private handleRemember(signal: Signal): void {
        const { value, source: recipient } = signal;
        const cache: CacheContext = { operation: CacheOperation.REMEMBER, recipient, request: value as Remember };
        this.resolveIdentity(cache);
    }

    private async resolveIdentity(cache: CacheContext): Promise<void> {
        try {
            const { aim } = this.disposition;
            const { namespace = DEFAULT_NAMESPACE } = aim.body ?? {};
            const identity = JSON.stringify(Memory.normalize({ namespace, descriptor: cache.request.descriptor }));
            const key = await Memory.hash(identity);
            this.accessEntry({ ...cache, identity, key });
        }
        catch (error) {
            this.emitCacheError(error, cache);
        }
    }

    private accessEntry(cache: CacheContext): void {
        const { operation, request, key, identity } = cache;
        const { sessionId, value } = request;
        const context = { ...cache, stage: StorageStage.ENTRY };
        if (operation === CacheOperation.RECALL) {
            this.pulse(StorageSignalType.GET, { key, sessionId, cache: context });
            return;
        }
        const entry = { key, identity, value, accessedAt: Date.now() };
        this.pulse(StorageSignalType.SET, { key, value: entry, sessionId, cache: context });
    }

    private createRetrievedPayload(result: Record<string, unknown>, stored: unknown, sessionId?: string): Record<string, unknown> {
        return {
            sessionId,
            timestamp: (result.timestamp as number) ?? Date.now(),
            value: stored,
        };
    }

    private handleStorageRetrieved(signal: Signal): void {
        const { value, sessionId } = signal;
        const { cache, value: stored, ...result } = (value ?? {}) as Record<string, unknown>;
        const activeSessionId = (result.sessionId ?? sessionId) as string | undefined;
        if (!cache) {
            const payload = this.createRetrievedPayload(result, stored, activeSessionId);
            this.pulse(SignalType.RETRIEVED, payload);
            return;
        }
        this.handleEntry(stored as StoredEntry | null, cache as CacheContext);
    }

    private handleEntry(entry: StoredEntry | null, cache: CacheContext): void {
        const { identity, key, request } = cache;
        const { sessionId } = request;
        const { aim } = this.disposition;
        const { maxAge = DEFAULT_MAX_AGE } = aim.body ?? {};
        if (!entry || entry.identity !== identity || Date.now() - entry.accessedAt >= maxAge) {
            this.pulse(StorageSignalType.REMOVE, { key, sessionId, cache: { ...cache, stage: StorageStage.MISS } });
            return;
        }
        const touched = { ...entry, accessedAt: Date.now() };
        this.pulse(StorageSignalType.SET, { key, value: touched, sessionId, cache: { ...cache, result: entry.value, stage: StorageStage.TOUCH } });
    }

    private handleStorageSaved(value: unknown): void {
        const { cache, key, value: stored, ...result } = value as Record<string, unknown>;
        if (!cache) {
            this.pulse(SignalType.SAVED, { ...result, key, value: stored });
            return;
        }
        const context = cache as CacheContext;
        if (context.stage === StorageStage.TOUCH) {
            this.emitCacheResult(context);
            return;
        }
        this.emitCacheResult({ ...context, result: context.request.value });
        this.pulse(StorageSignalType.ENTRIES, { cache: { ...context, stage: StorageStage.PRUNE } });
    }

    private handleStorageListed(value: unknown): void {
        const { cache, entries } = value as { cache: CacheContext; entries: Entry[] };
        const validEntries = entries
            .filter(({ key }) => key.startsWith(ENTRY_PREFIX))
            .map(({ value: entry }) => entry as StoredEntry);
        this.pruneEntries(validEntries, cache);
    }

    private pruneEntries(entries: StoredEntry[], cache: CacheContext): void {
        const { aim } = this.disposition;
        const { maxAge = DEFAULT_MAX_AGE, maxEntries = DEFAULT_MAX_ENTRIES } = aim.body ?? {};
        const now = Date.now();
        const retained = entries.filter(({ accessedAt }) => now - accessedAt < maxAge)
            .sort((left, right) => right.accessedAt - left.accessedAt).slice(0, maxEntries);
        const keys = entries.filter(({ key }) => !retained.some((entry) => entry.key === key)).map(({ key }) => key);
        if (keys.length) {
            this.pulse(StorageSignalType.REMOVE_MANY, { keys, cache: { ...cache, stage: StorageStage.PRUNE } });
        }
    }

    private handleStorageRemoved(value: unknown): void {
        const { cache, ...result } = value as Record<string, unknown>;
        if (!cache) {
            this.pulse(SignalType.REMOVED, result);
            return;
        }
        const context = cache as CacheContext;
        if (context.stage === StorageStage.MISS) {
            this.emitCacheResult({ ...context, result: null });
        }
    }

    private emitCacheResult(cache: CacheContext): void {
        const { operation, recipient, result: value = null, request } = cache;
        const { sessionId, context } = request;
        const property = operation === CacheOperation.RECALL ? SignalType.RECALLED : SignalType.REMEMBERED;
        this.pulse(property, { sessionId, context, value }, recipient);
    }

    private handleStorageError(value: unknown): void {
        const { cache, error } = value as { cache?: CacheContext; error: unknown };
        if (cache) {
            this.emitCacheError(error, cache);
            return;
        }
        this.pulse(SignalType.ERROR, value);
    }

    private emitCacheError(error: unknown, cache: CacheContext): void {
        const { recipient, request } = cache;
        const { sessionId, context } = request;
        this.pulse(SignalType.ERROR, { error, sessionId, context }, recipient);
    }

    private handleSave(value: unknown): void {
        const { key, value: stored, sessionId } = value as SavePayload;
        this.pulse(StorageSignalType.SET, { key, value: stored, sessionId });
    }

    private handleGet(signal: Signal): void {
        const { value, sessionId } = signal;
        const { key, ...rest } = (value ?? {}) as GetPayload & Record<string, unknown>;
        const activeSessionId = (sessionId ?? rest.sessionId) as string | undefined;
        this.pulse(StorageSignalType.GET, {
            key,
            ...rest,
            sessionId: activeSessionId,
        });
    }

    private handleRemove(value: unknown): void {
        const { key, sessionId } = value as RemovePayload;
        this.pulse(StorageSignalType.REMOVE, { key, sessionId });
    }

    private handleClear(): void {
        this.pulse(StorageSignalType.CLEAR, {});
    }
}
