import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import { type Body, type LogEntry, DataType, SignalType } from './types.js';

export class Logger extends Uca<Body> {
    public static override purpose: string = 'Observe nervous bus activity and log all reactive signals and primitives';

    public static override disposition: Disposition<Body> = {
        aim: { description: Logger.purpose, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [
            { signal: '*', type: DataType.SIGNAL, description: 'All bus signals to observe and log' },
        ],
        outputs: [
            { signal: SignalType.LOG, type: DataType.LOG_ENTRY, description: 'Structured signal log entry' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        return [];
    }

    protected override react(signal: Signal): void {
        const { property, source, value, timestamp = Date.now() } = signal;
        if (property === SignalType.LOG) { return; }
        const { aim } = this.disposition;
        const { prefix = '[UCA BUS]', filter, onLog } = aim.body ?? {};
        if (filter && !filter(signal)) { return; }
        const entry: LogEntry = { timestamp, source, property, value };
        console.log(`${prefix} [${source}] -> ${property}`, value);
        if (onLog) { onLog(entry); }
        this.pulse(SignalType.LOG, entry);
    }
}

export * from './types.js';
export * from './constants.js';
