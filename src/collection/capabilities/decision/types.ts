export enum SignalType {
    DECIDE = 'decision.decide',
    DECIDED = 'decision.decided',
    ERROR = 'decision.error',
}

export enum DataType {
    DECIDE_PAYLOAD = 'DecidePayload',
    DECIDED_RESULT = 'DecidedResult',
    UNKNOWN = 'unknown',
}

export interface Body {
    readonly id?: string;
    readonly provider?: string;
    readonly model?: string;
    readonly llm?: string;
}

export interface DecidePayload {
    readonly id?: string;
    readonly state?: unknown;
    readonly question?: string;
    readonly criteria?: Record<string, unknown>;
    readonly correlationId?: string;
    readonly model?: string;
    readonly provider?: string;
}

export interface DecidedResult {
    readonly decision: boolean;
    readonly probability?: number;
    readonly correlationId?: string;
    readonly state?: unknown;
    readonly raw?: unknown;
    readonly model?: string;
}
