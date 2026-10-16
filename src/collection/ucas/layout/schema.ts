import { z } from 'zod';
import {
    qualitiesSchema as visualQualitiesSchema,
} from '@uca/capability-css/schema';
import {
    entrySchema as catalogEntrySchema,
} from '@uca/capability-catalog/schema';

export const dimensionSchema = z.object({
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
}).strict();

export const screenSchema = dimensionSchema.extend({
    availableWidth: z.number().nonnegative(),
    availableHeight: z.number().nonnegative(),
});

export const visualViewportSchema = dimensionSchema.extend({
    offsetLeft: z.number(),
    offsetTop: z.number(),
    scale: z.number().positive(),
});

export const safeAreaSchema = z.object({
    top: z.number().nonnegative(),
    right: z.number().nonnegative(),
    bottom: z.number().nonnegative(),
    left: z.number().nonnegative(),
}).strict();

export const interactionSchema = z.object({
    pointer: z.enum([
        'none',
        'coarse',
        'fine',
    ]),
    hover: z.boolean(),
    touchPoints: z.number().int().nonnegative(),
}).strict();

export const preferencesSchema = z.object({
    colorScheme: z.enum([
        'light',
        'dark',
        'no-preference',
    ]),
    contrast: z.enum([
        'more',
        'less',
        'custom',
        'no-preference',
    ]),
    reducedMotion: z.boolean(),
    reducedTransparency: z.boolean().optional(),
}).strict();

export const performanceSchema = z.object({
    deviceMemory: z.number().positive().optional(),
    hardwareConcurrency: z.number().int().positive().optional(),
    saveData: z.boolean().optional(),
    effectiveConnection: z.enum([
        'slow-2g',
        '2g',
        '3g',
        '4g',
    ]).optional(),
}).strict();

export const browserSchema = z.object({
    area: dimensionSchema,
    viewport: dimensionSchema,
    screen: screenSchema,
    visualViewport: visualViewportSchema.optional(),
    safeArea: safeAreaSchema.optional(),
    pixelRatio: z.number().positive(),
    language: z.string().min(1),
    writingDirection: z.enum([
        'ltr',
        'rtl',
    ]),
    interaction: interactionSchema,
    preferences: preferencesSchema,
    performance: performanceSchema.optional(),
}).strict();

export const styleValueSchema = z.union([
    z.string(),
    z.number(),
]);

export const styleMapSchema = z.record(
    z.string().min(1),
    styleValueSchema,
);

export const directionSchema = z.object({
    theme: z.enum([
        'light',
        'dark',
        'adaptive',
    ]),
    density: z.enum([
        'compact',
        'comfortable',
        'spacious',
    ]),
    tone: z.array(z.string().min(1)),
    principles: z.array(z.string().min(1)),
}).strict();

export const layoutSchema = z.object({
    containers: styleMapSchema,
    grid: styleMapSchema,
}).strict();

export const logoSchema = z.object({
    source: z.string().min(1),
    alternative: z.string().min(1),
    description: z.string().min(1),
    purpose: z.string().min(1),
    usage: z.array(z.string().min(1)),
    constraints: z.array(z.string().min(1)),
}).strict();

export const identitySchema = z.object({
    name: z.string().min(1),
    logo: logoSchema,
}).strict();

export const patternSchema = z.object({
    composition: z.array(z.string().min(1)),
    hierarchy: z.array(z.string().min(1)),
    typography: z.array(z.string().min(1)),
    surfaces: z.array(z.string().min(1)),
    emphasis: z.array(z.string().min(1)),
    responsive: z.array(z.string().min(1)),
}).strict();

export const tokenSchema = z.object({
    $value: styleValueSchema,
    $type: z.string().min(1),
    $description: z.string().min(1).optional(),
}).strict();

export const tokenGroupSchema = z.record(
    z.string().min(1),
    tokenSchema,
);

export const tokensSchema = z.record(
    z.string().min(1),
    tokenGroupSchema,
);

export const modesSchema = z.object({
    light: tokensSchema.optional(),
    dark: tokensSchema.optional(),
    reducedMotion: tokensSchema.optional(),
}).strict();

export const rulesSchema = z.record(
    z.string().min(1),
    styleMapSchema,
);

export const designSchema = z.object({
    identity: identitySchema,
    direction: directionSchema,
    pattern: patternSchema,
    tokens: tokensSchema,
    layout: layoutSchema,
    modes: modesSchema.optional(),
    rules: rulesSchema.optional(),
}).strict();

export const aimSchema = z.string().min(1);

export const performanceLimitsSchema = z.object({
    maximumDomNodes: z.number().int().positive().optional(),
    maximumCssBytes: z.number().int().positive().optional(),
    maximumJavaScriptBytes: z.number().int().positive().optional(),
}).strict();

export const limitsSchema = z.object({
    maximumColumns: z.number().int().positive().optional(),
    maximumContentWidth: styleValueSchema.optional(),
    minimumTouchTarget: z.number().positive().optional(),
    minimumContrastRatio: z.number().positive().optional(),
    accessibilityLevel: z.enum([
        'A',
        'AA',
        'AAA',
    ]).optional(),
    responsive: z.boolean().optional(),
    performance: performanceLimitsSchema.optional(),
}).strict();

export const qualitiesSchema = visualQualitiesSchema.pick({
    spacing: true,
    spacingInline: true,
    spacingBlock: true,
    marginInline: true,
    gap: true,
    direction: true,
    alignment: true,
    distribution: true,
    wrap: true,
});

export const dimensionsSchema = visualQualitiesSchema.pick({
    width: true,
    height: true,
    maxWidth: true,
    minWidth: true,
    minHeight: true,
});

export const areaDesignSchema = visualQualitiesSchema.pick({
    surface: true,
    tone: true,
    textColor: true,
    typeface: true,
    textSize: true,
    fontWeight: true,
    lineHeight: true,
    textAlign: true,
    elevation: true,
    radius: true,
    border: true,
});

export const areaSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).describe('Exact name of the UCA responsible for managing this area'),
    purpose: z.string().min(1),
    order: z.number().int().nonnegative().describe('Zero-based position of the area among the children of its parent'),
    dimensions: dimensionsSchema,
    qualities: qualitiesSchema,
    design: areaDesignSchema,
}).strict();

export const compositionSchema = z.object({
    areas: z.array(areaSchema).min(1),
}).strict().describe('Current direct child areas of the requested target');

export const availableUcasSchema = z.object({
    web: z.array(catalogEntrySchema),
    logic: z.array(catalogEntrySchema),
}).strict();

export const targetAreaSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
}).strict();

export const decisionSchema = z.object({
    path: z.literal('LAYOUT'),
    minimumAreas: z.number().int().min(2),
}).strict();

export const correctionSchema = z.object({
    reason: z.string().min(1),
}).strict();

export const contextSchema = z.object({
    fulfillment: z.string().min(1),
    browser: browserSchema,
    design: designSchema,
    limits: limitsSchema,
    availableUcas: availableUcasSchema,
    composition: compositionSchema.optional(),
    correction: correctionSchema.optional(),
}).strict();

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    area: targetAreaSchema,
    purpose: aimSchema,
    decision: decisionSchema,
    attempt: z.number().int().min(0).max(1),
    context: contextSchema,
}).strict();

export const streamSchema = z.record(
    z.string().min(1),
    areaSchema,
);

export const resultSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    area: areaSchema,
    request: requestSchema,
}).strict();

export const completedSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    composition: z.object({
        areas: z.array(areaSchema),
    }).strict(),
    request: requestSchema,
}).strict();

export const repairSchema = z.object({
    completion: completedSchema,
    error: z.string().min(1),
}).strict();

export const errorSchema = z.object({
    correlationId: z.string().min(1).nullable(),
    areaId: z.string().min(1).nullable(),
    error: z.string(),
    request: requestSchema,
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
}).strict();

export type Aim = z.infer<typeof aimSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Body = z.infer<typeof bodySchema>;
export type Browser = z.infer<typeof browserSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Completed = z.infer<typeof completedSchema>;
export type Context = z.infer<typeof contextSchema>;
export type Design = z.infer<typeof designSchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Limits = z.infer<typeof limitsSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Repair = z.infer<typeof repairSchema>;
export type Result = z.infer<typeof resultSchema>;
export type TargetArea = z.infer<typeof targetAreaSchema>;
export type AvailableUcas = z.infer<typeof availableUcasSchema>;
