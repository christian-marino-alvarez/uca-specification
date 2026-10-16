import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, JSON_HEADERS } from './constants.js';
import { type Body, type RequestPayload, type AbortPayload, SignalType, DataType } from './types.js';
export class HttpClient extends Capability<Body> {
    public static readonly AIM: string = 'Exchange JSON with an HTTP backend';
    public static override disposition: Disposition<Body> = {
        aim: { description: HttpClient.AIM }, reactTo: [SignalType.REQUEST, SignalType.ABORT],
        inputs: [{ signal: SignalType.REQUEST, type: DataType.REQUEST }, { signal: SignalType.ABORT, type: DataType.ABORT }],
        outputs: [{ signal: SignalType.RESPONSE, type: DataType.RESPONSE }, { signal: SignalType.ERROR, type: DataType.ERROR }],
    };
    private readonly controllers = new Map<string, AbortController>();
    public constructor(id: string = __ID__) { super(id); }
    public override denervate(): void {
        this.controllers.forEach((controller) => controller.abort());
        this.controllers.clear();
        super.denervate();
    }
    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.REQUEST: await this.handleRequest(value as RequestPayload); break;
            case SignalType.ABORT: this.handleAbort(value as AbortPayload); break;
        }
    }
    protected async handleRequest(payload: RequestPayload): Promise<void> {
        const { correlationId = crypto.randomUUID(), context } = payload;
        const controller = new AbortController(); const { signal } = controller;
        this.controllers.get(correlationId)?.abort(); this.controllers.set(correlationId, controller);
        try {
            const data = await this.requestJson(payload, signal); signal.throwIfAborted();
            this.pulse(SignalType.RESPONSE, { data, correlationId, context });
        } catch (error) {
            !signal.aborted && this.pulse(SignalType.ERROR, { error: String(error), correlationId, context });
        } finally { this.controllers.get(correlationId) === controller && this.controllers.delete(correlationId); }
    }
    private async requestJson(payload: RequestPayload, signal: AbortSignal): Promise<unknown> {
        const { endpoint, payload: body } = payload;
        const response = await fetch(endpoint, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(body), signal });
        const { ok, status } = response;
        if (!ok) {
            throw new Error(`Backend HTTP ${status}: ${await response.text()}`);
        }
        return response.json();
    }
    protected handleAbort(payload: AbortPayload): void {
        const { correlationId } = payload;
        if (correlationId) {
            this.controllers.get(correlationId)?.abort(); this.controllers.delete(correlationId);
        }
        else {
            this.controllers.forEach((controller) => controller.abort()); this.controllers.clear();
        }
    }
}
