import { z } from 'zod';

export const signalDeclarationSchema = z.object({
    signal: z.string().describe('Signal identifier name (e.g. "create", "action.triggered")'),
    type: z.string().default('unknown').describe('Data type descriptor of payload'),
    description: z.string().optional().describe('Signal purpose and semantics'),
});

export type SignalDeclarationSchema = z.infer<typeof signalDeclarationSchema>;
