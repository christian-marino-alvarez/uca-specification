import { z } from 'zod';
import { DESIGN_TOKENS, DIMENSION_PATTERN } from './constants.js';
import type { DesignToken } from './types.js';

const tokenSchema = (group: Record<string, unknown>, description: string) => {
    const entries = Object.entries(group).filter(([name]) => !name.startsWith('$'));
    const meanings = entries.map(([name, token]) => {
        const {
            $description,
        } = token as DesignToken<string | number>;
        return `${name}: ${$description}`;
    });
    return z.enum(entries.map(([name]) => name)).describe(`${description}. Tokens: ${meanings.join('; ')}.`);
};
export const dimensionSchema = z.union([tokenSchema(DESIGN_TOKENS.dimensions, 'Explicit size; screen uses viewport width for width constraints and viewport height for height constraints'), z.string().regex(DIMENSION_PATTERN)]);
const maximumDimensionSchema = z.union([tokenSchema(Object.fromEntries(Object.entries(DESIGN_TOKENS.dimensions).filter(([name]) => name !== 'auto')), 'Maximum size; screen means viewport width'), z.string().regex(DIMENSION_PATTERN)]);

export const designTokenSchema = z.object({
    $value: z.unknown(),
    $type: z.string().optional(),
    $description: z.string().optional(),
});

export const qualitiesSchema = z.object({
    width: dimensionSchema.optional().describe('Preferred width of this element; does not select a child layout'),
    height: dimensionSchema.optional().describe('Preferred height of this element'),
    maxWidth: maximumDimensionSchema.optional().describe('Explicit upper width bound; no maximum is added when omitted'),
    minWidth: dimensionSchema.optional().describe('Explicit lower width bound'),
    minHeight: dimensionSchema.optional().describe('Explicit lower height bound'),
    spacing: tokenSchema(DESIGN_TOKENS.spacing, 'Inner padding on every side; does not create gaps between children').optional(),
    spacingInline: tokenSchema(DESIGN_TOKENS.spacing, 'Inner padding on both inline sides; overrides spacing on this axis').optional(),
    spacingBlock: tokenSchema(DESIGN_TOKENS.spacing, 'Inner padding on both block sides; overrides spacing on this axis').optional(),
    marginInline: z.union([tokenSchema(DESIGN_TOKENS.spacing, 'Outer margin on both inline sides'), z.literal('auto').describe('Distribute available inline space equally outside the element; useful with an explicit width or maxWidth')]).optional(),
    gap: tokenSchema(DESIGN_TOKENS.spacing, 'Space between children in a flex layout; does not add padding or enable flex by itself').optional(),
    surface: tokenSchema(DESIGN_TOKENS.surface, 'Background color; independent of textColor and takes precedence over legacy tone').optional(),
    tone: tokenSchema(DESIGN_TOKENS.tone, 'Legacy background color alias used only when surface is absent; never text color').optional(),
    textColor: tokenSchema(DESIGN_TOKENS.textColor, 'Foreground text color independent of the background; inherited by descendants unless overridden').optional(),
    typeface: tokenSchema(DESIGN_TOKENS.typeface, 'Font family; inherited by descendants unless overridden').optional(),
    textSize: tokenSchema(DESIGN_TOKENS.textSize, 'Font size; inherited by descendants unless overridden').optional(),
    fontWeight: tokenSchema(DESIGN_TOKENS.fontWeight, 'Font weight; inherited by descendants unless overridden').optional(),
    lineHeight: tokenSchema(DESIGN_TOKENS.lineHeight, 'Unitless line-height multiplier; inherited by descendants unless overridden').optional(),
    textAlign: tokenSchema(DESIGN_TOKENS.textAlign, 'Alignment of text inside its line box; does not position child elements').optional(),
    elevation: tokenSchema(DESIGN_TOKENS.elevation, 'Box shadow').optional(),
    radius: tokenSchema(DESIGN_TOKENS.radius, 'Corner radius').optional(),
    border: tokenSchema(DESIGN_TOKENS.border, 'Border around this element').optional(),
    direction: tokenSchema(DESIGN_TOKENS.direction, 'Enable flex layout and select its main axis').optional(),
    alignment: tokenSchema(DESIGN_TOKENS.alignment, 'Enable flex layout; start and stretch affect the cross axis, center and end affect both axes, between affects the main axis; explicit distribution overrides its main-axis choice').optional(),
    distribution: tokenSchema(DESIGN_TOKENS.distribution, 'Enable flex layout and distribute children on the main axis only; direction selects the axis').optional(),
    wrap: tokenSchema(DESIGN_TOKENS.wrap, 'Enable flex layout and choose whether children may continue on additional lines').optional(),
    custom: z.record(z.string(), z.string()).optional(),
});

export const baseRulesSchema = z.object({
    body: z.record(z.string(), z.string()),
    app: z.record(z.string(), z.string()),
    customElement: z.record(z.string(), z.string()),
});

export const bodySchema = z.object({
    qualities: qualitiesSchema.optional(),
    tokens: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type BaseRules = z.infer<typeof baseRulesSchema>;
export type Body = z.infer<typeof bodySchema>;
