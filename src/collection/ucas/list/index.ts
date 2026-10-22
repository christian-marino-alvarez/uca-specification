import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import {
    __ID__,
    DEFAULT_LIST_QUALITIES,
    DEFAULT_TAG,
    LIST_VISUAL_DISPOSITION,
    buildListAttributes,
    formatListItemsContent,
    resolveContainerSelector,
} from './constants.js';
import {
    type Body,
    type Qualities,
    DataType,
    SignalType,
} from './types.js';

export class List extends Uca<Body> {
    public static override purpose: string =
        'Organize and present ordered or unordered sequential items of domain information';

    public static readonly visualDisposition = LIST_VISUAL_DISPOSITION;

    public static override disposition: Disposition<Body> = {
        aim: { description: List.purpose },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.UPDATED,
            WebComponentSignalType.REMOVED,
            WebComponentSignalType.ERROR,
            ...WebComponent.disposition.reactTo ?? [],
            ...Css.disposition.reactTo ?? [],
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                description: 'Command to render the list',
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.UPDATE_PAYLOAD,
                description: 'Command to update the list',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                description: 'Command to remove the list',
            },
        ],
        outputs: [
            {
                signal: SignalType.CREATED,
                type: DataType.CREATED_RESULT,
                description: 'List created confirmation',
            },
            {
                signal: SignalType.UPDATED,
                type: DataType.UPDATED_RESULT,
                description: 'List updated confirmation',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.REMOVED_RESULT,
                description: 'List removed confirmation',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'List error notification',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        return [
            [
                WebComponent,
                {
                    aim: {
                        description: WebComponent.AIM,
                        body: { id: `${id}:web-component` },
                    },
                    reactTo: [...WebComponent.disposition.reactTo ?? []],
                },
            ],
            [
                Css,
                {
                    aim: {
                        description: Css.AIM,
                        body: { id: `${id}:css` },
                    },
                    reactTo: [...Css.disposition.reactTo ?? []],
                },
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.RENDER:
                this.handleRender(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case WebComponentSignalType.RENDERED:
                this.handleComponentRendered(signal);
                break;
            case WebComponentSignalType.UPDATED:
                this.handleComponentUpdated(signal);
                break;
            case WebComponentSignalType.REMOVED:
                this.handleComponentRemoved(signal);
                break;
            case WebComponentSignalType.ERROR:
                this.handleComponentError(signal);
                break;
        }
    }

    private resolveQualities(qualities?: Qualities): Qualities {
        return {
            ...DEFAULT_LIST_QUALITIES,
            ...qualities,
        };
    }

    private handleRender(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const {
            elementId = this.id,
            parentTo,
            containerElement,
            items,
            ordered,
            qualities,
            events,
            context,
        } = payload;
        const targetContainer = resolveContainerSelector(containerElement, parentTo);
        const attributes = buildListAttributes(payload);
        const content = formatListItemsContent(items, ordered);
        const resolvedQualities = this.resolveQualities(qualities);
        this.pulse(CssSignalType.APPLY, {
            elementId,
            qualities: resolvedQualities,
        });
        this.pulse(WebComponentSignalType.RENDER, {
            elementId,
            tag: DEFAULT_TAG,
            containerElement: targetContainer,
            attributes,
            content,
            events,
            context,
        });
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const {
            elementId = this.id,
            items,
            ordered,
            qualities,
            events,
            context,
        } = payload;
        const attributes = buildListAttributes(payload);
        const content = formatListItemsContent(items, ordered);
        const resolvedQualities = this.resolveQualities(qualities);
        this.pulse(CssSignalType.APPLY, {
            elementId,
            qualities: resolvedQualities,
        });
        this.pulse(WebComponentSignalType.UPDATE, {
            elementId,
            attributes,
            content,
            events,
            context,
        });
    }

    private handleRemove(value?: unknown): void {
        const {
            elementId = this.id,
            context,
        } = (value ?? {}) as Body & { context?: unknown };
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, {
            elementId,
            context,
        });
    }

    private handleComponentRendered(signal: Signal): void {
        const { value } = signal;
        const {
            elementId = this.id,
            tag,
        } = (value ?? {}) as { elementId?: string; tag?: string };
        if (tag && tag !== DEFAULT_TAG) {
            return;
        }
        this.pulse(SignalType.CREATED, {
            elementId,
            detail: value,
        });
    }

    private handleComponentUpdated(signal: Signal): void {
        const { value } = signal;
        const {
            elementId = this.id,
        } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.UPDATED, {
            elementId,
            detail: value,
        });
    }

    private handleComponentRemoved(signal: Signal): void {
        const { value } = signal;
        const {
            elementId = this.id,
        } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.REMOVED, {
            elementId,
            detail: value,
        });
    }

    private handleComponentError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}
