import { z } from 'zod';
import { DESIGN_TOKENS } from './constants.js';
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
export const dimensionPattern = /^\d+(?:\.\d+)?(?:%|px|rem|em|vh|vw|dvh|dvw)$/;

export const dimensionSchema = z.union([
    tokenSchema(DESIGN_TOKENS.dimensions, 'Abstract size token'),
    z.string().regex(dimensionPattern).describe('Relative or explicit CSS dimension unit'),
]);

const maximumDimensionSchema = z.union([
    tokenSchema(
        Object.fromEntries(
            Object.entries(DESIGN_TOKENS.dimensions).filter(([name]) => name !== 'auto'),
        ),
        'Abstract maximum size token',
    ),
    z.string().regex(dimensionPattern).describe('Relative or explicit CSS dimension unit'),
]);

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
    marginBlock: tokenSchema(DESIGN_TOKENS.spacing, 'Outer margin on both block (vertical) sides; creates vertical space between elements').optional(),
    order: z.number().int().describe('Explicit visual sequence among flex or grid siblings; omit when semantic DOM order is already the visual order').optional(),
    gap: tokenSchema(DESIGN_TOKENS.spacing, 'Space between children in a flex layout; does not add padding or enable flex by itself').optional(),
    surface: tokenSchema(DESIGN_TOKENS.surface, 'Background color role (Material Design 3 / system tokens). Pair with appropriate contrast textColor').optional(),
    variant: tokenSchema(DESIGN_TOKENS.variant, 'Material Design 3 canonical component variant (elevated, filled, tonal, outlined, text)').optional(),
    textColor: tokenSchema(DESIGN_TOKENS.textColor, 'Foreground text color independent of the background; inherited by descendants unless overridden. dark is for light brand or accent surfaces; light and muted are for dark surfaces. Never select a foreground with the same token value as its surface').optional(),
    typeface: tokenSchema(DESIGN_TOKENS.typeface, 'Font family; inherited by descendants unless overridden').optional(),
    textSize: tokenSchema(DESIGN_TOKENS.textSize, 'Font size; inherited by descendants unless overridden').optional(),
    fontWeight: tokenSchema(DESIGN_TOKENS.fontWeight, 'Font weight; inherited by descendants unless overridden').optional(),
    lineHeight: tokenSchema(DESIGN_TOKENS.lineHeight, 'Unitless line-height multiplier; inherited by descendants unless overridden').optional(),
    textAlign: tokenSchema(DESIGN_TOKENS.textAlign, 'Alignment of text inside its line box; does not position child elements').optional(),
    elevation: tokenSchema(DESIGN_TOKENS.elevation, 'Box shadow').optional(),
    shape: tokenSchema(DESIGN_TOKENS.shape, 'Material Design 3 corner curvature scale (none, extraSmall, small, medium, large, extraLarge, full)').optional(),
    outline: tokenSchema(DESIGN_TOKENS.outline, 'Material Design 3 perimeter boundary outline (none, subtle, strong, dashed)').optional(),
    outlineBottom: tokenSchema(DESIGN_TOKENS.outline, 'Bottom outline of this element (e.g. for header separator)').optional(),
    outlineTop: tokenSchema(DESIGN_TOKENS.outline, 'Top outline of this element (e.g. for footer separator)').optional(),
    outlineRight: tokenSchema(DESIGN_TOKENS.outline, 'Right outline of this element (e.g. for sidebar separator)').optional(),
    outlineLeft: tokenSchema(DESIGN_TOKENS.outline, 'Left outline of this element').optional(),
    direction: tokenSchema(DESIGN_TOKENS.direction, 'Enable flex layout and select its main axis (row, column). Mutually exclusive with division').optional(),
    alignment: tokenSchema(DESIGN_TOKENS.alignment, 'Cross-axis item alignment (start, center, end, stretch, baseline)').optional(),
    distribution: tokenSchema(DESIGN_TOKENS.distribution, 'Main-axis item distribution (start, center, end, between, around, evenly)').optional(),
    wrap: tokenSchema(DESIGN_TOKENS.wrap, 'Flex wrap behavior (nowrap, wrap, reverse)').optional(),
    division: tokenSchema(DESIGN_TOKENS.division, 'Grid layout track division (single, halves, thirds, quarters, sidebar-main, auto). Mutually exclusive with direction and wrap').optional(),
    span: tokenSchema(DESIGN_TOKENS.span, 'Grid cell span coverage for child area (single, double, triple, full)').optional(),
    flex: tokenSchema(DESIGN_TOKENS.flex, 'Flex sizing and grow/shrink behavior (none, initial, auto, fill, grow, shrink)').optional(),
    overflow: tokenSchema(DESIGN_TOKENS.overflow, 'Container overflow containment (visible, hidden, auto, scroll)').optional(),
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
