import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    __ID__,
    ENTRIES,
} from './constants.js';
import {
    errorSchema,
    requestSchema,
    resultSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type Request,
} from './types.js';

export class Catalog extends Capability<Body> {
    public static readonly AIM = 'List the explicitly declared UCAs available for requested functional kinds';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Catalog.AIM,
            body: {
                entries: [
                    ...ENTRIES,
                ],
            },
        },
        reactTo: [
            SignalType.LIST,
        ],
        inputs: [
            {
                signal: SignalType.LIST,
                type: DataType.REQUEST,
                schema: requestSchema,
            },
        ],
        outputs: [
            {
                signal: SignalType.LISTED,
                type: DataType.RESULT,
                schema: resultSchema,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
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
            case SignalType.LIST:
                this.handleList(signal);
                break;
        }
    }

    private handleList(signal: Signal): void {
        const {
            value,
        } = signal;
        const parsed = requestSchema.safeParse(value);
        if (!parsed.success) {
            this.pulse(SignalType.ERROR, {
                correlationId: null,
                error: parsed.error.message,
            });
            return;
        }
        this.emitListing(parsed.data);
    }

    private emitListing(request: Request): void {
        const {
            correlationId,
            context,
            kinds,
        } = request;
        const {
            aim: {
                body,
            },
        } = this.disposition;
        const {
            entries = [],
        } = body ?? {};
        this.pulse(SignalType.LISTED, {
            correlationId,
            entries: entries.filter(({
                kind,
            }) => kinds.includes(kind)),
            ...(context !== undefined && {
                context,
            }),
        });
    }
}
