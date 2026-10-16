import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { LocalStorage } from '@uca/capability-local-storage';
import {
    SignalType as StorageSignalType,
    type StoredItem,
} from '@uca/capability-local-storage/types';
import { Schema } from '@uca/capability-schema';
import { SignalType as SchemaSignalType, type ValidatedResult } from '@uca/capability-schema/types';
import { __ID__, FIELD_STORAGE_SUFFIX, formatFieldKey } from './constants.js';
import { createBindingSchema, createInvocationSchema, handleSchema, fieldBindingSchema } from './schema.js';
import { SignalType, EventType, ValidationPhase, RetrievalOperation, DataType, type Body, type Handle, type Binding, type Context, type Invocation, type Retrieval, type InvocationRetrieval, type FieldBinding, type Bound, type FieldValue, type ValidationContext } from './types.js';

export class Interaction extends Uca<Body> {
    public static override purpose = 'Resolve declared user interactions into domain operations using the current values of their scoped fields';
    public static override disposition: Disposition<Body> = {
        aim: { description: Interaction.purpose },
        reactTo: [SignalType.HANDLE, SignalType.BIND, StorageSignalType.SAVED, StorageSignalType.RETRIEVED, StorageSignalType.ERROR, SchemaSignalType.VALIDATED, SchemaSignalType.ERROR, ...LocalStorage.disposition.reactTo ?? [], ...Schema.disposition.reactTo ?? []],
        inputs: [{ signal: SignalType.HANDLE, type: DataType.EVENT }, { signal: SignalType.BIND, type: DataType.FIELD }],
        outputs: [{ signal: SignalType.BOUND, type: DataType.BOUND }, { signal: SignalType.INVOKED, type: DataType.INVOCATION }, { signal: SignalType.ERROR, type: DataType.ERROR }],
    };
    public constructor(id: string = __ID__) { super(id); }
    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.HANDLE: this.handleEventRequest(signal); break;
            case SignalType.BIND: this.handleBind(signal); break;
            case StorageSignalType.SAVED: this.handleSaved(signal); break;
            case SchemaSignalType.VALIDATED: this.handleValidated(signal); break;
            case SchemaSignalType.ERROR: this.handleValidationError(signal); break;
            case StorageSignalType.RETRIEVED: this.handleRetrieved(signal); break;
            case StorageSignalType.ERROR: this.handleStorageError(signal); break;
        }
    }
    protected override catalog(): Cooky {
        const { id } = this;
        const storage = typeof sessionStorage !== 'undefined' ? sessionStorage : undefined;
        return [
            [LocalStorage, { ...LocalStorage.disposition, aim: { description: LocalStorage.AIM, body: { id: `${id}:storage`, prefix: `${id}:${FIELD_STORAGE_SUFFIX}:`, ...(storage && { storage }) } } }],
            [Schema, { ...Schema.disposition, aim: { description: Schema.AIM, body: { id: `${id}:schema` } } }],
        ];
    }
    private handleBind(signal: Signal): void {
        const { value } = signal;
        this.pulse(SchemaSignalType.VALIDATE, { schema: fieldBindingSchema, value, context: { phase: ValidationPhase.FIELD } });
    }
    private handleSaved(signal: Signal): void {
        const { value } = signal, { correlationId } = value as StoredItem;
        if (correlationId) {
            this.pulse(SignalType.BOUND, JSON.parse(correlationId as string) as Bound);
        }
    }
    private handleEventRequest(signal: Signal): void {
        const { value } = signal;
        this.pulse(SchemaSignalType.VALIDATE, { schema: handleSchema, value, context: { phase: ValidationPhase.EVENT } });
    }
    private handleValidated(signal: Signal): void {
        const { value } = signal, { context } = value as ValidatedResult, { phase } = context as ValidationContext;
        switch (phase) {
            case ValidationPhase.EVENT: this.handleValidatedEvent(value as ValidatedResult); break;
            case ValidationPhase.FIELD: this.handleValidatedField(value as ValidatedResult); break;
            case ValidationPhase.BINDING: this.handleValidatedBinding(value as ValidatedResult); break;
            case ValidationPhase.INVOCATION: this.handleValidatedInvocation(value as ValidatedResult); break;
        }
    }
    private handleValidatedField(result: ValidatedResult): void {
        const { value } = result, request = value as FieldBinding, { context: { scope }, field } = request;
        this.pulse(StorageSignalType.GET, { key: formatFieldKey(scope, field), correlationId: JSON.stringify({ operation: RetrievalOperation.FIELD, request }) });
    }
    private handleValidatedEvent(result: ValidatedResult): void {
        const { value: payload } = result, { event, context, interaction, field = '', value = '' } = payload as Handle;
        if (event === EventType.CLICK) {
            this.pulse(SchemaSignalType.VALIDATE, { schema: createBindingSchema(context), value: interaction, context: { phase: ValidationPhase.BINDING, context } });
            return;
        }
        const { scope } = context;
        this.pulse(StorageSignalType.SET, { key: formatFieldKey(scope, field), value: JSON.stringify({
            value,
        }) });
    }
    private handleValidatedBinding(result: ValidatedResult): void {
        const { value, context: validation } = result, { context } = validation as ValidationContext;
        const binding = value as Binding, { operation, arguments: fields } = binding, { scope } = context as Context;
        const entries = Object.entries(fields), [, field] = entries[0] ?? [];
        if (!field) {
            this.pulse(SchemaSignalType.VALIDATE, { schema: createInvocationSchema(context!, operation), value: { scope, operation, arguments: {} }, context: { phase: ValidationPhase.INVOCATION } });
            return;
        }
        this.pulse(StorageSignalType.GET, { key: formatFieldKey(scope, field), correlationId: JSON.stringify({ operation: RetrievalOperation.INVOCATION, context, binding, entries, index: 0, arguments: {} }) });
    }
    private handleRetrieved(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            value: serialized,
            correlationId = '',
        } = value as StoredItem;
        const stored = serialized === null ? null : JSON.parse(serialized) as FieldValue;
        const retrieval = JSON.parse(correlationId as string) as Retrieval, { operation } = retrieval;
        switch (operation) {
            case RetrievalOperation.FIELD: this.handleFieldRetrieved(stored, retrieval.request); break;
            case RetrievalOperation.INVOCATION: this.handleArgumentRetrieved(stored, retrieval); break;
        }
    }
    private handleFieldRetrieved(stored: FieldValue | null, request: FieldBinding): void {
        const { context: { scope }, field, initialValue = '', correlationId } = request;
        const { value = initialValue } = stored ?? {}, response: Bound = { scope, field, value, correlationId };
        if (stored !== null) {
            this.pulse(SignalType.BOUND, response);
            return;
        }
        this.pulse(StorageSignalType.SET, { key: formatFieldKey(scope, field), value: JSON.stringify({
            value,
        }), correlationId: JSON.stringify(response) });
    }
    private handleArgumentRetrieved(stored: FieldValue | null, retrieval: InvocationRetrieval): void {
        const { context, binding, entries, index, arguments: previous } = retrieval, { scope } = context, { operation } = binding;
        const { value = '' } = stored ?? {}, [parameter] = entries[index], resolved = { ...previous, [parameter]: value }, [, field] = entries[index + 1] ?? [];
        if (field) {
            this.pulse(StorageSignalType.GET, { key: formatFieldKey(scope, field), correlationId: JSON.stringify({ ...retrieval, index: index + 1, arguments: resolved }) });
            return;
        }
        this.pulse(SchemaSignalType.VALIDATE, { schema: createInvocationSchema(context, operation), value: { scope, operation, arguments: resolved }, context: { phase: ValidationPhase.INVOCATION } });
    }
    private handleValidatedInvocation(result: ValidatedResult): void {
        const { value } = result;
        this.pulse(SignalType.INVOKED, value as Invocation);
    }
    private handleValidationError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, value);
    }
    private handleStorageError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}
