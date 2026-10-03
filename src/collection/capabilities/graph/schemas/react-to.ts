import { z } from 'zod';

export const reactToSignalSchema = z.string().regex(
    /^(?:[a-zA-Z0-9_-]+:)?[a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+$/,
    'reactTo must follow format [prefix:]<id>.<outcome> (e.g. "action:simulate-pulse.triggered")'
).describe('External signal from another UCA to subscribe and react to');

export type ReactToSignalSchema = z.infer<typeof reactToSignalSchema>;
