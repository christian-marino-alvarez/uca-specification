import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    DEFAULT_CLASS,
    SKELETON_CSS,
    STYLE_TAG_ID,
    __ID__,
} from './constants.js';
import {
    errorSchema,
    removePayloadSchema,
    removedResultSchema,
    showPayloadSchema,
    shownResultSchema,
    type Body,
    type RemovePayload,
    type ShowPayload,
} from './schema.js';
import {
    DataType,
    SignalType,
} from './types.js';

export class Skeleton extends Capability<Body> {
    public static readonly AIM: string =
        'Render and manage animated skeleton loading placeholders in DOM containers during asynchronous area construction';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Skeleton.AIM,
        },
        reactTo: [
            SignalType.SHOW,
            SignalType.REMOVE,
        ],
        inputs: [
            {
                signal: SignalType.SHOW,
                type: DataType.SHOW_PAYLOAD,
                schema: showPayloadSchema,
                description: 'Render skeleton loading placeholder in container',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                schema: removePayloadSchema,
                description: 'Remove skeleton loading placeholder from container',
            },
        ],
        outputs: [
            {
                signal: SignalType.SHOWN,
                type: DataType.SHOWN_RESULT,
                schema: shownResultSchema,
                description: 'Skeleton loading placeholder rendered confirmation',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.REMOVED_RESULT,
                schema: removedResultSchema,
                description: 'Skeleton loading placeholder removed confirmation',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR_RESULT,
                schema: errorSchema,
                description: 'Skeleton operation failed',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.SHOW:
                this.handleShow(signal);
                break;
            case SignalType.REMOVE:
                this.handleRemove(signal);
                break;
        }
    }

    private ensureStyles(): void {
        if (typeof document === 'undefined' || document.getElementById(STYLE_TAG_ID)) {
            return;
        }
        const style = document.createElement('style');
        style.id = STYLE_TAG_ID;
        style.textContent = SKELETON_CSS;
        document.head.appendChild(style);
    }

    private resolveContainer(elementId: string, containerElement?: string): Element | null {
        if (typeof document === 'undefined') {
            return null;
        }
        return this.findTargetElement(containerElement ?? elementId);
    }

    private findTargetElement(target: string): Element | null {
        if (target === 'body' || target === '#body') {
            return document.body;
        }
        const id = target.startsWith('#') ? target.slice(1) : target;
        return document.getElementById(id) ?? document.querySelector(target);
    }

    private mountSkeletonElement(container: Element, elementId: string): void {
        if (container.querySelector(`[data-skeleton="${elementId}"]`)) {
            return;
        }
        const skeleton = document.createElement('div');
        skeleton.className = DEFAULT_CLASS;
        skeleton.setAttribute('data-skeleton', elementId);
        container.appendChild(skeleton);
    }

    private renderSkeleton(elementId: string, containerElement?: string): void {
        this.ensureStyles();
        const container = this.resolveContainer(elementId, containerElement);
        if (container) {
            this.mountSkeletonElement(container, elementId);
        }
    }

    private pulseError(message: string): void {
        this.pulse(SignalType.ERROR, {
            elementId: null,
            error: message,
        });
    }

    private parseShowPayload(value: unknown): ShowPayload | undefined {
        const parsed = showPayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(parsed.error.message);
            return undefined;
        }
        return parsed.data;
    }

    private dispatchShow(payload: ShowPayload): void {
        const {
            elementId,
            containerElement,
            context,
        } = payload;
        this.renderSkeleton(elementId, containerElement);
        this.pulse(SignalType.SHOWN, {
            elementId,
            context,
        });
    }

    private handleShow(signal: Signal): void {
        const {
            value,
        } = signal;
        const payload = this.parseShowPayload(value);
        if (!payload) {
            return;
        }
        this.dispatchShow(payload);
    }

    private parseRemovePayload(value: unknown): RemovePayload | undefined {
        const parsed = removePayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(parsed.error.message);
            return undefined;
        }
        return parsed.data;
    }

    private unmountSkeleton(elementId: string): void {
        if (typeof document !== 'undefined') {
            document.querySelectorAll(`[data-skeleton="${elementId}"]`).forEach((node) => {
                node.remove();
            });
        }
    }

    private dispatchRemove(payload: RemovePayload): void {
        const {
            elementId,
            context,
        } = payload;
        this.unmountSkeleton(elementId);
        this.pulse(SignalType.REMOVED, {
            elementId,
            context,
        });
    }

    private handleRemove(signal: Signal): void {
        const {
            value,
        } = signal;
        const payload = this.parseRemovePayload(value);
        if (!payload) {
            return;
        }
        this.dispatchRemove(payload);
    }
}
