import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Collection } from '@uca/collection';
import { SignalType as CollectionSignalType } from '@uca/collection/types';
import { Design } from '@uca/capability-design';
import { SignalType as DesignSignalType } from '@uca/capability-design/types';
import { Decision } from '@uca/decision';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { Dropdown } from '@uca/dropdown';
import { SignalType as DropdownSignalType } from '@uca/dropdown/types';
import { Input } from '@uca/input';
import { SignalType as InputSignalType } from '@uca/input/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Options } from '@uca/options';
import { SignalType as OptionsSignalType } from '@uca/options/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
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
    DEFAULT_AIM_BODY,
    DEFAULT_AIM_DESCRIPTION,
    DEFAULT_PURPOSE,
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
            ...App.reactToMemory(),
            ...App.reactToBox(),
            ...App.reactToAction(),
            ...App.reactToInput(),
            ...App.reactToPicture(),
            ...App.reactToDropdown(),
            ...App.reactToOptions(),
            ...App.reactToCollection(),
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

    private static reactToBox(): string[] {
        const {
            reactTo = [],
        } = Box.disposition;
        return [
            ...reactTo,
            BoxSignalType.CREATED,
            BoxSignalType.UPDATED,
            BoxSignalType.REMOVED,
            BoxSignalType.EVENT,
        ];
    }

    private static reactToAction(): string[] {
        const {
            reactTo = [],
        } = Action.disposition;
        return [
            ...reactTo,
            ActionSignalType.CREATED,
            ActionSignalType.UPDATED,
            ActionSignalType.REMOVED,
            ActionSignalType.EVENT,
        ];
    }

    private static reactToInput(): string[] {
        const {
            reactTo = [],
        } = Input.disposition;
        return [
            ...reactTo,
            InputSignalType.CREATED,
            InputSignalType.UPDATED,
            InputSignalType.REMOVED,
            InputSignalType.EVENT,
        ];
    }

    private static reactToPicture(): string[] {
        const {
            reactTo = [],
        } = Picture.disposition;
        return [
            ...reactTo,
            PictureSignalType.CREATED,
            PictureSignalType.UPDATED,
            PictureSignalType.REMOVED,
        ];
    }

    private static reactToDropdown(): string[] {
        const {
            reactTo = [],
        } = Dropdown.disposition;
        return [
            ...reactTo,
            DropdownSignalType.CREATED,
            DropdownSignalType.UPDATED,
            DropdownSignalType.REMOVED,
            DropdownSignalType.EVENT,
        ];
    }

    private static reactToOptions(): string[] {
        const {
            reactTo = [],
        } = Options.disposition;
        return [
            ...reactTo,
            OptionsSignalType.CREATED,
            OptionsSignalType.UPDATED,
            OptionsSignalType.REMOVED,
            OptionsSignalType.EVENT,
        ];
    }

    private static reactToCollection(): string[] {
        const {
            reactTo = [],
        } = Collection.disposition;
        return [
            ...reactTo,
            CollectionSignalType.CREATED,
            CollectionSignalType.UPDATED,
            CollectionSignalType.REMOVED,
            CollectionSignalType.EVENT,
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
            this.buildMemoryCooky(),
            this.buildBoxCooky(),
            this.buildActionCooky(),
            this.buildInputCooky(),
            this.buildPictureCooky(),
            this.buildDropdownCooky(),
            this.buildOptionsCooky(),
            this.buildCollectionCooky(),
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
            case DesignSignalType.THEME_CHANGED:
                this.handleThemeChanged(signal);
                break;
            case DispositionSignal.PROVIDE:
                this.handleDispositionProvide(signal);
                break;
            case ActionSignalType.EVENT:
                this.handleActionEvent(signal);
                break;
            case BoxSignalType.EVENT:
                this.handleBoxEvent(signal);
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

    private buildMemoryCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Memory, Memory.purpose, `${id}:memory`, Memory.disposition);
    }

    private buildBoxCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Box, Box.purpose, `${id}:box`, Box.disposition);
    }

    private buildActionCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Action, Action.purpose, `${id}:action`, Action.disposition);
    }

    private buildInputCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Input, Input.purpose, `${id}:input`, Input.disposition);
    }

    private buildPictureCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Picture, Picture.purpose, `${id}:picture`, Picture.disposition);
    }

    private buildDropdownCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Dropdown, Dropdown.purpose, `${id}:dropdown`, Dropdown.disposition);
    }

    private buildOptionsCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Options, Options.purpose, `${id}:options`, Options.disposition);
    }

    private buildCollectionCooky(): [CapabilityConstructor, Disposition] {
        const {
            id,
        } = this;
        return this.buildUcaCooky(Collection, Collection.purpose, `${id}:collection`, Collection.disposition);
    }

    private buildUcaCooky(
        Factory: CapabilityConstructor,
        purpose: string,
        instanceId: string,
        defaults: Disposition,
    ): [CapabilityConstructor, Disposition] {
        const aim = this.createAim(purpose, instanceId);
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

    private buildDecisionContext(input: unknown, session: unknown): Record<string, unknown> {
        const {
            browserContext,
        } = this.disposition.aim.body ?? {};
        return {
            ...this.extractOntologyContext(),
            input,
            session: session ?? null,
            browser: browserContext ?? {},
            components: this.extractAvailableComponents(),
        };
    }

    private buildAreaOptions(): Record<string, unknown>[] {
        return [
            {
                id: 'LAYOUT',
                label: 'Layout',
                description: 'Partición en áreas específicas',
                criteria: 'Elegir LAYOUT si cubrir las necesidades técnicas de intention y purpose en el contexto exige dividir el espacio en áreas específicas.',
            },
            {
                id: 'VIEW',
                label: 'View',
                description: 'Representación directa y esencial',
                criteria: 'Elegir VIEW si no hace falta usar más áreas específicas y intention bajo purpose se resuelve directamente con components del contexto.',
            },
        ];
    }

    private resolveCognitiveQuestion(_input: unknown): Record<string, unknown> {
        return {
            id: 'area_type',
            type: 'choice',
            prompt: 'Determina si debemos usar LAYOUT o VIEW evaluando intention, purpose y components en el contexto provisto.',
            options: this.buildAreaOptions(),
        };
    }

    private extractAvailableComponents(): Record<string, { purpose: string }> {
        return {
            Box: { purpose: Box.purpose },
            Action: { purpose: Action.purpose },
            Input: { purpose: Input.purpose },
            Picture: { purpose: Picture.purpose },
            Dropdown: { purpose: Dropdown.purpose },
            Options: { purpose: Options.purpose },
            Collection: { purpose: Collection.purpose },
            Navigate: { purpose: Navigate.purpose },
            Memory: { purpose: Memory.purpose },
        };
    }

    private handleDispositionProvide(signal: Signal): void {
        const payload = this.extractPayload<DispositionProvidePayload>(signal.value);
        if (!payload) {
            return;
        }
        this.pulse(DispositionSignal.UPDATED, payload);
    }

    private handleActionEvent(signal: Signal): void {
        const {
            value,
        } = signal;
        this.consultSession(value);
        this.pulse(ActionSignalType.EVENT, value);
    }

    private handleBoxEvent(signal: Signal): void {
        const {
            value,
        } = signal;
        this.consultSession(value);
        this.pulse(BoxSignalType.EVENT, value);
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
