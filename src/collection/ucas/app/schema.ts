import { z } from 'zod';
import { requestSchema as buildRequestSchema } from '@uca/builder/schema';

export const buildSchema = buildRequestSchema.pick({
    areaId: true,
    design: true,
    aim: true,
    context: true,
    limits: true,
    requirements: true,
    composition: true,
});

export const bodySchema = z.object({
    build: buildSchema.optional(),
}).strict();

export type Build = z.infer<typeof buildSchema>;
export type Body = z.infer<typeof bodySchema>;
