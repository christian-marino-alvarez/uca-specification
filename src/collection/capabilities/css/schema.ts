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
export const dimensionSchema = tokenSchema(DESIGN_TOKENS.dimensions, 'Abstract size token');
const maximumDimensionSchema = tokenSchema(
    Object.fromEntries(
        Object.entries(DESIGN_TOKENS.dimensions).filter(([name]) => name !== 'auto'),
    ),
    'Abstract maximum size token',
);

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
    borderBottom: tokenSchema(DESIGN_TOKENS.border, 'Bottom border of this element (e.g. for header separator)').optional(),
    borderTop: tokenSchema(DESIGN_TOKENS.border, 'Top border of this element (e.g. for footer separator)').optional(),
    borderRight: tokenSchema(DESIGN_TOKENS.border, 'Right border of this element (e.g. for sidebar separator)').optional(),
    borderLeft: tokenSchema(DESIGN_TOKENS.border, 'Left border of this element').optional(),
    direction: tokenSchema(DESIGN_TOKENS.direction, 'Enable flex layout and select its main axis (row, column)').optional(),
    alignment: tokenSchema(DESIGN_TOKENS.alignment, 'Cross-axis item alignment (start, center, end, stretch, baseline)').optional(),
    distribution: tokenSchema(DESIGN_TOKENS.distribution, 'Main-axis item distribution (start, center, end, between, around, evenly)').optional(),
    wrap: tokenSchema(DESIGN_TOKENS.wrap, 'Flex wrap behavior (nowrap, wrap, reverse)').optional(),
    division: tokenSchema(DESIGN_TOKENS.division, 'Grid layout track division (single, halves, thirds, quarters, sidebar-main, auto)').optional(),
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
