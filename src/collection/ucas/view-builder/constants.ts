import { SignalType } from './types.js';

export const __ID__ = 'view-builder';

export const DEFAULT_SIGNALS = [
    SignalType.BUILD,
    SignalType.ABORT,
] as const;

export const SUPPORTED_ELEMENT_TYPES = [
    'box',
    'picture',
    'input',
    'dropdown',
    'list',
    'access',
    'action',
    'collector',
    'toggle',
    'choice',
] as const;

export const DEFAULT_VIEW_SCHEMA = {
    visual: { type: 'object', description: 'Visual hierarchy of web capabilities (box, input, action, etc)' },
    graph: { type: 'object', description: 'Topological reactive connections and signals between elements' },
} as const;
