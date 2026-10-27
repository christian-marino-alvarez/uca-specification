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
    cssDeclaration,
    webComponentDeclaration,
} from '../declaration.js';
import { bodySchema } from './schema.js';
import {
    DEFAULT_TOAST_QUALITIES,
    TOAST_VISUAL_DISPOSITION,
    __ID__,
    resolveToastRenderPayload,
    resolveToastUpdatePayload,
} from './constants.js';
import {
    type Body,
    DataType,
    type Qualities,
    SignalType,
} from './types.js';

export class Toast extends Uca<Body> {
    public static override purpose: string =
        'Autonomous transient feedback surface communicating system notifications, status alerts, or brief confirmation actions';

    public static readonly visualDisposition = TOAST_VISUAL_DISPOSITION;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Toast.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            ...Toast.reactToWebComponent(),
            ...Toast.reactToCss(),
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                schema: bodySchema,
                description: 'Render and display the transient toast notification',
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.UPDATE_PAYLOAD,
                schema: bodySchema,
                description: 'Update toast content, tone, or message',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                schema: bodySchema,
                description: 'Dismiss and remove the toast notification',
            },
        ],
        outputs: [
            {
                signal: SignalType.CREATED,
                type: DataType.CREATED_RESULT,
                schema: bodySchema,
                description: 'Toast element created confirmation',
            },
            {
                signal: SignalType.UPDATED,
                type: DataType.UPDATED_RESULT,
                schema: bodySchema,
                description: 'Toast element updated confirmation',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.REMOVED_RESULT,
                schema: bodySchema,
                description: 'Toast element removed confirmation',
            },
            {
                signal: SignalType.ACTION,
                type: DataType.ACTION_RESULT,
                description: 'Toast action button clicked',
            },
            {
                signal: SignalType.DISMISSED,
                type: DataType.DISMISSED_RESULT,
                description: 'Toast dismissed by user or timeout',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Toast error notification',
            },
        ],
    };

    private static reactToWebComponent(): string[] {
        const {
            reactTo = [],
        } = WebComponent.disposition;
        return Toast.mergeWebComponentSignals(reactTo);
    }

    private static mergeWebComponentSignals(signals: string[]): string[] {
        return signals.concat(
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.UPDATED,
            WebComponentSignalType.REMOVED,
            WebComponentSignalType.ERROR,
            WebComponentSignalType.EVENT,
        );
    }

    private static reactToCss(): string[] {
        const {
            reactTo = [],
        } = Css.disposition;
        return [
            ...reactTo,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            webComponentDeclaration(id),
            cssDeclaration(id),
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
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
            case WebComponentSignalType.EVENT:
                this.handleComponentEvent(signal);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const {
            elementId = this.id,
            qualities,
        } = payload;
        this.applyStyles(elementId, qualities);
        this.renderComponent(payload);
    }

    private applyStyles(elementId: string, qualities?: Qualities): void {
        const resolvedQualities = {
            ...DEFAULT_TOAST_QUALITIES,
            ...qualities,
        };
        this.pulse(CssSignalType.APPLY, {
            elementId,
            qualities: resolvedQualities,
        });
    }

    private renderComponent(payload: Body & { context?: unknown }): void {
        const renderPayload = resolveToastRenderPayload(this.id, payload);
        this.pulse(WebComponentSignalType.RENDER, renderPayload);
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const {
            elementId = this.id,
            qualities,
        } = payload;
        this.applyStyles(elementId, qualities);
        this.updateComponent(payload);
    }

    private updateComponent(payload: Body & { context?: unknown }): void {
        const updatePayload = resolveToastUpdatePayload(this.id, payload);
        this.pulse(WebComponentSignalType.UPDATE, updatePayload);
    }

    private handleRemove(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        this.removeStyles(payload);
        this.removeComponent(payload);
    }

    private removeStyles(payload: Body): void {
        const {
            elementId = this.id,
        } = payload;
        this.pulse(CssSignalType.REMOVE, {
            elementId,
        });
    }

    private removeComponent(payload: Body & { context?: unknown }): void {
        const {
            context,
            elementId = this.id,
        } = payload;
        this.pulse(WebComponentSignalType.REMOVE, {
            context,
            elementId,
        });
    }

    private handleComponentRendered(signal: Signal): void {
        const payload = this.extractComponentLifecyclePayload(signal);
        this.pulse(SignalType.CREATED, payload);
    }

    private handleComponentUpdated(signal: Signal): void {
        const payload = this.extractComponentLifecyclePayload(signal);
        this.pulse(SignalType.UPDATED, payload);
    }

    private handleComponentRemoved(signal: Signal): void {
        const payload = this.extractComponentLifecyclePayload(signal);
        this.pulse(SignalType.REMOVED, payload);
    }

    private extractComponentLifecyclePayload(signal: Signal): Record<string, unknown> {
        const {
            value,
        } = signal;
        const {
            elementId = this.id,
        } = (value ?? {}) as { elementId?: string };
        return {
            detail: value,
            elementId,
        };
    }

    private handleComponentEvent(signal: Signal): void {
        const {
            value,
        } = signal;
        const eventDetail = value as { target?: { dataset?: { action?: string } } };
        const action = eventDetail?.target?.dataset?.action;
        switch (action) {
            case 'dismiss':
                this.pulse(SignalType.DISMISSED, value);
                break;
            default:
                this.pulse(SignalType.ACTION, value);
                break;
        }
    }

    private handleComponentError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}
