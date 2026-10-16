import { z } from 'zod';
import { EventType, ValidationPhase, RetrievalOperation } from './types.js';

export const contextSchema = z.object({
    scope: z.string().min(1),
    purpose: z.string().min(1),
    fields: z.record(z.string().min(1), z.string()),
    operations: z.record(z.string().min(1), z.object({ description: z.string(), parameters: z.record(z.string().min(1), z.string()) }).strict()),
}).strict();
export const allocationSchema = z.object({ fields: z.array(z.string()), operations: z.array(z.string()) }).strict()
    .describe('Local responsibility for capturing declared fields and presenting declared operations. Empty lists assign no controls; the shared interaction context remains available for cross-area bindings.');
export const bindingSchema = z.object({ event: z.literal(EventType.CLICK), operation: z.string().min(1), arguments: z.record(z.string().min(1), z.string().min(1)) }).strict();
export const invocationSchema = z.object({ scope: z.string().min(1), operation: z.string().min(1), arguments: z.record(z.string(), z.string()) }).strict();
export const bodySchema = z.object({ context: z.string().optional() });
export const handleSchema = z.object({ context: contextSchema, event: z.enum(EventType), field: z.string().optional(), interaction: bindingSchema.optional(), value: z.string().optional() }).strict().superRefine((payload, refinement) => {
    const { context: { fields }, event, field, interaction } = payload;
    if (event === EventType.CLICK && !interaction) {
        refinement.addIssue({ code: 'custom', path: ['interaction'], message: 'An activation requires a declared operation binding' });
    }
    if (event !== EventType.CLICK && (!field || !Object.hasOwn(fields, field))) {
        refinement.addIssue({ code: 'custom', path: ['field'], message: 'The field must belong to the interaction context' });
    }
});
export const fieldBindingSchema = z.object({ context: contextSchema, field: z.string().min(1), initialValue: z.string().optional(), correlationId: z.string() }).strict().superRefine(({ context: { fields }, field }, refinement) => {
    if (!Object.hasOwn(fields, field)) {
        refinement.addIssue({ code: 'custom', path: ['field'], message: 'The field must belong to the interaction context' });
    }
});
export const boundSchema = z.object({ scope: z.string(), field: z.string(), value: z.string(), correlationId: z.string() }).strict();
export const fieldValueSchema = z.object({ value: z.string() }).strict();
export const validationContextSchema = z.object({ phase: z.enum(ValidationPhase), context: contextSchema.optional() });
export const invocationRetrievalSchema = z.object({ operation: z.literal(RetrievalOperation.INVOCATION), context: contextSchema, binding: bindingSchema, entries: z.array(z.tuple([z.string(), z.string()])), index: z.number().int(), arguments: z.record(z.string(), z.string()) });
export const retrievalSchema = z.discriminatedUnion('operation', [z.object({ operation: z.literal(RetrievalOperation.FIELD), request: fieldBindingSchema }), invocationRetrievalSchema]);
export const failureSchema = z.object({ error: z.unknown(), context: z.unknown().optional() });

export const createAllocationSchema = (context: Context, allocation?: Allocation) => {
    const { fields, operations } = context, { description } = allocationSchema;
    const { fields: inheritedFields = Object.keys(fields), operations: inheritedOperations = Object.keys(operations) } = allocation ?? {};
    const availableFields = inheritedFields.filter((field) => Object.hasOwn(fields, field));
    const availableOperations = inheritedOperations.filter((operation) => Object.hasOwn(operations, operation));
    return allocationSchema.extend({
        fields: availableFields.length ? z.array(z.enum(availableFields)) : z.array(z.string()).max(0),
        operations: availableOperations.length ? z.array(z.enum(availableOperations)) : z.array(z.string()).max(0),
    }).describe(description!);
};

export const createBindingSchema = (context: Context): z.ZodType<Binding> => {
    const { fields, operations } = context, field = z.enum(Object.keys(fields));
    const choices = Object.entries(operations).map(([operation, { description, parameters }]) => z.object({
        event: z.literal(EventType.CLICK), operation: z.literal(operation).describe(description),
        arguments: z.object(Object.fromEntries(Object.entries(parameters).map(([name, description]) => [name, field.describe(description)]))).strict(),
    }).strict());
    return choices.length ? z.union(choices) : z.never();
};
export const createInvocationSchema = (context: Context, operation: string): z.ZodType<Invocation> => {
    const { scope, operations } = context, { parameters } = operations[operation];
    const argumentsSchema = z.object(Object.fromEntries(Object.entries(parameters).map(([name, description]) => [name, z.string().describe(description)]))).strict();
    return z.object({ scope: z.literal(scope), operation: z.literal(operation), arguments: argumentsSchema }).strict();
};

export type Body = z.infer<typeof bodySchema>;
export type Context = z.infer<typeof contextSchema>;
export type Allocation = z.infer<typeof allocationSchema>;
export type Binding = z.infer<typeof bindingSchema>;
export type Handle = z.infer<typeof handleSchema>;
export type Invocation = z.infer<typeof invocationSchema>;
export type FieldBinding = z.infer<typeof fieldBindingSchema>;
export type Bound = z.infer<typeof boundSchema>;
export type FieldValue = z.infer<typeof fieldValueSchema>;
export type InvocationRetrieval = z.infer<typeof invocationRetrievalSchema>;
export type Retrieval = z.infer<typeof retrievalSchema>;
export type ValidationContext = z.infer<typeof validationContextSchema>;
export type Failure = z.infer<typeof failureSchema>;
