import { z } from 'zod';

export const regionNodeSchema = z.object({
    purpose: z.string().optional().describe('Teleological purpose and functional responsibility of this conceptual region'),
    parentRegion: z.string().nullable().optional().default('').describe('Identifier of parent conceptual region'),
    parentTo: z.string().nullable().optional().default('').describe('Legacy compatibility for parent reference'),
});

export const ucaNodeSchema = regionNodeSchema;

export const themeSchema = z.object({
    global: z.union([z.string(), z.record(z.string(), z.unknown())]).default('').describe('Global CSS visual foundation or design tokens'),
}).catchall(z.unknown()).describe('OOCSS visual architecture and reusable styling structures');

export const scaffoldSchema = z.object({
    purpose: z.string().optional().default('').describe('Refined and clear conceptual goal of the application'),
    global: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
    theme: themeSchema.optional().default({ global: '' }),
    regions: z.record(z.string(), regionNodeSchema).optional().default({}),
    ucas: z.record(z.string(), regionNodeSchema).optional().default({}),
}).catchall(z.union([regionNodeSchema, z.unknown()])).describe('Conceptual application scaffold structure');

export type RegionNode = z.infer<typeof regionNodeSchema>;
export type UcaNode = RegionNode;
export type Theme = z.infer<typeof themeSchema>;
export type Scaffold = z.infer<typeof scaffoldSchema>;

