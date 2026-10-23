import { Capability } from '@uca/core/capability';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    BOX_CREATED_SIGNAL,
    COMPLIANCE_CARD_REQUIRED_QUALITIES,
    DEFAULT_AIM,
    INFER_SIGNAL,
    INFERRED_SIGNAL,
    INTERCEPTED_SIGNALS,
    LAYOUT_BUILT_SIGNAL,
    RENDER_SIGNAL,
    RENDERED_SIGNAL,
    STREAMED_SIGNAL,
    VIEW_BUILT_SIGNAL,
    WEB_COMPONENT_RENDER_SIGNAL,
    WEB_COMPONENT_RENDERED_SIGNAL,
    __ID__,
} from './constants.js';
import {
    bodySchema,
    telemetryEventSchema,
    type Body,
    type ComplianceReport,
    type TelemetryEvent,
} from './schema.js';
import {
    DataType,
    SignalType,
} from './types.js';
import { SignalType as AppSignalType } from '@uca/app/types';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as LlmSignalType } from '@uca/capability-llm/types';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';
import { SignalType as ViewSignalType } from '@uca/view/types';

export class Telemetry extends Capability<Body> {
    public static readonly AIM: string = DEFAULT_AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Telemetry.AIM,
            body: {
                enabled: true,
                logToConsole: true,
                detectAnomalies: true,
            },
        },
        reactTo: [
            ...INTERCEPTED_SIGNALS,
        ],
        inputs: [
            {
                signal: SignalType.OBSERVE,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Process telemetry observation signal',
            },
        ],
        outputs: [
            {
                signal: SignalType.INFERENCE_REQUEST,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Inference request detected',
            },
            {
                signal: SignalType.INFERENCE_RESPONSE,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Inference response completed',
            },
            {
                signal: SignalType.RENDER_REQUEST,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Render request scheduled',
            },
            {
                signal: SignalType.RENDER_COMPLETED,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Render completed in DOM',
            },
            {
                signal: SignalType.ANOMALY,
                type: DataType.EVENT,
                schema: telemetryEventSchema,
                description: 'Ontological compliance anomaly detected',
            },
        ],
    };

    private readonly timers: Map<string, number> = new Map();
    private readonly correlationUcas: Map<string, string> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget): this {
        super.innervate(target);
        this.connectReceptors();
        return this;
    }

    public override denervate(): void {
        this.timers.clear();
        this.correlationUcas.clear();
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const {
            aim,
        } = this.disposition;
        const {
            enabled = true,
        } = aim.body ?? {};
        if (!enabled || signal.source === this.id || signal.property.startsWith('telemetry.')) {
            return;
        }
        this.routeSignal(signal);
    }

    private routeSignal(signal: Signal): void {
        if (this.tryRouteInference(signal)) {
            return;
        }
        if (this.tryRouteRender(signal)) {
            return;
        }
        this.tryRouteLifecycle(signal);
    }

    private isInferResponse(property: string): boolean {
        return property === INFERRED_SIGNAL || property === STREAMED_SIGNAL;
    }

    private tryRouteInference(signal: Signal): boolean {
        const { property } = signal;
        if (property === INFER_SIGNAL) {
            this.handleInferenceRequest(signal);
            return true;
        }
        if (this.isInferResponse(property)) {
            this.handleInferenceResponse(signal);
            return true;
        }
        return false;
    }

    private tryRouteRender(signal: Signal): boolean {
        const {
            property,
        } = signal;
        if (this.isRenderRequest(property)) {
            this.handleRenderRequest(signal);
            return true;
        }
        if (this.isRenderCompleted(property)) {
            this.handleRenderCompleted(signal);
            return true;
        }
        return false;
    }

    private tryRouteLifecycle(signal: Signal): void {
        const {
            property,
        } = signal;
        if (this.isLifecycleSignal(property)) {
            this.handleLifecycle(signal);
        }
    }

    private isLifecycleSignal(property: string): boolean {
        switch (property) {
            case SpecificationSignalType.PARSED:
            case AppSignalType.NAVIGATE:
            case AppSignalType.DECIDED:
            case AppSignalType.BUILT:
            case AppSignalType.ERROR:
            case MemorySignalType.RETRIEVED:
            case DecisionSignalType.DECIDE:
            case DecisionSignalType.DECIDED:
            case DecisionSignalType.ERROR:
            case LayoutSignalType.BUILD:
            case LayoutSignalType.BUILT:
            case LayoutSignalType.AREA_DEFINED:
            case LayoutSignalType.AREA_CREATED:
            case LayoutSignalType.ERROR:
            case ViewSignalType.BUILD:
            case ViewSignalType.BUILT:
            case ViewSignalType.RENDERED:
            case ViewSignalType.ERROR:
            case LlmSignalType.STREAMING:
            case LlmSignalType.STREAM_END:
            case LlmSignalType.ERROR:
                return true;
            default:
                return false;
        }
    }

    private extractSignalData(signal: Signal): Partial<TelemetryEvent> {
        return {
            source: signal.source,
            property: signal.property,
            signalBody: signal.value,
            correlationId: signal.correlationId,
        };
    }

    private createLifecycleEvent(signal: Signal): TelemetryEvent {
        return {
            type: 'lifecycle',
            timestamp: signal.timestamp ?? Date.now(),
            ...this.extractSignalData(signal),
        };
    }

    private handleLifecycle(signal: Signal): void {
        const event = this.createLifecycleEvent(signal);
        this.notifyEvent(SignalType.LIFECYCLE, event);
    }

    private isRenderRequest(property: string): boolean {
        return property.endsWith('.render') || property === RENDER_SIGNAL;
    }

    private isRenderCompleted(property: string): boolean {
        return property.endsWith('.rendered') || property.endsWith('.created');
    }

    private capitalize(text: string): string {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    }

    private resolveUcaName(signal: Signal): string {
        const {
            property,
            source,
            value,
        } = signal;
        const [domain] = property.split('.');
        if (domain && domain !== 'render' && domain !== 'web-component') {
            return this.capitalize(domain);
        }
        return this.resolveUcaFromPayload(value, source);
    }

    private resolveUcaFromPayload(value: unknown, source: string): string {
        const payload = (value ?? {}) as Record<string, unknown>;
        const component = (payload.component ?? payload.tag) as string | undefined;
        if (component) {
            return this.capitalize(component.replace(/^ext-/, ''));
        }
        const last = source.split(':').pop() ?? '';
        return last ? this.capitalize(last) : 'Render';
    }

    private resolveElementId(signal: Signal): string | undefined {
        const {
            value,
        } = signal;
        const payload = (value ?? {}) as Record<string, unknown>;
        return (payload.elementId as string | undefined) ?? (payload.id as string | undefined);
    }

    private resolveAreaId(signal: Signal): string | undefined {
        const {
            value,
        } = signal;
        const payload = (value ?? {}) as Record<string, unknown>;
        return (payload.areaId as string | undefined)
            ?? (payload.targetContainer as string | undefined)
            ?? (payload.containerElement as string | undefined)
            ?? (payload.parentTo as string | undefined);
    }

    private extractCorrelationId(signal: Signal): string | undefined {
        const {
            value,
            correlationId,
        } = signal;
        const payload = (value ?? {}) as Record<string, unknown>;
        return (payload.correlationId as string | undefined) ?? correlationId;
    }

    private extractAreaId(signal: Signal): string | undefined {
        const { value } = signal;
        const payload = (value ?? {}) as Record<string, unknown>;
        const { areaId, targetContainer, streamId } = payload;
        if (areaId) { return String(areaId); }
        if (targetContainer) { return String(targetContainer); }
        const parts = String(streamId ?? '').split(':');
        return parts.length > 2 ? parts[parts.length - 1] : undefined;
    }

    private matchUcaFromCombined(combined: string, property: string): string {
        if (combined.includes('decision')) { return 'Decision'; }
        if (combined.includes('layout') || property.startsWith('layout.')) { return 'Layout'; }
        return (combined.includes('view') || property.startsWith('view.')) ? 'View' : 'Llm';
    }

    private resolveInferenceUca(signal: Signal): string {
        const { source = '', targetId = '', property = '', value } = signal;
        if (source.includes('decision') || targetId.includes('decision')) { return 'Decision'; }
        if (source.includes('layout') || targetId.includes('layout')) { return 'Layout'; }
        if (source.includes('view') || targetId.includes('view')) { return 'View'; }
        const payload = (value ?? {}) as Record<string, unknown>;
        const request = (payload.request ?? {}) as Record<string, unknown>;
        const { id = '', streamId = '', correlationId = '' } = payload;
        const { id: reqId = '', streamId: reqStream = '' } = request;
        const combined = `${id} ${reqId} ${streamId} ${reqStream} ${correlationId}`.toLowerCase();
        return this.matchUcaFromCombined(combined, property);
    }

    private handleInferenceRequest(signal: Signal): void {
        const correlationId = this.extractCorrelationId(signal);
        const uca = this.resolveInferenceUca(signal);
        if (correlationId) {
            this.timers.set(correlationId, Date.now());
            this.correlationUcas.set(correlationId, uca);
        }
        const areaId = this.extractAreaId(signal);
        const event = this.createTelemetryEvent('inference_request', signal, correlationId, areaId, undefined, undefined, uca);
        this.notifyEvent(SignalType.INFERENCE_REQUEST, event);
    }

    private calculateDuration(correlationId?: string): number | undefined {
        if (!correlationId || !this.timers.has(correlationId)) {
            return undefined;
        }
        const start = this.timers.get(correlationId)!;
        return Date.now() - start;
    }

    private resolveResponseUca(signal: Signal, correlationId?: string): string {
        const cached = correlationId ? this.correlationUcas.get(correlationId) : undefined;
        if (correlationId) {
            this.correlationUcas.delete(correlationId);
        }
        return cached ?? this.resolveInferenceUca(signal);
    }

    private handleInferenceResponse(signal: Signal): void {
        const correlationId = this.extractCorrelationId(signal);
        const durationMs = this.calculateDuration(correlationId);
        const areaId = this.extractAreaId(signal);
        const uca = this.resolveResponseUca(signal, correlationId);
        const compliance = this.evaluateResponseCompliance(signal.value);
        const event = this.createTelemetryEvent('inference_response', signal, correlationId, areaId, durationMs, compliance, uca);
        this.notifyEvent(SignalType.INFERENCE_RESPONSE, event);
        if (!compliance.compliant) {
            this.emitAnomalyEvent(event);
        }
    }

    private handleRenderRequest(signal: Signal): void {
        const correlationId = this.extractCorrelationId(signal);
        const areaId = this.resolveAreaId(signal);
        const elementId = this.resolveElementId(signal);
        const uca = this.resolveUcaName(signal);
        const event = this.createRenderEvent('render_request', signal, uca, elementId, areaId, correlationId);
        this.notifyEvent(SignalType.RENDER_REQUEST, event);
    }

    private handleRenderCompleted(signal: Signal): void {
        const correlationId = this.extractCorrelationId(signal);
        const areaId = this.resolveAreaId(signal);
        const elementId = this.resolveElementId(signal);
        const uca = this.resolveUcaName(signal);
        const event = this.createRenderEvent('render_completed', signal, uca, elementId, areaId, correlationId);
        this.notifyEvent(SignalType.RENDER_COMPLETED, event);
    }

    private createRenderEvent(
        type: 'render_request' | 'render_completed',
        signal: Signal,
        uca: string,
        elementId?: string,
        areaId?: string,
        correlationId?: string,
    ): TelemetryEvent {
        return {
            type,
            timestamp: signal.timestamp ?? Date.now(),
            ...this.extractSignalData(signal),
            correlationId: correlationId ?? signal.correlationId,
            areaId,
            elementId,
            uca,
        };
    }

    private createTelemetryEvent(
        type: TelemetryEvent['type'],
        signal: Signal,
        correlationId?: string,
        areaId?: string,
        durationMs?: number,
        compliance?: ComplianceReport,
        uca?: string,
    ): TelemetryEvent {
        return {
            type,
            timestamp: signal.timestamp ?? Date.now(),
            ...this.extractSignalData(signal),
            correlationId: correlationId ?? signal.correlationId,
            areaId,
            durationMs,
            compliance,
            uca,
        };
    }

    private notifyEvent(signalType: SignalType, event: TelemetryEvent): void {
        const {
            aim,
        } = this.disposition;
        const {
            logToConsole = true,
        } = aim.body ?? {};
        if (logToConsole) {
            this.logEventToConsole(event);
        }
        this.pulse(signalType, event);
    }

    private emitAnomalyEvent(event: TelemetryEvent): void {
        const anomalyEvent: TelemetryEvent = {
            ...event,
            type: 'compliance_anomaly',
        };
        this.pulse(SignalType.ANOMALY, anomalyEvent);
    }

    private logEventToConsole(event: TelemetryEvent): void {
        if (event.type === 'lifecycle') {
            this.logLifecycleToConsole(event);
            return;
        }
        this.logStandardEventToConsole(event);
    }

    private logLifecycleToConsole(event: TelemetryEvent): void {
        const {
            source,
            property = '',
        } = event;
        const badge = this.resolveLifecycleBadge(property);
        const sourceLabel = source ? ` [${source}]` : '';
        const style = this.resolveLifecycleStyle(property);
        console.log(`%c${badge}${sourceLabel} ${property}`, style, event);
    }

    private resolveLifecycleBadge(property?: string): string {
        switch (property) {
            case SpecificationSignalType.PARSED:
                return '📖 [SPECIFICATION]';
            case AppSignalType.NAVIGATE:
                return '🚀 [NAVIGATE]';
            case AppSignalType.DECIDED:
                return '🧠 [APP::DECIDED]';
            case AppSignalType.BUILT:
                return '🏆 [APP::BUILT]';
            case AppSignalType.ERROR:
                return '❌ [APP::ERROR]';
            case MemorySignalType.RETRIEVED:
                return '💾 [MEMORY]';
            case DecisionSignalType.DECIDE:
                return '📨 [DECISION::REQUEST]';
            case DecisionSignalType.DECIDED:
                return '🎯 [DECISION::RESPONSE]';
            case DecisionSignalType.ERROR:
                return '❌ [DECISION::ERROR]';
            case LayoutSignalType.BUILD:
                return '📐 [LAYOUT::BUILD]';
            case LayoutSignalType.BUILT:
                return '📐 [LAYOUT::BUILT]';
            case LayoutSignalType.AREA_DEFINED:
            case LayoutSignalType.AREA_CREATED:
                return '🏛️ [LAYOUT::AREA]';
            case LayoutSignalType.ERROR:
                return '❌ [LAYOUT::ERROR]';
            case ViewSignalType.BUILD:
                return '🎨 [VIEW::BUILD]';
            case ViewSignalType.BUILT:
                return '🎨 [VIEW::BUILT]';
            case ViewSignalType.RENDERED:
                return '🎨 [VIEW::RENDERED]';
            case ViewSignalType.ERROR:
                return '❌ [VIEW::ERROR]';
            case LlmSignalType.STREAMING:
                return '⚡ [INFER::STREAMING]';
            case LlmSignalType.STREAM_END:
                return '🏁 [INFER::STREAM_END]';
            case LlmSignalType.ERROR:
                return '❌ [LLM::ERROR]';
            default:
                return '⚡ [LIFECYCLE]';
        }
    }

    private resolveLifecycleStyle(property?: string): string {
        switch (property) {
            case SpecificationSignalType.PARSED:
                return 'color: #0D9488; font-weight: bold;';
            case AppSignalType.NAVIGATE:
            case AppSignalType.DECIDED:
            case AppSignalType.BUILT:
                return 'color: #7C3AED; font-weight: bold;';
            case MemorySignalType.RETRIEVED:
                return 'color: #EA580C; font-weight: bold;';
            case DecisionSignalType.DECIDE:
                return 'color: #F59E0B; font-weight: bold;';
            case DecisionSignalType.DECIDED:
                return 'color: #16A34A; font-weight: bold;';
            case LayoutSignalType.BUILD:
                return 'color: #D97706; font-weight: bold;';
            case LayoutSignalType.BUILT:
                return 'color: #059669; font-weight: bold;';
            case LayoutSignalType.AREA_DEFINED:
            case LayoutSignalType.AREA_CREATED:
                return 'color: #10B981; font-weight: bold;';
            case ViewSignalType.BUILD:
                return 'color: #8B5CF6; font-weight: bold;';
            case ViewSignalType.BUILT:
            case ViewSignalType.RENDERED:
                return 'color: #6366F1; font-weight: bold;';
            case LlmSignalType.STREAMING:
            case LlmSignalType.STREAM_END:
                return 'color: #0284C7; font-weight: bold;';
            case DecisionSignalType.ERROR:
            case LayoutSignalType.ERROR:
            case ViewSignalType.ERROR:
            case AppSignalType.ERROR:
            case LlmSignalType.ERROR:
                return 'color: #DC2626; font-weight: bold;';
            default:
                return 'color: #6B7280; font-weight: bold;';
        }
    }

    private formatStandardLabel(event: TelemetryEvent, badge: string): string {
        const { source, uca, elementId, areaId, durationMs } = event;
        const sourceLabel = source ? ` [${source}]` : '';
        const ucaLabel = uca ? ` (${uca})` : '';
        const elementLabel = elementId ? ` #${elementId}` : '';
        const areaLabel = areaId ? ` (${areaId})` : '';
        const timing = durationMs !== undefined ? ` [${durationMs}ms]` : '';
        return `${badge}${sourceLabel}${ucaLabel}${elementLabel}${areaLabel}${timing}`;
    }

    private logStandardEventToConsole(event: TelemetryEvent): void {
        const { type } = event;
        const badge = this.resolveLogBadge(type);
        const label = this.formatStandardLabel(event, badge);
        const style = this.resolveLogStyle(type);
        console.log(`%c${label}`, style, event);
    }

    private resolveLogBadge(type: TelemetryEvent['type']): string {
        switch (type) {
            case 'inference_request':
                return '📡 [INFER::REQUEST]';
            case 'inference_response':
                return '🧠 [INFER::RESPONSE]';
            case 'render_request':
                return '🎨 [RENDER::REQUEST]';
            case 'render_completed':
                return '✅ [RENDER::COMPLETED]';
            case 'compliance_anomaly':
                return '⚠️ [COMPLIANCE::ANOMALY]';
            default:
                return '⚡ [LIFECYCLE]';
        }
    }

    private resolveLogStyle(type: TelemetryEvent['type']): string {
        switch (type) {
            case 'inference_request':
                return 'color: #2563EB; font-weight: bold;';
            case 'inference_response':
                return 'color: #16A34A; font-weight: bold;';
            case 'render_request':
                return 'color: #D97706; font-weight: bold;';
            case 'render_completed':
                return 'color: #059669; font-weight: bold;';
            case 'compliance_anomaly':
                return 'color: #DC2626; font-weight: bold;';
            default:
                return 'color: #7C3AED; font-weight: bold;';
        }
    }

    private evaluateResponseCompliance(value: unknown): ComplianceReport {
        const payload = (value ?? {}) as Record<string, unknown>;
        const composition = (payload.composition ?? {}) as Record<string, unknown>;
        const rawComponents = composition.components ?? payload.components ?? [];
        const components = Array.isArray(rawComponents) ? rawComponents : [];
        const warnings: string[] = [];
        components.forEach((component) => {
            this.inspectComponentCompliance(component as Record<string, unknown>, warnings);
        });
        return {
            compliant: warnings.length === 0,
            warnings,
        };
    }

    private inspectComponentCompliance(component: Record<string, unknown>, warnings: string[]): void {
        const {
            id = 'unknown',
            qualities,
        } = component;
        if (!qualities || typeof qualities !== 'object') {
            warnings.push(`Componente '${id}' no tiene qualities declaradas`);
            return;
        }
        this.inspectCardCompliance(String(id), qualities as Record<string, unknown>, warnings);
    }

    private inspectCardCompliance(id: string, qualities: Record<string, unknown>, warnings: string[]): void {
        const isCard = id.includes('card') || qualities.surface === 'card';
        if (!isCard) {
            return;
        }
        for (const quality of COMPLIANCE_CARD_REQUIRED_QUALITIES) {
            if (!qualities[quality]) {
                warnings.push(`Tarjeta '${id}' carece de cualidad requerida '${quality}'`);
            }
        }
    }
}
