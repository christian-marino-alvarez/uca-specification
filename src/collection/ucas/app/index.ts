import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Specification as SpecificationCapability } from '@uca/capability-specification';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';
import {
    queryRequestSchema,
    specificationModelSchema,
} from '@uca/capability-specification/schema';
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
            ...App.reactToSpecification(),
        ],
        inputs: [
            {
                signal: DispositionSignal.INNERVATED,
                type: DataType.VOID,
                description: 'Core lifecycle signal emitted upon innervation',
            },
            {
                signal: SpecificationSignalType.PROVIDED,
                type: DataType.SPECIFICATION_MODEL,
                schema: specificationModelSchema,
                description: 'Specification model provided by Specification capability',
            },
            {
                signal: SpecificationSignalType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during specification query',
            },
        ],
        outputs: [
            {
                signal: DispositionSignal.INNERVATED,
                type: DataType.BODY,
                description: 'Core lifecycle signal emitted upon innervation',
            },
            {
                signal: SpecificationSignalType.QUERY,
                type: DataType.QUERY_REQUEST,
                schema: queryRequestSchema,
                description: 'Query active specification model or filtered subset',
            },
            {
                signal: DataType.ERROR,
                type: DataType.ERROR,
                description: 'Error emitted during app execution',
            },
        ],
    };

    private static reactToSpecification(): string[] {
        return [
            ...SpecificationCapability.disposition?.reactTo || [],
            SpecificationSignalType.PROVIDED,
            SpecificationSignalType.ERROR,
        ];
    }

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
            this.catalogSpecification(),
            this.catalogNavigate(),
        ];
    }

    private catalogSpecification(): Cooky[number] {
        const disposition = this.createDisposition(
            SpecificationCapability.disposition,
            SpecificationCapability.AIM,
            'specification',
        );
        return [
            SpecificationCapability as unknown as CapabilityConstructor,
            disposition,
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
                this.handleInnervated();
                break;
            case DispositionSignal.UPDATED:
                this.handleUpdated();
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
            case SpecificationSignalType.PROVIDED:
                this.handleSpecificationProvided(signal);
                break;
            case SpecificationSignalType.ERROR:
                this.handleSpecificationError(signal);
                break;
            default:
                break;
        }
    }

    private handleInnervated(): void {
        this.pulse(SessionSignalType.GET, {});
    }

    private handleUpdated(): void {
        const {
            source = this.id,
        } = this.body ?? {};
        switch (source) {
            case `${this.id}:navigate`:
                this.handleNavigateUpdated();
                break;
            case `${this.id}:session`:
                this.handleSessionUpdated();
                break;
            case `${this.id}:specification`:
                this.handleSpecificationLoaded();
                break;
            default:
                this.handleSelfUpdated();
                break;
        }
    }

    private handleNavigateUpdated(): void {
        const {
            activePage,
            specification,
        } = this.body ?? {};
        if (activePage && !specification) {
            this.pulse(SpecificationSignalType.QUERY, {});
        }
    }

    private handleSessionUpdated(): void {
        const {
            sessionId,
        } = this.body ?? {};
        console.log('[App] Session established:', sessionId);
    }

    private handleSpecificationLoaded(): void {
        const {
            specification,
        } = this.body ?? {};
        console.log('[App] Specification model loaded:', Boolean(specification));
    }

    private handleSelfUpdated(): void {
        console.log('[App] Self disposition updated:', this.body);
    }

    private handleSessionRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        if (value) {
            this.handleSessionCreated(signal);
            return;
        }
        this.pulse(SessionSignalType.CREATE, {});
    }

    private handleSessionCreated(signal: Signal): void {
        const {
            source,
            value,
        } = signal;
        this.applySession(value as Session, source);
    }

    private handleNavigateChanged(signal: Signal): void {
        const {
            source,
            value,
        } = signal;
        this.updateDispositionBody({
            activePage: this.extractNavigateUrl(value),
            source,
        });
    }

    private extractNavigateUrl(value: unknown): string {
        const payload = this.extractPayload<{ url?: string }>(value);
        const {
            url = DEFAULT_PAGE,
        } = payload ?? {};
        return url;
    }

    private handleSpecificationProvided(signal: Signal): void {
        const {
            source,
            value,
        } = signal;
        this.updateDispositionBody({
            source,
            specification: value as Record<string, unknown>,
        });
    }

    private handleSpecificationError(signal: Signal): void {
        const {
            value,
        } = signal;
        console.error('[App] Specification query error:', value);
    }

    private applySession(session?: Session | null, source?: string): void {
        const {
            id = '',
        } = session ?? {};
        this.updateDispositionBody({
            sessionId: id,
            ...(source && { source }),
        });
        this.initNavigation(id);
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
