import { Capability } from '../../../core/capability.js';
import type { Disposition, Signal } from '../../../core/types.js';
import { type Body, type IterationContext, SignalType } from './types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';

export class Loop extends Capability<Body> {
    public static readonly AIM: string = 'Iterate sequentially over items or count';

    private static createDefaultDisposition(): Disposition<Body> {
        const disposition = Capability.createDisposition<Body>(Loop.AIM, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.START, type: 'LoopOptions', description: 'LoopOptions { items, count, step }' },
                { signal: SignalType.STOP, type: 'void', description: 'Stop ongoing loop' },
                { signal: SignalType.NEXT, type: 'void', description: 'Advance to next iteration' },
            ],
            outputs: [
                { signal: SignalType.ITERATION, type: 'IterationContext', description: 'IterationContext { index, item, total, isFirst, isLast }' },
                { signal: SignalType.COMPLETED, type: '{ total: number }', description: 'Loop completion notification' },
            ],
        });
        return disposition;
    }


    public constructor(id: string = __ID__) {
        super(id, Loop.createDefaultDisposition());
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? this.disposition;
        const { reactTo = [] } = baseDisposition;
        const signals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        super.innervate(target, activeDisposition);
        return this;
    }


    public override denervate(): void {
        super.denervate();
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

export * from './constants.js';
export * from './types.js';
