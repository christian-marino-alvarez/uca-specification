import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Browser } from '@uca/capability-browser';
import {
    SignalType as BrowserSignalType,
    type BrowserContext,
    type NavigatorContext,
    type ScreenContext,
} from '@uca/capability-browser/types';
import { Builder } from '@uca/builder';
import {
    SignalType as BuilderSignalType,
    type Failure as BuildFailure,
    type LayoutAreaResult as BuildLayoutAreaResult,
    type Request as BuildRequest,
    type Result as BuildResult,
    type ViewCompleted as BuildViewCompleted,
    type ViewElementResult as BuildViewElementResult,
} from '@uca/builder/types';
import {
    type Composition,
    errorSchema as buildErrorSchema,
    layoutAreaResultSchema as buildLayoutAreaResultSchema,
    requestSchema as buildRequestSchema,
    resultSchema as buildResultSchema,
    viewCompletedSchema as buildViewCompletedSchema,
    viewElementResultSchema as buildViewElementResultSchema,
} from '@uca/builder/schema';
import { Memory } from '@uca/memory';
import {
    SignalType as MemorySignalType,
    type RetrievedResult,
} from '@uca/memory/types';
import {
    __ID__,
    AREA_ID,
    BUILD_AIM,
    BUILD_CONTEXT,
    DESIGN,
    LIMITS,
    VIEW_REQUIREMENTS,
} from './constants.js';
import {
    type Body,
    type Build,
    DataType,
    SignalType,
} from './types.js';

export class App extends Uca<Body> {
    public static override purpose = 'Demonstrate emergent UCA composition by generating this browser interface through reactive collaboration under its declared context and deterministic design';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: App.purpose,
            body: {
                build: {
                    areaId: AREA_ID,
                    design: DESIGN,
                    aim: BUILD_AIM,
                    context: BUILD_CONTEXT,
                    limits: LIMITS,
                    requirements: VIEW_REQUIREMENTS,
                },
            },
        },
        reactTo: [
            SignalType.DETECT,
            SignalType.BUILD,
            ...App.reactToBrowser(),
            ...App.reactToBuilder(),
            ...App.reactToMemory(),
        ],
        inputs: [
            {
                signal: SignalType.DETECT,
                type: DataType.VOID,
                description: 'Detect the current browser environment',
            },
            {
                signal: SignalType.BUILD,
                type: DataType.BUILD_REQUEST,
                schema: buildRequestSchema,
                description: 'Request a construction path for a DOM area',
            },
        ],
        outputs: [
            {
                signal: SignalType.BUILD_DECIDED,
                type: DataType.BUILD_RESULT,
                schema: buildResultSchema,
                description: 'Construction path selected by Builder',
            },
            {
                signal: SignalType.LAYOUT_AREA_CREATED,
                type: DataType.LAYOUT_AREA_RESULT,
                schema: buildLayoutAreaResultSchema,
                description: 'Structural layout created progressively by Builder',
            },
            {
                signal: SignalType.VIEW_ELEMENT_CREATED,
                type: DataType.VIEW_ELEMENT_RESULT,
                schema: buildViewElementResultSchema,
                description: 'Final view element created progressively by Builder',
            },
            {
                signal: SignalType.VIEW_COMPLETED,
                type: DataType.VIEW_COMPLETED_RESULT,
                schema: buildViewCompletedSchema,
                description: 'Final view composition completed by Builder',
            },
            {
                signal: SignalType.BUILD_ERROR,
                type: DataType.BUILD_ERROR,
                schema: buildErrorSchema,
                description: 'Builder contract or decision failure',
            },
        ],
    };

    private static reactToBrowser(): string[] {
        return [
            BrowserSignalType.DETECT,
            BrowserSignalType.DETECTED,
            BrowserSignalType.CHANGED,
        ];
    }

    private static reactToBuilder(): string[] {
        return [
            BuilderSignalType.BUILD,
            BuilderSignalType.DECIDED,
            BuilderSignalType.LAYOUT_AREA_CREATED,
            BuilderSignalType.VIEW_ELEMENT_CREATED,
            BuilderSignalType.VIEW_COMPLETED,
            BuilderSignalType.ERROR,
        ];
    }

    private static reactToMemory(): string[] {
        return [
            MemorySignalType.SAVE,
            MemorySignalType.GET,
            MemorySignalType.SAVED,
            MemorySignalType.RETRIEVED,
            MemorySignalType.ERROR,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        const {
            registry,
        } = this;
        registry.forEach((capability) => capability.denervate());
        super.denervate();
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.pulse(BrowserSignalType.DETECT, undefined);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.DETECT:
                this.handleDetect();
                break;
            case SignalType.BUILD:
                this.handleBuild(signal);
                break;
            case BrowserSignalType.DETECTED:
                this.handleBrowserDetected(signal);
                break;
            case BrowserSignalType.CHANGED:
                this.handleBrowserChanged(signal);
                break;
            case BuilderSignalType.DECIDED:
                this.handleBuilderDecided(signal);
                break;
            case BuilderSignalType.LAYOUT_AREA_CREATED:
                this.handleBuilderLayoutAreaCreated(signal);
                break;
            case BuilderSignalType.VIEW_ELEMENT_CREATED:
                this.handleBuilderViewElementCreated(signal);
                break;
            case BuilderSignalType.VIEW_COMPLETED:
                this.handleBuilderViewCompleted(signal);
                break;
            case BuilderSignalType.ERROR:
                this.handleBuilderError(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [Browser, this.createBrowserDisposition(`${id}:browser`)],
            [Builder, this.createBuilderDisposition(`${id}:builder`)],
            [Memory, this.createMemoryDisposition(`${id}:memory`)],
        ];
    }

    private createBrowserDisposition(id: string): Disposition {
        return {
            ...Browser.disposition,
            aim: {
                description: Browser.AIM,
                body: {
                    id,
                },
            },
        };
    }

    private createBuilderDisposition(id: string): Disposition {
        return {
            ...Builder.disposition,
            aim: {
                description: Builder.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private createMemoryDisposition(id: string): Disposition {
        return {
            ...Memory.disposition,
            aim: {
                description: Memory.purpose,
                body: {
                    namespace: id,
                },
            },
        };
    }

    private handleDetect(): void {
        this.pulse(BrowserSignalType.DETECT, undefined);
    }

    private handleBuild(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(BuilderSignalType.BUILD, value as BuildRequest);
    }

    private handleBrowserDetected(signal: Signal): void {
        const {
            value,
        } = signal;
        this.requestStoredComposition(value as BrowserContext);
    }

    private handleBrowserChanged(signal: Signal): void {
        const {
            value,
        } = signal;
        this.requestStoredComposition(value as BrowserContext);
    }

    private requestStoredComposition(context: BrowserContext): void {
        const {
            id,
        } = this;
        this.pulse(MemorySignalType.GET, {
            key: `${id}:composition`,
            correlationId: JSON.stringify(context),
        });
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        this.dispatchMemoryRetrieved(value as RetrievedResult<Composition>);
    }

    private dispatchMemoryRetrieved(result: RetrievedResult<Composition>): void {
        const {
            value: savedComposition,
            correlationId,
        } = result ?? {};
        if (correlationId) {
            this.dispatchBuildWithMemory(correlationId, savedComposition ?? undefined);
        }
    }

    private dispatchBuildWithMemory(correlationId: string, savedComposition?: Composition): void {
        const context = JSON.parse(correlationId) as BrowserContext;
        const request = this.createBuildRequest(context, savedComposition);
        this.pulse(BuilderSignalType.BUILD, request);
    }

    private handleBuilderDecided(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILD_DECIDED, value as BuildResult);
    }

    private handleBuilderLayoutAreaCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.LAYOUT_AREA_CREATED, value as BuildLayoutAreaResult);
    }

    private handleBuilderViewElementCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(
            SignalType.VIEW_ELEMENT_CREATED,
            value as BuildViewElementResult,
        );
    }

    private handleBuilderViewCompleted(signal: Signal): void {
        const {
            value,
        } = signal;
        const completion = value as BuildViewCompleted;
        this.persistComposition(completion);
        this.pulse(
            SignalType.VIEW_COMPLETED,
            completion,
        );
    }

    private persistComposition(completion: BuildViewCompleted): void {
        const {
            id,
        } = this;
        const {
            composition,
        } = completion;
        this.pulse(MemorySignalType.SAVE, {
            key: `${id}:composition`,
            value: composition,
        });
    }

    private handleBuilderError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.BUILD_ERROR, value as BuildFailure);
    }

    private createBrowserScreen(screen: ScreenContext): Record<string, unknown> {
        const {
            width,
            height,
            availWidth: availableWidth,
            availHeight: availableHeight,
        } = screen;
        return {
            width,
            height,
            availableWidth,
            availableHeight,
        };
    }

    private createBrowserInteraction(browser: NavigatorContext): Record<string, unknown> {
        const {
            touch,
            maxTouchPoints: touchPoints,
        } = browser;
        return {
            pointer: touch ? 'coarse' : 'fine',
            hover: !touch,
            touchPoints,
        };
    }

    private createBrowserPreferences(browser: NavigatorContext): Record<string, unknown> {
        const {
            colorScheme,
            reducedMotion,
        } = browser;
        return {
            colorScheme,
            contrast: 'no-preference',
            reducedMotion,
        };
    }

    private createBrowserPayload(context: BrowserContext): Record<string, unknown> {
        const {
            viewport,
            screen,
            browser,
        } = context;
        const {
            pixelRatio,
            language,
            writingDirection,
        } = this.extractBrowserMeta(screen, browser);
        return {
            area: viewport,
            viewport,
            screen: this.createBrowserScreen(screen),
            pixelRatio,
            language,
            writingDirection,
            interaction: this.createBrowserInteraction(browser),
            preferences: this.createBrowserPreferences(browser),
        };
    }

    private extractBrowserMeta(screen: ScreenContext, browser: NavigatorContext): Record<string, unknown> {
        const {
            pixelRatio,
        } = screen;
        const {
            language,
            writingDirection,
        } = browser;
        return {
            pixelRatio,
            language,
            writingDirection,
        };
    }

    private createBuildRequest(context: BrowserContext, savedComposition?: Composition): BuildRequest {
        const {
            aim: dispositionAim,
        } = this.disposition;
        const {
            build,
        } = dispositionAim.body ?? {};
        const config = this.resolveBuildConfig(build, savedComposition);
        return {
            correlationId: crypto.randomUUID(),
            browser: this.createBrowserPayload(context) as unknown as BuildRequest['browser'],
            ...config,
        } as BuildRequest;
    }

    private resolveBuildConfig(build?: Build, savedComposition?: Composition): Partial<BuildRequest> {
        const {
            areaId = AREA_ID,
            design = DESIGN,
            aim = BUILD_AIM,
            context = BUILD_CONTEXT,
            limits = LIMITS,
            requirements = VIEW_REQUIREMENTS,
            composition,
        } = build ?? {};
        const activeComposition = savedComposition ?? composition;
        return {
            areaId,
            design,
            aim,
            context,
            limits,
            requirements,
            ...(activeComposition && {
                composition: activeComposition,
            }),
        };
    }
}
