import { Choice } from '@uca/choice';
import { type Body as ChoiceBody, SignalType as ChoiceSignalType } from '@uca/choice/types';
import { InteractionType } from '@uca/capability-presentation/types';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, SIGNALS } from './constants.js';
import { SignalType, type Body } from './types.js';

/** @deprecated Use Choice; this adapter preserves legacy signal names. */
export class Dropdown extends Choice {
    public static override purpose = 'Choose one alternative from a bounded set independently of its presentation';

    public static override disposition: Disposition<ChoiceBody> = {
        ...Choice.disposition,
        reactTo: [
            ...Choice.disposition.reactTo ?? [],
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
        ],
        inputs: Choice.disposition.inputs?.map((port) => ({
            ...port,
            signal: SIGNALS[port.signal] ?? port.signal,
        })),
        outputs: Choice.disposition.outputs?.map((port) => ({
            ...port,
            signal: SIGNALS[port.signal] ?? port.signal,
        })),
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.RENDER:
                this.handleLegacyRender(signal);
                break;
            case SignalType.UPDATE:
                this.handleLegacyUpdate(signal);
                break;
            case SignalType.REMOVE:
                this.handleLegacyRemove(signal);
                break;
            default:
                super.react(signal);
        }
    }

    protected override pulse(property: string, value: unknown, targetId?: string): Signal | undefined {
        const mapped = SIGNALS[property] ?? property;
        const payload = property === ChoiceSignalType.CHANGED ? this.legacyInteraction(value) : value;
        return super.pulse(mapped, payload, targetId);
    }

    private handleLegacyRender(signal: Signal): void {
        super.react({
            ...signal,
            property: ChoiceSignalType.RENDER,
            value: signal.value,
        });
    }

    private handleLegacyUpdate(signal: Signal): void {
        super.react({
            ...signal,
            property: ChoiceSignalType.UPDATE,
            value: signal.value,
        });
    }

    private handleLegacyRemove(signal: Signal): void {
        super.react({
            ...signal,
            property: ChoiceSignalType.REMOVE,
        });
    }

    private legacyInteraction(value: unknown): unknown {
        return Object.assign({}, value, {
            event: InteractionType.CHANGE,
        });
    }

}
