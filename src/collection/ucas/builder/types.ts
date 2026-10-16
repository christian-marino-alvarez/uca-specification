export enum Path {
    LAYOUT = 'LAYOUT',
    VIEW = 'VIEW',
}

export enum SignalType {
    BUILD = 'builder.build',
    DECIDED = 'builder.decided',
    LAYOUT_AREA_CREATED = 'builder.layout.area.created',
    VIEW_ELEMENT_CREATED = 'builder.view.element.created',
    VIEW_COMPLETED = 'builder.view.completed',
    ERROR = 'builder.error',
}

export enum DataType {
    REQUEST = 'Request',
    RESULT = 'Result',
    LAYOUT_AREA_RESULT = 'LayoutAreaResult',
    VIEW_ELEMENT_RESULT = 'ViewElementResult',
    VIEW_COMPLETED_RESULT = 'ViewCompletedResult',
    ERROR = 'Error',
}

export type {
    Aim,
    AvailableUcas,
    Body,
    Browser,
    Composition,
    Design,
    DecisionContext,
    DecisionContinuation,
    Failure,
    Limits,
    Request,
    Result,
} from './schema.js';

export {
    type Result as LayoutAreaResult,
} from '@uca/layout/types';

export {
    type Completed as ViewCompleted,
    type Result as ViewElementResult,
} from '@uca/view/types';
