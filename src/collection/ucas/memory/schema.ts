import { z } from 'zod';

export const mediaRangeSchema = z.object({
    minWidth: z.number().optional().describe('Minimum viewport width in pixels for which this disposition is valid'),
    maxWidth: z.number().optional().describe('Maximum viewport width in pixels for which this disposition is valid'),
    minHeight: z.number().optional().describe('Minimum viewport height in pixels'),
    maxHeight: z.number().optional().describe('Maximum viewport height in pixels'),
    orientation: z.string().optional().describe('Screen orientation constraint (e.g. landscape-primary, portrait-primary)'),
});

export const bodySchema = z.object({
    id: z.string().optional().describe('Identifier of the Memory UCA instance'),
    namespace: z.string().default('uca').describe('Storage key namespace prefix'),
    storage: z.unknown().optional().describe('Optional custom Storage implementation'),
});

export type MediaRange = z.infer<typeof mediaRangeSchema>;
export type Body = z.infer<typeof bodySchema>;
