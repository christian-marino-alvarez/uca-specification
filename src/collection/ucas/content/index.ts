import { LocalStorage } from '@uca/capability-local-storage';
import { SignalType as LocalStorageSignalType } from '@uca/capability-local-storage/types';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Scaffold } from '@uca/scaffold';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import {
    __ID__,
    DEFAULT_GOAL,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type CreatePayload,
    type StreamPayload,
    DataType,
    SignalType,
} from './types.js';

export class Content extends Uca<Body> {
    public static override purpose: string =
        'Articulate, demonstrate, and deliver the core value proposition and interactive cognitive narrative, guiding the visitor through the essential concepts and capabilities of the system';

    public static override disposition: Disposition<Body> = {
        aim: { description: Content.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.PAYLOAD, description: 'Request content layout scaffolding generation' },
            { signal: SignalType.STREAM, type: DataType.PAYLOAD, description: 'Request streaming content layout scaffolding generation' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel active content scaffolding reasoning' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RESULT, description: 'Complete content scaffolding layout' },
            { signal: SignalType.STREAMED, type: DataType.STREAM, description: 'ReadableStream of content layout item chunks' },
            { signal: SignalType.CHUNK, type: DataType.RESULT, description: 'Individual content layout chunk' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Content scaffolding generation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(value);
                break;
            case SignalType.STREAM:
                this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            case LocalStorageSignalType.RETRIEVED:
                this.handleRetrieved(value);
                break;
            case ScaffoldSignalType.CHUNK:
                this.handleScaffoldChunk(value);
                break;
            case ScaffoldSignalType.STREAMED:
                this.handleScaffoldStreamed(value);
                break;
            case ScaffoldSignalType.CREATED:
                this.handleScaffoldCreated(value);
                break;
            case ScaffoldSignalType.ERROR:
                this.handleScaffoldError(value);
                break;
            default:
                break;
        }
    }

    protected override capabilities(): Cooky {
        const { reactTo: scaffoldReactTo = [] } = Scaffold.disposition;
        const { reactTo: storageReactTo = [] } = LocalStorage.disposition;
        const scaffoldAim = { description: 'Scaffolding for Content', body: { id: `${this.id}:scaffold` } };
        const storageAim = { description: 'Storage for Content', body: { id: `${this.id}:storage`, ownerId: this.id, prefix: 'uca:' } };
        const scaffoldItem: Cooky[number] = [Scaffold, { aim: scaffoldAim, reactTo: [...scaffoldReactTo] }];
        const storageItem: Cooky[number] = [LocalStorage, { aim: storageAim, reactTo: [...storageReactTo] }];
        return [scaffoldItem, storageItem];
    }

    private resolveContext(context?: string): string {
        if (context) { return context; }
        return this.context ? `${this.context} | Section: ${Content.purpose}` : Content.purpose;
    }

    private handleCreate(value: unknown): void {
        const { request = DEFAULT_GOAL, correlationId = `${this.id}:create:${Date.now()}`, forceRefresh, context, parentTo = this.id, ...rest } = (value ?? {}) as CreatePayload;
        const payload = { ...rest, id: `${this.id}:scaffold`, request, context: this.resolveContext(context), parentTo, correlationId };
        if (forceRefresh) {
            this.pulse(ScaffoldSignalType.CREATE, payload);
            return;
        }
        this.pulse(LocalStorageSignalType.GET, { id: `${this.id}:storage`, targetId: this.id, key: this.id, action: 'create', payload });
    }

    private handleStream(value: unknown): void {
        const { request = DEFAULT_GOAL, correlationId = `${this.id}:stream:${Date.now()}`, forceRefresh, context, parentTo = this.id, ...rest } = (value ?? {}) as StreamPayload;
        const payload = { ...rest, id: `${this.id}:scaffold`, request, context: this.resolveContext(context), parentTo, correlationId };
        if (forceRefresh) {
            this.pulse(ScaffoldSignalType.STREAM, payload);
            return;
        }
        this.pulse(LocalStorageSignalType.GET, { id: `${this.id}:storage`, targetId: this.id, key: this.id, action: 'stream', payload });
    }

    private handleRetrieved(value: unknown): void {
        const { key, value: raw, action, payload } = (value ?? {}) as { key?: string; value?: string | null; action?: string; payload?: CreatePayload };
        const { correlationId } = payload ?? {};
        if (key !== this.id) { return; }
        if (raw) {
            this.restoreCachedScaffold(raw, correlationId);
            return;
        }
        this.dispatchScaffold(action, payload);
    }

    private restoreCachedScaffold(raw: string, correlationId?: string): void {
        try {
            const scaffold = JSON.parse(raw);
            const resolvedCorrelationId = correlationId ?? `${this.id}:cache:${Date.now()}`;
            this.pulse(SignalType.CREATED, { correlationId: resolvedCorrelationId, scaffold });
        } catch {
            this.pulse(LocalStorageSignalType.REMOVE, { id: `${this.id}:storage`, key: this.id });
        }
    }

    private dispatchScaffold(action?: string, payload?: CreatePayload): void {
        const { correlationId } = payload ?? {};
        const signal = action === 'create' ? ScaffoldSignalType.CREATE : ScaffoldSignalType.STREAM;
        const resolvedCorrelationId = correlationId ?? `${this.id}:${action ?? 'stream'}:${Date.now()}`;
        this.pulse(signal, { ...(payload ?? {}), id: `${this.id}:scaffold`, correlationId: resolvedCorrelationId });
    }

    private handleDestroy(): void {
        this.pulse(ScaffoldSignalType.DESTROY, { id: `${this.id}:scaffold` });
    }

    private handleScaffoldChunk(value: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        this.pulse(SignalType.CHUNK, value);
    }

    private handleScaffoldStreamed(value: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        this.pulse(SignalType.STREAMED, value);
    }

    private handleScaffoldCreated(value: unknown): void {
        const { correlationId, scaffold } = (value ?? {}) as { correlationId?: string; scaffold?: Record<string, unknown> };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        if (scaffold && Object.keys(scaffold).length > 0) {
            this.pulse(LocalStorageSignalType.SET, { id: `${this.id}:storage`, key: this.id, value: JSON.stringify(scaffold) });
        }
        this.pulse(SignalType.CREATED, value);
    }

    private handleScaffoldError(value: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        this.pulse(SignalType.ERROR, value);
    }
}
