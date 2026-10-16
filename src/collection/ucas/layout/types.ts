export enum SignalType {
    CREATE = 'layout.create',
    REPAIR = 'layout.repair',
    AREA_CREATED = 'layout.area.created',
    COMPLETED = 'layout.completed',
    ERROR = 'layout.error',
}

export enum DataType {
    REQUEST = 'Request',
    REPAIR_REQUEST = 'RepairRequest',
    AREA_RESULT = 'AreaResult',
    COMPLETED_RESULT = 'CompletedResult',
    ERROR = 'Error',
}

export type {
    Aim,
    Area,
    Body,
    Browser,
    Composition,
    Completed,
    Context,
    Design,
    Failure,
    Limits,
    Request,
    Repair,
    Result,
    TargetArea,
    AvailableUcas,
} from './schema.js';
