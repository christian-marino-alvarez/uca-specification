export const __ID__ = 'browser';
export const AIM = 'Detectar y transmitir reactivamente el contexto de entorno del navegador, viewport y pantalla';
export const CHANGE_SETTLE_MS = 500;

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
    writingDirection: 'ltr' as const,
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

export const BREAKPOINT_QUERIES = [
    '(max-width: 480px)',
    '(min-width: 481px) and (max-width: 768px)',
    '(min-width: 769px) and (max-width: 1200px)',
    '(min-width: 1201px) and (max-width: 1440px)',
    '(min-width: 1441px)',
    '(orientation: portrait)',
    '(prefers-color-scheme: dark)',
] as const;
