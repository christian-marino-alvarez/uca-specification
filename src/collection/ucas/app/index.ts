import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Builder } from '@uca/builder';
import {
    SignalType as BuilderSignalType,
    type Area,
    type AreaCreated,
} from '@uca/builder/types';
import { Design } from '@uca/capability-design';
import { SignalType as DesignSignalType } from '@uca/capability-design/types';
import { Decision } from '@uca/decision';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type Aim,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type DispositionProvidePayload,
    type Signal,
} from '@uca/core/types';
import {
    AREA_DECISION_OPTIONS,
    DEFAULT_AIM_BODY,
    DEFAULT_AIM_DESCRIPTION,
    DEFAULT_DESIGN_GUIDELINES,
    DEFAULT_PURPOSE,
    ROOT_AREA_ID,
    __ID__,
} from './constants.js';
import {
    browserContextSchema,
    decisionResultSchema,
    navigationSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type DecisionResult,
    type Navigation,
} from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: DEFAULT_AIM_DESCRIPTION,
            body: {
                ...DEFAULT_AIM_BODY,
            },
        },
        reactTo: [
            SignalType.NAVIGATE,
            SignalType.SESSION_RESUME,
            SignalType.SESSION_FRESH,
            DispositionSignal.PROVIDE,
            ...App.reactToBrowser(),
            ...App.reactToNavigate(),
            ...App.reactToDesign(),
            ...App.reactToDecision(),
            ...App.reactToBuilder(),
            ...App.reactToMemory(),
        ],
        inputs: [
            {
                signal: SignalType.NAVIGATE,
                type: DataType.NAVIGATION,
                schema: navigationSchema,
                description: 'Navigate to target page with parameters',
            },
            {
                signal: SignalType.SESSION_RESUME,
                type: DataType.VOID,
                description: 'Resume previous session recovered from memory',
            },
            {
                signal: SignalType.SESSION_FRESH,
                type: DataType.VOID,
                description: 'Start fresh session discarding previous memory',
            },
        ],
        outputs: [
            {
                signal: SignalType.BROWSER_CHANGED,
                type: DataType.BROWSER_CONTEXT,
                schema: browserContextSchema,
                description: 'Browser context telemetry captured or updated',
            },
            {
                signal: SignalType.DECIDED,
                type: DataType.DECISION_RESULT,
                schema: decisionResultSchema,
                description: 'Cognitive page composition decision result',
            },
            {
                signal: SignalType.BUILT,
                type: DataType.BUILT_RESULT,
                description: 'Cognitive page structure built by builder UCA',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during app cognitive orchestration',
            },
        ],
    };

    private static reactToBrowser(): string[] {
        const {
            reactTo = [],
        } = Browser.disposition;
        return [
            ...reactTo,
            BrowserSignalType.DETECTED,
            BrowserSignalType.CHANGED,
        ];
    }

    private static reactToNavigate(): string[] {
        const {
            reactTo = [],
        } = Navigate.disposition;
        return [
            ...reactTo,
            NavigateSignalType.CHANGED,
            NavigateSignalType.RESTORED,
        ];
    }

    private static reactToDesign(): string[] {
        const {
            reactTo = [],
        } = Design.disposition;
        return [
            ...reactTo,
            DesignSignalType.THEME_CHANGED,
        ];
    }

    private static reactToDecision(): string[] {
        const {
            reactTo = [],
        } = Decision.disposition;
        return [
            ...reactTo,
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
        ];
    }

    private static reactToBuilder(): string[] {
        const {
            reactTo = [],
        } = Builder.disposition;
        return [
            ...reactTo,
            BuilderSignalType.BUILT,
            BuilderSignalType.AREA_CREATED,
            BuilderSignalType.ERROR,
        ];
    }

    private static reactToMemory(): string[] {
        const {
            reactTo = [],
        } = Memory.disposition;
        return [
            ...reactTo,
            MemorySignalType.RETRIEVED,
            MemorySignalType.SAVED,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        return [
            this.buildBrowserCooky(),
            this.buildNavigateCooky(),
            this.buildDesignCooky(),
            this.buildDecisionCooky(),
            this.buildBuilderCooky(),
            this.buildMemoryCooky(),
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.NAVIGATE:
                this.handleNavigate(signal);
                break;
            case SignalType.SESSION_RESUME:
                this.handleSessionResume();
                break;
            case SignalType.SESSION_FRESH:
                this.handleSessionFresh();
                break;
            case NavigateSignalType.CHANGED:
                this.handleNavigationChanged(signal);
                break;
            case NavigateSignalType.RESTORED:
                this.handleNavigationRestored(signal);
                break;
            case BrowserSignalType.DETECTED:
                this.handleBrowserDetected(signal);
                break;
            case BrowserSignalType.CHANGED:
                this.handleBrowserChanged(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            case BuilderSignalType.AREA_CREATED:
                this.handleBuilderAreaCreated(signal);
                break;
            case BuilderSignalType.BUILT:
                this.handleBuilderBuilt(signal);
                break;
            case BuilderSignalType.ERROR:
                this.handleBuilderError(signal);
                break;
            case DesignSignalType.THEME_CHANGED:
                this.handleThemeChanged(signal);
                break;
            case DispositionSignal.PROVIDE:
                this.handleDispositionProvide(signal);
                break;
            default:
                break;
        }
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
    }

    private buildBrowserCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Browser,
            this.createBrowserDisposition(`${id}:browser`),
        ];
    }

    private buildNavigateCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Navigate,
            this.createNavigateDisposition(`${id}:navigate`),
        ];
    }

    private buildDesignCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Design,
            this.createDesignDisposition(`${id}:design`),
        ];
    }

    private buildDecisionCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Decision,
            this.createDecisionDisposition(`${id}:decision`),
        ];
    }

    private createBuilderDisposition(): Disposition {
        const { aim } = Builder.disposition;
        const body = { ...(aim.body ?? {}), containerElement: '#app' };
        return { ...Builder.disposition, aim: { ...aim, body } };
    }

    private buildBuilderCooky(): [CapabilityConstructor, Disposition] {
        const { id } = this;
        const disposition = this.createBuilderDisposition();
        return this.buildUcaCooky(Builder, Builder.purpose, `${id}:builder`, disposition);
    }

    private buildMemoryCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Memory, Memory.purpose, `${id}:memory`, Memory.disposition);
    }

    private buildUcaCooky(
        Factory: CapabilityConstructor,
        purpose: string,
        instanceId: string,
        defaults: Disposition,
    ): [CapabilityConstructor, Disposition] {
        const {
            aim: defaultAim,
        } = defaults;
        const aim = {
            ...defaultAim,
            description: purpose,
            body: {
                ...(defaultAim.body as Record<string, unknown>),
                id: instanceId,
            },
        };
        return [
            Factory,
            {
                ...defaults,
                aim,
            },
        ];
    }

    private createBrowserDisposition(id: string): Disposition {
        const aim = this.createAim(Browser.AIM, id);
        return {
            ...Browser.disposition,
            aim,
        };
    }

    private createNavigateDisposition(id: string): Disposition {
        const aim = this.createAim(Navigate.purpose, id);
        return {
            ...Navigate.disposition,
            aim,
        };
    }

    private createDesignDisposition(id: string): Disposition {
        const aim = this.createAim(Design.AIM, id);
        return {
            ...Design.disposition,
            aim,
        };
    }

    private createDecisionDisposition(id: string): Disposition {
        const {
            aim,
        } = Decision.disposition;
        return {
            ...Decision.disposition,
            aim: {
                ...aim,
                body: {
                    ...aim?.body,
                    id,
                },
            },
        };
    }

    private createAim(description: string, id: string): Aim {
        return {
            description,
            body: {
                id,
            },
        };
    }

    private handleNavigate(signal: Signal): void {
        const payload = this.extractPayload<Navigation>(signal.value);
        if (!payload) {
            return;
        }
        this.consultSession(payload);
    }

    private handleSessionResume(): void {
        const {
            previousSession,
        } = this.disposition.aim.body ?? {};
        const path = previousSession?.lastRoute ?? 'presentation';
        this.updateDispositionBody({
            activePage: path,
            sessionState: 'ACTIVE',
        });
        this.consultSession({ navigateTo: path });
    }

    private handleSessionFresh(): void {
        this.updateDispositionBody({
            activePage: 'presentation',
            sessionState: 'FRESH',
            previousSession: undefined,
        });
        this.consultSession({ navigateTo: 'presentation' });
    }

    private handleNavigationChanged(signal: Signal): void {
        const state = this.extractPayload<{ path: string }>(signal.value);
        if (!state) {
            return;
        }
        this.updateDispositionBody({
            activePage: state.path,
        });
    }

    private handleNavigationRestored(signal: Signal): void {
        const state = this.extractPayload<{ path: string; timestamp?: number }>(signal.value);
        if (!state) {
            return;
        }
        this.updateSessionPromptState(state);
    }

    private updateSessionPromptState(state: { path: string; timestamp?: number }): void {
        this.updateDispositionBody({
            activePage: state.path,
            sessionState: 'PROMPT_RESUME',
            previousSession: {
                sessionId: `sess-${state.timestamp ?? Date.now()}`,
                lastRoute: state.path,
                timestamp: state.timestamp ?? Date.now(),
            },
        });
    }

    private handleBrowserDetected(signal: Signal): void {
        const {
            value,
        } = signal;
        this.updateBrowserContext(value as Record<string, unknown>);
    }

    private handleBrowserChanged(signal: Signal): void {
        const {
            value,
        } = signal;
        this.updateBrowserContext(value as Record<string, unknown>);
    }

    private updateBrowserContext(browserContext: Record<string, unknown>): void {
        this.updateDispositionBody({
            browserContext,
        });
        this.pulse(SignalType.BROWSER_CHANGED, browserContext);
    }

    private consultSession(input: unknown): void {
        this.ensureBrowserContext();
        const correlationId = `session-${Date.now()}`;
        this.pulse(MemorySignalType.GET, {
            key: 'session',
            correlationId,
            input,
        });
    }

    private ensureBrowserContext(): void {
        const {
            browserContext,
        } = this.disposition.aim.body ?? {};
        if (!browserContext) {
            this.pulse(BrowserSignalType.DETECT, {});
        }
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const {
            value: session,
            correlationId,
            input,
        } = (signal.value ?? {}) as Record<string, unknown>;
        this.sendDecisionRequest(input, session, correlationId as string);
    }

    private sendDecisionRequest(input: unknown, session: unknown, correlationId?: string): void {
        const context = this.buildDecisionContext(input, session);
        const question = this.resolveCognitiveQuestion(input);
        this.pulse(DecisionSignalType.DECIDE, {
            correlationId: correlationId ?? `decide-${Date.now()}`,
            question,
            context,
        });
    }

    private extractOntologyContext(): Record<string, unknown> {
        const {
            purpose,
        } = this;
        const {
            description: intention,
        } = this.disposition.aim;
        return {
            purpose,
            intention,
        };
    }

    private resolveBrowserContext(): Record<string, unknown> {
        const {
            aim,
        } = this.disposition;
        const {
            browserContext = {},
        } = aim.body ?? {};
        return browserContext;
    }

    private buildDecisionContext(input: unknown, session: unknown): Record<string, unknown> {
        return {
            ...this.extractOntologyContext(),
            input,
            session: session ?? null,
            browser: this.resolveBrowserContext(),
            design: DEFAULT_DESIGN_GUIDELINES,
        };
    }

    private resolveCognitiveQuestion(_input: unknown): Record<string, unknown> {
        return {
            id: 'area_type',
            type: 'choice',
            prompt: 'Determina si debemos usar LAYOUT o VIEW evaluando intention y purpose en el contexto provisto.',
            options: AREA_DECISION_OPTIONS,
        };
    }

    private handleDispositionProvide(signal: Signal): void {
        const payload = this.extractPayload<DispositionProvidePayload>(signal.value);
        if (!payload) {
            return;
        }
        this.pulse(DispositionSignal.UPDATED, payload);
    }

    private mergeAimBody(aim: Aim<Body>, patch: Partial<Body>): Aim<Body> {
        const body = {
            ...aim.body,
            ...patch,
        };
        return {
            ...aim,
            body,
        };
    }

    private updateDispositionBody(patch: Partial<Body>): void {
        const {
            aim,
        } = this.disposition;
        const updatedAim = this.mergeAimBody(aim, patch);
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: updatedAim,
        });
    }

    private handleDecisionDecided(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.DECIDED, value);
        this.requestBuild(value);
    }

    private extractDecisionChoice(decisionValue: unknown): 'LAYOUT' | 'VIEW' {
        const {
            result,
            choice,
        } = (decisionValue ?? {}) as { result?: { choice?: 'LAYOUT' | 'VIEW' }; choice?: 'LAYOUT' | 'VIEW' };
        const {
            choice: resultChoice,
        } = result ?? {};
        return resultChoice ?? choice ?? 'VIEW';
    }

    private requestBuild(decisionValue: unknown): void {
        const {
            correlationId,
            context: decisionContext,
        } = (decisionValue ?? {}) as {
            correlationId?: string;
            context?: Record<string, unknown>;
        };
        const choice = this.extractDecisionChoice(decisionValue);
        const context = decisionContext ?? this.buildDecisionContext(null, null);
        const { areaId, parentId, purpose, intention } = context as {
            areaId?: string;
            parentId?: string;
            purpose?: string;
            intention?: string;
        };
        this.pulse(BuilderSignalType.BUILD, {
            choice,
            areaId: areaId ?? ROOT_AREA_ID,
            parentId,
            purpose,
            intention,
            context,
            correlationId: correlationId ?? `build-${Date.now()}`,
        });
    }

    private handleBuilderBuilt(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILT, value);
    }

    private handleBuilderAreaCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.sendAreaDecision(value as AreaCreated);
    }





    private sendAreaDecision(created: AreaCreated): void {
        const {
            area,
            context,
        } = created;
        const {
            id,
            parentId,
        } = area;
        const areaContext = this.buildAreaContext(area, context);
        const question = this.resolveAreaQuestion(area, parentId);
        this.pulse(DecisionSignalType.DECIDE, {
            correlationId: crypto.randomUUID(),
            question,
            context: areaContext,
        });
    }

    private buildAreaContext(area: Area, inherited: Record<string, unknown>): Record<string, unknown> {
        const {
            id: areaId,
            parentId,
            role,
            description,
            purpose,
            intention,
        } = area;
        return {
            ...inherited,
            areaId,
            parentId,
            role,
            description,
            purpose: purpose ?? inherited.purpose,
            intention: intention ?? description ?? inherited.intention,
        };
    }

    private resolveAreaQuestion(area: Area, parentId?: string): Record<string, unknown> {
        const target = parentId ? `el área '${area.id}' (contenida en '${parentId}')` : `el área '${area.id}'`;
        return {
            id: `area_type_${area.id}`,
            type: 'choice',
            prompt: `Determina si ${target} debe ser LAYOUT o VIEW evaluando intention y purpose en el contexto provisto.`,
            options: AREA_DECISION_OPTIONS,
        };
    }

    private handleBuilderError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

    private handleDecisionError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

    private handleThemeChanged(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(DesignSignalType.THEME_CHANGED, value);
    }
}
