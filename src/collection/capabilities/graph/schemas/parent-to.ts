import { z } from 'zod';

export const parentToSchema = z.object({
    uca: z.string().describe('Parent container UCA identifier (e.g. "box:root", "box:card", "collector:form")'),
    relation: z.string().describe('Structural role inside parent container (e.g. "child", "header", "content", "action")'),
}).describe('Structural hierarchical placement inside parent container (omit on root containers)');

export type ParentToSchema = z.infer<typeof parentToSchema>;
