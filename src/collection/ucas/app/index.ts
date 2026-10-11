import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import { type Cooky, type Disposition, type Signal } from '@uca/core/types';
import { Composer } from '@uca/composer';
import { SignalType as ComposerSignalType } from '@uca/composer/types';
import { Builder } from '@uca/builder';
import { SignalType as BuilderSignalType } from '@uca/builder/types';
import { Browser } from '@uca/capability-browser';
import { SignalType as BrowserSignalType, type BrowserContext } from '@uca/capability-browser/types';
import { __ID__, DEFAULT_CONTEXT, INPUTS, OUTPUTS } from './constants.js';
import { type Body, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Website oficial de la arquitectura UCA cuyo propósito es explicar de forma demostrable la propia UCA mediante una interfaz de IDE inspirada en herramientas como Cursor o Antigravity, siendo la propia web una aplicación UCA reactiva';

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: { context: DEFAULT_CONTEXT } },
        reactTo: [
            ComposerSignalType.STREAMED,
            ComposerSignalType.ERROR,
            BrowserSignalType.DETECTED,
            BrowserSignalType.CHANGED,
            ...Composer.disposition.reactTo ?? [],
            ...Builder.disposition.reactTo ?? [],
            ...Browser.disposition.reactTo ?? [],
        ],
        inputs: INPUTS,
        outputs: OUTPUTS,
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { aim, limits } = this.disposition;
        const { description, body: { context, composition } = {} } = aim;
        const { reactTo: composerReactTo } = Composer.disposition;
        const { reactTo: builderReactTo } = Builder.disposition;
        const { reactTo: browserReactTo } = Browser.disposition;
        const composerBody = { id: `${this.id}:composer`, request: this.purpose, context, parentTo: this.id, composition };
        const builderBody = { id: `${this.id}:builder`, parentTo: this.id };
        const browserBody = { id: `${this.id}:browser` };
        return [
            [Composer, { aim: { description, body: composerBody }, reactTo: composerReactTo, ...(limits && { limits }) }],
            [Builder, { aim: { description: Builder.purpose, body: builderBody }, reactTo: builderReactTo }],
            [Browser, { aim: { description: Browser.AIM, body: browserBody }, reactTo: browserReactTo }],
        ];
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.pulse(BrowserSignalType.READ, {});
    }

    protected override react(signal: Signal): void {
        const { property, value, source } = signal;
        switch (property) {
            case BrowserSignalType.DETECTED: this.handleBrowserDetected(value); break;
            case BrowserSignalType.CHANGED: this.handleBrowserChanged(value); break;
            case ComposerSignalType.STREAMED: this.handleComposerStreamed(value, source); break;
            case ComposerSignalType.ERROR: this.handleComposerError(value, source); break;
            default: break;
        }
    }

    private handleBrowserDetected(value: unknown): void {
        const browserContext = value as BrowserContext;
        const limits = this.resolveLimits(browserContext);
        const context = this.formatContext(browserContext);
        this.updateComposer(context, limits);
    }

    private handleBrowserChanged(value: unknown): void {
        const browserContext = value as BrowserContext;
        const limits = this.resolveLimits(browserContext);
        const context = this.formatContext(browserContext);
        this.updateComposer(context, limits);
    }

    private resolveLimits(browserContext: BrowserContext): Record<string, unknown> {
        const { viewport, screen, browser } = browserContext ?? {};
        const { width = 1920, height = 1080 } = viewport ?? {};
        const { orientation = 'landscape' } = screen ?? {};
        const { platform = 'desktop' } = browser ?? {};
        return { width, height, orientation, platform, viewport: { width, height } };
    }

    private updateComposer(context: string, limits?: Record<string, unknown>): void {
        const { aim } = this.disposition;
        const { description, body: { composition } = {} } = aim;
        const { reactTo } = Composer.disposition;
        const body = { id: `${this.id}:composer`, request: this.purpose, context, parentTo: this.id, composition };
        this.logLimits(limits);
        this.pulse(Capability.updateEvent(`${this.id}:composer`), { aim: { description, body }, reactTo, ...(limits && { limits }) });
    }

    private logLimits(limits?: Record<string, unknown>): void {
        if (!limits) { return; }
        console.log('%c📐 [App -> Composer] Límites de pantalla detectados por Browser:', 'color: #38bdf8; font-weight: bold;', limits);
    }

    private formatContext(browserContext: BrowserContext): string {
        const { viewport, screen, browser } = browserContext ?? {};
        const { width = 1920, height = 1080 } = viewport ?? {};
        const { orientation = 'landscape' } = screen ?? {};
        const { colorScheme = 'dark', platform = 'desktop' } = browser ?? {};
        const { aim: { body: { context: base = DEFAULT_CONTEXT } = {} } } = this.disposition;
        return `${base} Lienzo: Viewport ${width}x${height}, Orientación ${orientation}, Tema ${colorScheme}, Plataforma ${platform}. Particiona este lienzo entre los hijos inmediatos conservando el 100% de la fila.`;
    }

    private handleComposerStreamed(value: unknown, source: string): void {
        if (!source.startsWith(this.id)) { return; }
        const { stream, correlationId } = (value ?? {}) as { stream?: ReadableStream; correlationId?: string };
        if (!stream) { return; }
        this.pulse(BuilderSignalType.STREAM, { stream, correlationId });
    }

    private handleComposerError(value: unknown, source: string): void {
        if (source !== `${this.id}:composer`) { return; }
        this.pulse(SignalType.ERROR, value);
    }
}
