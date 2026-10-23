import type { Body, Qualities } from './schema.js';

export const __ID__ = 'dialog';

export const DEFAULT_TAG = 'dialog' as const;

export const DEFAULT_EVENTS: readonly string[] = ['close'] as const;

export const DEFAULT_DIALOG_QUALITIES: Qualities = {
    surface: 'card',
    elevation: 'high',
    shape: 'large',
    outline: 'none',
    spacingInline: 'large',
    spacingBlock: 'large',
    maxWidth: 'compact',
};

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const resolveDialogContent = (payload: Body): string => {
    const { icon, headline, supportingText, content, confirmLabel = 'OK', cancelLabel } = payload;
    const parts: string[] = [];
    if (icon) {
        parts.push(`<div style="display: flex; justify-content: center; margin-bottom: 1rem;"><span class="material-symbols-outlined" style="font-size: 2rem;">${icon}</span></div>`);
    }
    parts.push(`<h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; text-align: ${icon ? 'center' : 'start'};">${headline}</h2>`);
    if (supportingText) {
        parts.push(`<p style="margin: 0 0 1rem 0; opacity: 0.8; line-height: 1.5;">${supportingText}</p>`);
    }
    if (content) {
        parts.push(`<div style="margin-bottom: 1rem;">${content}</div>`);
    }
    const actions: string[] = [];
    if (cancelLabel) {
        actions.push(`<button type="button" data-action="cancel" style="background: transparent; border: none; color: inherit; padding: 0.5rem 1rem; cursor: pointer;">${cancelLabel}</button>`);
    }
    actions.push(`<button type="button" data-action="confirm" style="background: var(--md-sys-color-primary, #e2e8f0); color: var(--md-sys-color-on-primary, #070A12); border: none; border-radius: 9999px; padding: 0.5rem 1.25rem; font-weight: 500; cursor: pointer;">${confirmLabel}</button>`);
    parts.push(`<div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">${actions.join('')}</div>`);
    return parts.join('\n');
};

export const DIALOG_VISUAL_DISPOSITION = {
    role: 'dialog',
    defaultQualities: DEFAULT_DIALOG_QUALITIES,
    supportedQualities: [
        'surface',
        'outline',
        'shape',
        'elevation',
        'spacingInline',
        'spacingBlock',
        'maxWidth',
        'variant',
    ],
    description: 'Diálogo modal interactivo de confirmación o acción de Material Design 3',
} as const;
