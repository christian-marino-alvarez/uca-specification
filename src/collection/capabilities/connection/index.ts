import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    __ID__,
} from './constants.js';
import {
    configurationSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type Route,
} from './types.js';

export class Connection extends Capability<Body> {
    public static readonly AIM = 'Materialize declared reactive routes between UCA signals';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Connection.AIM,
        },
        reactTo: [
            SignalType.CONFIGURE,
        ],
        inputs: [
            {
                signal: SignalType.CONFIGURE,
                type: DataType.CONFIGURATION,
            },
        ],
        outputs: [
            {
                signal: SignalType.CONNECTED,
                type: DataType.RESULT,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
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
        if (property === SignalType.CONFIGURE) {
            this.handleConfigure(signal);
            return;
        }
        this.handleRoute(signal);
    }

    private handleConfigure(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            routes,
        } = configurationSchema.parse(value);
        this.pulse(this.updateEvent, this.createDisposition(routes));
        this.pulse(SignalType.CONNECTED, {
            routes,
        });
    }

    private handleRoute(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        const sourceValue = value as Record<string, unknown>;
        const {
            elementId,
        } = sourceValue;
        const {
            aim,
        } = this.disposition;
        const {
            routes = [],
        } = aim.body ?? {};
        routes
            .filter(({ source }) => source.signal === property && source.id === elementId)
            .forEach((route) => this.forward(route, sourceValue));
    }

    private createDisposition(routes: Route[]): Disposition<Body> {
        const {
            id,
        } = this;
        return {
            ...Connection.disposition,
            reactTo: [
                SignalType.CONFIGURE,
                ...new Set(routes.map(({ source }) => source.signal)),
            ],
            aim: {
                description: Connection.AIM,
                body: {
                    id,
                    routes,
                },
            },
        };
    }

    private forward(route: Route, sourceValue: Record<string, unknown>): void {
        const {
            target,
            value = {},
            forward,
        } = route;
        const forwarded = Object.fromEntries(
            forward.map((property) => [property, sourceValue[property]]),
        );
        this.pulse(
            target.signal,
            {
                ...value,
                ...forwarded,
            },
            target.id,
        );
    }
}

