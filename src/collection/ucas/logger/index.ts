import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import { type Body, type LogEntry, SignalType } from './types.js';

export class Logger extends Uca<Body> {
    public static readonly PURPOSE: string = 'Observe nervous bus activity and log all reactive signals and primitives';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(Logger.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: '*', type: 'Signal', description: 'All bus signals to observe and log' },
            ],
            outputs: [
                { signal: SignalType.LOG, type: 'LogEntry', description: 'Structured signal log entry' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, Logger.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? Logger.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set(initialSignals));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    public override denervate(): void {
        super.denervate();
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
