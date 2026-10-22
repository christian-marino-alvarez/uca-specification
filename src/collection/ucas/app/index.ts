import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Layout } from '@uca/layout';
import {
    SignalType as LayoutSignalType,
    type Area,
    type AreaDefined,
} from '@uca/layout/types';
import { View } from '@uca/view';
import {
    SignalType as ViewSignalType,
} from '@uca/view/types';
import { Design } from '@uca/capability-design';
import { SignalType as DesignSignalType } from '@uca/capability-design/types';
import { Decision } from '@uca/decision';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Specification } from '@uca/capability-specification';
import {
    SignalType as SpecificationSignalType,
} from '@uca/capability-specification/types';
import { Telemetry } from '@uca/capability-telemetry';
import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type Aim,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type DispositionProvidePayload,
    type Signal,
    type TransportPayload,
} from '@uca/core/types';
import {
    APP_DECISION_OPTIONS,
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
            ...App.reactToLayout(),
            ...App.reactToView(),
            ...App.reactToMemory(),
            ...App.reactToSpecification(),
            ...App.reactToTelemetry(),
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

    private static reactToLayout(): string[] {
        const {
            reactTo = [],
        } = Layout.disposition;
        return [
            ...reactTo,
            LayoutSignalType.BUILT,
            LayoutSignalType.AREA_CREATED,
            LayoutSignalType.ERROR,
        ];
    }

    private static reactToView(): string[] {
        const {
            reactTo = [],
        } = View.disposition;
        return [
            ...reactTo,
            ViewSignalType.BUILT,
            ViewSignalType.RENDERED,
            ViewSignalType.ERROR,
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

    private static reactToSpecification(): string[] {
        const {
            reactTo = [],
        } = Specification.disposition;
        return [
            ...reactTo,
            SpecificationSignalType.PARSED,
            SpecificationSignalType.PROVIDED,
        ];
    }

    private static reactToTelemetry(): string[] {
        const {
            reactTo = [],
        } = Telemetry.disposition;
        return [
            ...reactTo,
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
            this.buildLayoutCooky(),
            this.buildViewCooky(),
            this.buildMemoryCooky(),
            this.buildSpecificationCooky(),
            this.buildTelemetryCooky(),
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
            case LayoutSignalType.AREA_CREATED:
                this.handleLayoutAreaCreated(signal);
                break;
            case LayoutSignalType.BUILT:
                this.handleLayoutBuilt(signal);
                break;
            case LayoutSignalType.ERROR:
                this.handleLayoutError(signal);
                break;
            case ViewSignalType.BUILT:
                this.handleViewBuilt(signal);
                break;
            case ViewSignalType.RENDERED:
                this.handleViewRendered(signal);
                break;
            case ViewSignalType.ERROR:
                this.handleViewError(signal);
                break;
            case DesignSignalType.THEME_CHANGED:
                this.handleThemeChanged(signal);
                break;
            case SpecificationSignalType.PARSED:
                this.handleSpecificationParsed(signal);
                break;
            case SpecificationSignalType.PROVIDED:
                this.handleSpecificationProvided(signal);
                break;
            case DispositionSignal.PROVIDE:
                this.handleDispositionProvide(signal);
                break;
            default:
                break;
        }
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

    private createLayoutBody(): Record<string, unknown> {
        const { aim } = Layout.disposition;
        const { structural, spatial, design } = this.disposition.aim.body ?? {};
        const containerElement = (structural as { containerElement?: string })?.containerElement ?? 'body';
        return {
            ...(aim.body ?? {}),
            structural,
            spatial,
            design,
            containerElement,
        };
    }

    private createLayoutDisposition(): Disposition {
        const { aim } = Layout.disposition;
        const body = this.createLayoutBody();
        return {
            ...Layout.disposition,
            aim: { ...aim, body },
        };
    }

    private buildLayoutCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        const disposition = this.createLayoutDisposition();
        return this.buildUcaCooky(Layout, Layout.purpose, `${id}:layout`, disposition);
    }

    private createViewBody(): Record<string, unknown> {
        const { aim } = View.disposition;
        const { structural, spatial, design } = this.disposition.aim.body ?? {};
        const containerElement = (structural as { containerElement?: string })?.containerElement ?? 'body';
        return {
            ...(aim.body ?? {}),
            structural,
            spatial,
            design,
            containerElement,
        };
    }

    private createViewDisposition(): Disposition {
        const { aim } = View.disposition;
        const body = this.createViewBody();
        return {
            ...View.disposition,
            aim: { ...aim, body },
        };
    }

    private buildViewCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        const disposition = this.createViewDisposition();
        return this.buildUcaCooky(View, View.purpose, `${id}:view`, disposition);
    }

    private buildMemoryCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Memory, Memory.purpose, `${id}:memory`, Memory.disposition);
    }

    private buildSpecificationCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Specification as unknown as CapabilityConstructor,
            this.createSpecificationDisposition(`${id}:specification`),
        ];
    }

    private buildTelemetryCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return [
            Telemetry as unknown as CapabilityConstructor,
            this.createTelemetryDisposition(`${id}:telemetry`),
        ];
    }

    private createSpecificationDisposition(id: string): Disposition {
        const aim = this.createAim(Specification.AIM, id);
        return {
            ...Specification.disposition,
            aim,
        };
    }

    private createTelemetryDisposition(id: string): Disposition {
        const aim = this.createAim(Telemetry.AIM, id);
        return {
            ...Telemetry.disposition,
            aim,
        };
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
        this.ensureSpecification();
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

    private ensureSpecification(): void {
        const {
            specification,
        } = this.disposition.aim.body ?? {};
        if (!specification) {
            this.pulse(SpecificationSignalType.LOAD, {});
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
        const { purpose } = this;
        const { description: intention, body } = this.disposition.aim;
        const { structural, spatial, design } = body ?? {};
        const visualIntention = `${intention}\n${DEFAULT_DESIGN_GUIDELINES}`;
        return {
            purpose,
            intention,
            visualIntention,
            structural,
            spatial,
            design,
            guidelines: DEFAULT_DESIGN_GUIDELINES,
        };
    }

    private resolveBrowserContext(): Record<string, unknown> {
        const {
            aim,
        } = this.disposition;
        const {
            browserContext = {},
        } = aim.body ?? {};
        const {
            viewport,
        } = browserContext as { viewport?: { width?: number; height?: number } };
        const width = viewport?.width ?? 1024;
        const height = viewport?.height ?? 768;
        const device = width < 768 ? 'mobile' : 'desktop';
        return {
            device,
            viewport: {
                width,
                height,
            },
        };
    }

    private buildDecisionContext(_input: unknown, session: unknown): Record<string, unknown> {
        return {
            ...this.extractOntologyContext(),
            session: session ?? null,
            browser: this.resolveBrowserContext(),
        };
    }

    private resolveCognitiveQuestion(_input: unknown): Record<string, unknown> {
        return {
            id: 'area_type',
            type: 'choice',
            prompt: 'Determina si la aplicación principal debe articularse mediante un LAYOUT estructural o como una VIEW unitaria.',
            options: APP_DECISION_OPTIONS,
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

    private resolveBuildContext(decisionValue: unknown): Record<string, unknown> {
        const {
            context,
        } = (decisionValue ?? {}) as { context?: Record<string, unknown> };
        return context ?? this.buildDecisionContext(null, null);
    }

    private resolveBuildIntention(choice: 'LAYOUT' | 'VIEW', area?: Area): string {
        const isLayout = choice === 'LAYOUT';
        const action = isLayout ? 'Estructurar distribución espacial' : 'Articular componentes visuales';
        const targetId = area?.id ?? ROOT_AREA_ID;
        const purpose = area?.purpose ?? area?.intention ?? 'Interacción y contenido funcional';
        return `${action} para el área '${targetId}': "${purpose}"`;
    }

    private buildAimPayload(choice: 'LAYOUT' | 'VIEW', area?: Area, context?: Record<string, unknown>): Aim<Record<string, unknown>> {
        const description = this.resolveBuildIntention(choice, area);
        return {
            description,
            body: context ?? {},
        };
    }

    private buildLimitsPayload(browser?: { viewport?: unknown }): Record<string, unknown> {
        return {
            viewport: browser?.viewport,
        };
    }

    private assembleBuildPayload(aim: Aim<Record<string, unknown>>, browser?: { viewport?: unknown }, correlationId?: string): TransportPayload {
        return {
            aim,
            limits: this.buildLimitsPayload(browser),
            correlationId: correlationId ?? `build-${Date.now()}`,
        };
    }

    private createBuildPayload(choice: 'LAYOUT' | 'VIEW', context: Record<string, unknown>, correlationId?: string): TransportPayload {
        const { area, browser } = context as { area?: Area; browser?: { viewport?: unknown } };
        return this.assembleBuildPayload(this.buildAimPayload(choice, area, context), browser, correlationId);
    }

    private dispatchBuild(choice: 'LAYOUT' | 'VIEW', context: Record<string, unknown>, correlationId?: string): void {
        const payload = this.createBuildPayload(choice, context, correlationId);
        const signal = choice === 'LAYOUT' ? LayoutSignalType.BUILD : ViewSignalType.BUILD;
        this.pulse(signal, payload);
    }

    private requestBuild(decisionValue: unknown): void {
        const context = this.resolveBuildContext(decisionValue);
        const {
            correlationId,
        } = (decisionValue ?? {}) as { correlationId?: string };
        const choice = this.extractDecisionChoice(decisionValue);
        this.dispatchBuild(choice, context, correlationId);
    }

    private handleLayoutBuilt(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILT, value);
    }

    private handleViewBuilt(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILT, value);
    }

    private handleViewRendered(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILT, value);
    }

    private handleLayoutAreaCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        const defined = value as AreaDefined;
        if (defined?.area?.id === 'root' || defined?.area?.id === 'app' || defined?.area?.id === 'body') {
            return;
        }
        this.sendAreaDecision(defined);
    }

    private createAreaContext(area: Area, context: Record<string, unknown>): Record<string, unknown> {
        const {
            browser = this.resolveBrowserContext(),
        } = context as { browser?: Record<string, unknown> };
        return {
            area,
            browser,
            guidelines: DEFAULT_DESIGN_GUIDELINES,
        };
    }

    private dispatchAreaPrompt(area: Area, context: Record<string, unknown>, correlationId?: string): void {
        const nextId = `${correlationId ?? 'decision'}:${area.id}`;
        const areaContext = this.createAreaContext(area, context);
        const question = this.resolveAreaQuestion(area, area.parentId);
        this.pulse(DecisionSignalType.DECIDE, {
            correlationId: nextId,
            question,
            context: areaContext,
        });
    }

    private sendAreaDecision(defined: AreaDefined): void {
        const {
            area,
            context = {},
            correlationId,
        } = defined;
        this.dispatchAreaPrompt(area, context, correlationId);
    }

    private resolveAreaQuestion(area: Area, parentId?: string): Record<string, unknown> {
        const {
            id,
        } = area;
        const target = parentId ? `el área '${id}' (contenida en '${parentId}')` : `el área '${id}'`;
        return {
            id: `area_type_${id}`,
            type: 'choice',
            prompt: `Determina si ${target} debe ser LAYOUT o VIEW evaluando intention y purpose en el contexto provisto.`,
            options: AREA_DECISION_OPTIONS,
        };
    }

    private handleLayoutError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

    private handleViewError(signal: Signal): void {
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

    private handleSpecificationParsed(signal: Signal): void {
        const {
            value,
        } = signal;
        this.updateDispositionBody({
            specification: value as Record<string, unknown>,
        });
    }

    private handleSpecificationProvided(signal: Signal): void {
        const {
            value,
        } = signal;
        this.updateDispositionBody({
            specification: value as Record<string, unknown>,
        });
    }
}
