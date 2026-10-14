import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { SignalType as LlmSignalType, type InferResult } from '@uca/llm/types';
import { __ID__, AFFIRMATIVE_PATTERN, DEFAULT_MODEL, DEFAULT_PROVIDER, DEFAULT_QUESTION, DEFAULT_THRESHOLD } from './constants.js';
import {
    type Body,
    type DecidePayload,
    type DecidedResult,
    DataType,
    SignalType,
} from './types.js';

export class Decision extends Capability<Body> {
    public static readonly AIM: string = 'Perform probabilistic system-one decisions and evaluations using Llm';

    public static override disposition: Disposition<Body> = {
        aim: { description: Decision.AIM, body: {} },
        reactTo: [
            SignalType.DECIDE,
            LlmSignalType.INFERRED,
            LlmSignalType.ERROR,
        ],
        inputs: [
            { signal: SignalType.DECIDE, type: DataType.DECIDE_PAYLOAD, description: 'Evaluate state and question for decision' },
            { signal: LlmSignalType.INFERRED, type: DataType.UNKNOWN, description: 'Inference answers received from Llm' },
        ],
        outputs: [
            { signal: SignalType.DECIDED, type: DataType.DECIDED_RESULT, description: 'Decision outcome and resolution' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Error notification during decision' },
            { signal: LlmSignalType.INFER, type: DataType.UNKNOWN, description: 'Request probabilistic inference from Llm' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.DECIDE:
                this.handleDecide(value);
                break;
            case LlmSignalType.INFERRED:
                this.handleInferred(signal);
                break;
            case LlmSignalType.ERROR:
                this.handleError(signal);
                break;
            default:
                break;
        }
    }

    private handleDecide(value: unknown): void {
        const payload = this.extractPayload<DecidePayload>(value);
        if (!payload) { return; }
        const { aim } = this.disposition;
        const { llm } = aim.body ?? {};
        const { state, question = DEFAULT_QUESTION, criteria, correlationId, model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER } = payload;
        const expectations = criteria && Object.keys(criteria).length > 0 ? criteria : { decision: question };
        const inferPayload = { ...(llm && { id: llm }), provider, model, request: question, context: state, expectations, correlationId };
        this.pulse(LlmSignalType.INFER, inferPayload);
    }

    private handleInferred(signal: Signal): void {
        const { source, value } = signal;
        const { aim } = this.disposition;
        const { llm } = aim.body ?? {};
        if (llm && source !== llm) { return; }
        const result = this.extractPayload<InferResult>(value);
        if (!result) { return; }
        const { data, response, correlationId, context } = result;
        const { decision, probability } = this.resolveAnswer(data ?? response);
        const decidedResult: DecidedResult = { decision, probability, correlationId, state: context, raw: data ?? response };
        this.pulse(SignalType.DECIDED, decidedResult);
    }

    private handleError(signal: Signal): void {
        const { source, value } = signal;
        const { aim } = this.disposition;
        const { llm } = aim.body ?? {};
        if (llm && source !== llm) { return; }
        this.pulse(SignalType.ERROR, value);
    }

    private resolveAnswer(answer: unknown): { decision: boolean; probability?: number } {
        switch (typeof answer) {
            case 'boolean':
                return { decision: answer };
            case 'number':
                return { decision: answer >= DEFAULT_THRESHOLD, probability: answer };
            case 'string':
                return { decision: AFFIRMATIVE_PATTERN.test(answer) };
            case 'object':
                return this.resolveObjectAnswer(answer);
            default:
                return { decision: false };
        }
    }

    private resolveObjectAnswer(answer: unknown): { decision: boolean; probability?: number } {
        const { choice, confidence, noul, decision, assessment, needsSubdivision, recompose, ...rest } = (answer ?? {}) as Record<string, unknown>;
        if (typeof choice === 'string') {
            return { decision: AFFIRMATIVE_PATTERN.test(choice), ...(typeof confidence === 'number' && { probability: confidence }) };
        }
        const [firstValue] = Object.values(rest);
        return this.resolveAnswer(noul ?? decision ?? assessment ?? needsSubdivision ?? recompose ?? firstValue);
    }
}
