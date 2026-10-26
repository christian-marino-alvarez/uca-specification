import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Telemetry } from '@uca/capability-telemetry';
import { Session as SessionCapability } from '@uca/capability-session';
import {
    SignalType as SessionSignalType,
    type Session,
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
    DEFAULT_PAGE,
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
            DispositionSignal.UPDATED,
            ...App.reactToSession(),
            ...App.reactToNavigate(),
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

    private static reactToNavigate(): string[] {
        return [
            ...Navigate.disposition?.reactTo || [],
            NavigateSignalType.CHANGED,
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
            this.catalogTelemetry(),
            this.catalogSession(),
            this.catalogNavigate(),
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

    private catalogNavigate(): Cooky[number] {
        const extra = this.createNavigateExtraBody();
        const disposition = this.createDisposition(
            Navigate.disposition,
            Navigate.purpose,
            'navigate',
            extra,
        );
        return [
            Navigate as unknown as CapabilityConstructor,
            disposition,
        ];
    }

    private createNavigateExtraBody(): Record<string, unknown> {
        const {
            aim,
        } = this.disposition;
        const {
            activePage = DEFAULT_PAGE,
            sessionId,
        } = aim.body ?? {};
        return {
            ...(sessionId && { sessionId }),
            url: activePage,
        };
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case DispositionSignal.INNERVATED:
                this.handleInnervated(signal);
                break;
            case DispositionSignal.UPDATED:
                this.handleUpdated(signal);
                break;
            case SessionSignalType.RETRIEVED:
                this.handleSessionRetrieved(signal);
                break;
            case SessionSignalType.CREATED:
                this.handleSessionCreated(signal);
                break;
            case NavigateSignalType.CHANGED:
                this.handleNavigateChanged(signal);
                break;
            default:
                break;
        }
    }

    private handleNavigateChanged(signal: Signal): void {
        const payload = this.extractPayload<{ url?: string }>(signal.value);
        const {
            url = DEFAULT_PAGE,
        } = payload ?? {};
        this.updateDispositionBody({
            activePage: url,
        });
    }

    private handleUpdated(signal: Signal): void {
        if (signal.source !== this.id) {
            return;
        }
        console.log('[App] Disposition updated, ready to query Specification:', signal);
    }

    private handleInnervated(signal: Signal): void {
        if (signal.source !== this.id) {
            return;
        }
        this.pulse(SessionSignalType.GET, {});
    }

    private initNavigation(sessionId?: string): void {
        if (!sessionId) {
            return;
        }
        this.pulse(NavigateSignalType.INIT, {
            sessionId,
            url: DEFAULT_PAGE,
        });
    }

    private handleSessionRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        this.routeSessionPayload(value as Session | null);
    }

    private routeSessionPayload(session?: Session | null): void {
        if (!session) {
            this.pulse(SessionSignalType.CREATE, {});
            return;
        }
        this.handleSessionReceived(session);
    }

    private handleSessionCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.handleSessionReceived(value as Session);
    }

    private handleSessionReceived(session?: Session | null): void {
        const {
            id,
        } = session ?? {};
        this.updateDispositionBody({
            sessionId: id,
        });
        this.initNavigation(id);
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
