import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { type Body, type Operands, DataType, SignalType } from './types.js';
import { __ID__ } from './constants.js';

export class Contains extends Capability<Body> {
    public static readonly AIM: string = 'Evaluate whether container string or array includes the target element';

    public static override disposition: Disposition<Body> = {
        aim: { description: Contains.AIM, body: {} },
        reactTo: [SignalType.EVALUATE],
        inputs: [{ signal: SignalType.EVALUATE, type: DataType.OPERANDS, description: 'Operands [container, target]' }],
        outputs: [{ signal: SignalType.EVALUATED, type: DataType.BOOLEAN, description: 'Boolean result of inclusion evaluation' }],
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
            const [targetContainer, searchElement] = operands;
            const doesContain = this.checkContains(targetContainer, searchElement);
            this.pulse(SignalType.EVALUATED, doesContain);
        }
    }

    private checkContains(container: unknown, search: unknown): boolean {
        if (typeof container === 'string' && typeof search === 'string') {
            return container.includes(search);
        }
        if (Array.isArray(container)) {
            return container.includes(search);
        }
        return false;
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
            return [value[0], value[1]];
        }
        if (value && typeof value === 'object' && 'operands' in value) {
            const { operands } = value as { operands?: unknown };
            if (Array.isArray(operands) && operands.length >= 2) {
                return [operands[0], operands[1]];
            }
        }
        return undefined;
    }
}

