import type { Disposition, ICapability } from '@uca/core/types';

export interface Signals {
    readonly RENDER: string;
    readonly UPDATE: string;
    readonly REMOVE: string;
    readonly CREATED: string;
    readonly UPDATED: string;
    readonly REMOVED: string;
    readonly ERROR: string;
}

export interface Scenario {
    readonly create: () => ICapability;
    readonly disposition: Disposition;
    readonly signals: Signals;
    readonly body: Record<string, unknown>;
    readonly patch: Record<string, unknown>;
    readonly tag: string;
    readonly updatedTag?: string;
}
