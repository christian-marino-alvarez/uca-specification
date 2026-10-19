import type { Projector } from './types.js';
import { heading, paragraph, access, choice, toggle, range, quantity, moment, symbol, status, progress, separator } from './projection.js';
import { SignalType as ComponentSignalType } from '@uca/capability-web-component/types';
import { InteractionType, Kind } from './types.js';

export const __ID__ = 'presentation';
export const DEFAULT_KIND = Kind.PARAGRAPH;
export const DEFAULT_IMPORTANCE = 1;
export const DEFAULT_MINIMUM = 0;
export const DEFAULT_MAXIMUM = 100;
export const DEFAULT_STEP = 1;
export const DEFAULT_ORIENTATION = 'horizontal';
export const EMPTY_TEXT = '';
export const EMPTY_EVENTS: readonly string[] = [];
export const CONTROL_EVENTS: readonly string[] = [
    InteractionType.INPUT,
    InteractionType.CHANGE,
];
export const ACCESS_EVENTS: readonly string[] = [
    InteractionType.CLICK,
];
export const CONTROL_KINDS: readonly Kind[] = [
    Kind.CHOICE,
    Kind.TOGGLE,
    Kind.RANGE,
    Kind.QUANTITY,
    Kind.MOMENT,
];
export const MANAGED_ATTRIBUTES: readonly string[] = [
    'href',
    'aria-label',
    'aria-description',
    'aria-valuetext',
    'aria-orientation',
    'data-tone',
    'disabled',
    'required',
    'checked',
    'min',
    'max',
    'step',
    'value',
    'name',
];
export const ESCAPES: Readonly<Record<string, string>> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export const LIFECYCLE_SIGNALS: readonly string[] = [
    ComponentSignalType.RENDERED,
    ComponentSignalType.UPDATED,
    ComponentSignalType.REMOVED,
    ComponentSignalType.EVENT,
];

export const PROJECTORS: Readonly<Record<Kind, Projector>> = {
    [Kind.HEADING]: heading,
    [Kind.PARAGRAPH]: paragraph,
    [Kind.ACCESS]: access,
    [Kind.CHOICE]: choice,
    [Kind.TOGGLE]: toggle,
    [Kind.RANGE]: range,
    [Kind.QUANTITY]: quantity,
    [Kind.MOMENT]: moment,
    [Kind.SYMBOL]: symbol,
    [Kind.STATUS]: status,
    [Kind.PROGRESS]: progress,
    [Kind.SEPARATOR]: separator,
};

export const KIND_EVENTS: Readonly<Record<Kind, readonly string[]>> = {
    [Kind.HEADING]: EMPTY_EVENTS,
    [Kind.PARAGRAPH]: EMPTY_EVENTS,
    [Kind.ACCESS]: ACCESS_EVENTS,
    [Kind.CHOICE]: CONTROL_EVENTS,
    [Kind.TOGGLE]: CONTROL_EVENTS,
    [Kind.RANGE]: CONTROL_EVENTS,
    [Kind.QUANTITY]: CONTROL_EVENTS,
    [Kind.MOMENT]: CONTROL_EVENTS,
    [Kind.SYMBOL]: EMPTY_EVENTS,
    [Kind.STATUS]: EMPTY_EVENTS,
    [Kind.PROGRESS]: EMPTY_EVENTS,
    [Kind.SEPARATOR]: EMPTY_EVENTS,
};

export const TAGS = {
    PARAGRAPH: 'p',
    ACCESS: 'a',
    CHOICE: 'select',
    INPUT: 'input',
    SYMBOL: 'span',
    STATUS: 'output',
    PROGRESS: 'progress',
    SEPARATOR: 'hr',
} as const;

export const HEADING_TAGS: Readonly<Record<number, string>> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
};
