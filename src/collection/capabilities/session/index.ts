import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_MEMORY_KEY,
    DEFAULT_STORAGE,
    __ID__,
} from './constants.js';
import {
    sessionPayloadSchema,
    sessionRequestSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type Session as SessionEntity,
    type SessionPayload,
    type SessionRequest,
} from './types.js';

export class Session extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Session.AIM,
            body: {
                defaultStorage: DEFAULT_STORAGE,
                memoryKey: DEFAULT_MEMORY_KEY,
            },
        },
        reactTo: [
            SignalType.GET,
            SignalType.CREATE,
            SignalType.DESTROY,
        ],
        inputs: [
            {
                signal: SignalType.GET,
                type: DataType.SESSION_REQUEST,
                schema: sessionRequestSchema,
                description: 'Query active session from storage',
            },
            {
                signal: SignalType.CREATE,
                type: DataType.SESSION_REQUEST,
                schema: sessionRequestSchema,
                description: 'Create and persist new session in storage',
            },
            {
                signal: SignalType.DESTROY,
                type: DataType.SESSION_REQUEST,
                schema: sessionRequestSchema,
                description: 'Destroy session and remove from storage',
            },
        ],
        outputs: [
            {
                signal: SignalType.RETRIEVED,
                type: DataType.SESSION_PAYLOAD,
                schema: sessionPayloadSchema,
                description: 'Session retrieved from storage',
            },
            {
                signal: SignalType.CREATED,
                type: DataType.SESSION_PAYLOAD,
                schema: sessionPayloadSchema,
                description: 'Session created and persisted in storage',
            },
            {
                signal: SignalType.DELETED,
                type: DataType.SESSION_PAYLOAD,
                schema: sessionPayloadSchema,
                description: 'Session deleted from storage',
            },
        ],
    };

    private readonly memoryFallback: Map<string, SessionEntity> = new Map();

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
            case SignalType.CREATE:
                this.handleCreate(signal);
                break;
            case SignalType.DESTROY:
                this.handleDestroy(signal);
                break;
            default:
                break;
        }
    }

    private handleGet(signal: Signal): void {
        const key = this.resolveKey();
        const stored = this.readStorage(key);
        const activeId = stored?.id ?? signal.sessionId;
        const payload: SessionPayload = {
            sessionId: activeId ?? '',
            timestamp: Date.now(),
            value: stored,
        };
        this.pulse(SignalType.RETRIEVED, payload, undefined, activeId);
    }

    private handleCreate(signal: Signal): void {
        const {
            value,
            sessionId,
        } = signal;
        const request = (value ?? {}) as SessionRequest;
        const timestamp = request.timestamp ?? Date.now();
        const activeId = sessionId ?? request.sessionId ?? `session-${timestamp}`;
        const sessionEntity = this.resolveSessionEntity(activeId, timestamp, request);
        this.writeStorage(this.resolveKey(), sessionEntity);
        const payload: SessionPayload = {
            sessionId: activeId,
            timestamp,
            value: sessionEntity,
        };
        this.pulse(SignalType.CREATED, payload, undefined, activeId);
    }

    private handleDestroy(signal: Signal): void {
        const {
            value,
            sessionId,
        } = signal;
        const request = (value ?? {}) as SessionRequest;
        const activeId = sessionId ?? request.sessionId;
        this.removeStorage(this.resolveKey());
        const payload: SessionPayload = {
            sessionId: activeId,
            timestamp: Date.now(),
            value: null,
        };
        this.pulse(SignalType.DELETED, payload, undefined, activeId);
    }

    private resolveKey(): string {
        const {
            memoryKey = DEFAULT_MEMORY_KEY,
        } = this.disposition.aim.body ?? {};
        return memoryKey;
    }

    private resolveSessionEntity(id: string, createdAt: number, request: SessionRequest): SessionEntity {
        const {
            storage = DEFAULT_STORAGE,
            value,
        } = request;
        return value ?? {
            id,
            createdAt,
            deletedAt: null,
            storage,
        };
    }

    private readStorage(key: string): SessionEntity | null {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const raw = window.sessionStorage.getItem(key);
            return raw ? (JSON.parse(raw) as SessionEntity) : null;
        }
        return this.memoryFallback.get(key) ?? null;
    }

    private writeStorage(key: string, entity: SessionEntity): void {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem(key, JSON.stringify(entity));
            return;
        }
        this.memoryFallback.set(key, entity);
    }

    private removeStorage(key: string): void {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem(key);
            return;
        }
        this.memoryFallback.delete(key);
    }
}
