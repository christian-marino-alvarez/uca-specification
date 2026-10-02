import { SignalType } from './types.js';

export const __ID__ = 'server';

export const DEFAULT_PORT = 3000;

export const DEFAULT_HOSTNAME = '0.0.0.0';

export const DEFAULT_AUTO_START = true;

export const DEFAULT_DIST_DIR = 'dist';

export const DEFAULT_WEB_DIR = 'dist/web';

export const DEFAULT_SIGNALS = [
    SignalType.START,
    SignalType.STOP,
    SignalType.ROUTE,
    SignalType.RESPOND,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

export const DEFAULT_TEMPERATURE = 0.1;

export const DEFAULT_MAX_OUTPUT_TOKENS = 4096;

export const DEFAULT_UCA_VIEW_SCHEMA: Record<string, unknown> = {
    type: 'object',
    properties: {
        answer: {
            type: 'string',
            description: 'Explicación concisa y directa de la arquitectura UCA (máximo 1-2 párrafos)',
        },
        ucas: {
            type: 'array',
            description: 'Array plano de UCAs [<uca-id>: <disposition>] a un único nivel sin árbol ni anidación jerárquica',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'ID ontológico de la UCA (ej: "box:center-container", "action:query-button", "list:features")',
                    },
                    aim: {
                        type: 'object',
                        properties: {
                            description: { type: 'string', description: 'Propósito u objetivo de la UCA' },
                            body: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'Texto del componente para Box' },
                                    label: { type: 'string', description: 'Texto del botón Action o Toggle' },
                                    items: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Lista de elementos para List',
                                    },
                                    className: { type: 'string' },
                                    checked: { type: 'boolean', description: 'Estado para Toggle' },
                                    hidden: { type: 'boolean', description: 'Visibilidad del elemento' },
                                    disabled: { type: 'boolean', description: 'Deshabilitar interacción' },
                                    title: { type: 'string' },
                                    options: { type: 'array', items: { type: 'string' } },
                                    value: { type: 'string' },
                                    placeholder: { type: 'string' },
                                    source: { type: 'string' },
                                    alt: { type: 'string' },
                                },
                            },
                        },
                        required: ['description'],
                    },
                    reactTo: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Señales a las que reacciona la UCA',
                    },
                },
                required: ['id', 'aim', 'reactTo'],
            },
        },
    },
    required: ['answer', 'ucas'],
};

