export {
    type Body,
    type DialogVariant,
    type Qualities,
} from './schema.js';

export enum SignalType {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CREATED = 'dialog:created',
    UPDATED = 'dialog:updated',
    REMOVED = 'dialog:removed',
    CONFIRMED = 'dialog:confirmed',
    CANCELLED = 'dialog:cancelled',
    CLOSED = 'dialog:closed',
    ERROR = 'dialog:error',
}

export enum DataType {
    RENDER_PAYLOAD = 'dialog.render-payload',
    UPDATE_PAYLOAD = 'dialog.update-payload',
    REMOVE_PAYLOAD = 'dialog.remove-payload',
    CREATED_RESULT = 'dialog.created-result',
    UPDATED_RESULT = 'dialog.updated-result',
    REMOVED_RESULT = 'dialog.removed-result',
    CONFIRMED_RESULT = 'dialog.confirmed-result',
    CANCELLED_RESULT = 'dialog.cancelled-result',
    CLOSED_RESULT = 'dialog.closed-result',
    UNKNOWN = 'unknown',
}
