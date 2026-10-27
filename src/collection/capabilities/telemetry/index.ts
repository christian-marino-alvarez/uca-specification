import { Capability } from '@uca/core/capability';
import {
    DispositionSignal,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import {
    COLOR_PALETTE,
    DEFAULT_AIM,
    DEFAULT_FILTER,
    INTERCEPTED_SIGNALS,
    SOURCE_COLORS,
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
        const icon = this.resolveLifecycleIcon(property);
        const badgeStyle = this.resolveSourceBadgeStyle(source);
        const textStyle = this.resolvePropertyStyle(source);
        console.log(`%c[${source ?? 'uca'}]%c ${icon} ${property}`, badgeStyle, textStyle, payload ?? event);
    }

    private resolveLifecycleIcon(property?: string): string {
        switch (property) {
            case DispositionSignal.INNERVATED:
                return '⚡';
            case DispositionSignal.DENERVATED:
                return '🔌';
            case DispositionSignal.UPDATED:
                return '🔄';
            case SessionSignalType.GET:
                return '🔍';
            case SessionSignalType.RETRIEVED:
                return '💾';
            case SessionSignalType.CREATE:
                return '➕';
            case SessionSignalType.CREATED:
                return '✨';
            case 'navigate.init':
                return '🧭';
            case 'navigate.go':
                return '🚀';
            case 'navigate.changed':
                return '📍';
            case 'navigate.destroy':
                return '🗑️';
            case 'memory.get':
                return '🔍';
            case 'memory.set':
                return '💾';
            case 'memory.clear':
                return '🧹';
            case 'memory.retrieved':
                return '📦';
            case 'memory.saved':
                return '✅';
            case 'memory.cleared':
                return '✨';
            default:
                return '📡';
        }
    }

    private resolveSourceBadgeStyle(source?: string): string {
        const color = this.resolveSourceColor(source);
        return `background: ${color}; color: #FFFFFF; font-weight: bold; font-size: 11px; padding: 2px 6px; border-radius: 3px;`;
    }

    private resolvePropertyStyle(source?: string): string {
        const color = this.resolveSourceColor(source);
        return `color: ${color}; font-weight: 600; font-size: 11px; margin-left: 4px;`;
    }

    private resolveSourceColor(source?: string): string {
        if (!source) {
            return '#64748B';
        }
        if (source in SOURCE_COLORS) {
            return SOURCE_COLORS[source];
        }
        return this.hashSourceColor(source);
    }

    private hashSourceColor(source: string): string {
        let hash = 0;
        for (let i = 0; i < source.length; i++) {
            hash = (hash << 5) - hash + source.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % COLOR_PALETTE.length;
        return COLOR_PALETTE[index] ?? '#0284C7';
    }
}
