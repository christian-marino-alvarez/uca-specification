import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { __ID__, DEFAULT_SIGNALS } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Coordinate application lifecycle and scaffolding orchestration';

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.INIT, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: SignalType.START, type: DataType.VOID, description: 'Start application execution' },
            { signal: SignalType.STOP, type: DataType.VOID, description: 'Stop application execution' },
        ],
        outputs: [
            { signal: SignalType.READY, type: DataType.STRING, description: 'Application initialized and ready' },
            { signal: SignalType.STARTED, type: DataType.BOOLEAN, description: 'Application started' },
            { signal: SignalType.STOPPED, type: DataType.BOOLEAN, description: 'Application stopped' },
            { signal: SignalType.ERROR, type: DataType.STRING, description: 'Application error occurred' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.INIT:
                this.handleInit(value);
                break;
            case SignalType.START:
                this.handleStart();
                break;
            case SignalType.STOP:
                this.handleStop();
                break;
            default:
                break;
        }
    }

    protected override capabilities(): Cooky {
        return [];
    }

    private handleInit(value: unknown): void {
        const { title = 'ready' } = (value ?? {}) as Body;
        this.pulse(SignalType.READY, title);
    }

    private handleStart(): void {
        this.pulse(SignalType.STARTED, true);
    }

    private handleStop(): void {
        this.pulse(SignalType.STOPPED, false);
    }
}

export * from './types.js';
export * from './constants.js';
