import { Capability } from '@uca/core/capability';
import {
    DispositionSignal,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import {
    DEFAULT_AIM,
    DEFAULT_FILTER,
    INTERCEPTED_SIGNALS,
    __ID__,
} from './constants.js';
import {
    telemetryEventSchema,
    type Body,
    type TelemetryEvent,
} from './schema.js';
import {
    DataType,
    SignalType,
} from './types.js';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';

export class Telemetry extends Capability<Body> {
    public static readonly AIM: string = DEFAULT_AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Telemetry.AIM,
            body: {
                enabled: true,
                logToConsole: true,
            },
        },
        reactTo: [
            ...INTERCEPTED_SIGNALS,
        ],
        inputs: [
            {
                signal: SignalType.OBSERVE,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Process telemetry observation signal',
            },
        ],
        outputs: [
            {
                signal: SignalType.LIFECYCLE,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Lifecycle signal observed',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget): this {
        super.innervate(target);
        this.connectReceptors();
        return this;
    }

    protected override react(signal: Signal): void {
        const {
            aim,
        } = this.disposition;
        const {
            enabled = true,
        } = aim.body ?? {};
        if (!enabled || signal.source === this.id || signal.property.startsWith('telemetry.')) {
            return;
        }
        this.routeSignal(signal);
    }

    private routeSignal(signal: Signal): void {
        const {
            property,
        } = signal;
        if (this.isAllowedSignal(property)) {
            this.handleLifecycle(signal);
        }
    }

    private isAllowedSignal(property: string): boolean {
        const {
            aim,
        } = this.disposition;
        const {
            filter = [...DEFAULT_FILTER],
        } = aim.body ?? {};
        return filter.some((pattern) => this.matchesPattern(property, pattern));
    }

    private matchesPattern(property: string, pattern: string): boolean {
        if (pattern === '*' || pattern === property) {
            return true;
        }
        const isPrefix = pattern.endsWith('*') && property.startsWith(pattern.slice(0, -1));
        return isPrefix;
    }

    private createLifecycleEvent(signal: Signal): TelemetryEvent {
        return {
            type: 'lifecycle',
            timestamp: signal.timestamp ?? Date.now(),
            source: signal.source,
            sourceKind: signal.sourceKind,
            targetId: signal.targetId,
            property: signal.property,
            payload: signal.value,
            sessionId: signal.sessionId,
        };
    }

    private handleLifecycle(signal: Signal): void {
        const event = this.createLifecycleEvent(signal);
        this.notifyLifecycle(event);
    }

    private notifyLifecycle(event: TelemetryEvent): void {
        const {
            aim,
        } = this.disposition;
        const {
            logToConsole = true,
        } = aim.body ?? {};
        if (logToConsole) {
            this.logLifecycleToConsole(event);
        }
        this.pulse(SignalType.LIFECYCLE, event);
    }

    private logLifecycleToConsole(event: TelemetryEvent): void {
        const {
            source,
            property = '',
            payload,
        } = event;
        const badge = this.resolveLifecycleBadge(property);
        const sourceLabel = source ? ` [${source}]` : '';
        const style = this.resolveLifecycleStyle(property);
        console.log(`%c${badge}${sourceLabel} ${property}`, style, payload ?? event);
    }

    private resolveLifecycleBadge(property?: string): string {
        switch (property) {
            case DispositionSignal.INNERVATED:
                return '⚡ [CORE::INNERVATED]';
            case DispositionSignal.DENERVATED:
                return '🔌 [CORE::DENERVATED]';
            case SessionSignalType.GET:
                return '🔍 [SESSION::GET]';
            case SessionSignalType.RETRIEVED:
                return '💾 [SESSION::RETRIEVED]';
            case SessionSignalType.CREATE:
                return '➕ [SESSION::CREATE]';
            case SessionSignalType.CREATED:
                return '✨ [SESSION::CREATED]';
            default:
                return `📡 [${property ? property.toUpperCase() : 'SIGNAL'}]`;
        }
    }

    private resolveLifecycleStyle(property?: string): string {
        switch (property) {
            case DispositionSignal.INNERVATED:
                return 'color: #7C3AED; font-weight: bold; font-size: 11px;';
            case DispositionSignal.DENERVATED:
                return 'color: #9CA3AF; font-weight: bold; font-size: 11px;';
            case SessionSignalType.GET:
                return 'color: #0284C7; font-weight: bold; font-size: 11px;';
            case SessionSignalType.RETRIEVED:
                return 'color: #EA580C; font-weight: bold; font-size: 11px;';
            case SessionSignalType.CREATE:
                return 'color: #2563EB; font-weight: bold; font-size: 11px;';
            case SessionSignalType.CREATED:
                return 'color: #16A34A; font-weight: bold; font-size: 11px;';
            default:
                return 'color: #6B7280; font-weight: bold; font-size: 11px;';
        }
    }
}
