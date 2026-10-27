export {
    type Body,
    type Qualities,
    type Tone,
} from './schema.js';

export enum SignalType {
    RENDER = 'render',
    UPDATE = 'update',
    REMOVE = 'remove',
    CREATED = 'toast:created',
    UPDATED = 'toast:updated',
    REMOVED = 'toast:removed',
    ACTION = 'toast:action',
    DISMISSED = 'toast:dismissed',
    ERROR = 'toast:error',
}

export enum DataType {
    RENDER_PAYLOAD = 'toast.render-payload',
    UPDATE_PAYLOAD = 'toast.update-payload',
    REMOVE_PAYLOAD = 'toast.remove-payload',
    CREATED_RESULT = 'toast.created-result',
    UPDATED_RESULT = 'toast.updated-result',
    REMOVED_RESULT = 'toast.removed-result',
    ACTION_RESULT = 'toast.action-result',
    DISMISSED_RESULT = 'toast.dismissed-result',
    UNKNOWN = 'unknown',
}
