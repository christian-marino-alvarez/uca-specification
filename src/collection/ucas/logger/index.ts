import { extractContext } from './formatting.js';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { EntityKind } from '@uca/core/types';
import { __ID__ } from './constants.js';
import { type Body, type LogEntry, type ObservedPayload, DataType, SignalType, Scope } from './types.js';

export class Logger extends Uca<Body> {
    public static override purpose: string = 'Observe nervous bus activity and log all reactive signals and primitives';

    public static override disposition: Disposition<Body> = {
        aim: { description: Logger.purpose, body: {} },
        reactTo: [SignalType.OBSERVE],
        inputs: [
            { signal: SignalType.OBSERVE, type: DataType.SIGNAL, description: 'All bus signals to observe and log' },
        ],
        outputs: [
            { signal: SignalType.LOG, type: DataType.LOG_ENTRY, description: 'Structured signal log entry' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override matchesId(_id?: string): boolean {
        return true;
    }

    protected override catalog(): Cooky {
        return [];
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        const { aim } = this.disposition;
        const { filter } = aim.body ?? {};
        if (property === SignalType.LOG || (filter && !filter(signal))) {
            return;
        }
        this.handleObserved(signal);
    }

    private handleObserved(signal: Signal): void {
        const {
            property,
            source,
            sourceKind = EntityKind.EXTERNAL,
            targetId,
            value,
            timestamp = Date.now(),
        } = signal;
        const {
            aim,
        } = this.disposition;
        const {
            scope = Scope.FRONT,
            prefix,
            onLog,
        } = aim.body ?? {};
        const entry: LogEntry = {
            scope,
            timestamp,
            source,
            sourceKind,
            targetId,
            property,
            value,
            ...extractContext(value),
        };
        this.printFormattedLog(prefix, entry);
        if (onLog) {
            onLog(entry);
        }
        this.pulse(SignalType.LOG, entry);
    }

    private printFormattedLog(prefix: string | undefined, entry: LogEntry): void {
        const {
            source,
            sourceKind,
            scope,
            property,
            value,
            ...context
        } = entry;
        const {
            message: description,
            error,
        } = (value ?? {}) as ObservedPayload;
        const message = `[${scope}] ${prefix ? `${prefix} ` : ''}[${sourceKind} ${source}] ${description ?? `-> ${property}`}`;
        const data = {
            source: {
                kind: sourceKind,
                id: source,
            },
            scope,
            property,
            value,
            ...context,
        };
        if (error !== undefined) {
            console.error(message, data);
            return;
        }
        console.log(message, data);
    }
}
