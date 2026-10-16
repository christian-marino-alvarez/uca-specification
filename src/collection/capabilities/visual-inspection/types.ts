import type { z } from 'zod';
import type { descriptorSchema, focusSchema, measurementSchema, findingSchema, snapshotSchema, inspectSchema, restoreSchema, bodySchema } from './schema.js';
export type Descriptor = z.infer<typeof descriptorSchema>;
export type Focus = z.infer<typeof focusSchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
export type InspectPayload = z.infer<typeof inspectSchema>;
export type RestorePayload = z.infer<typeof restoreSchema>;
export type Body = z.infer<typeof bodySchema>;
export interface InspectedResult { readonly snapshot: Snapshot; readonly correlationId: string; }
export interface Failure { readonly error: unknown; readonly correlationId: string; }
export enum SignalType { INSPECT = 'visual-inspection.inspect', INSPECTED = 'visual-inspection.inspected', PRESERVE = 'visual-inspection.preserve', PRESERVED = 'visual-inspection.preserved', RESTORE = 'visual-inspection.restore', RESTORED = 'visual-inspection.restored', ERROR = 'visual-inspection.error' }
export enum DataType { REQUEST = 'Request', SNAPSHOT = 'Snapshot', RESTORATION = 'Restoration', ERROR = 'Error' }
export enum FindingCode { HORIZONTAL_OVERFLOW = 'horizontal-overflow', CLIPPED_CONTENT = 'clipped-content', VIEWPORT_OVERFLOW = 'viewport-overflow', WRAPPED_ACTION = 'wrapped-action' }

export interface PreservedResult { readonly focus?: Focus; readonly correlationId: string; }
