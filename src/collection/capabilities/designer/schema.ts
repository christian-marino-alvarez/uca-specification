import { z } from 'zod';
import { qualitiesSchema } from '@uca/capability-css/schema';
import { RoleKind } from './types.js';

export const geometrySchema = qualitiesSchema.pick({ width: true, height: true, maxWidth: true, minWidth: true, minHeight: true, spacing: true, spacingInline: true, spacingBlock: true, marginInline: true, gap: true, direction: true, alignment: true, distribution: true, wrap: true, textAlign: true }).strict();
export const profileSchema = qualitiesSchema.omit({ custom: true, width: true, height: true, maxWidth: true, minWidth: true, minHeight: true, direction: true, alignment: true, distribution: true, wrap: true, marginInline: true, gap: true }).required({ surface: true, spacing: true, border: true, radius: true, elevation: true, textColor: true, typeface: true, textSize: true, fontWeight: true, lineHeight: true }).strict();
export const textProfileSchema = profileSchema.pick({ textColor: true, typeface: true, textSize: true, fontWeight: true, lineHeight: true, textAlign: true }).strict();
export const surfaceProfileSchema = profileSchema.pick({ surface: true, textColor: true, spacing: true, spacingInline: true, spacingBlock: true, border: true, radius: true, elevation: true }).strict();
const rolePurposeSchema = z.string().min(1).describe('The visual responsibility served by this role and when this treatment should be applied');
export const roleSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal(RoleKind.SURFACE), purpose: rolePurposeSchema, qualities: surfaceProfileSchema }).strict(),
    z.object({ kind: z.literal(RoleKind.TEXT), purpose: rolePurposeSchema, qualities: textProfileSchema }).strict(),
    z.object({ kind: z.literal(RoleKind.INPUT), purpose: rolePurposeSchema, qualities: profileSchema }).strict(),
    z.object({ kind: z.literal(RoleKind.ACTION), purpose: rolePurposeSchema, qualities: profileSchema }).strict(),
]);
export const definitionSchema = z.object({
    intent: z.string().min(1),
    visualElements: z.array(z.object({ name: z.string().min(1), representation: z.enum(['text', 'surface', 'input', 'action', 'media']), purpose: z.string().min(1), when: z.string().min(1) }).strict()).min(1).describe('Visual resources needed to cover the application purpose, their responsibility and when they earn a place; this is a vocabulary, not a fixed page tree'),
    hierarchy: z.object({ primary: z.string().min(1), body: z.string().min(1), secondary: z.string().min(1) }).strict(),
    composition: geometrySchema.pick({ maxWidth: true, marginInline: true, gap: true, direction: true, alignment: true, distribution: true, wrap: true }).required({ maxWidth: true, marginInline: true, gap: true, direction: true }).describe('Shared spatial language applied to the application root: infer readable width, positioning, section rhythm and flow; local areas adapt within this system'),
    principles: z.object({ hierarchy: z.string().min(1), spacing: z.string().min(1), surfaces: z.string().min(1), interaction: z.string().min(1), adaptation: z.string().min(1) }).strict(),
}).strict();
export const identitySchema = z.object({
    name: z.string().min(1),
    canvas: profileSchema,
    definition: definitionSchema.optional(),
    roles: z.record(z.string().min(1), roleSchema).refine((roles) => [RoleKind.TEXT, RoleKind.INPUT, RoleKind.ACTION].every((kind) => Object.values(roles).some((role) => role.kind === kind)), 'Provide at least one text, input and action role; surface roles are optional').meta({ minProperties: 3 }).describe('Available appearance vocabulary: include at least one text, input and action role. Surface roles are optional. This catalog does not require rendering any component.'),
}).strict();
export const outputSchema = identitySchema.required({ definition: true }).superRefine(({ definition: { hierarchy }, roles }, refinement) => {
    Object.entries(hierarchy).forEach(([name, role]) => {
        if (roles[role]?.kind !== RoleKind.TEXT) {
            refinement.addIssue({ code: 'custom', path: ['definition', 'hierarchy', name], message: 'Hierarchy references must select declared text roles' });
        }
    });
    const { qualities: primary } = roles[hierarchy.primary] ?? {}, { qualities: body } = roles[hierarchy.body] ?? {};
    if (hierarchy.primary === hierarchy.body || (primary && body && JSON.stringify(primary) === JSON.stringify(body))) {
        refinement.addIssue({ code: 'custom', path: ['definition', 'hierarchy'], message: 'Primary headings and body text need distinct visual roles' });
    }
});
export const bodySchema = z.object({ llm: z.string().optional() });
