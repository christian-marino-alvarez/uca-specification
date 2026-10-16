import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { SignalType as LlmSignalType, type Failure } from '@uca/llm/types';
import { __ID__, CORRELATION_PREFIX } from './constants.js';
import { createRequest } from './inference.js';
import { SignalType, DataType, type Body, type DesignPayload, type Correlation, type Result } from './types.js';
export class Designer extends Capability<Body> {
    public static readonly AIM = 'Infer a purpose-grounded design definition, visual hierarchy and shared spatial language';
    public static override disposition: Disposition<Body> = {
        aim: { description: Designer.AIM }, reactTo: [SignalType.DESIGN, SignalType.ABORT, LlmSignalType.INFERRED, LlmSignalType.ERROR],
        inputs: [{ signal: SignalType.DESIGN, type: DataType.REQUEST }, { signal: SignalType.ABORT, type: DataType.REQUEST }], outputs: [{ signal: SignalType.DESIGNED, type: DataType.DESIGN }, { signal: SignalType.ERROR, type: DataType.ERROR }],
    };
    public constructor(id: string = __ID__) { super(id); }
    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.ABORT: this.handleAbort(signal); break;
            case SignalType.DESIGN: this.handleDesign(signal); break;
            case LlmSignalType.INFERRED: this.handleInferred(signal); break;
            case LlmSignalType.ERROR: this.handleError(signal); break;
        }
    }
    private handleDesign({ value }: Signal): void {
        const payload = value as DesignPayload, { correlationId } = payload, { aim: { body } } = this.disposition, { llm } = body ?? {};
        const context: Correlation = { owner: this.id, correlationId };
        this.pulse(LlmSignalType.INFER, createRequest({ ...payload, correlationId: `${CORRELATION_PREFIX}${JSON.stringify(context)}` }), llm);
    }
    private handleAbort({ value }: Signal): void {
        const { correlationId } = value as DesignPayload, { aim: { body } } = this.disposition, { llm } = body ?? {};
        this.pulse(LlmSignalType.ABORT, { correlationId: `${CORRELATION_PREFIX}${JSON.stringify({ owner: this.id, correlationId })}` }, llm);
        this.pulse(LlmSignalType.ABORT, { correlationId }, llm);
    }
    private handleInferred({ source, value }: Signal): void {
        const result = value as Result, { correlationId = '' } = result, { aim: { body } } = this.disposition, { llm } = body ?? {};
        if (source !== llm || !correlationId.startsWith(CORRELATION_PREFIX)) {
            return;
        }
        const { owner, correlationId: original } = JSON.parse(correlationId.slice(CORRELATION_PREFIX.length)) as Correlation;
        if (owner === this.id) {
            const parentId = this.id.slice(0, this.id.lastIndexOf(':'));
            this.pulse(SignalType.DESIGNED, { ...result, correlationId: original }, parentId);
        }
    }
    private handleError({ source, value }: Signal): void {
        const failure = value as Failure, { correlationId = '' } = failure, { aim: { body } } = this.disposition, { llm } = body ?? {};
        if (source !== llm || !correlationId.startsWith(CORRELATION_PREFIX)) {
            return;
        }
        const { owner, correlationId: original } = JSON.parse(correlationId.slice(CORRELATION_PREFIX.length)) as Correlation;
        if (owner === this.id) {
            const parentId = this.id.slice(0, this.id.lastIndexOf(':'));
            this.pulse(SignalType.ERROR, { ...failure, correlationId: original }, parentId);
        }
    }
}
