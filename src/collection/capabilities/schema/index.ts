import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__ } from './constants.js';
import { type Body, type ValidatePayload, DataType, SignalType } from './types.js';

export class Schema extends Capability<Body> {
    public static readonly AIM = 'Validate domain data against its declared schema';
    public static override disposition: Disposition<Body> = {
        aim: { description: Schema.AIM },
        reactTo: [SignalType.VALIDATE],
        inputs: [{ signal: SignalType.VALIDATE, type: DataType.VALUE }],
        outputs: [{ signal: SignalType.VALIDATED, type: DataType.RESULT }, { signal: SignalType.ERROR, type: DataType.ERROR }],
    };
    public constructor(id: string = __ID__) { super(id); }
    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.VALIDATE:
                this.handleValidate(value as ValidatePayload);
                break;
        }
    }
    private handleValidate(payload: ValidatePayload): void {
        const { schema, value, context } = payload;
        const result = schema.safeParse(value);
        const id = this.id.includes(':') ? this.id.slice(0, this.id.lastIndexOf(':')) : undefined;
        if (result.success) {
            const { data } = result;
            this.pulse(SignalType.VALIDATED, { value: data, context }, id);
        } else {
            const { error } = result;
            this.pulse(SignalType.ERROR, { error, context }, id);
        }
    }
}
