import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    AIM,
    DEFAULT_DATABASE_NAME,
    DEFAULT_STORE_NAME,
    DEFAULT_VERSION,
    MISSING_DATABASE,
    __ID__,
} from './constants.js';
import {
    type Body,
    type Entry,
    type ItemPayload,
    type KeyPayload,
    type KeysPayload,
    DataType,
    SignalType,
} from './types.js';

export class IndexedDatabase extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: AIM,
            body: {},
        },
        reactTo: [
            SignalType.SET,
            SignalType.GET,
            SignalType.REMOVE,
            SignalType.REMOVE_MANY,
            SignalType.CLEAR,
            SignalType.ENTRIES,
        ],
        inputs: [
            { signal: SignalType.SET, type: DataType.ITEM },
            { signal: SignalType.GET, type: DataType.KEY },
            { signal: SignalType.REMOVE, type: DataType.KEY },
            { signal: SignalType.REMOVE_MANY, type: DataType.KEYS },
            { signal: SignalType.CLEAR, type: DataType.VOID },
            { signal: SignalType.ENTRIES, type: DataType.VOID },
        ],
        outputs: [
            { signal: SignalType.SAVED, type: DataType.RESULT },
            { signal: SignalType.RETRIEVED, type: DataType.RESULT },
            { signal: SignalType.REMOVED, type: DataType.RESULT },
            { signal: SignalType.CLEARED, type: DataType.VOID },
            { signal: SignalType.LISTED, type: DataType.RESULT },
            { signal: SignalType.ERROR, type: DataType.ERROR },
        ],
    };

    private database?: IDBDatabase;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.database?.close();
        this.database = undefined;
        super.denervate();
    }

    protected override onDispositionUpdated(event: Event): void {
        this.database?.close();
        this.database = undefined;
        super.onDispositionUpdated(event);
    }

    protected override async react(signal: Signal): Promise<void> {
        try {
            await this.route(signal);
        }
        catch (error) {
            this.handleError(signal, error);
        }
    }

    private async route(signal: Signal): Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.SET:
                await this.handleSet(signal);
                break;
            case SignalType.GET:
                await this.handleGet(signal);
                break;
            case SignalType.REMOVE:
                await this.handleRemove(signal);
                break;
            case SignalType.REMOVE_MANY:
                await this.handleRemoveMany(signal);
                break;
            case SignalType.CLEAR:
                await this.handleClear(signal);
                break;
            case SignalType.ENTRIES:
                await this.handleEntries(signal);
                break;
        }
    }

    private async handleSet(signal: Signal): Promise<void> {
        const { value, source } = signal;
        const { key, value: stored, targetId, ...context } = value as ItemPayload;
        await this.execute('readwrite', (store) => store.put(stored, key));
        this.pulse(SignalType.SAVED, { ...context, key, value: stored }, targetId ?? source);
    }

    private async handleGet(signal: Signal): Promise<void> {
        const {
            value,
            source,
            sessionId,
        } = signal;
        const { key, targetId, ...context } = value as KeyPayload;
        const stored = await this.execute('readonly', (store) => store.get(key));
        this.pulse(SignalType.RETRIEVED, { ...context, key, value: stored ?? null }, targetId ?? source);
    }

    private async handleRemove(signal: Signal): Promise<void> {
        const { value, source } = signal;
        const { key, targetId, ...context } = value as KeyPayload;
        await this.execute('readwrite', (store) => store.delete(key));
        this.pulse(SignalType.REMOVED, { ...context, key }, targetId ?? source);
    }

    private async handleRemoveMany(signal: Signal): Promise<void> {
        const { value, source } = signal;
        const { keys, targetId, ...context } = value as KeysPayload;
        await this.executeMany(keys);
        this.pulse(SignalType.REMOVED, { ...context, keys }, targetId ?? source);
    }

    private async handleClear(signal: Signal): Promise<void> {
        const { value, source } = signal;
        const { targetId, ...context } = (value ?? {}) as KeyPayload;
        await this.execute('readwrite', (store) => store.clear());
        this.pulse(SignalType.CLEARED, context, targetId ?? source);
    }

    private async handleEntries(signal: Signal): Promise<void> {
        const { value, source } = signal;
        const { targetId, ...context } = (value ?? {}) as KeyPayload;
        const entries = await this.readEntries();
        this.pulse(SignalType.LISTED, { ...context, entries }, targetId ?? source);
    }

    private async execute(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest): Promise<unknown> {
        const database = await this.resolveDatabase();
        const storeName = this.resolveStoreName();
        const transaction = database.transaction(storeName, mode);
        const completion = this.resolveTransaction(transaction);
        const result = await this.resolveRequest(operation(transaction.objectStore(storeName)));
        await completion;
        return result;
    }

    private async executeMany(keys: readonly string[]): Promise<void> {
        const database = await this.resolveDatabase();
        const storeName = this.resolveStoreName();
        const transaction = database.transaction(storeName, 'readwrite');
        const completion = this.resolveTransaction(transaction);
        keys.forEach((key) => transaction.objectStore(storeName).delete(key));
        await completion;
    }

    private async readEntries(): Promise<Entry[]> {
        const database = await this.resolveDatabase();
        const storeName = this.resolveStoreName();
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const [keys, values] = await Promise.all([
            this.resolveRequest<IDBValidKey[]>(store.getAllKeys()),
            this.resolveRequest<unknown[]>(store.getAll()),
        ]);
        return keys.map((key, index) => ({ key: String(key), value: values[index] }));
    }

    private async resolveDatabase(): Promise<IDBDatabase> {
        if (this.database) {
            return this.database;
        }
        if (typeof indexedDB === 'undefined') {
            throw new Error(MISSING_DATABASE);
        }
        this.database = await this.openDatabase();
        return this.database;
    }

    private openDatabase(): Promise<IDBDatabase> {
        const { aim } = this.disposition;
        const { databaseName = DEFAULT_DATABASE_NAME, version = DEFAULT_VERSION } = aim.body ?? {};
        const request = indexedDB.open(databaseName, version);
        request.onupgradeneeded = () => this.createStore(request.result);
        return this.resolveRequest(request);
    }

    private createStore(database: IDBDatabase): void {
        const storeName = this.resolveStoreName();
        if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName);
        }
    }

    private resolveStoreName(): string {
        const { aim } = this.disposition;
        const { storeName = DEFAULT_STORE_NAME } = aim.body ?? {};
        return storeName;
    }

    private resolveRequest<T = unknown>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private resolveTransaction(transaction: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }

    private handleError(signal: Signal, error: unknown): void {
        const { value, source, property } = signal;
        const { targetId, ...context } = (value ?? {}) as KeyPayload;
        this.pulse(SignalType.ERROR, { ...context, operation: property, error }, targetId ?? source);
    }
}
