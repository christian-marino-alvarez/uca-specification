import { z } from 'zod';

export const bodySchema = z.object({
    areaId: z.string().optional().describe('Unique identifier of the target area to build'),
    purpose: z.string().optional().describe('Ontological purpose and responsibility of the area'),
    context: z.string().optional().describe('Context delegated to the area for template evaluation'),
    parentTo: z.string().optional().describe('Identifier of the parent container'),
    status: z.enum(['idle', 'skeleton', 'evaluating', 'built', 'subdivided']).optional().describe('Lifecycle state of the template construction'),
    provider: z.enum(['gemini', 'openai', 'jev']).optional().describe('Cognitive AI evaluation provider'),
    model: z.string().optional().describe('AI model to use for area evaluation'),
});

export type Body = z.infer<typeof bodySchema>;
