export {
    type Body,
    type Qualities,
    type SliderVariant,
} from './schema.js';

export enum SignalType {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CREATED = 'slider:created',
    UPDATED = 'slider:updated',
    REMOVED = 'slider:removed',
    CHANGED = 'slider:changed',
    ERROR = 'slider:error',
}

export enum DataType {
    RENDER_PAYLOAD = 'slider.render-payload',
    UPDATE_PAYLOAD = 'slider.update-payload',
    REMOVE_PAYLOAD = 'slider.remove-payload',
    CREATED_RESULT = 'slider.created-result',
    UPDATED_RESULT = 'slider.updated-result',
    REMOVED_RESULT = 'slider.removed-result',
    CHANGED_RESULT = 'slider.changed-result',
    UNKNOWN = 'unknown',
}
