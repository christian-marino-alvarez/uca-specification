import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import { type Body, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static readonly PURPOSE: string = 'Coordinate application lifecycle and scaffolding orchestration';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(App.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.INIT, type: 'void', description: 'Initialize the application' },
                { signal: SignalType.START, type: 'void', description: 'Start the application execution' },
                { signal: SignalType.STOP, type: 'void', description: 'Stop the application execution' },
            ],
            outputs: [
                { signal: SignalType.READY, type: '{ status: string }', description: 'Application initialized and ready' },
                { signal: SignalType.STARTED, type: '{ active: boolean }', description: 'Application started' },
                { signal: SignalType.STOPPED, type: '{ active: boolean }', description: 'Application stopped' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, App.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const active = disposition ?? App.createDefaultDisposition();
        return super.innervate(target, active);
    }

    protected override capabilities(): Cooky {
        return [];
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.INIT:
                this.handleInit();
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

    private handleInit(): void {
        this.pulse(SignalType.READY, { status: 'ready' });
    }

    private handleStart(): void {
        this.pulse(SignalType.STARTED, { active: true });
    }

    private handleStop(): void {
        this.pulse(SignalType.STOPPED, { active: false });
    }
}

export * from './types.js';
export * from './constants.js';
