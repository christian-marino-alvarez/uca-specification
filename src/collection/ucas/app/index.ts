import { Telemetry } from '@uca/capability-telemetry';
import { Session as SessionCapability } from '@uca/capability-session';
import {
    SignalType as SessionSignalType,
    type SessionPayload,
} from '@uca/capability-session/types';
import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import {
    DEFAULT_AIM_BODY,
    DEFAULT_AIM_DESCRIPTION,
    DEFAULT_PURPOSE,
    TELEMETRY_OBSERVED_SIGNALS,
    __ID__,
} from './constants.js';
import {
    DataType,
    type Body,
} from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: DEFAULT_AIM_DESCRIPTION,
            body: {
                ...DEFAULT_AIM_BODY,
            },
        },
        reactTo: [
            DispositionSignal.INNERVATED,
            ...App.reactToSession(),
        ],
        inputs: [
            {
                signal: DispositionSignal.INNERVATED,
                type: DataType.VOID,
                description: 'Core lifecycle signal emitted upon innervation',
            },
        ],
        outputs: [
            {
                signal: DispositionSignal.INNERVATED,
                type: DataType.BODY,
                description: 'Core lifecycle signal emitted upon innervation',
            },
            {
                signal: DataType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during app execution',
            },
        ],
    };

    private static reactToSession(): string[] {
        return [
            ...SessionCapability.disposition?.reactTo || [],
            SessionSignalType.RETRIEVED,
            SessionSignalType.CREATED,
            SessionSignalType.DELETED,
        ];
    }

    private static createTelemetryExtraBody(): Record<string, unknown> {
        return {
            filter: [
                ...TELEMETRY_OBSERVED_SIGNALS,
            ],
        };
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        return [
            this.catalogSession(),
            this.catalogTelemetry(),
        ];
    }

    private catalogSession(): Cooky[number] {
        return [
            SessionCapability as unknown as CapabilityConstructor,
            this.createDisposition(
                SessionCapability.disposition,
                SessionCapability.AIM,
                'session',
            ),
        ];
    }

    private catalogTelemetry(): Cooky[number] {
        const extraBody = App.createTelemetryExtraBody();
        const disposition = this.createDisposition(
            Telemetry.disposition,
            Telemetry.AIM,
            'telemetry',
            extraBody,
        );
        return [
            Telemetry as unknown as CapabilityConstructor,
            disposition,
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case DispositionSignal.INNERVATED:
                this.handleInnervated(signal);
                break;
            case SessionSignalType.RETRIEVED:
                this.handleSessionRetrieved(signal);
                break;
            case SessionSignalType.CREATED:
                this.handleSessionCreated(signal);
                break;
            default:
                break;
        }
    }

    private handleInnervated(signal: Signal): void {
        if (signal.source !== this.id) {
            return;
        }
        this.pulse(SessionSignalType.GET, {});
    }

    private handleSessionRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        const payload = (value ?? {}) as SessionPayload;
        this.routeSessionPayload(payload);
    }

    private routeSessionPayload(payload: SessionPayload): void {
        if (!payload.value) {
            this.pulse(SessionSignalType.CREATE, {});
            return;
        }
        this.handleSessionReceived(payload);
    }

    private handleSessionCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        const payload = (value ?? {}) as SessionPayload;
        this.handleSessionReceived(payload);
    }

    private handleSessionReceived(payload: SessionPayload): void {
        const {
            sessionId,
            value,
        } = payload;
        const activeId = sessionId || value?.id;
        this.updateDispositionBody({
            sessionId: activeId,
        });
    }

    private updateDispositionBody(partial: Partial<Body>): void {
        const {
            aim,
        } = this.disposition;
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: {
                ...aim,
                body: {
                    ...aim.body,
                    ...partial,
                },
            },
        });
    }
}
