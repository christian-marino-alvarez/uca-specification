import type {
    z,
} from 'zod';

export interface Body {
    readonly id?: string;
    readonly schema?: z.ZodType;
}

export interface ValidatePayload<T = unknown> {
    readonly schema?: z.ZodType<T>;
    readonly value: unknown;
    readonly context?: unknown;
}

export interface ValidatedResult<T = unknown> {
    readonly value: T;
    readonly context?: unknown;
}

export interface DescribePayload {
    readonly schema?: z.ZodType;
    readonly values?: unknown;
    readonly context?: unknown;
}

export interface DescribedResult {
    readonly jsonSchema: Record<string, unknown>;
    readonly context?: unknown;
}

export interface ErrorResult {
    readonly error: unknown;
    readonly context?: unknown;
}

export enum SignalType {
    VALIDATE = 'zod.validate',
    VALIDATED = 'zod.validated',
    DESCRIBE = 'zod.describe',
    DESCRIBED = 'zod.described',
    ERROR = 'zod.error',
}

export enum DataType {
    BODY = 'Body',
    VALIDATE_PAYLOAD = 'ValidatePayload',
    VALIDATED_RESULT = 'ValidatedResult',
    DESCRIBE_PAYLOAD = 'DescribePayload',
    DESCRIBED_RESULT = 'DescribedResult',
    ERROR_RESULT = 'ErrorResult',
}
