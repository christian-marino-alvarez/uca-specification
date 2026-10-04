import { z } from 'zod';

export const aimSchema = z.object({
    description: z.string().describe('Short teleological purpose of the UCA'),
    body: z.object({
        text: z.string().optional().describe('Visible text content (real heading, title or paragraph text for Box)'),
        label: z.string().optional().describe('Visible clickable label text (REQUIRED for Action buttons and Access navigation links)'),
        items: z.array(z.string()).optional().describe('Array of items or bullet points (REQUIRED for List)'),
        source: z.string().optional().describe('Image URL or SVG data URI for Picture, or target URL for Access'),
        placeholder: z.string().optional().describe('Placeholder input hint for Input'),
        role: z.string().optional().describe('Semantic structural role ("header", "main", "card", "footer")'),
        title: z.string().optional().describe('Tooltip or container title'),
        disabled: z.boolean().optional().describe('Disabled status'),
        checked: z.boolean().optional().describe('Checked state for Toggle'),
    }).passthrough().optional().describe('Domain properties configuring the visual content and behavior of the UCA'),
});

export type AimSchema = z.infer<typeof aimSchema>;
