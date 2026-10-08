import { z } from 'zod';

export const templateNodeSchema = z.object({
    id: z.string().describe('Unique instance identifier for the component'),
    uca: z.enum(['box', 'action', 'input', 'list', 'picture', 'toggle', 'dropdown']).describe('Target UCA primitive type'),
    parentTo: z.string().describe('Parent UCA or container id in the hierarchy'),
    body: z.record(z.string(), z.unknown()).describe('Disposition body properties such as className, label, text, items'),
    purpose: z.string().optional().describe('Teleological purpose of this specific component node'),
});

export const customCssRuleSchema = z.object({
    selector: z.string().describe('CSS selector for specific component styling'),
    declarations: z.record(z.string(), z.string()).describe('CSS property value declarations'),
});

export const composePayloadSchema = z.object({
    targetUca: z.string().describe('Scaffold UCA id to compose'),
    purpose: z.string().describe('Ontological purpose defined in scaffold'),
    parentTo: z.string().describe('Structural parent UCA id'),
    parentContext: z.string().optional().describe('Ontological context or purpose of the parent UCA'),
    themeClasses: z.array(z.string()).optional().describe('List of available OOCSS skin and typography classes'),
    model: z.string().optional().default('gemini-3.5-flash-lite'),
    provider: z.string().optional().default('gemini'),
    correlationId: z.string().optional(),
});

export const composedResultSchema = z.object({
    targetUca: z.string().describe('Scaffold UCA id that was composed'),
    nodes: z.array(templateNodeSchema).describe('Composed hierarchy of web and logic UCAs'),
    rules: z.array(customCssRuleSchema).optional().describe('Optional custom CSS rules created by composer'),
    correlationId: z.string().optional(),
});

export const bodySchema = z.object({
    context: z.string().optional().describe('Composition aesthetic and functional context'),
});

export type TemplateNode = z.infer<typeof templateNodeSchema>;
export type CustomCssRule = z.infer<typeof customCssRuleSchema>;
export type ComposePayload = z.infer<typeof composePayloadSchema>;
export type ComposedResult = z.infer<typeof composedResultSchema>;
export type Body = z.infer<typeof bodySchema>;
