import { z } from 'zod';
import { aimSchema } from './aim.js';
import { reactToSignalSchema } from './react-to.js';
import { parentToSchema } from './parent-to.js';
import { signalDeclarationSchema } from './signal.js';

export const dispositionSchema = z.object({
    aim: aimSchema,
    reactTo: z.array(reactToSignalSchema).optional().default([]).describe('Reactive subscriptions to external outcomes emitted by other UCAs'),
    parentTo: parentToSchema.optional(),
    inputs: z.array(signalDeclarationSchema).optional().describe('List of accepted input signals'),
    outputs: z.array(signalDeclarationSchema).optional().describe('List of emitted output signals'),
});

export type DispositionSchema = z.infer<typeof dispositionSchema>;
