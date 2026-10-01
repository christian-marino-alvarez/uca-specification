import type { Disposition } from '@uca/core/types';

export const __ID__ = 'app';

export const DEFAULT_SIGNALS: readonly string[] = [
    'app.init',
    'app.start',
    'app.stop',
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const INITIAL_VIEW_NEED = 'Crear una vista con un único input y un botón centrados en el medio de la página y que ponga en placeholder: que quieres conocer de la Uca';

export const VIEW_DISPOSITION_SCHEMA = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'ViewDisposition',
    type: 'object',
    properties: {
        ucas: {
            type: 'object',
            description: 'Map of UCA IDs to their respective dispositions',
            additionalProperties: {
                type: 'object',
                properties: {
                    aim: {
                        type: 'object',
                        properties: {
                            description: { type: 'string' },
                            body: { type: 'object' },
                        },
                        required: ['description'],
                    },
                    reactTo: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
                required: ['aim'],
            },
        },
    },
    required: ['ucas'],
} as const;

export const INITIAL_VIEW_DISPOSITION: Record<string, Disposition> = {
    'center-container': {
        aim: {
            description: 'Container layout centered in the middle of the page',
            body: { className: 'center-layout', role: 'main' },
        },
        reactTo: ['box.create', 'box.update', 'box.remove'],
    },
    'query-input': {
        aim: {
            description: 'Inquiry input for UCA exploration',
            body: { placeholder: 'que quieres conocer de la Uca', value: '' },
        },
        reactTo: ['input.create', 'input.update', 'input.change'],
    },
    'query-button': {
        aim: {
            description: 'Button action to submit the query',
            body: { label: 'Consultar', role: 'button' },
        },
        reactTo: ['action.create', 'action.update', 'action.trigger'],
    },
} as const;
