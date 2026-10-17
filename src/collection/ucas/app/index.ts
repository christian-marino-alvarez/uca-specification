import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { Design } from '@uca/capability-design';
import { SignalType as DesignSignalType } from '@uca/capability-design/types';
import { Decision } from '@uca/decision';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { Uca } from '@uca/core/uca';
import type {
    Aim,
    CapabilityConstructor,
    Cooky,
    Disposition,
    Signal,
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
            ...App.reactToBrowser(),
            ...App.reactToDesign(),
            ...App.reactToDecision(),
        ],
        inputs: [
            {
                signal: SignalType.NAVIGATE,
                type: DataType.NAVIGATION,
                schema: navigationSchema,
                description: 'Navigate to target page with parameters',
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
                description: 'Cognitive decision made for page structure',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Application error notification',
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

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        return [
            this.buildBrowserCooky(),
            this.buildDesignCooky(),
            this.buildDecisionCooky(),
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
            case BrowserSignalType.DETECTED:
                this.handleBrowserDetected(signal);
                break;
            case BrowserSignalType.CHANGED:
                this.handleBrowserChanged(signal);
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

    private createDesignDisposition(id: string): Disposition {
        const aim = this.createAim(Design.AIM, id);
        return {
            ...Design.disposition,
            aim,
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

    private createBrowserDisposition(id: string): Disposition {
        const aim = this.createAim(Browser.AIM, id);
        return {
            ...Browser.disposition,
            aim,
        };
    }

    private createDecisionDisposition(id: string): Disposition {
        const aim = this.createAim(Decision.purpose, id);
        return {
            ...Decision.disposition,
            aim,
        };
    }

    private handleNavigate(signal: Signal): void {
        const {
            value,
        } = signal;
        this.applyNavigation((value ?? {}) as Navigation);
    }

    private applyNavigation(navigation: Navigation): void {
        const {
            navigateTo: activePage,
            parameters,
        } = navigation;
        this.updateDispositionBody({
            activePage,
            parameters,
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

    private updateBrowserContext(browserContext: Record<string, unknown>): void {
        this.updateDispositionBody({
            browserContext,
        });
        this.pulse(SignalType.BROWSER_CHANGED, browserContext);
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
