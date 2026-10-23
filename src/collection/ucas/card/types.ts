export {
    type Body,
    type CardVariant,
    type Qualities,
} from './schema.js';

export enum SignalType {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CREATED = 'card:created',
    UPDATED = 'card:updated',
    REMOVED = 'card:removed',
    CLICKED = 'card:clicked',
    ERROR = 'card:error',
}

export enum DataType {
    RENDER_PAYLOAD = 'card.render-payload',
    UPDATE_PAYLOAD = 'card.update-payload',
    REMOVE_PAYLOAD = 'card.remove-payload',
    CREATED_RESULT = 'card.created-result',
    UPDATED_RESULT = 'card.updated-result',
    REMOVED_RESULT = 'card.removed-result',
    CLICKED_RESULT = 'card.clicked-result',
    UNKNOWN = 'unknown',
}
