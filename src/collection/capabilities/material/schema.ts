import { z } from 'zod';

export const themeModeSchema = z.enum(['light', 'dark']);

export const colorRoleSchema = z.enum([
    'primary',
    'secondary',
    'tertiary',
    'surface',
    'surfaceVariant',
    'surfaceContainer',
    'surfaceContainerLow',
    'surfaceContainerHigh',
    'surfaceContainerHighest',
    'outline',
    'error',
]);

export const elevationSchema = z.enum([
    'level0',
    'level1',
    'level2',
    'level3',
    'level4',
    'level5',
]);

export const shapeSchema = z.enum([
    'none',
    'extraSmall',
    'small',
    'medium',
    'large',
    'extraLarge',
    'full',
]);

export const componentVariantSchema = z.enum([
    'elevated',
    'filled',
    'tonal',
    'outlined',
    'text',
]);

export const spacingScaleSchema = z.enum([
    'none',
    'compact',
    'comfortable',
    'dense',
    'spacious',
    'generous',
]);

export const layoutDirectionSchema = z.enum([
    'row',
    'column',
]);

export const alignmentSchema = z.enum([
    'start',
    'center',
    'end',
    'stretch',
]);

export const distributionSchema = z.enum([
    'start',
    'center',
    'end',
    'between',
    'around',
    'evenly',
]);

export const materialQualitiesSchema = z.object({
    variant: componentVariantSchema.optional().describe('Material 3 canonical component variant'),
    elevation: elevationSchema.optional().describe('Material 3 tonal elevation and shadow depth (level0..level5)'),
    surface: colorRoleSchema.optional().describe('Material 3 surface color container role'),
    shape: shapeSchema.optional().describe('Material 3 corner radius curvature scale'),
    spacing: spacingScaleSchema.optional().describe('Material 3 inner container padding'),
    gap: spacingScaleSchema.optional().describe('Material 3 space between child elements'),
    direction: layoutDirectionSchema.optional().describe('Flex container primary axis direction'),
    alignment: alignmentSchema.optional().describe('Cross-axis item alignment'),
    distribution: distributionSchema.optional().describe('Main-axis item distribution'),
    width: z.string().optional().describe('CSS dimension for preferred width'),
    height: z.string().optional().describe('CSS dimension for preferred height'),
    maxWidth: z.string().optional().describe('Explicit maximum width constraint'),
    minWidth: z.string().optional().describe('Explicit minimum width constraint'),
    overflow: z.enum(['visible', 'hidden', 'auto', 'scroll']).optional(),
}).strict();

export const applyPayloadSchema = z.object({
    theme: themeModeSchema.optional(),
    seedColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid HEX color string required').optional(),
    targetSelector: z.string().min(1).optional(),
}).strict();

export const appliedResultSchema = z.object({
    theme: themeModeSchema,
    tokens: z.record(z.string(), z.string()),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    theme: themeModeSchema.optional(),
    seedColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
    targetSelector: z.string().min(1).optional(),
}).strict();

export type ThemeMode = z.infer<typeof themeModeSchema>;
export type ColorRole = z.infer<typeof colorRoleSchema>;
export type Elevation = z.infer<typeof elevationSchema>;
export type Shape = z.infer<typeof shapeSchema>;
export type ComponentVariant = z.infer<typeof componentVariantSchema>;
export type SpacingScale = z.infer<typeof spacingScaleSchema>;
export type MaterialQualities = z.infer<typeof materialQualitiesSchema>;
export type ApplyPayload = z.infer<typeof applyPayloadSchema>;
export type AppliedResult = z.infer<typeof appliedResultSchema>;
export type Body = z.infer<typeof bodySchema>;
