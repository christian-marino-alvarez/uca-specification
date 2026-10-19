import { SignalType, type Payload, type Response, type Channel } from './types.js';
import { SignalType as ComponentSignalType } from '@uca/capability-web-component/types';
import {
    DEFAULT_IMPORTANCE,
    DEFAULT_MAXIMUM,
    DEFAULT_MINIMUM,
    DEFAULT_ORIENTATION,
    DEFAULT_STEP,
    EMPTY_TEXT,
    ESCAPES,
    TAGS,
    HEADING_TAGS,
} from './constants.js';
import { ControlType, Role, Kind, type Content, type Item, type Projection, type Projector } from './types.js';

export function escapeText(value: string = EMPTY_TEXT): string {
    return value.replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

export function text(body: Content, tag: string): Projection {
    const {
        text: content,
    } = body;
    return {
        tag,
        attributes: {},
        content: escapeText(content),
    };
}

export function heading(body: Content): Projection {
    const {
        importance = DEFAULT_IMPORTANCE,
    } = body;
    return text(body, HEADING_TAGS[importance]);
}

export function paragraph(body: Content): Projection {
    return text(body, TAGS.PARAGRAPH);
}

export function access({
    destination = EMPTY_TEXT,
    description,
    ...body
}: Content): Projection {
    return {
        ...text(body, TAGS.ACCESS),
        attributes: {
            href: destination,
            ...(description && {
                'aria-label': description,
            }),
        },
    };
}

export function option(item: Item, value?: string): string {
    const {
        value: identifier,
        label,
        selected,
        disabled,
    } = item;
    const selection = identifier === value || (value === undefined && selected) ? ' selected' : EMPTY_TEXT;
    const unavailable = disabled ? ' disabled' : EMPTY_TEXT;
    return `<option value="${escapeText(identifier)}"${selection}${unavailable}>${escapeText(label)}</option>`;
}

export function choice({
    items = [],
    value,
    placeholder,
    ...body
}: Content): Projection {
    const prefix = placeholder ? `<option value="">${escapeText(placeholder)}</option>` : EMPTY_TEXT;
    return {
        tag: TAGS.CHOICE,
        attributes: controlAttributes(body),
        content: prefix + items.map((item) => option(item, value as string | undefined)).join(EMPTY_TEXT),
    };
}

export function controlAttributes({
    label,
    name,
    disabled,
    required,
}: Content): Record<string, string> {
    return {
        'aria-label': label ?? EMPTY_TEXT,
        name: name ?? EMPTY_TEXT,
        ...(disabled && {
            disabled: EMPTY_TEXT,
        }),
        ...(required && {
            required: EMPTY_TEXT,
        }),
    };
}

export function toggle({
    value,
    ...body
}: Content): Projection {
    return {
        tag: TAGS.INPUT,
        attributes: {
            ...controlAttributes(body),
            type: ControlType.TOGGLE,
            ...(value && {
                checked: EMPTY_TEXT,
            }),
        },
    };
}

export function numeric(body: Content, type: string): Projection {
    return {
        tag: TAGS.INPUT,
        attributes: numericAttributes(body, type),
    };
}

export function numericAttributes({
    value,
    minimum,
    maximum,
    step = DEFAULT_STEP,
    unit,
    ...body
}: Content, type: string): Record<string, string> {
    return {
        ...controlAttributes(body),
        type,
        step: String(step),
        value: value === undefined ? EMPTY_TEXT : String(value),
        min: minimum === undefined ? EMPTY_TEXT : String(minimum),
        max: maximum === undefined ? EMPTY_TEXT : String(maximum),
        'aria-valuetext': unit ? `${value ?? EMPTY_TEXT} ${unit}` : EMPTY_TEXT,
    };
}

export function range(body: Content): Projection {
    return numeric({
        minimum: DEFAULT_MINIMUM,
        maximum: DEFAULT_MAXIMUM,
        ...body,
    }, ControlType.RANGE);
}

export function quantity(body: Content): Projection {
    return numeric(body, ControlType.QUANTITY);
}

export function moment(body: Content): Projection {
    return numeric(body, ControlType.MOMENT);
}

export function symbol(body: Content): Projection {
    const {
        description = EMPTY_TEXT,
    } = body;
    return {
        ...text(body, TAGS.SYMBOL),
        attributes: {
            role: Role.SYMBOL,
            'aria-label': description,
        },
    };
}

export function status({
    tone,
    ...body
}: Content): Projection {
    return {
        ...text(body, TAGS.STATUS),
        attributes: {
            role: Role.STATUS,
            'data-tone': tone ?? EMPTY_TEXT,
        },
    };
}

export function progress({
    label,
    value,
    total = DEFAULT_MAXIMUM,
}: Content): Projection {
    return {
        tag: TAGS.PROGRESS,
        attributes: {
            max: String(total),
            ...(value !== undefined && {
                value: String(value),
            }),
            'aria-label': label ?? EMPTY_TEXT,
        },
    };
}

export function separator({
    orientation = DEFAULT_ORIENTATION,
    description,
}: Content): Projection {
    return {
        tag: TAGS.SEPARATOR,
        attributes: {
            'aria-orientation': orientation,
            'aria-label': description ?? EMPTY_TEXT,
        },
    };
}

function buildPayloadContext(body: Content, operation: SignalType): { body: Content; operation: SignalType } {
    return {
        body,
        operation,
    };
}

function resolvePayloadTarget(containerElement?: string, parentId?: string, parentTo?: string): string | undefined {
    if (containerElement) {
        return containerElement;
    }
    return parentId?.startsWith('#') ? parentId : parentId ? `#${parentId}` : parentTo;
}

function assemblePayload(
    projection: Projection,
    elementId?: string,
    containerElement?: string,
    events: readonly string[] = [],
    context?: { body: Content; operation: SignalType },
): Payload {
    return {
        ...projection,
        elementId,
        containerElement,
        events,
        context,
    };
}

export function createPayload(
    projection: Projection,
    events: readonly string[],
    body: Content,
    operation: SignalType,
    identity: Content = body,
): Payload {
    const {
        elementId,
        parentId,
        parentTo,
        containerElement,
    } = identity;
    const container = resolvePayloadTarget(containerElement, parentId, parentTo);
    const context = buildPayloadContext(body, operation);
    return assemblePayload(projection, elementId, container, events, context);
}

export function lifecycleChannel(property: string, value: unknown): Channel {
    switch (property) {
        case ComponentSignalType.RENDERED:
            return renderedChannel(value as Response);
        case ComponentSignalType.UPDATED:
            return updatedChannel(value as Response);
        case ComponentSignalType.REMOVED:
            return removedChannel(value as Response);
        case ComponentSignalType.EVENT:
            return interactionChannel(value as Response);
        default:
            return {
                property,
                value,
            };
    }
}

export function renderedChannel({
    context: {
    body,
    operation,
},
    ...result
}: Response): Channel {
    return {
        property: operation === SignalType.UPDATE ? ComponentSignalType.UPDATED : ComponentSignalType.RENDERED,
        value: {
            ...result,
            context: body,
        },
    };
}

export function updatedChannel({
    context: {
    body,
},
    ...result
}: Response): Channel {
    return {
        property: ComponentSignalType.UPDATED,
        value: {
            ...result,
            context: body,
        },
    };
}

export function removedChannel({
    context: {
    body,
},
    ...result
}: Response): Channel {
    return {
        property: ComponentSignalType.REMOVED,
        value: {
            ...result,
            context: body,
        },
    };
}

export function interactionChannel({
    context: {
    body,
},
    ...result
}: Response): Channel {
    return {
        property: ComponentSignalType.EVENT,
        value: {
            ...result,
            context: body,
        },
    };
}
