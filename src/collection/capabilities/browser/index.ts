import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_BROWSER,
    DEFAULT_SCREEN,
    DEFAULT_SIGNALS,
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
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.READ, type: DataType.VOID, description: 'Request fresh browser context capture' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Unbind window listeners and destroy session' },
        ],
        outputs: [
            { signal: SignalType.DETECTED, type: DataType.RECORD, description: 'Initial or requested browser context' },
            { signal: SignalType.CHANGED, type: DataType.RECORD, description: 'Updated browser context upon resize or orientation change' },
            { signal: SignalType.DESTROYED, type: DataType.RECORD, description: 'Confirmation that window listeners are destroyed' },
        ],
    };

    private resizeListener?: () => void;

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.READ:
                this.handleRead();
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            default:
                break;
        }
    }

    private handleRead(): void {
        this.bindWindowListeners();
        this.pulse(SignalType.DETECTED, this.captureContext());
    }

    private handleDestroy(): void {
        this.unbindWindowListeners();
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private bindWindowListeners(): void {
        if (typeof window === 'undefined' || this.resizeListener) { return; }
        this.resizeListener = () => this.pulse(SignalType.CHANGED, this.captureContext());
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('orientationchange', this.resizeListener);
    }

    private unbindWindowListeners(): void {
        if (typeof window === 'undefined' || !this.resizeListener) { return; }
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('orientationchange', this.resizeListener);
        this.resizeListener = undefined;
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
        const isDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const type = this.detectBrowserType(userAgent);
        const platform = this.resolvePlatform();
        return { type, userAgent, language, platform, touch: maxTouchPoints > 0, maxTouchPoints, colorScheme: isDark ? 'dark' : 'light', reducedMotion: Boolean(reducedMotion), online: onLine };
    }

    private resolvePlatform(): string {
        const clientData = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData;
        const { platform: clientPlatform } = clientData ?? {};
        const { platform: legacyPlatform } = navigator as unknown as { platform?: string };
        return clientPlatform || legacyPlatform || 'unknown';
    }

    private detectBrowserType(userAgent: string): string {
        const lower = userAgent.toLowerCase();
        if (lower.includes('edg/')) { return 'Edge'; }
        if (lower.includes('chrome') && !lower.includes('edg')) { return 'Chrome'; }
        if (lower.includes('safari') && !lower.includes('chrome')) { return 'Safari'; }
        if (lower.includes('firefox')) { return 'Firefox'; }
        if (lower.includes('opera') || lower.includes('opr/')) { return 'Opera'; }
        return 'Unknown';
    }
}
