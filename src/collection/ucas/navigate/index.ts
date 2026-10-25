import { History } from '@uca/capability-history';
import { SignalType as HistorySignalType } from '@uca/capability-history/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    DEFAULT_PATH,
    DEFAULT_PURPOSE,
    MEMORY_LAST_ROUTE_KEY,
    MEMORY_NAMESPACE,
    __ID__,
} from './constants.js';
import {
    navigateRequestSchema,
    navigationStateSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type NavigateRequest,
    type NavigationState,
} from './types.js';

export class Navigate extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: DEFAULT_PURPOSE,
            body: {
                currentPath: DEFAULT_PATH,
            },
        },
        reactTo: [
            SignalType.GO,
            SignalType.RESTORE,
            ...Navigate.reactToHistory(),
            ...Navigate.reactToMemory(),
        ],
        inputs: [
            {
                signal: SignalType.GO,
                type: DataType.NAVIGATE_REQUEST,
                schema: navigateRequestSchema,
                description: 'Navigate to target path and synchronize history with memory',
            },
            {
                signal: SignalType.RESTORE,
                type: DataType.VOID,
                description: 'Restore previous navigation from memory',
            },
        ],
        outputs: [
            {
                signal: SignalType.CHANGED,
                type: DataType.NAVIGATION_STATE,
                schema: navigationStateSchema,
                description: 'Active navigation state updated',
            },
        ],
    };

    private static reactToHistory(): string[] {
        return [
            ...History.disposition?.reactTo || [],
            HistorySignalType.CHANGED,
            HistorySignalType.CURRENT,
        ];
    }

    private static reactToMemory(): string[] {
        return [
            ...Memory.disposition?.reactTo || [],
            MemorySignalType.RETRIEVED,
            MemorySignalType.SAVED,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        return [
            [
                History,
                this.createDisposition(
                    History.disposition,
                    History.AIM,
                    'history',
                ),
            ],
            [
                Memory,
                this.createDisposition(
                    Memory.disposition,
                    Memory.purpose,
                    'memory',
                    {
                        namespace: MEMORY_NAMESPACE,
                    },
                ),
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.GO:
                this.handleGo(signal);
                break;
            case SignalType.RESTORE:
                this.handleRestore();
                break;
            case HistorySignalType.CHANGED:
                this.handleHistoryChanged(signal);
                break;
            case HistorySignalType.CURRENT:
                this.handleHistoryCurrent(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            default:
                break;
        }
    }

    private handleGo(signal: Signal): void {
        const payload = this.extractPayload<NavigateRequest>(signal.value);
        if (!payload) {
            return;
        }
        this.executeGo(payload);
    }

    private executeGo(payload: NavigateRequest): void {
        const {
            path,
            parameters,
            replace,
        } = payload;
        const historyProperty = replace
            ? HistorySignalType.REPLACE
            : HistorySignalType.PUSH;
        this.pulse(historyProperty, {
            path,
            parameters,
        });
    }

    private handleRestore(): void {
        this.pulse(MemorySignalType.GET, {
            key: MEMORY_LAST_ROUTE_KEY,
        });
    }

    private handleHistoryCurrent(signal: Signal): void {
        this.processRouteState(signal);
    }

    private handleHistoryChanged(signal: Signal): void {
        this.processRouteState(signal);
    }

    private processRouteState(signal: Signal): void {
        const routeState = this.extractPayload<NavigationState>(signal.value);
        if (!routeState) {
            return;
        }
        this.persistAndEmit(routeState);
    }

    private persistAndEmit(routeState: NavigationState): void {
        const {
            path,
            parameters,
            url,
            timestamp,
        } = routeState;
        this.pulse(MemorySignalType.SAVE, {
            key: MEMORY_LAST_ROUTE_KEY,
            value: routeState,
        });
        const navigationState: NavigationState = {
            path,
            parameters,
            url,
            timestamp,
        };
        this.updateAimBody(path, parameters);
        this.pulse(SignalType.CHANGED, navigationState);
    }

    private updateAimBody(currentPath: string, parameters?: Record<string, unknown>): void {
        const {
            aim,
        } = this.disposition;
        const previousPath = aim.body?.currentPath;
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: {
                ...aim,
                body: {
                    ...aim.body,
                    currentPath,
                    previousPath,
                    parameters,
                },
            },
        });
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const routeState = this.extractPayload<NavigationState>(signal.value);
        if (!routeState) {
            return;
        }
        this.restoreRoute(routeState);
    }

    private restoreRoute(routeState: NavigationState): void {
        const {
            path,
            parameters,
        } = routeState;
        this.pulse(HistorySignalType.REPLACE, {
            path,
            parameters,
        });
    }
}
