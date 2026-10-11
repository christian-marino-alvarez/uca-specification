import * as assert from 'node:assert';
import { Capability } from '../capability.js';
import type { Disposition, Signal } from '../types.js';

class DummyProbeCapability extends Capability {
    public reactedSignal?: Signal;

    protected override react(signal: Signal): void {
        this.reactedSignal = signal;
    }

    public emitTestPulse(property: string, value: unknown): Signal | undefined {
        return this.pulse(property, value);
    }
}

function updateDisposition(bus: EventTarget, id: string, disposition: Disposition): void {
    const signal: Signal = {
        source: 'test',
        property: Capability.updateEvent(id),
        value: disposition,
        timestamp: Date.now(),
    };
    bus.dispatchEvent(new CustomEvent(Capability.updateEvent(id), { detail: signal }));
}

function testCapability_CreationAndDisposition(): void {
    const bus = new EventTarget();
    const disposition: Disposition = {
        aim: { description: 'Sample Aim', body: { tag: 'test' } },
        reactTo: ['test.signal'],
        inputs: [{ signal: 'test.input', type: 'string' }],
        outputs: [{ signal: 'test.output', type: 'number', description: 'Emits processed test data' }],
    };
    const capability = new DummyProbeCapability('cap-1').innervate(bus);
    updateDisposition(bus, 'cap-1', disposition);
    assert.strictEqual(capability.id, 'cap-1');
    assert.strictEqual(capability.disposition.aim.description, 'Sample Aim');
    assert.deepStrictEqual(capability.disposition.aim.body, { tag: 'test' });
    assert.deepStrictEqual(capability.disposition.reactTo, ['test.signal']);
    assert.deepStrictEqual(capability.disposition.inputs, [{ signal: 'test.input', type: 'string' }]);
    assert.deepStrictEqual(capability.disposition.outputs, [{ signal: 'test.output', type: 'number', description: 'Emits processed test data' }]);
    capability.denervate();
}

function testCapability_InnervateAndReaction(): void {
    const bus = new EventTarget();
    const disposition: Disposition = { aim: { description: 'Reaction Aim' }, reactTo: ['test.action'] };
    const capability = new DummyProbeCapability('cap-reaction').innervate(bus);
    updateDisposition(bus, 'cap-reaction', disposition);
    assert.strictEqual(capability.target, bus);

    const signal: Signal = { source: 'external', property: 'test.action', value: { ok: true }, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent('test.action', { detail: signal }));

    assert.notStrictEqual(capability.reactedSignal, undefined);
    assert.strictEqual(capability.reactedSignal?.property, 'test.action');
    assert.deepStrictEqual(capability.reactedSignal?.value, { ok: true });
    capability.denervate();
}

function testCapability_PulseEmitsSignalIntoBus(): void {
    const bus = new EventTarget();
    const capability = new DummyProbeCapability('cap-pulse');
    capability.innervate(bus);

    let receivedSignal: Signal | undefined;
    bus.addEventListener('data.changed', (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        receivedSignal = customEvent.detail;
    });

    const emitted = capability.emitTestPulse('data.changed', { count: 42 });
    assert.notStrictEqual(emitted, undefined);
    assert.strictEqual(emitted?.source, 'cap-pulse');
    assert.strictEqual(emitted?.property, 'data.changed');
    assert.deepStrictEqual(emitted?.value, { count: 42 });
    assert.deepStrictEqual(receivedSignal, emitted);
    capability.denervate();
}

function testCapability_DenervateDisconnectsAndClearsTarget(): void {
    const bus = new EventTarget();
    const disposition: Disposition = { aim: { description: 'Disconnect Aim' }, reactTo: ['action'] };
    const capability = new DummyProbeCapability('cap-disc').innervate(bus);
    updateDisposition(bus, 'cap-disc', disposition);
    capability.denervate();

    assert.strictEqual(capability.target, undefined);
    const signal: Signal = { source: 't', property: 'action', value: null, timestamp: 0 };
    bus.dispatchEvent(new CustomEvent('action', { detail: signal }));
    assert.strictEqual(capability.reactedSignal, undefined);
}

function testCapability_ExtractPayload(): void {
    const rawPrimitive = Capability.extractPayload<number>(42);
    assert.strictEqual(rawPrimitive, 42);

    const directObject = { name: 'test-item', count: 10 };
    const extractedDirect = Capability.extractPayload<typeof directObject>(directObject);
    assert.deepStrictEqual(extractedDirect, directObject);

    const wrappedInBody = { body: { name: 'wrapped-item', count: 20 } };
    const extractedWrapped = Capability.extractPayload<{ name: string; count: number }>(wrappedInBody);
    assert.deepStrictEqual(extractedWrapped, { name: 'wrapped-item', count: 20 });

    const nullValue = Capability.extractPayload(null);
    assert.strictEqual(nullValue, null);
}

function testCapability_DirectedSignal_ExecutesOnlyForTarget(): void {
    const bus = new EventTarget();
    const probe1 = new DummyProbeCapability('cap-1').innervate(bus);
    const probe2 = new DummyProbeCapability('cap-2').innervate(bus);
    updateDisposition(bus, 'cap-1', { aim: { description: '1' }, reactTo: ['test.update'] });
    updateDisposition(bus, 'cap-2', { aim: { description: '2' }, reactTo: ['test.update'] });
    const signal: Signal = { source: 'source', property: 'test.update', value: { id: 'cap-1' } };
    bus.dispatchEvent(new CustomEvent('test.update', { detail: signal }));
    assert.strictEqual(probe1.reactedSignal?.property, 'test.update');
    assert.strictEqual(probe2.reactedSignal, undefined);
    probe1.denervate();
    probe2.denervate();
}

function testCapability_BroadcastSignal_ExecutesForAll(): void {
    const bus = new EventTarget();
    const probe1 = new DummyProbeCapability('cap-1').innervate(bus);
    const probe2 = new DummyProbeCapability('cap-2').innervate(bus);
    updateDisposition(bus, 'cap-1', { aim: { description: '1' }, reactTo: ['test.event'] });
    updateDisposition(bus, 'cap-2', { aim: { description: '2' }, reactTo: ['test.event'] });
    const signal: Signal = { source: 'source', property: 'test.event', value: { message: 'hello' } };
    bus.dispatchEvent(new CustomEvent('test.event', { detail: signal }));
    assert.strictEqual(probe1.reactedSignal?.property, 'test.event');
    assert.strictEqual(probe2.reactedSignal?.property, 'test.event');
    probe1.denervate();
    probe2.denervate();
}

class DispositionTrackingCapability extends Capability<{ a?: number; b?: number }> {
    public updatesCount = 0;
    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.updatesCount += 1;
    }
    protected override react(): void {}
}

function testCapability_DispositionNormalization_IgnoresKeyOrdering(): void {
    const bus = new EventTarget();
    const cap = new DispositionTrackingCapability('track-cap').innervate(bus);
    const firstDisposition = { aim: { description: 'Track', body: { a: 1, b: 2 } }, reactTo: ['sig'] };
    updateDisposition(bus, 'track-cap', firstDisposition);
    assert.strictEqual(cap.updatesCount, 1);

    const reorderedDisposition = { reactTo: ['sig'], aim: { body: { b: 2, a: 1 }, description: 'Track' } };
    updateDisposition(bus, 'track-cap', reorderedDisposition);
    assert.strictEqual(cap.updatesCount, 1, 'Reordered keys must not trigger update');

    const differentDisposition = { aim: { description: 'Track', body: { a: 1, b: 3 } }, reactTo: ['sig'] };
    updateDisposition(bus, 'track-cap', differentDisposition);
    assert.strictEqual(cap.updatesCount, 2, 'Value change must trigger update');
    cap.denervate();
}

function runAllCapabilityTests(): void {
    testCapability_CreationAndDisposition();
    testCapability_InnervateAndReaction();
    testCapability_PulseEmitsSignalIntoBus();
    testCapability_DenervateDisconnectsAndClearsTarget();
    testCapability_ExtractPayload();
    testCapability_DirectedSignal_ExecutesOnlyForTarget();
    testCapability_BroadcastSignal_ExecutesForAll();
    testCapability_DispositionNormalization_IgnoresKeyOrdering();
    console.log('✔ All Capability core tests passed successfully.');
}

runAllCapabilityTests();

