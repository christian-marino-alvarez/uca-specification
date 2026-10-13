import type { Body, Dimensions, Screen } from './schema.js';

export { type Body, type Dimensions, type Screen } from './schema.js';

export enum SignalType {
    DETECT = 'app.detect',
    DIMENSIONS_DETECTED = 'app.dimensions.detected',
    DIMENSIONS_CHANGED = 'app.dimensions.changed',
    LAYOUT_COMPOSED = 'app.layout.composed',
}

export enum DataType {
    VOID = 'void',
    APP_BODY = 'AppBody',
    LAYOUT = 'Layout',
}
