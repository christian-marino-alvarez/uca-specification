import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_PREFIX,
    DEFAULT_STORAGE,
    __ID__,
} from './constants.js';
import {
    bodySchema,
    memoryPayloadSchema,
    memoryQuerySchema,
    memoryResultSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    StorageType,
    type Body,
    type MemoryEntry,
    type MemoryPayload,
    type MemoryQuery,
} from './types.js';

export class Memory extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Memory.AIM,
            body: {
                prefix: DEFAULT_PREFIX,
                storage: DEFAULT_STORAGE,
            },
        },
        reactTo: [
            SignalType.GET,
            SignalType.SET,
            SignalType.CLEAR,
        ],
        inputs: [
            {
                signal: SignalType.GET,
                type: DataType.QUERY,
                schema: memoryQuerySchema,
                description: 'Retrieve stored entries by keys array from configured storage',
            },
            {
                signal: SignalType.SET,
                type: DataType.PAYLOAD,
                schema: memoryPayloadSchema,
                description: 'Persist key-value entries array into configured storage',
            },
            {
                signal: SignalType.CLEAR,
                type: DataType.VOID,
                description: 'Clear all entries from configured storage',
            },
        ],
        outputs: [
            {
                signal: SignalType.RETRIEVED,
                type: DataType.RESULT,
                schema: memoryResultSchema,
                description: 'Emitted when entries are retrieved from storage',
            },
            {
                signal: SignalType.SAVED,
                type: DataType.RESULT,
                schema: memoryResultSchema,
                description: 'Emitted when entries are saved in storage',
            },
            {
                signal: SignalType.CLEARED,
                type: DataType.VOID,
                description: 'Emitted when storage is cleared',
            },
        ],
    };

    private readonly memoryFallback: Map<string, string> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.GET:
                this.handleGet(signal);
                break;
            case SignalType.SET:
                this.handleSet(signal);
                break;
            case SignalType.CLEAR:
                this.handleClear(signal);
                break;
            default:
                break;
        }
    }

    private handleGet(signal: Signal): void {
        const query = this.extractPayload<MemoryQuery>(signal.value);
        const {
            keys = [],
        } = query ?? {};
        keys.forEach((key) => {
            const value = this.readParsedValue(key);
            this.pulse(SignalType.RETRIEVED, value);
        });
    }

    private handleSet(signal: Signal): void {
        const payload = this.extractPayload<MemoryPayload>(signal.value);
        const {
            entries = [],
        } = payload ?? {};
        entries.forEach((entry) => {
            const { key, value } = entry;
            this.writeStorage(key, JSON.stringify(value));
            this.pulse(SignalType.SAVED, entry);
        });
    }

    private handleClear(_signal: Signal): void {
        const storage = this.resolveStorage();
        if (storage) {
            storage.clear();
        }
        this.memoryFallback.clear();
        this.pulse(SignalType.CLEARED, {});
    }

    private readParsedValue(key: string): unknown {
        const raw = this.readStorage(key);
        return raw ? JSON.parse(raw) : null;
    }

    private resolveStorage(): Storage | null {
        if (typeof window === 'undefined') {
            return null;
        }
        const {
            aim,
        } = this.disposition;
        const {
            storage = DEFAULT_STORAGE,
        } = aim.body ?? {};
        return storage === StorageType.LOCAL_STORAGE
            ? window.localStorage
            : window.sessionStorage;
    }

    private readStorage(key: string): string | null {
        const storage = this.resolveStorage();
        return storage ? storage.getItem(key) : (this.memoryFallback.get(key) ?? null);
    }

    private writeStorage(key: string, value: string): void {
        const storage = this.resolveStorage();
        if (storage) {
            storage.setItem(key, value);
            return;
        }
        this.memoryFallback.set(key, value);
    }
}
