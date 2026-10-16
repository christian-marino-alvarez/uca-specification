import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, MAXIMUM_ELEMENTS, MISSING_ROOT } from './constants.js';
import { measureElement, inspectFindings, captureFocus, restoreFocus } from './measurement.js';
import { SignalType, DataType, type Body, type InspectPayload, type RestorePayload, type Snapshot } from './types.js';

export class VisualInspection extends Capability<Body> {
    public static readonly AIM = 'Measure a materialized interface and preserve focus while its owning units revise it';
    public static override disposition: Disposition<Body> = {
        aim: { description: VisualInspection.AIM }, reactTo: [SignalType.INSPECT, SignalType.RESTORE, SignalType.PRESERVE],
        inputs: [{ signal: SignalType.PRESERVE, type: DataType.RESTORATION }, { signal: SignalType.INSPECT, type: DataType.REQUEST }, { signal: SignalType.RESTORE, type: DataType.RESTORATION }],
        outputs: [{ signal: SignalType.PRESERVED, type: DataType.RESTORATION }, { signal: SignalType.INSPECTED, type: DataType.SNAPSHOT }, { signal: SignalType.RESTORED, type: DataType.RESTORATION }, { signal: SignalType.ERROR, type: DataType.ERROR }],
    };
    public constructor(id: string = __ID__) { super(id); }
    protected override async react(signal: Signal): Promise<void> {
        const { property, value, source } = signal;
        switch (property) {
            case SignalType.INSPECT: await this.handleInspect(value as InspectPayload, source); break;
            case SignalType.PRESERVE: this.handlePreserve(value as RestorePayload, source); break;
            case SignalType.RESTORE: this.handleRestore(value as RestorePayload, source); break;
        }
    }
    private async handleInspect(payload: InspectPayload, source: string): Promise<void> {
        const { correlationId } = payload;
        try {
            await document.fonts?.ready;
            const snapshot = this.captureSnapshot(payload);
            this.pulse(SignalType.INSPECTED, { snapshot, correlationId }, source);
        }
        catch (error) {
            this.pulse(SignalType.ERROR, { error, correlationId }, source);
        }
    }
    private captureSnapshot({ rootId, descriptors }: InspectPayload): Snapshot {
        const root = document.getElementById(rootId);
        if (!root) {
            throw new Error(MISSING_ROOT);
        }
        const candidates = descriptors.filter(({ elementId }) => { const element = document.getElementById(elementId); return element && (element === root || root.contains(element)); });
        const elements = candidates.slice(0, MAXIMUM_ELEMENTS).map((descriptor) => measureElement(document.getElementById(descriptor.elementId)!, descriptor));
        const viewport = { width: window.innerWidth, height: window.innerHeight }, findings = elements.flatMap((measurement) => inspectFindings(measurement, viewport.width));
        return { rootId, viewport, elements, findings, focus: captureFocus(candidates), truncated: candidates.length > MAXIMUM_ELEMENTS };
    }
    private handlePreserve({ descriptors, correlationId }: RestorePayload, source: string): void {
        this.pulse(SignalType.PRESERVED, { focus: captureFocus(descriptors), correlationId }, source);
    }
    private handleRestore({ focus, descriptors, correlationId }: RestorePayload, source: string): void {
        restoreFocus(focus, descriptors);
        this.pulse(SignalType.RESTORED, { correlationId }, source);
    }
}
