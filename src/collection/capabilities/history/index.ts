import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_PATH,
    __ID__,
} from './constants.js';
import {
    routePayloadSchema,
    routeStateSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type RoutePayload,
    type RouteState,
} from './types.js';

export class History extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: History.AIM,
            body: {
                defaultPath: DEFAULT_PATH,
            },
        },
        reactTo: [
            SignalType.PUSH,
            SignalType.REPLACE,
            SignalType.READ,
        ],
        inputs: [
            {
                signal: SignalType.PUSH,
                type: DataType.ROUTE_PAYLOAD,
                schema: routePayloadSchema,
                description: 'Push new route to browser history',
            },
            {
                signal: SignalType.REPLACE,
                type: DataType.ROUTE_PAYLOAD,
                schema: routePayloadSchema,
                description: 'Replace current browser history entry',
            },
            {
                signal: SignalType.READ,
                type: DataType.VOID,
                description: 'Read current browser history location',
            },
        ],
        outputs: [
            {
                signal: SignalType.CHANGED,
                type: DataType.ROUTE_STATE,
                schema: routeStateSchema,
                description: 'Emitted when browser history popstate or navigation changes',
            },
            {
                signal: SignalType.CURRENT,
                type: DataType.ROUTE_STATE,
                schema: routeStateSchema,
                description: 'Current browser history location state',
            },
        ],
    };

    private popstateListener?: (event: PopStateEvent) => void;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.unbindWindowHistory();
        super.denervate();
    }

    protected override react(signal: Signal): void {
        this.ensureWindowHistory();
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.PUSH:
                this.handlePush(signal);
                break;
            case SignalType.REPLACE:
                this.handleReplace(signal);
                break;
            case SignalType.READ:
                this.emitCurrentRoute();
                break;
            default:
                break;
        }
    }

    private ensureWindowHistory(): void {
        if (typeof window === 'undefined' || this.popstateListener) {
            return;
        }
        this.popstateListener = () => {
            this.handlePopState();
        };
        window.addEventListener('popstate', this.popstateListener);
    }

    private unbindWindowHistory(): void {
        if (typeof window === 'undefined' || !this.popstateListener) {
            return;
        }
        window.removeEventListener('popstate', this.popstateListener);
        this.popstateListener = undefined;
    }

    private handlePopState(): void {
        const routeState = this.resolveCurrentRouteState();
        this.pulse(SignalType.CHANGED, routeState);
    }

    private handlePush(signal: Signal): void {
        const payload = this.extractPayload<RoutePayload>(signal.value);
        if (!payload) {
            return;
        }
        this.applyHistoryPush(payload);
    }

    private handleReplace(signal: Signal): void {
        const payload = this.extractPayload<RoutePayload>(signal.value);
        if (!payload) {
            return;
        }
        this.applyHistoryReplace(payload);
    }

    private applyHistoryPush(payload: RoutePayload): void {
        const {
            path,
            parameters,
        } = payload;
        this.executePushState(path, parameters);
        const routeState = this.resolveCurrentRouteState();
        this.pulse(SignalType.CHANGED, routeState);
    }

    private applyHistoryReplace(payload: RoutePayload): void {
        const {
            path,
            parameters,
        } = payload;
        this.executeReplaceState(path, parameters);
        const routeState = this.resolveCurrentRouteState();
        this.pulse(SignalType.CHANGED, routeState);
    }

    private executePushState(path: string, parameters?: Record<string, unknown>): void {
        if (typeof window === 'undefined' || !window.history) {
            return;
        }
        const hash = `#/${path}`;
        window.history.pushState(parameters ?? {}, '', hash);
    }

    private executeReplaceState(path: string, parameters?: Record<string, unknown>): void {
        if (typeof window === 'undefined' || !window.history) {
            return;
        }
        const hash = `#/${path}`;
        window.history.replaceState(parameters ?? {}, '', hash);
    }

    private emitCurrentRoute(): void {
        const routeState = this.resolveCurrentRouteState();
        this.pulse(SignalType.CURRENT, routeState);
    }

    private resolveCurrentRouteState(): RouteState {
        const path = this.readCurrentPath();
        const url = typeof window !== 'undefined' ? window.location.href : undefined;
        return {
            path,
            url,
            timestamp: Date.now(),
        };
    }

    private readCurrentPath(): string {
        if (typeof window === 'undefined' || !window.location) {
            const {
                aim,
            } = this.disposition;
            return aim.body?.defaultPath ?? DEFAULT_PATH;
        }
        const {
            hash,
        } = window.location;
        const normalized = hash.replace(/^#\/?/, '').trim();
        return normalized.length > 0 ? normalized : DEFAULT_PATH;
    }
}
