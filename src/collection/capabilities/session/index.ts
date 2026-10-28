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
  sessionRequestSchema,
  sessionSchema,
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
        description: 'Consultar la sesión activa desde el almacenamiento',
      },
      {
        signal: SignalType.CREATE,
        type: DataType.SESSION_REQUEST,
        schema: sessionRequestSchema,
        description: 'Crear y persistir una nueva sesión en el almacenamiento',
      },
      {
        signal: SignalType.DESTROY,
        type: DataType.SESSION_REQUEST,
        schema: sessionRequestSchema,
        description: 'Destruir la sesión y eliminarla del almacenamiento',
      },
    ],
    outputs: [
      {
        signal: SignalType.RETRIEVED,
        type: DataType.SESSION,
        schema: sessionSchema.nullable(),
        description: 'Sesión recuperada desde el almacenamiento',
      },
      {
        signal: SignalType.CREATED,
        type: DataType.SESSION,
        schema: sessionSchema,
        description: 'Sesión creada y persistida en el almacenamiento',
      },
      {
        signal: SignalType.DELETED,
        type: DataType.SESSION,
        schema: sessionSchema.nullable(),
        description: 'Sesión eliminada del almacenamiento',
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
    this.currentSignal = {
      ...signal,
      sessionId: activeId,
    };
    this.pulse(SignalType.RETRIEVED, stored);
  }

  private handleCreate(signal: Signal): void {
    const activeId = this.resolveCreateSessionId(signal);
    const entity = this.persistCreatedSession(signal, activeId);
    this.currentSignal = {
      ...signal,
      sessionId: activeId,
    };
    this.pulse(SignalType.CREATED, entity);
  }

  private resolveCreateSessionId(signal: Signal): string {
    const {
      sessionId,
      value,
    } = signal;
    const request = (value ?? {}) as SessionRequest;
    return sessionId ?? request.sessionId ?? `session-${Date.now()}`;
  }

  private persistCreatedSession(signal: Signal, activeId: string): SessionEntity {
    const request = (signal.value ?? {}) as SessionRequest;
    const timestamp = request.timestamp ?? Date.now();
    const entity = this.resolveSessionEntity(activeId, timestamp, request);
    this.writeStorage(this.resolveKey(), entity);
    return entity;
  }

  private handleDestroy(signal: Signal): void {
    const activeId = signal.sessionId ?? (signal.value as SessionRequest)?.sessionId;
    this.removeStorage(this.resolveKey());
    this.currentSignal = {
      ...signal,
      sessionId: activeId,
    };
    this.pulse(SignalType.DELETED, null);
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
