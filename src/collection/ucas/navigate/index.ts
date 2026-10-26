import { History } from '@uca/capability-history';
import { SignalType as HistorySignalType } from '@uca/capability-history/types';
import { Memory } from '@uca/capability-memory';
import {
    SignalType as MemorySignalType,
} from '@uca/capability-memory/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    DEFAULT_PURPOSE,
    DEFAULT_URL,
    __ID__,
} from './constants.js';
import {
    navigateDestroySchema,
    navigateInitSchema,
    navigateRequestSchema,
    navigationStateSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type NavigateRequest,
    type NavigationEntry,
    type NavigationState,
} from './types.js';

export class Navigate extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: DEFAULT_PURPOSE,
            body: {
                url: DEFAULT_URL,
            },
        },
        reactTo: [
            SignalType.INIT,
            SignalType.GO,
            SignalType.DESTROY,
            ...Navigate.reactToHistory(),
            ...Navigate.reactToMemory(),
        ],
        inputs: [
            {
                signal: SignalType.INIT,
                type: DataType.NAVIGATE_INIT,
                schema: navigateInitSchema,
                description: 'Initialize navigation session with default url if not registered',
            },
            {
                signal: SignalType.GO,
                type: DataType.NAVIGATE_REQUEST,
                schema: navigateRequestSchema,
                description: 'Navigate to target url and synchronize history',
            },
            {
                signal: SignalType.DESTROY,
                type: DataType.NAVIGATE_DESTROY,
                schema: navigateDestroySchema,
                description: 'Clear navigation session storage and state',
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
            this.buildHistoryCooky(),
            this.buildMemoryCooky(),
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.INIT:
                this.handleInit(signal);
                break;
            case SignalType.GO:
                this.handleGo(signal);
                break;
            case SignalType.DESTROY:
                this.handleDestroy(signal);
                break;
            case HistorySignalType.CHANGED:
                this.handleHistoryChanged(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            default:
                break;
        }
    }

    private buildHistoryCooky(): Cooky[number] {
        return [
            History,
            this.createDisposition(
                History.disposition,
                History.AIM,
                'history',
            ),
        ];
    }

    private buildMemoryCooky(): Cooky[number] {
        return [
            Memory,
            this.createDisposition(
                Memory.disposition,
                Memory.AIM,
                'memory',
            ),
        ];
    }

    private handleInit(signal: Signal): void {
        const {
            sessionId = '',
        } = signal;
        this.pulse(MemorySignalType.GET, {
            keys: [sessionId],
        });
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        const navigations = (Array.isArray(value) ? value : []) as NavigationEntry[];
        const lastNavigation = this.getLatestNavigation(navigations);
        this.pulse(SignalType.GO, {
            replace: true,
            url: lastNavigation.url,
        });
    }

    private getLatestNavigation(entries: NavigationEntry[]): NavigationEntry {
        const sorted = [...entries].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
        return sorted[0] ?? { url: DEFAULT_URL };
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
            parameters,
            replace,
            url,
        } = payload;
        const updated = this.buildAppendedRecords(url);
        this.persistTargetRoute(url, updated);
        this.pulseHistory(url, parameters, replace);
        this.emitRouteChanged(url, parameters, updated);
    }

    private buildAppendedRecords(url: string): NavigationEntry[] {
        const {
            aim,
        } = this.disposition;
        const existing = aim.body?.records ?? [];
        return this.appendUniqueRecord(existing, url);
    }

    private appendUniqueRecord(existing: NavigationEntry[], url: string): NavigationEntry[] {
        const last = existing[existing.length - 1];
        if (last?.url === url) {
            return existing;
        }
        const entry = this.createNavigationEntry(url);
        return [
            ...existing,
            entry,
        ];
    }

    private createNavigationEntry(url: string): NavigationEntry {
        return {
            timestamp: Date.now(),
            url,
        };
    }

    private persistTargetRoute(url: string, records?: NavigationEntry[]): void {
        const updated = records ?? this.buildAppendedRecords(url);
        const {
            aim,
        } = this.disposition;
        const sessionId = this.currentSignal?.sessionId ?? aim.body?.sessionId ?? '';
        this.pulse(MemorySignalType.SET, {
            entries: [{
                key: sessionId,
                value: updated,
            }],
        });
    }

    private pulseHistory(url: string, parameters?: Record<string, unknown>, replace?: boolean): void {
        const historyProperty = replace
            ? HistorySignalType.REPLACE
            : HistorySignalType.PUSH;
        this.pulse(historyProperty, {
            parameters,
            path: url,
        });
    }

    private emitRouteChanged(
        url: string,
        parameters?: Record<string, unknown>,
        records?: NavigationEntry[],
    ): void {
        this.updateAimBody(url, parameters, records);
        this.pulse(SignalType.CHANGED, {
            parameters,
            url,
        });
    }

    private handleDestroy(_signal: Signal): void {
        this.persistTargetRoute(DEFAULT_URL, []);
        this.updateAimBody(DEFAULT_URL, undefined, []);
    }

    private handleHistoryChanged(signal: Signal): void {
        const routeState = this.extractPayload<NavigationState>(signal.value);
        if (!routeState) {
            return;
        }
        this.processHistoryRoute(routeState);
    }

    private processHistoryRoute(routeState: NavigationState): void {
        const {
            parameters,
            url,
        } = routeState;
        this.persistTargetRoute(url);
        this.emitRouteChanged(url, parameters);
    }

    private updateAimBody(
        url: string,
        parameters?: Record<string, unknown>,
        records?: NavigationEntry[],
    ): void {
        const updatedBody = this.createUpdatedBody(url, parameters, records);
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: {
                ...this.disposition.aim,
                body: updatedBody,
            },
        });
    }

    private createUpdatedBody(
        url: string,
        parameters?: Record<string, unknown>,
        records?: NavigationEntry[],
    ): Body {
        const base = this.resolveBaseBody(url, parameters, records);
        const sessionId = this.currentSignal?.sessionId ?? this.disposition.aim.body?.sessionId;
        return sessionId ? {
            ...base,
            sessionId,
        } : base;
    }

    private resolveBaseBody(
        url: string,
        parameters?: Record<string, unknown>,
        records?: NavigationEntry[],
    ): Body {
        const {
            aim,
        } = this.disposition;
        return {
            ...aim.body,
            currentPath: url,
            previousPath: aim.body?.url ?? aim.body?.currentPath,
            previousUrl: aim.body?.url,
            records: records ?? aim.body?.records,
            url,
            parameters,
        };
    }
}
