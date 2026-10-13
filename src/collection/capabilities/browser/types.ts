export enum SignalType {
    DETECT = 'browser.detect',
    DETECTED = 'browser.detected',
    CHANGED = 'browser.changed',
    DESTROY = 'browser.destroy',
    DESTROYED = 'browser.destroyed',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'record',
    CONTEXT = 'BrowserContext',
}

export interface ViewportContext {
    readonly width: number;
    readonly height: number;
}

export interface ScreenContext {
    readonly width: number;
    readonly height: number;
    readonly availWidth: number;
    readonly availHeight: number;
    readonly colorDepth: number;
    readonly pixelRatio: number;
    readonly orientation: string;
}

export interface NavigatorContext {
    readonly type: string;
    readonly userAgent: string;
    readonly language: string;
    readonly platform: string;
    readonly touch: boolean;
    readonly maxTouchPoints: number;
    readonly colorScheme: 'dark' | 'light';
    readonly reducedMotion: boolean;
    readonly online: boolean;
}

export interface BrowserContext {
    readonly viewport: ViewportContext;
    readonly screen: ScreenContext;
    readonly browser: NavigatorContext;
}

export interface Body {
    readonly context?: BrowserContext;
}
