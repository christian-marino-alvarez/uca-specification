import { z } from 'zod';

export const aimSchema = z.object({
    description: z.string().describe('Teleological description of UCA purpose'),
    body: z.record(z.string(), z.unknown()).optional().describe('Key-value domain properties configuring the UCA'),
});

export type AimSchema = z.infer<typeof aimSchema>;
