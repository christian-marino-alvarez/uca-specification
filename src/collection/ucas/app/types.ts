export enum SignalType {
    DETECT = 'app.detect',
    BUILD = 'app.build',
    BUILD_DECIDED = 'app.build.decided',
    LAYOUT_AREA_CREATED = 'app.layout.area.created',
    VIEW_ELEMENT_CREATED = 'app.view.element.created',
    VIEW_COMPLETED = 'app.view.completed',
    BUILD_ERROR = 'app.build.error',
}

export enum DataType {
    VOID = 'void',
    BUILD_REQUEST = 'BuildRequest',
    BUILD_RESULT = 'BuildResult',
    LAYOUT_AREA_RESULT = 'LayoutAreaResult',
    VIEW_ELEMENT_RESULT = 'ViewElementResult',
    VIEW_COMPLETED_RESULT = 'ViewCompletedResult',
    BUILD_ERROR = 'BuildError',
}

export type {
    Body,
    Build,
} from './schema.js';

export {
    type Failure as BuildFailure,
    type LayoutAreaResult as BuildLayoutAreaResult,
    type Request as BuildRequest,
    type Result as BuildResult,
    type ViewCompleted as BuildViewCompleted,
    type ViewElementResult as BuildViewElementResult,
} from '@uca/builder/types';
