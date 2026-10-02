import { SignalType } from './types.js';

export const __ID__ = 'view-composer';
export const PURPOSE = 'Compose cognitive view graphs and propagate reactive dispositions via LLM';
export const DEFAULT_SIGNALS = [SignalType.COMPOSE] as const;

export const DEFAULT_VIEW_SCHEMA = {
    type: 'object',
    properties: {
        answer: {
            type: 'string',
            description: 'Cognitive reasoning or direct answer (concise, max 1-2 paragraphs)',
        },
        ucas: {
            type: 'array',
            description: 'Flat array of single-level UCA dispositions [<uca-id>: <disposition>] without tree hierarchy',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Ontological UCA ID (e.g. "box:center-container", "action:query-button", "list:features")',
                    },
                    aim: {
                        type: 'object',
                        properties: {
                            description: { type: 'string' },
                            body: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string' },
                                    label: { type: 'string' },
                                    items: { type: 'array', items: { type: 'string' } },
                                    className: { type: 'string' },
                                    checked: { type: 'boolean' },
                                    hidden: { type: 'boolean' },
                                    disabled: { type: 'boolean' },
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
                    },
                },
                required: ['id', 'aim', 'reactTo'],
            },
        },
    },
    required: ['answer', 'ucas'],
} as const;

export const AVAILABLE_UCAS_CATALOG = `Available UCAs Palette:
- Box: Visual container and textual projection. Aim body: { text?: string, role?: string, className?: string }. Reacts to: ['box.create', 'box.update', 'box.remove'].
- Action: Interactive buttons and triggers. Aim body: { label?: string, title?: string, disabled?: boolean }. Reacts to: ['action.create', 'action.trigger'].
- List: Ordered/unordered items sequence. Aim body: { items?: string[], ordered?: boolean, spacing?: string }. Reacts to: ['list.create', 'list.update'].
- Input: Text input field. Aim body: { value?: string, placeholder?: string, disabled?: boolean }. Reacts to: ['input.create', 'input.update'].
- Choice: Selection checkboxes/radios. Aim body: { options?: string[], selected?: string[], multiple?: boolean }. Reacts to: ['choice.create', 'choice.select'].
- Dropdown: Option selection menu. Aim body: { options?: string[], selected?: string }. Reacts to: ['dropdown.create', 'dropdown.select'].
- Picture: Media images and illustrations. Aim body: { source?: string, alt?: string, dimensions?: { width: number, height: number } }. Reacts to: ['picture.create'].
- Toggle: Binary on/off switch. Aim body: { checked?: boolean, title?: string }. Reacts to: ['toggle.create', 'toggle.toggle'].
- Collector: Form data aggregator. Aim body: { name?: string, title?: string }. Reacts to: ['collector.create', 'collector.submit'].
- Access: Gate condition and authorization. Aim body: { source?: string, title?: string }. Reacts to: ['access.create'].
` as const;
