import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType, type BrowserContext } from '@uca/capability-browser/types';
import { Builder } from '@uca/builder';
import { SignalType as BuilderSignalType } from '@uca/builder/types';
import { __ID__, DEFAULT_CONTEXT, DEFAULT_LANGUAGE, DEFAULT_NAME, DEFAULT_ROOT_AREA, resolveRootLayout, resolveViewportMedia } from './constants.js';
import { type Body, type Dimensions, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Create a web application that presents UCA with a centered text input, action button, and localized prompt suggestion based on browser language';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: App.purpose,
            body: {
                name: DEFAULT_NAME,
                purpose: App.purpose,
                context: DEFAULT_CONTEXT,
                language: DEFAULT_LANGUAGE,
            },
        },
        reactTo: [
            SignalType.DETECT,
            BrowserSignalType.DETECTED,
            BrowserSignalType.CHANGED,
            BuilderSignalType.BUILT,
            ...Browser.disposition.reactTo ?? [],
            ...Builder.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.DETECT, type: DataType.VOID, description: 'Request browser environment detection' },
            { signal: BuilderSignalType.BUILT, type: DataType.LAYOUT, description: 'Area template materialized by Builder capability' },
        ],
        outputs: [
            { signal: SignalType.DIMENSIONS_DETECTED, type: DataType.APP_BODY, description: 'Application body with detected dimensions' },
            { signal: SignalType.DIMENSIONS_CHANGED, type: DataType.APP_BODY, description: 'Application body with updated dimensions upon window resize' },
            { signal: SignalType.LAYOUT_COMPOSED, type: DataType.LAYOUT, description: 'Final application layout composed' },
            { signal: BuilderSignalType.BUILD, type: DataType.LAYOUT, description: 'Request root area construction to Builder' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        console.log(`[${this.id}] 🚀 App iniciada`);
        this.pulse(BrowserSignalType.DETECT, undefined);
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.DETECT:
                this.handleDetect();
                break;
            case BrowserSignalType.DETECTED:
                this.handleBrowserDetected(signal);
                break;
            case BrowserSignalType.CHANGED:
                this.handleBrowserChanged(signal);
                break;
            case BuilderSignalType.BUILT:
                this.handleBuilderBuilt(signal);
                break;
            default:
                break;
        }
    }

    protected override catalog(): Cooky {
        const { id } = this;
        const browserId = `${id}:browser`;
        const builderId = `${id}:builder`;
        const cooky: Cooky = [
            [Browser, { aim: { description: 'Browser context detector', body: { id: browserId } }, reactTo: [...Browser.disposition.reactTo ?? []] }],
            [Builder, { aim: { description: Builder.purpose, body: { id: builderId, parentTo: id } }, reactTo: [...Builder.disposition.reactTo ?? []] }],
        ];
        return cooky;
    }

    private handleDetect(): void {
        this.pulse(BrowserSignalType.DETECT, undefined);
    }

    private handleBrowserDetected(signal: Signal): void {
        const { value } = signal;
        const dimensions = this.getDimensions(value);
        const language = this.getLanguage(value);
        const { aim } = this.disposition;
        const { name = DEFAULT_NAME, purpose = App.purpose, context = DEFAULT_CONTEXT } = aim.body ?? {};
        const payload: Body = { name, purpose, context, language, dimensions };
        this.pulse(SignalType.DIMENSIONS_DETECTED, payload);
        this.requestBuild(language, dimensions);
    }

    private requestBuild(language: string, dimensions?: Dimensions): void {
        const suggestion = language.startsWith('es') ? 'Dime qué quieres' : 'Tell me what you want';
        const purpose = `Architect layout representation areas with text input "${suggestion}" and action button`;
        const { aim } = this.disposition;
        const { context = DEFAULT_CONTEXT } = aim.body ?? {};
        const media = resolveViewportMedia(dimensions);
        const [width, direction] = resolveRootLayout(dimensions);
        this.pulse(BuilderSignalType.BUILD, { areaId: DEFAULT_ROOT_AREA, parentTo: this.id, kind: 'container', depth: 0, purpose, context, dimensions: { width, height: 'auto' }, style: { direction, alignment: 'center' }, media });
    }

    private handleBuilderBuilt(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.LAYOUT_COMPOSED, { layout: value });
    }

    private handleBrowserChanged(signal: Signal): void {
        const { value } = signal;
        const dimensions = this.getDimensions(value);
        const language = this.getLanguage(value);
        const { aim } = this.disposition;
        const { name = DEFAULT_NAME, purpose = App.purpose, context = DEFAULT_CONTEXT } = aim.body ?? {};
        const payload: Body = { name, purpose, context, language, dimensions };
        this.pulse(SignalType.DIMENSIONS_CHANGED, payload);
        this.requestBuild(language, dimensions);
    }

    private getDimensions(value: unknown): Dimensions {
        const context = Capability.extractPayload<BrowserContext>(value);
        const { viewport, screen } = context ?? {};
        const { width, height } = viewport ?? {};
        const { pixelRatio, orientation } = screen ?? {};
        return { width, height, pixelRatio, orientation, screen };
    }

    private getLanguage(value: unknown): string {
        const context = Capability.extractPayload<BrowserContext>(value);
        const { browser } = context ?? {};
        const { language = DEFAULT_LANGUAGE } = browser ?? {};
        return language;
    }
}
