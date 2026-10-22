import { z } from 'zod';

export const phaseSchema = z.enum([
    'structure',
    'plan',
    'visual',
]);

export const bodySchema = z.object({
    request: z.record(z.string(), z.unknown()).optional(),
    correlationId: z.string().optional(),
    phase: phaseSchema.optional(),
    structure: z.unknown().optional(),
    visualPlan: z.record(z.string(), z.unknown()).optional(),
});

export type Body = z.infer<typeof bodySchema>;
