import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { Scaffold } from '@uca/scaffold';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import type { Node as ScaffoldNode } from '@uca/scaffold/schema';
import { ThemeCss } from '@uca/theme-css';
import { BASE_THEME_RULES } from '@uca/theme-css/constants';
import { SignalType as ThemeCssSignalType, type ThemeResult } from '@uca/theme-css/types';
import { Composer } from '@uca/composer';
import {
    SignalType as ComposerSignalType,
    type ComposedResult,
    type TemplateNode,
} from '@uca/composer/types';
import { Box } from '@uca/box';
import { Action } from '@uca/action';
import { Input } from '@uca/input';
import { List } from '@uca/list';
import { Picture } from '@uca/picture';
import { Toggle } from '@uca/toggle';
import { Dropdown } from '@uca/dropdown';
import {
    __ID__,
    DEFAULT_CONTEXT,
    DEFAULT_MODEL,
    DEFAULT_THEME_MODEL,
    DEFAULT_PROVIDER,
    DEFAULT_PURPOSE,
    DEFAULT_SIGNALS,
} from './constants.js';
import { bodySchema } from './schema.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: { context: DEFAULT_CONTEXT } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.INIT, type: DataType.RECORD, schema: bodySchema, description: 'Initialize application' },
            { signal: SignalType.START, type: DataType.VOID, description: 'Start application' },
            { signal: SignalType.STOP, type: DataType.VOID, description: 'Stop application' },
            { signal: SignalType.TRIGGER, type: DataType.PAYLOAD, description: 'Action triggered input' },
            { signal: BrowserSignalType.DETECTED, type: DataType.RECORD, description: 'Browser client context detected' },
            { signal: BrowserSignalType.CHANGED, type: DataType.RECORD, description: 'Browser client context changed' },
            { signal: ScaffoldSignalType.STREAMED, type: DataType.PAYLOAD, description: 'Scaffold stream signal' },
            { signal: ScaffoldSignalType.CHUNK, type: DataType.PAYLOAD, description: 'Scaffold chunk signal' },
            { signal: ScaffoldSignalType.CREATED, type: DataType.PAYLOAD, description: 'Scaffold created signal' },
            { signal: ScaffoldSignalType.ERROR, type: DataType.PAYLOAD, description: 'Scaffold error signal' },
            { signal: ThemeCssSignalType.CREATED, type: DataType.PAYLOAD, description: 'Theme created signal' },
            { signal: ThemeCssSignalType.ERROR, type: DataType.PAYLOAD, description: 'Theme error signal' },
            { signal: CssSignalType.CREATED, type: DataType.PAYLOAD, description: 'Css rule created signal' },
            { signal: CssSignalType.ERROR, type: DataType.PAYLOAD, description: 'Css error signal' },
            { signal: ComposerSignalType.STREAMED, type: DataType.PAYLOAD, description: 'Composer streamed signal' },
            { signal: ComposerSignalType.COMPOSED, type: DataType.PAYLOAD, description: 'Composer composed signal' },
            { signal: ComposerSignalType.ERROR, type: DataType.PAYLOAD, description: 'Composer error signal' },
        ],
        outputs: [
            { signal: SignalType.STARTED, type: DataType.RESULT, description: 'Application started' },
            { signal: SignalType.STOPPED, type: DataType.RESULT, description: 'Application stopped' },
            { signal: SignalType.CONTEXT, type: DataType.RECORD, description: 'Client browser context emitted' },
            { signal: SignalType.CHUNK, type: DataType.RESULT, description: 'Application scaffold chunk' },
            { signal: SignalType.CREATED, type: DataType.RESULT, description: 'Application scaffold created' },
            { signal: SignalType.THEME_CREATED, type: DataType.RESULT, description: 'Application theme created' },
            { signal: SignalType.COMPOSED, type: DataType.RESULT, description: 'Application node composed and mounted' },
            { signal: SignalType.ERROR, type: DataType.RESULT, description: 'Application error' },
            { signal: ScaffoldSignalType.STREAM, type: DataType.PAYLOAD, description: 'Trigger scaffold stream' },
            { signal: ThemeCssSignalType.CREATE, type: DataType.PAYLOAD, description: 'Trigger theme creation' },
            { signal: CssSignalType.CREATE, type: DataType.PAYLOAD, description: 'Create CSS rule' },
            { signal: ComposerSignalType.STREAM, type: DataType.PAYLOAD, description: 'Forward stream to composer' },
            { signal: ComposerSignalType.COMPOSE, type: DataType.PAYLOAD, description: 'Trigger UCA composition' },
            { signal: BrowserSignalType.READ, type: DataType.VOID, description: 'Trigger browser context capture' },
        ],
    };

    private isThemeReady: boolean = false;
    private isStreamActive: boolean = false;
    private themeGateResolvers: (() => void)[] = [];
    private pendingChunks: unknown[] = [];
    private pendingScaffold: unknown = undefined;
    private themeClasses: string[] = [];
    private ucaContexts: Map<string, string> = new Map();
    private activeUcas: Map<string, Uca<unknown>> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.START: this.handleStart(value); break;
            case SignalType.TRIGGER: this.handleTrigger(value); break;
            case SignalType.STOP: this.handleStop(); break;
            case BrowserSignalType.DETECTED: this.handleBrowserDetected(value); break;
            case BrowserSignalType.CHANGED: this.handleBrowserChanged(value); break;
            case ScaffoldSignalType.STREAMED: this.handleScaffoldStreamed(value); break;
            case ScaffoldSignalType.CHUNK: this.handleScaffoldChunk(value); break;
            case ScaffoldSignalType.CREATED: this.handleScaffoldCreated(value); break;
            case ScaffoldSignalType.ERROR: this.handleScaffoldError(value); break;
            case ThemeCssSignalType.CREATED: this.handleThemeCreated(value); break;
            case ThemeCssSignalType.ERROR: this.handleThemeError(value); break;
            case CssSignalType.CREATED: this.handleCssCreated(value); break;
            case CssSignalType.ERROR: this.handleCssError(value); break;
            case ComposerSignalType.STREAMED: this.handleComposerStreamed(value); break;
            case ComposerSignalType.COMPOSED: this.handleComposerComposed(value); break;
            case ComposerSignalType.ERROR: this.handleComposerError(value); break;
            default: break;
        }
    }

    protected override capabilities(): Cooky {
        const browser = this.createBrowserCapability();
        const scaffold = this.createScaffoldCapability();
        const theme = this.createThemeCapability();
        const css = this.createCssCapability();
        const composer = this.createComposerCapability();
        return [...browser, ...scaffold, ...theme, ...css, ...composer];
    }

    private handleStart(value?: unknown): void {
        const payload = (value ?? {}) as Body;
        this.isThemeReady = false;
        this.isStreamActive = false;
        this.themeGateResolvers = [];
        this.ucaContexts.set(this.id, this.context ?? this.purpose);
        this.pulse(SignalType.STARTED, { id: this.id, started: true, ...payload });
        this.pulse(BrowserSignalType.READ, { id: `${this.id}:browser` });
        this.injectBaseTheme();
        this.dispatchScaffold();
        this.dispatchTheme();
    }

    private injectBaseTheme(): void {
        BASE_THEME_RULES.forEach((rule) => this.pulse(CssSignalType.CREATE, rule));
    }

    private handleTrigger(value?: unknown): void {
        const { request } = (value ?? {}) as { request?: string };
        this.isThemeReady = false;
        this.isStreamActive = false;
        this.themeGateResolvers = [];
        this.pendingChunks = [];
        this.pendingScaffold = undefined;
        this.ucaContexts.set(this.id, this.context ?? this.purpose);
        this.dispatchScaffold(request);
        this.dispatchTheme(request);
    }

    private dispatchScaffold(requestText?: string): void {
        const request = requestText ?? this.purpose;
        const context = this.context ?? DEFAULT_CONTEXT;
        const correlationId = `${this.id}:scaffold:${Date.now()}`;
        const payload = { id: `${this.id}:scaffold`, request, context, parentTo: this.id, model: DEFAULT_MODEL, provider: DEFAULT_PROVIDER, correlationId };
        this.pulse(ScaffoldSignalType.STREAM, payload);
    }

    private dispatchTheme(requestText?: string): void {
        const request = requestText ?? this.purpose;
        const context = this.context ?? DEFAULT_CONTEXT;
        const correlationId = `${this.id}:theme-css:${Date.now()}`;
        const payload = { id: `${this.id}:theme-css`, request, context, model: DEFAULT_THEME_MODEL, provider: DEFAULT_PROVIDER, correlationId };
        this.pulse(ThemeCssSignalType.CREATE, payload);
    }

    private handleScaffoldStreamed(value: unknown): void {
        const { stream, correlationId } = (value ?? {}) as { stream?: ReadableStream<unknown>; correlationId?: string };
        if (!stream) { return; }
        this.isStreamActive = true;
        const parentContext = this.context ?? this.purpose;
        const payload = { stream, parentContext, themeClasses: this.themeClasses, correlationId };
        this.pulse(ComposerSignalType.STREAM, payload);
    }

    private handleComposerStreamed(value: unknown): void {
        const { stream } = (value ?? {}) as { stream?: ReadableStream<ComposedResult> };
        if (!stream) { return; }
        void this.consumeComposedStream(stream);
    }

    private async consumeComposedStream(stream: ReadableStream<ComposedResult>): Promise<void> {
        const reader = stream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            await this.waitForThemeGate();
            this.handleComposerComposed(value);
        }
    }

    private async waitForThemeGate(): Promise<void> {
        if (this.isThemeReady) { return; }
        await new Promise<void>((resolve) => {
            this.themeGateResolvers.push(resolve);
        });
    }

    private handleThemeCreated(value: unknown): void {
        const { rules = [] } = (value ?? {}) as ThemeResult;
        console.log(`🎨 [App:Theme-Created] Aplicando ${rules.length} reglas CSS`);
        this.themeClasses = rules.map((rule) => rule.selector).filter((selector) => selector.startsWith('.'));
        rules.forEach((rule) => this.pulse(CssSignalType.CREATE, rule));
        this.isThemeReady = true;
        this.themeGateResolvers.forEach((resolve) => resolve());
        this.themeGateResolvers = [];
        this.pulse(SignalType.THEME_CREATED, value);
        this.flushPendingScaffold();
    }

    private flushPendingScaffold(): void {
        this.pendingChunks.forEach((chunk) => this.emitScaffoldChunk(chunk));
        this.pendingChunks = [];
        if (this.pendingScaffold) {
            this.emitScaffoldCreated(this.pendingScaffold);
            this.pendingScaffold = undefined;
        }
    }

    private handleThemeError(value: unknown): void {
        console.error('🚨 [App:Theme-Error]', value);
        this.pulse(SignalType.ERROR, value);
    }

    private handleCssCreated(value: unknown): void {
        const { selector } = (value ?? {}) as { selector?: string };
        console.log(`🖌️ [App:Css-Rule-Created] Regla CSS inyectada: ${selector}`);
    }

    private handleCssError(value: unknown): void {
        console.error('🚨 [App:Css-Error]', value);
    }

    private handleStop(): void {
        this.pulse(SignalType.STOPPED, { id: this.id, started: false });
    }

    private handleBrowserDetected(value: unknown): void {
        this.pulse(SignalType.CONTEXT, { id: this.id, context: value });
    }

    private handleBrowserChanged(value: unknown): void {
        this.pulse(SignalType.CONTEXT, { id: this.id, context: value, updated: true });
    }

    private handleScaffoldChunk(value: unknown): void {
        if (!this.isThemeReady) {
            this.pendingChunks.push(value);
            return;
        }
        this.emitScaffoldChunk(value);
    }

    private emitScaffoldChunk(value: unknown): void {
        const { chunk } = (value ?? {}) as { chunk?: Record<string, ScaffoldNode> };
        console.log('🧩 [App:Scaffold-Chunk]', JSON.stringify(chunk ?? value, null, 2));
        if (chunk && typeof chunk === 'object' && !this.isStreamActive) {
            this.composeChunkNodes(chunk);
        }
        this.pulse(SignalType.CHUNK, value);
    }

    private composeChunkNodes(chunk: Record<string, ScaffoldNode>): void {
        for (const [ucaName, ucaDef] of Object.entries(chunk)) {
            this.dispatchComposeUca(ucaName, ucaDef);
        }
    }

    private dispatchComposeUca(ucaName: string, ucaDef: ScaffoldNode): void {
        const { purpose = ucaName, parentTo = this.id } = ucaDef ?? {};
        const parentId = parentTo || this.id;
        const parentContext = this.ucaContexts.get(parentId) ?? this.context ?? this.purpose;
        this.ucaContexts.set(ucaName, purpose);
        const payload = { targetUca: ucaName, purpose, parentTo: parentId, parentContext, themeClasses: this.themeClasses };
        this.pulse(ComposerSignalType.COMPOSE, payload);
    }

    private handleComposerComposed(value: unknown): void {
        const { targetUca, nodes = [] } = (value ?? {}) as ComposedResult;
        console.log(`🏗️ [App:Composer-Composed] Montando ${nodes.length} nodos para #${targetUca}`);
        nodes.forEach((node) => this.mountComposedNode(node));
        this.pulse(SignalType.COMPOSED, value);
    }

    private mountComposedNode(node: TemplateNode): void {
        const { id, uca, parentTo, body = {}, purpose = '' } = node;
        const instance = this.createWebUca(uca, id);
        if (!instance) { return; }
        this.ucaContexts.set(id, purpose);
        const aim = { description: purpose, body };
        const disposition = { aim, parentTo: { uca: parentTo, relation: 'child' } };
        instance.innervate(this.target, disposition);
        this.activeUcas.set(id, instance);
    }

    private createWebUca(uca: string, id: string): Uca<unknown> | undefined {
        switch (uca) {
            case 'box': return new Box(id);
            case 'action': return new Action(id);
            case 'input': return new Input(id);
            case 'list': return new List(id);
            case 'picture': return new Picture(id);
            case 'toggle': return new Toggle(id);
            case 'dropdown': return new Dropdown(id);
            default: return undefined;
        }
    }

    private handleComposerError(value: unknown): void {
        console.error('🚨 [App:Composer-Error]', value);
        this.pulse(SignalType.ERROR, value);
    }

    private handleScaffoldCreated(value: unknown): void {
        if (!this.isThemeReady) {
            this.pendingScaffold = value;
            return;
        }
        this.emitScaffoldCreated(value);
    }

    private emitScaffoldCreated(value: unknown): void {
        const { scaffold } = (value ?? {}) as { scaffold?: unknown };
        console.log('🏛️ [App:Scaffold-Created]', JSON.stringify(scaffold ?? value, null, 2));
        this.pulse(SignalType.CREATED, value);
    }

    private handleScaffoldError(value: unknown): void {
        console.error('🚨 [App:Scaffold-Error]', value);
        this.pulse(SignalType.ERROR, value);
    }

    private createBrowserCapability(): Cooky {
        const { reactTo = [] } = Browser.disposition;
        const aim = { description: Browser.AIM, body: { id: `${this.id}:browser` } };
        return [[Browser, { aim, reactTo: [...reactTo] }]];
    }

    private createScaffoldCapability(): Cooky {
        const { reactTo = [] } = Scaffold.disposition;
        const body = { id: `${this.id}:scaffold`, model: DEFAULT_MODEL, provider: DEFAULT_PROVIDER };
        const aim = { description: 'Scaffolding for App', body };
        return [[Scaffold, { aim, reactTo: [...reactTo] }]];
    }

    private createThemeCapability(): Cooky {
        const { reactTo = [] } = ThemeCss.disposition;
        const body = { id: `${this.id}:theme-css`, model: DEFAULT_THEME_MODEL, provider: DEFAULT_PROVIDER };
        const aim = { description: 'Theme generation for App', body };
        return [[ThemeCss, { aim, reactTo: [...reactTo] }]];
    }

    private createCssCapability(): Cooky {
        const { reactTo = [] } = Css.disposition;
        const body = { id: `${this.id}:css` };
        const aim = { description: 'CSS styling capability for App', body };
        return [[Css, { aim, reactTo: [...reactTo] }]];
    }

    private createComposerCapability(): Cooky {
        const { reactTo = [] } = Composer.disposition;
        const body = { id: `${this.id}:composer` };
        const aim = { description: 'Composer for emergent scaffold UCAs', body };
        return [[Composer, { aim, reactTo: [...reactTo] }]];
    }
}
