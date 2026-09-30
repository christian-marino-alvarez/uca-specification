import { Capability } from '../../../core/capability.js';
import type { Disposition, Signal } from '../../../core/types.js';
import { type Body, type Operands, type Outcome, SignalType } from './types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';

export class Divide extends Capability<Body> {
    public static readonly AIM: string = 'Divide dividend by divisor and pulse outcome with result and rest';

    private static createDefaultDisposition(): Disposition<Body> {
        const disposition = Capability.createDisposition<Body>(Divide.AIM, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [{ signal: SignalType.EVALUATE, type: '[number, number]', description: 'Operands [dividend, divisor]' }],
            outputs: [{ signal: SignalType.EVALUATED, type: '{ result: number, rest: number }', description: 'Outcome { result, rest }' }],
        });
        return disposition;
    }

    public constructor(id: string = __ID__) {
        super(id, Divide.createDefaultDisposition());
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

export * from './constants.js';
export * from './types.js';
