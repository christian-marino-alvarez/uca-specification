import {
    Kind,
    type Entry,
} from './types.js';

export const __ID__ = 'catalog';

export const ENTRIES: readonly Entry[] = [
    {
        name: 'Action',
        kind: Kind.WEB,
        purpose: 'Autonomous interactive trigger unit that executes user intentions, commands, and form submissions through a button element',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Box',
        kind: Kind.WEB,
        purpose: 'Autonomous spatial container that groups, distributes, and visually delimits elements through dimension, layout, and appearance qualities',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Collection',
        kind: Kind.WEB,
        purpose: 'Autonomous data collection container that groups interactive fields, orchestrates user input, and handles form submission',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Dropdown',
        kind: Kind.WEB,
        purpose: 'Autonomous collapsible selection unit that renders and manages a dropdown select menu of options',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Input',
        kind: Kind.WEB,
        purpose: 'Autonomous text entry unit that captures, validates, and emits user text input through a native input field',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Options',
        kind: Kind.WEB,
        purpose: 'Autonomous mutually exclusive choice unit that renders and manages a group of radio button options for single selection',
        capabilities: [
            'render',
            'update',
            'remove',
            'event',
        ],
    },
    {
        name: 'Picture',
        kind: Kind.WEB,
        purpose: 'Autonomous visual representation unit that renders, adapts, and manages imagery, alternate text, and presentation qualities',
        capabilities: [
            'render',
            'update',
            'remove',
        ],
    },
    {
        name: 'Interaction',
        kind: Kind.LOGIC,
        purpose: 'Resolve declared user interactions into domain operations using the current values of their scoped fields',
        capabilities: [
            'bind',
            'handle',
        ],
    },
];
