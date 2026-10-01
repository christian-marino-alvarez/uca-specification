import { SignalType } from './types.js';

export const __ID__ = 'view-composer';
export const PURPOSE = 'Compose cognitive view graphs and propagate reactive dispositions via LLM';
export const DEFAULT_SIGNALS = [SignalType.COMPOSE] as const;

export const DEFAULT_VIEW_SCHEMA = {
    type: 'object',
    properties: {
        ucas: {
            type: 'object',
            description: 'Map of UCA IDs to their respective dispositions',
            additionalProperties: {
                type: 'object',
                properties: {
                    aim: { type: 'object', properties: { description: { type: 'string' }, body: { type: 'object' } } },
                    reactTo: { type: 'array', items: { type: 'string' } },
                },
            },
        },
    },
    required: ['ucas'],
} as const;
