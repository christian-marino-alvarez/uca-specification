import type { Context } from './types.js';
export const __ID__ = 'interaction';
export const FIELD_STORAGE_SUFFIX = 'fields:v2';
export const formatFieldKey = (scope: string, field: string): string => JSON.stringify([scope, field]);
export const contextFingerprint = (context?: Context): string => {
    const { scope, purpose, fields = {}, operations = {} } = context ?? {};
    const orderedFields = Object.entries(fields).sort(([first], [second]) => first.localeCompare(second));
    const orderedOperations = Object.entries(operations).sort(([first], [second]) => first.localeCompare(second)).map(([name, { description, parameters }]) => [name, description, Object.entries(parameters).sort(([first], [second]) => first.localeCompare(second))]);
    return JSON.stringify([scope, purpose, orderedFields, orderedOperations]);
};
