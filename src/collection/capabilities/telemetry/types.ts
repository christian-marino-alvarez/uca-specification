export enum SignalType {
    OBSERVE = 'telemetry.observe',
    INFERENCE_REQUEST = 'telemetry.inference_request',
    INFERENCE_RESPONSE = 'telemetry.inference_response',
    RENDER_REQUEST = 'telemetry.render_request',
    RENDER_COMPLETED = 'telemetry.render_completed',
    ANOMALY = 'telemetry.anomaly',
    LIFECYCLE = 'telemetry.lifecycle',
}

export enum DataType {
    BODY = 'Body',
    EVENT = 'TelemetryEvent',
    REPORT = 'ComplianceReport',
    UNKNOWN = 'unknown',
}

export type {
    Body,
    ComplianceReport,
    TelemetryEvent,
} from './schema.js';
