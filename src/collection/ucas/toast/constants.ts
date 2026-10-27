import type {
    Body,
    Qualities,
} from './schema.js';

export const __ID__ = 'toast';

export const DEFAULT_TAG = 'aside' as const;

export const DEFAULT_EVENTS: readonly string[] = [
    'click',
] as const;

export const DEFAULT_TOAST_QUALITIES: Qualities = {
    elevation: 'medium',
    maxWidth: 'compact',
    outline: 'subtle',
    shape: 'medium',
    spacingBlock: 'medium',
    spacingInline: 'medium',
    surface: 'card',
};

export const resolveContainerSelector = (
    containerElement?: string,
    parentTo?: string,
): string | undefined => {
    if (containerElement) {
        return containerElement;
    }
    if (parentTo) {
        return parentTo.startsWith('#') ? parentTo : `#${parentTo}`;
    }
    return undefined;
};

export const resolveToastContent = (
    payload: Body,
): string => {
    const {
        actionLabel,
        icon,
        message,
    } = payload;
    const iconElement = icon
        ? `<span class="material-symbols-outlined" style="font-size: 1.25rem;">${icon}</span>`
        : '';
    const actionElement = actionLabel
        ? `<button type="button" data-action="custom" style="background: transparent; border: none; color: var(--md-sys-color-primary, #60A5FA); font-weight: 600; cursor: pointer;">${actionLabel}</button>`
        : '';
    const dismissElement = `<button type="button" data-action="dismiss" style="background: transparent; border: none; color: inherit; opacity: 0.7; cursor: pointer;">&times;</button>`;
    return `<div style="display: flex; align-items: center; gap: 0.75rem;"><div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">${iconElement}<span>${message}</span></div>${actionElement}${dismissElement}</div>`;
};

export const resolveToastRenderPayload = (
    defaultId: string,
    payload: Body & { context?: unknown },
): Record<string, unknown> => {
    const {
        containerElement,
        context,
        elementId = defaultId,
        events = [
            ...DEFAULT_EVENTS,
        ],
        parentTo,
    } = payload;
    return {
        attributes: {},
        containerElement: resolveContainerSelector(containerElement, parentTo),
        content: resolveToastContent(payload),
        context,
        elementId,
        events,
        tag: DEFAULT_TAG,
    };
};

export const resolveToastUpdatePayload = (
    defaultId: string,
    payload: Body & { context?: unknown },
): Record<string, unknown> => {
    const {
        context,
        elementId = defaultId,
        events,
    } = payload;
    return {
        attributes: {},
        content: resolveToastContent(payload),
        context,
        elementId,
        events,
    };
};

export const TOAST_VISUAL_DISPOSITION = {
    defaultQualities: DEFAULT_TOAST_QUALITIES,
    description: 'Notificación emergente transitoria (toast/snackbar) para retroalimentación al usuario',
    role: 'alert',
    supportedQualities: [
        'surface',
        'outline',
        'shape',
        'elevation',
        'spacingInline',
        'spacingBlock',
        'maxWidth',
    ],
} as const;
