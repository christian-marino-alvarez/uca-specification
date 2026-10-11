import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { type Body, type Operands, type Outcome, DataType, SignalType } from './types.js';
import { __ID__ } from './constants.js';

export class Divide extends Capability<Body> {
    public static readonly AIM: string = 'Divide dividend by divisor and pulse outcome with result and rest';

    public static override disposition: Disposition<Body> = {
        aim: { description: Divide.AIM, body: {} },
        reactTo: [SignalType.EVALUATE],
        inputs: [{ signal: SignalType.EVALUATE, type: DataType.OPERANDS, description: 'Operands [dividend, divisor]' }],
        outputs: [{ signal: SignalType.EVALUATED, type: DataType.OUTCOME, description: 'Outcome { result, rest }' }],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }


    protected override react(signal: Signal): void {
        const { value } = signal;
        this.handleEvaluate(value);
    }

    private handleEvaluate(value: unknown): void {
        const operands = this.extractOperands(value);
        if (operands) {
            const [dividend, divisor] = operands;
            if (divisor !== 0) {
                const outcome: Outcome = {
                    result: Math.trunc(dividend / divisor),
                    rest: dividend % divisor,
                };
                this.pulse(SignalType.EVALUATED, outcome);
            }
        }
    }

    private extractOperands(value: unknown): Operands | undefined {
        const payload = this.extractPayload<unknown>(value);
        const operands = this.getOperandsFromValue(payload);
        const { aim } = this.disposition;
        const { operands: fallbackOperands } = aim.body ?? {};
        const result = operands ?? fallbackOperands;
        return result;
    }

    private getOperandsFromValue(value: unknown): Operands | undefined {
        if (Array.isArray(value) && value.length >= 2) {
            return this.parseOperands(value[0], value[1]);
        }
        if (value && typeof value === 'object' && 'operands' in value) {
            const { operands } = value as { operands?: unknown };
            if (Array.isArray(operands) && operands.length >= 2) {
                return this.parseOperands(operands[0], operands[1]);
            }
        }
        return undefined;
    }

    private parseOperands(first: unknown, second: unknown): Operands | undefined {
        const parsedFirst = Number(first);
        const parsedSecond = Number(second);
        const isValid = !Number.isNaN(parsedFirst) && !Number.isNaN(parsedSecond);
        return isValid ? [parsedFirst, parsedSecond] : undefined;
    }
}

