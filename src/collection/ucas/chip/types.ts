export {
    type Body,
    type ChipVariant,
    type Qualities,
} from './schema.js';

export enum SignalType {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CREATED = 'chip:created',
    UPDATED = 'chip:updated',
    REMOVED = 'chip:removed',
    SELECTED = 'chip:selected',
    ACTION = 'chip:action',
    ERROR = 'chip:error',
}

export enum DataType {
    RENDER_PAYLOAD = 'chip.render-payload',
    UPDATE_PAYLOAD = 'chip.update-payload',
    REMOVE_PAYLOAD = 'chip.remove-payload',
    CREATED_RESULT = 'chip.created-result',
    UPDATED_RESULT = 'chip.updated-result',
    REMOVED_RESULT = 'chip.removed-result',
    SELECTED_RESULT = 'chip.selected-result',
    ACTION_RESULT = 'chip.action-result',
    UNKNOWN = 'unknown',
}
