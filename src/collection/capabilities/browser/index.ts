import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_BROWSER,
    DEFAULT_SCREEN,
    DEFAULT_VIEWPORT,
} from './constants.js';
import {
    type Body,
    type BrowserContext,
    type NavigatorContext,
    type ScreenContext,
    type ViewportContext,
    DataType,
    SignalType,
} from './types.js';

export class Browser extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: Browser.AIM, body: {} },
        reactTo: [
            SignalType.DETECT,
            SignalType.DESTROY,
        ],
        inputs: [
            { signal: SignalType.DETECT, type: DataType.VOID, description: 'Request fresh browser context capture' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Unbind window listeners and destroy session' },
        ],
        outputs: [
            { signal: SignalType.DETECTED, type: DataType.CONTEXT, description: 'Initial or requested browser context' },
            { signal: SignalType.CHANGED, type: DataType.CONTEXT, description: 'Updated browser context upon resize or orientation change' },
            { signal: SignalType.DESTROYED, type: DataType.RECORD, description: 'Confirmation that window listeners are destroyed' },
        ],
    };

    private mediaQueries: MediaQueryList[] = [];
    private mediaListener?: () => void;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.unbindWindowListeners();
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.DETECT:
                this.handleDetect();
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            default:
                break;
        }
    }

    private handleDetect(): void {
        this.bindWindowListeners();
        this.pulse(SignalType.DETECTED, this.captureContext());
    }

    private handleDestroy(): void {
        this.unbindWindowListeners();
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private bindWindowListeners(): void {
        if (typeof window === 'undefined' || this.mediaListener) { return; }
        this.mediaListener = () => this.pulse(SignalType.CHANGED, this.captureContext());
        window.addEventListener('resize', this.mediaListener);
        const queries = ['(orientation: portrait)', '(prefers-color-scheme: dark)'];
        this.mediaQueries = queries.map((query) => window.matchMedia?.(query)).filter(Boolean) as MediaQueryList[];
        for (const mediaQuery of this.mediaQueries) {
            mediaQuery.addEventListener('change', this.mediaListener);
        }
    }

    private unbindWindowListeners(): void {
        if (!this.mediaListener) { return; }
        if (typeof window !== 'undefined') { window.removeEventListener('resize', this.mediaListener); }
        for (const mediaQuery of this.mediaQueries) {
            mediaQuery.removeEventListener('change', this.mediaListener);
        }
        this.mediaQueries = [];
        this.mediaListener = undefined;
    }

    private captureContext(): BrowserContext {
        const viewport = this.captureViewport();
        const screen = this.captureScreen();
        const browser = this.captureNavigator();
        return { viewport, screen, browser };
    }

    private captureViewport(): ViewportContext {
        if (typeof window === 'undefined') { return DEFAULT_VIEWPORT; }
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }

    private captureScreen(): ScreenContext {
        if (typeof window === 'undefined' || typeof screen === 'undefined') { return DEFAULT_SCREEN; }
        const { width, height, availWidth, availHeight, colorDepth, orientation } = screen;
        const { devicePixelRatio: pixelRatio = 1 } = window;
        const orientationType = orientation?.type ?? (width > height ? 'landscape-primary' : 'portrait-primary');
        return { width, height, availWidth, availHeight, colorDepth, pixelRatio, orientation: orientationType };
    }

    private captureNavigator(): NavigatorContext {
        if (typeof navigator === 'undefined') { return DEFAULT_BROWSER; }
        const { userAgent, language, maxTouchPoints = 0, onLine = true } = navigator;
        const colorScheme = this.resolveThemePreference();
        const reducedMotion = this.resolveReducedMotion();
        const type = this.detectBrowserType(userAgent);
        const platform = this.resolvePlatform();
        return { type, userAgent, language, platform, touch: maxTouchPoints > 0, maxTouchPoints, colorScheme, reducedMotion, online: onLine };
    }

    private resolveThemePreference(): 'dark' | 'light' {
        if (typeof window === 'undefined' || !window.matchMedia) { return 'light'; }
        const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
        return matches ? 'dark' : 'light';
    }

    private resolveReducedMotion(): boolean {
        if (typeof window === 'undefined' || !window.matchMedia) { return false; }
        const { matches } = window.matchMedia('(prefers-reduced-motion: reduce)');
        return matches;
    }

    private resolvePlatform(): string {
        const nav = navigator as unknown as { userAgentData?: { platform?: string }; platform?: string };
        const { userAgentData, platform: legacyPlatform } = nav ?? {};
        const { platform: clientPlatform } = userAgentData ?? {};
        return clientPlatform || legacyPlatform || 'unknown';
    }

    private detectBrowserType(userAgent: string): string {
        const lower = userAgent.toLowerCase();
        const signatures: [string, string][] = [
            ['edg/', 'Edge'], ['opera', 'Opera'], ['opr/', 'Opera'],
            ['chrome', 'Chrome'], ['safari', 'Safari'], ['firefox', 'Firefox'],
        ];
        const matched = signatures.find(([key]) => lower.includes(key));
        return matched ? matched[1] : 'Unknown';
    }
}
