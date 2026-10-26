import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_SPECIFICATION_MODEL,
    __ID__,
} from './constants.js';
import {
    queryRequestSchema,
    specificationModelSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type QueryRequest,
    type SpecificationModel,
} from './types.js';

export class Specification extends Capability<Body> {
    public static readonly AIM: string = AIM;
    public static readonly __ID__: string = __ID__;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: AIM,
            body: {
                model: DEFAULT_SPECIFICATION_MODEL,
            },
        },
        reactTo: [
            SignalType.QUERY,
        ],
        inputs: [
            {
                signal: SignalType.QUERY,
                type: DataType.QUERY_REQUEST,
                schema: queryRequestSchema,
                description: 'Query specification model with optional keys filter',
            },
        ],
        outputs: [
            {
                signal: SignalType.PROVIDED,
                type: DataType.SPECIFICATION_MODEL,
                schema: specificationModelSchema,
                description: 'Active specification model or filtered subset provided',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during specification query',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.QUERY:
                this.handleQuery(signal);
                break;
            default:
                break;
        }
    }

    private resolveActiveModel(): SpecificationModel {
        const {
            aim,
        } = this.disposition;
        const {
            model = DEFAULT_SPECIFICATION_MODEL,
        } = aim.body ?? {};
        return model;
    }

    private handleQuery(signal: Signal): void {
        const keys = this.extractQueryKeys(signal.value);
        const model = this.resolveActiveModel();
        const payload = this.filterSpecification(model, keys);
        this.pulse(SignalType.PROVIDED, payload);
    }

    private extractQueryKeys(value?: unknown): string[] | undefined {
        const {
            keys,
        } = (value ?? {}) as QueryRequest ?? {};
        return keys;
    }

    private filterSpecification(
        model: SpecificationModel,
        keys?: string[],
    ): unknown {
        if (!keys || keys.length === 0) {
            return model;
        }
        return this.applyKeysFilter(model, keys);
    }

    private applyKeysFilter(
        model: SpecificationModel,
        keys: string[],
    ): Record<string, unknown> {
        const keySet = new Set(keys);
        const {
            data,
            ...topLevel
        } = model;
        return {
            ...this.filterRecord(topLevel as Record<string, unknown>, keySet),
            ...this.filterRecord(data as unknown as Record<string, unknown>, keySet),
        };
    }

    private filterRecord(
        record: Record<string, unknown>,
        keySet: Set<string>,
    ): Record<string, unknown> {
        return Object.fromEntries(
            Object.entries(record).filter(([key]) => {
                return keySet.has(key);
            }),
        );
    }
}
