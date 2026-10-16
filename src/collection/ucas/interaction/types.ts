export enum SignalType { HANDLE = 'interaction.handle', BIND = 'interaction.bind', BOUND = 'interaction.bound', INVOKED = 'interaction.invoked', ERROR = 'interaction.error' }
export enum EventType { INPUT = 'input', CHANGE = 'change', CLICK = 'click' }
export enum ValidationPhase { EVENT = 'event', FIELD = 'field', BINDING = 'binding', INVOCATION = 'invocation' }
export enum DataType { EVENT = 'Event', FIELD = 'Field', BOUND = 'Bound', INVOCATION = 'Invocation', ERROR = 'Error' }
export enum RetrievalOperation { FIELD = 'field', INVOCATION = 'invocation' }
export type { Body, Context, Allocation, Binding, Handle, Invocation, Retrieval, InvocationRetrieval, FieldBinding, Bound, FieldValue, ValidationContext, Failure } from './schema.js';
