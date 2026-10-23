import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import { z } from 'zod';
import { __ID__ } from './constants.js';
import {
    type Body,
    type DescribePayload,
    type ValidatePayload,
    DataType,
    SignalType,
} from './types.js';

export class Zod extends Capability<Body> {
    public static readonly AIM: string =
        'Define, describe, and validate domain schemas for runtime safety and LLM inference';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Zod.AIM,
        },
        reactTo: [
            SignalType.VALIDATE,
            SignalType.DESCRIBE,
        ],
        inputs: [
            {
                signal: SignalType.VALIDATE,
                type: DataType.VALIDATE_PAYLOAD,
                description: 'Validate arbitrary value against a declared or dynamically provided Zod schema',
            },
            {
                signal: SignalType.DESCRIBE,
                type: DataType.DESCRIBE_PAYLOAD,
                description: 'Describe and convert Zod schema to JSON Schema specification for LLM inference',
            },
        ],
        outputs: [
            {
                signal: SignalType.VALIDATED,
                type: DataType.VALIDATED_RESULT,
                description: 'Successfully parsed and validated data',
            },
            {
                signal: SignalType.DESCRIBED,
                type: DataType.DESCRIBED_RESULT,
                description: 'JSON Schema definition and fact specifications for LLM inference',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR_RESULT,
                description: 'Validation failure, describe failure, or missing schema error',
            },
        ],
    };

    public static toJsonSchema(schema: z.ZodType): Record<string, unknown> {
        return z.toJSONSchema(schema) as Record<string, unknown>;
    }

    public static toContextSchema(schema: z.ZodType, values?: unknown): Record<string, unknown> {
        const jsonSchema = Zod.toJsonSchema(schema);
        if (values !== undefined) {
            return {
                ...jsonSchema,
                const: values,
            };
        }
        return jsonSchema;
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.VALIDATE:
                this.handleValidate(value as ValidatePayload);
                break;
            case SignalType.DESCRIBE:
                this.handleDescribe(value as DescribePayload);
                break;
        }
    }

    private handleValidate(payload: ValidatePayload): void {
        const {
            schema,
            value,
            context,
        } = payload;
        const targetSchema = schema ?? this.resolveDispositionSchema();
        if (!targetSchema) {
            this.handleMissingSchema(context);
            return;
        }
        this.executeSafeParse(targetSchema, value, context);
    }

    private handleDescribe(payload: DescribePayload): void {
        const {
            schema,
            values,
            context,
        } = payload;
        const targetSchema = schema ?? this.resolveDispositionSchema();
        if (!targetSchema) {
            this.handleMissingSchema(context);
            return;
        }
        this.executeDescribe(targetSchema, values, context);
    }

    private executeDescribe(schema: z.ZodType, values?: unknown, context?: unknown): void {
        const jsonSchema = Zod.toContextSchema(schema, values);
        const target = this.resolveTarget();
        this.pulse(SignalType.DESCRIBED, {
            jsonSchema,
            context,
        }, target);
    }

    private resolveDispositionSchema(): z.ZodType | undefined {
        const {
            aim,
        } = this.disposition;
        const {
            schema,
        } = aim.body ?? {};
        return schema;
    }

    private executeSafeParse(schema: z.ZodType, value: unknown, context?: unknown): void {
        const result = schema.safeParse(value);
        if (result.success) {
            this.handleSuccess(result.data, context);
            return;
        }
        this.handleFailure(result.error, context);
    }

    private handleSuccess(data: unknown, context?: unknown): void {
        const target = this.resolveTarget();
        this.pulse(SignalType.VALIDATED, {
            value: data,
            context,
        }, target);
    }

    private handleFailure(error: unknown, context?: unknown): void {
        const target = this.resolveTarget();
        this.pulse(SignalType.ERROR, {
            error,
            context,
        }, target);
    }

    private handleMissingSchema(context?: unknown): void {
        const target = this.resolveTarget();
        const error = new Error('No Zod schema provided for operation');
        this.pulse(SignalType.ERROR, {
            error,
            context,
        }, target);
    }

    private resolveTarget(): string | undefined {
        const {
            id,
        } = this;
        if (id.includes(':')) {
            return id.slice(0, id.lastIndexOf(':'));
        }
        return undefined;
    }
}
