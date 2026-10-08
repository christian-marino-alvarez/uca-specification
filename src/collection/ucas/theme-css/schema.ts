import { z } from 'zod';

export const cssRuleSchema = z.object({
    selector: z.string().describe('CSS selector (e.g. :root, .ext-box, body)'),
    declarations: z.record(z.string(), z.string()).describe('CSS property declarations mapping property name to value'),
});

export const themeSchema = z.object({
    rules: z.array(cssRuleSchema).describe('List of OOCSS rules defining the theme'),
});

export const createPayloadSchema = z.object({
    request: z.string().describe('Target purpose or application requirements to theme'),
    context: z.string().optional().describe('Context or aesthetic guidelines'),
    model: z.string().optional().default('gemini-3.5-flash-lite'),
    provider: z.string().optional().default('gemini'),
    correlationId: z.string().optional(),
});

export const bodySchema = z.object({
    rules: z.array(cssRuleSchema).optional(),
});

export const themeResultSchema = z.object({
    correlationId: z.string().optional(),
    rules: z.array(cssRuleSchema),
});

export type CssRule = z.infer<typeof cssRuleSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type CreatePayload = z.infer<typeof createPayloadSchema>;
export type Body = z.infer<typeof bodySchema>;
export type ThemeResult = z.infer<typeof themeResultSchema>;

