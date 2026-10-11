export const __ID__ = 'browser';
export const AIM = 'Detect and stream reactive browser, viewport, and screen environment context';

export const DEFAULT_VIEWPORT = { width: 1440, height: 900 } as const;
export const DEFAULT_SCREEN = {
    width: 1440,
    height: 900,
    availWidth: 1440,
    availHeight: 900,
    colorDepth: 24,
    pixelRatio: 1,
    orientation: 'landscape-primary',
} as const;

export const DEFAULT_BROWSER = {
    type: 'Node',
    userAgent: 'Node',
    language: 'es-ES',
    platform: 'server',
    touch: false,
    maxTouchPoints: 0,
    colorScheme: 'dark' as const,
    reducedMotion: false,
    online: true,
} as const;

export const DEFAULT_CONTEXT = {
    viewport: DEFAULT_VIEWPORT,
    screen: DEFAULT_SCREEN,
    browser: DEFAULT_BROWSER,
} as const;
