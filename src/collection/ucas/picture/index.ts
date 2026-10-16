import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { __ID__, DEFAULT_ALT, DEFAULT_LOADING } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class Picture extends Uca<Body> {
    public static override purpose: string = 'Autonomous visual representation unit that renders, adapts, and manages imagery, alternate text, and presentation qualities';

    public static override disposition: Disposition<Body> = {
        aim: { description: Picture.purpose },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.UPDATED,
            WebComponentSignalType.REMOVED,
            ...WebComponent.disposition.reactTo ?? [],
            ...Css.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.RENDER, type: DataType.RENDER_PAYLOAD, description: 'Command to render the picture' },
            { signal: SignalType.UPDATE, type: DataType.UPDATE_PAYLOAD, description: 'Command to update the picture' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Command to remove the picture' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.CREATED_RESULT, description: 'Picture created confirmation' },
            { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Picture updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Picture removed confirmation' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Picture error notification' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        const declarations: Cooky = [
            [WebComponent, { aim: { description: WebComponent.AIM, body: { id: `${id}:web-component` } }, reactTo: [...WebComponent.disposition.reactTo ?? []] }],
            [Css, { aim: { description: Css.AIM, body: { id: `${id}:css` } }, reactTo: [...Css.disposition.reactTo ?? []] }],
        ];
        return declarations;
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
                this.handleComponentRendered(value);
                break;
            case WebComponentSignalType.UPDATED:
                this.handleComponentUpdated(value);
                break;
            case WebComponentSignalType.REMOVED:
                this.handleComponentRemoved(value);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const { elementId = this.id, parentTo, containerElement, src, alt = DEFAULT_ALT, loading = DEFAULT_LOADING, qualities, context } = (value ?? {}) as Body & { context?: unknown };
        const targetContainer = containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        const attributes = { src: src ?? '', alt, loading };
        this.pulse(WebComponentSignalType.RENDER, {
            elementId,
            tag: 'img',
            containerElement: targetContainer,
            attributes,
            ...(context !== undefined && { context }),
        });
    }

    private handleUpdate(value?: unknown): void {
        const { elementId = this.id, src, alt, loading, qualities, context } = (value ?? {}) as Body;
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        const attributes = { ...(src && { src }), ...(alt && { alt }), ...(loading && { loading }) };
        this.pulse(WebComponentSignalType.UPDATE, { elementId, attributes, context });
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id, context } = (value ?? {}) as Body;
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, { elementId, context });
    }

    private handleComponentRendered(value?: unknown): void {
        const { elementId = this.id, tag, context } = (value ?? {}) as { elementId?: string; tag?: string; context?: unknown };
        if (tag && tag !== 'img') { return; }
        this.pulse(SignalType.CREATED, {
            elementId,
            detail: value,
            ...(context !== undefined && { context }),
        });
    }

    private handleComponentUpdated(value?: unknown): void {
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.UPDATED, { elementId, detail: value });
    }

    private handleComponentRemoved(value?: unknown): void {
        const {
            elementId = this.id,
            context,
        } = (value ?? {}) as {
            elementId?: string;
            context?: unknown;
        };
        this.pulse(SignalType.REMOVED, {
            elementId,
            detail: value,
            ...(context !== undefined && {
                context,
            }),
        });
    }
}
