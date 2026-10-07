import { LocalStorage } from '@uca/capability-local-storage';
import { SignalType as LocalStorageSignalType } from '@uca/capability-local-storage/types';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Scaffold } from '@uca/scaffold';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { WebComponent } from '@uca/capability-web-component';
import { Box } from '@uca/box';
import { Action } from '@uca/action';
import { Input } from '@uca/input';
import { Picture } from '@uca/picture';
import { Toggle } from '@uca/toggle';
import { Choice } from '@uca/choice';
import { Dropdown } from '@uca/dropdown';
import { List } from '@uca/list';
import { Contains } from '@uca/capability-contains';
import { Equal } from '@uca/capability-equal';
import { GreaterThan } from '@uca/capability-greater-than';
import { LessThan } from '@uca/capability-less-than';
import { Divide } from '@uca/capability-divide';
import { Multiply } from '@uca/capability-multiply';
import { Loop } from '@uca/capability-loop';
import {
    __ID__,
    DEFAULT_GOAL,
    DEFAULT_SIGNALS,
    CATEGORY_KEYWORDS,
} from './constants.js';
import {
    type Body,
    type CreatePayload,
    type StreamPayload,
    DataType,
    SignalType,
} from './types.js';

function detectCategory(key: string, purpose: string): string {
    const text = `${key} ${purpose}`.toLowerCase();
    for (const [kind, words] of CATEGORY_KEYWORDS) {
        if (words.some((word) => text.includes(word))) { return kind; }
    }
    return 'box';
}

function createLivingUca(kind: string, id: string): Uca {
    switch (kind) {
        case 'action': return new Action(id);
        case 'input': return new Input(id);
        case 'picture': return new Picture(id);
        case 'toggle': return new Toggle(id);
        case 'choice': return new Choice(id);
        case 'dropdown': return new Dropdown(id);
        case 'list': return new List(id);
        default: return new Box(id);
    }
}

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

    private readonly emergentUcas: Map<string, Uca> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        super.denervate();
        for (const instance of this.emergentUcas.values()) {
            instance.denervate();
        }
        this.emergentUcas.clear();
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
        const core = this.createCoreCapabilities();
        const web = this.createWebCapabilities();
        const logic = this.createLogicCapabilities();
        return [...core, ...web, ...logic];
    }

    private createCoreCapabilities(): Cooky {
        const { reactTo: scaffoldReactTo = [] } = Scaffold.disposition;
        const { reactTo: storageReactTo = [] } = LocalStorage.disposition;
        const { reactTo: webReactTo = [] } = WebComponent.disposition;
        const scaffoldAim = { description: 'Scaffolding for Content', body: { id: `${this.id}:scaffold` } };
        const storageAim = { description: 'Storage for Content', body: { id: `${this.id}:storage`, ownerId: this.id, prefix: 'uca:' } };
        const webAim = { description: 'Web Component for Content', body: { id: `${this.id}:web-component` } };
        const scaffoldItem: Cooky[number] = [Scaffold, { aim: scaffoldAim, reactTo: [...scaffoldReactTo] }];
        const storageItem: Cooky[number] = [LocalStorage, { aim: storageAim, reactTo: [...storageReactTo] }];
        const webItem: Cooky[number] = [WebComponent, { aim: webAim, reactTo: [...webReactTo] }];
        return [scaffoldItem, storageItem, webItem];
    }

    private createWebCapabilities(): Cooky {
        const webClasses = [Box, Action, Input, Picture, Toggle, Choice, Dropdown, List];
        return webClasses.map((UcaClass) => {
            const { purpose, disposition } = UcaClass;
            const { reactTo = [] } = disposition;
            const aim = { description: purpose, body: { id: `${this.id}:${UcaClass.name.toLowerCase()}` } };
            return [UcaClass, { aim, reactTo: [...reactTo] }] as Cooky[number];
        });
    }

    private createLogicCapabilities(): Cooky {
        const logicClasses = [Contains, Equal, GreaterThan, LessThan, Divide, Multiply, Loop];
        return logicClasses.map((CapabilityClass) => {
            const { AIM, disposition } = CapabilityClass as unknown as { AIM: string; disposition: Disposition };
            const { reactTo = [] } = disposition ?? {};
            const aim = { description: AIM, body: { id: `${this.id}:${CapabilityClass.name.toLowerCase()}` } };
            return [CapabilityClass, { aim, reactTo: [...reactTo] }] as Cooky[number];
        });
    }

    private handleCreate(value: unknown): void {
        const { request = DEFAULT_GOAL, correlationId = `${this.id}:create:${Date.now()}`, forceRefresh, context, parentTo = this.id, ...rest } = (value ?? {}) as CreatePayload;
        const payload = { ...rest, id: `${this.id}:scaffold`, request, ...(context && { context }), parentTo, correlationId };
        if (forceRefresh) {
            this.pulse(ScaffoldSignalType.CREATE, payload);
            return;
        }
        this.pulse(LocalStorageSignalType.GET, { id: `${this.id}:storage`, targetId: this.id, key: this.id, action: 'create', payload });
    }

    private handleStream(value: unknown): void {
        const { request = DEFAULT_GOAL, correlationId = `${this.id}:stream:${Date.now()}`, forceRefresh, context, parentTo = this.id, ...rest } = (value ?? {}) as StreamPayload;
        const payload = { ...rest, id: `${this.id}:scaffold`, request, ...(context && { context }), parentTo, correlationId };
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
            this.materializeEmergentNodes(scaffold);
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
        for (const instance of this.emergentUcas.values()) {
            instance.denervate();
        }
        this.emergentUcas.clear();
        this.pulse(ScaffoldSignalType.DESTROY, { id: `${this.id}:scaffold` });
    }

    private validateScaffold(scaffold?: Record<string, unknown>): Record<string, unknown> {
        if (!scaffold) { return {}; }
        const entries = Object.entries(scaffold).filter(([key, value]) => {
            const { parentTo } = (value ?? {}) as { parentTo?: string | null };
            return key !== this.id && parentTo === this.id;
        });
        return Object.fromEntries(entries);
    }

    private materializeEmergentNodes(nodes: Record<string, unknown>): void {
        for (const [key, node] of Object.entries(nodes)) {
            const { purpose = 'Visual component' } = (node ?? {}) as { purpose?: string };
            this.materializeNode(key, purpose);
        }
    }

    private materializeNode(key: string, purpose: string): void {
        const kind = detectCategory(key, purpose);
        const instance = this.emergentUcas.get(key) ?? createLivingUca(kind, key);
        this.emergentUcas.set(key, instance);
        const aim = { description: purpose, body: { id: key, text: purpose, label: key, placeholder: purpose } };
        const disposition: Disposition = { aim, parentTo: { uca: this.id, relation: 'contains' } };
        instance.innervate(this.target, disposition as never);
    }

    private handleScaffoldChunk(value: unknown): void {
        const { correlationId, chunk } = (value ?? {}) as { correlationId?: string; chunk?: Record<string, unknown> };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        const validChunk = this.validateScaffold(chunk);
        if (Object.keys(validChunk).length === 0) { return; }
        this.materializeEmergentNodes(validChunk);
        this.pulse(SignalType.CHUNK, { correlationId, chunk: validChunk });
    }

    private handleScaffoldStreamed(value: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        this.pulse(SignalType.STREAMED, value);
    }

    private handleScaffoldCreated(value: unknown): void {
        const { correlationId, scaffold } = (value ?? {}) as { correlationId?: string; scaffold?: Record<string, unknown> };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        const validScaffold = this.validateScaffold(scaffold);
        if (Object.keys(validScaffold).length === 0) { return; }
        this.materializeEmergentNodes(validScaffold);
        this.pulse(LocalStorageSignalType.SET, { id: `${this.id}:storage`, key: this.id, value: JSON.stringify(validScaffold) });
        this.pulse(SignalType.CREATED, { correlationId, scaffold: validScaffold });
    }

    private handleScaffoldError(value: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId && !correlationId.startsWith(this.id)) { return; }
        this.pulse(SignalType.ERROR, value);
    }
}
