import * as assert from 'node:assert';
import { Capability } from '../capability.js';
import { DispositionSignal, StorageSignal, type Disposition, type Signal } from '../types.js';

class DummyProbeCapability extends Capability {
    public reactedSignal?: Signal;

    protected override react(signal: Signal): void {
        this.reactedSignal = signal;
    }

    public emitTestPulse(property: string, value: unknown): Signal | undefined {
        return this.pulse(property, value);
    }
}

function testCapability_CreationAndDisposition(): void {
    const disposition: Disposition = {
        aim: { description: 'Sample Aim', body: { tag: 'test' } },
        reactTo: ['test.signal'],
        inputs: [{ signal: 'test.input', type: 'string' }],
        outputs: [{ signal: 'test.output', type: 'number', description: 'Emits processed test data' }],
    };
    const capability = new DummyProbeCapability('cap-1').innervate(undefined, disposition);
    assert.strictEqual(capability.id, 'cap-1');
    assert.strictEqual(capability.disposition.aim.description, 'Sample Aim');
    assert.deepStrictEqual(capability.disposition.aim.body, { tag: 'test' });
    assert.deepStrictEqual(capability.disposition.reactTo, ['test.signal']);
    assert.deepStrictEqual(capability.disposition.inputs, [{ signal: 'test.input', type: 'string' }]);
    assert.deepStrictEqual(capability.disposition.outputs, [{ signal: 'test.output', type: 'number', description: 'Emits processed test data' }]);
}


function testCapability_InnervateAndReaction(): void {
    const bus = new EventTarget();
    const disposition: Disposition = { aim: { description: 'Reaction Aim' }, reactTo: ['test.action'] };
    const capability = new DummyProbeCapability('cap-reaction').innervate(bus, disposition);
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
    const capability = new DummyProbeCapability('cap-disc').innervate(bus, disposition);
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

function testCapability_DispositionUpdate(): void {
    const bus = new EventTarget();
    const targetCap = new DummyProbeCapability('cap-target').innervate(bus, {
        aim: { description: 'Target' },
        reactTo: ['initial.signal'],
    });
    const otherCap = new DummyProbeCapability('cap-other').innervate(bus, {
        aim: { description: 'Other' },
        reactTo: ['other.signal'],
    });

    let updatedPayload: unknown;
    let storageSetPayload: unknown;
    bus.addEventListener(DispositionSignal.UPDATED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        updatedPayload = customEvent.detail.value;
    });
    bus.addEventListener(StorageSignal.SET, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        storageSetPayload = customEvent.detail.value;
    });

    const updateSignal: Signal = {
        source: 'orchestrator',
        property: DispositionSignal.UPDATE,
        value: {
            targetId: 'cap-target',
            disposition: { reactTo: ['new.signal'], aim: { description: 'Updated Target', body: { v: 2 } } },
        },
        timestamp: Date.now(),
    };
    bus.dispatchEvent(new CustomEvent(DispositionSignal.UPDATE, { detail: updateSignal }));

    assert.ok(updatedPayload);
    assert.ok(storageSetPayload);
    assert.strictEqual((storageSetPayload as { key: string }).key, 'cap-target');
    assert.strictEqual(targetCap.disposition.aim.description, 'Updated Target');
    assert.deepStrictEqual(targetCap.disposition.aim.body, { v: 2 });
    assert.ok(targetCap.disposition.reactTo?.includes('new.signal'));

    const testSignal: Signal = { source: 't', property: 'new.signal', value: 'hello', timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent('new.signal', { detail: testSignal }));
    assert.strictEqual(targetCap.reactedSignal?.property, 'new.signal');

    targetCap.denervate();
    otherCap.denervate();
}

function runAllCapabilityTests(): void {
    testCapability_CreationAndDisposition();
    testCapability_InnervateAndReaction();
    testCapability_PulseEmitsSignalIntoBus();
    testCapability_DenervateDisconnectsAndClearsTarget();
    testCapability_ExtractPayload();
    testCapability_DispositionUpdate();
    console.log('✔ All Capability core tests passed successfully.');
}

runAllCapabilityTests();
