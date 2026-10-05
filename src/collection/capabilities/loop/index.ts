import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { type Body, type IterationContext, DataType, SignalType } from './types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';

export class Loop extends Capability<Body> {
    public static readonly AIM: string = 'Iterate sequentially over items or count';

    public static override disposition: Disposition<Body> = {
        aim: { description: Loop.AIM, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [
                { signal: SignalType.START, type: DataType.LOOP_OPTIONS, description: 'LoopOptions { items, count, step }' },
                { signal: SignalType.STOP, type: DataType.VOID, description: 'Stop ongoing loop' },
                { signal: SignalType.NEXT, type: DataType.VOID, description: 'Advance to next iteration' },
            ],
            outputs: [
                { signal: SignalType.ITERATION, type: DataType.ITERATION_CONTEXT, description: 'IterationContext { index, item, total, isFirst, isLast }' },
                { signal: SignalType.COMPLETED, type: DataType.COMPLETION_CONTEXT, description: 'Loop completion notification' },
            ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }


    protected override react(signal: Signal): void {
        const { value } = signal;
        this.handleStart(value);
    }

    private handleStart(value: unknown): void {
        const payload = this.extractPayload<Body>(value);
        const items = this.resolveItems(payload, value);
        this.executeLoop(items);
    }

    private resolveItems(payload?: Body, rawValue?: unknown): readonly unknown[] {
        const directArray = Array.isArray(rawValue) ? rawValue : undefined;
        const payloadItems = payload?.items;
        const count = payload?.count;
        const { aim } = this.disposition;
        const { items: fallbackItems, count: fallbackCount } = aim.body ?? {};
        const activeItems = directArray ?? payloadItems ?? fallbackItems;
        const activeCount = count ?? fallbackCount;
        return activeItems ?? (activeCount !== undefined ? Array.from({ length: activeCount }, (_, index) => index) : []);
    }

    private executeLoop(items: readonly unknown[]): void {
        const total = items.length;
        for (let index = 0; index < total; index++) {
            const context: IterationContext = {
                index,
                item: items[index],
                total,
                isFirst: index === 0,
                isLast: index === total - 1,
            };
            this.pulse(SignalType.ITERATION, context);
        }
        this.pulse(SignalType.COMPLETED, { total });
    }
}


