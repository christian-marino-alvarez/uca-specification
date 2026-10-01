import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { type Body, type Operands, DataType, SignalType } from './types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';

export class Multiply extends Capability<Body> {
    public static readonly AIM: string = 'Multiply multiplier and multiplicand and pulse product';

    public static override disposition: Disposition<Body> = {
        aim: { description: Multiply.AIM, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [{ signal: SignalType.EVALUATE, type: DataType.OPERANDS, description: 'Operands [multiplier, multiplicand]' }],
        outputs: [{ signal: SignalType.EVALUATED, type: DataType.NUMBER, description: 'Product number of multiplication' }],
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
            const [firstOperand, secondOperand] = operands;
            const product = firstOperand * secondOperand;
            this.pulse(SignalType.EVALUATED, product);
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

export * from './constants.js';
export * from './types.js';
