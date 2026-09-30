import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import {
    Capability,
    type Cooky,
    Uca,
    type Disposition,
    type ICapability,
    type Signal,
} from '../index.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { document } = dom.window;

class MockCapability extends Capability {
    constructor(id: string, disposition: Disposition) {
        super(id, disposition);
    }

    protected override react(): void {}
}

class MoveCapability extends Capability {
    constructor(id = 'move') {
        super(id);
    }

    protected override react(): void {
        this.pulse('move', { destinationReached: true });
    }
}

class ConsumeCapability extends Capability {
    private currentFuel = 0;

    constructor(id = 'consume') {
        super(id);
    }

    protected override react(signal: Signal): void {
        const amount = typeof signal.value === 'number' ? signal.value : 5;
        this.currentFuel += amount;
        this.pulse('consume', { fuelConsumed: this.currentFuel });
    }
}

class VehicleUca extends Uca {
    public moved = false;
    public fuel = 0;

    constructor(id = 'v1', purpose = 'Transportar') {
        super(id, purpose);
    }

    public override innervate(target?: EventTarget): this {
        const disposition = Capability.createDisposition(this.purpose, undefined, ['move', 'consume']);
        return super.innervate(target, disposition);
    }

    protected override capabilities(): Cooky {
        const moveDisp = Capability.createDisposition('Mover vehículo', undefined, ['start']);
        const consumeDisp = Capability.createDisposition('Consumir combustible', undefined, ['start']);
        const declarations: Cooky = [
            [MoveCapability, moveDisp],
            [ConsumeCapability, consumeDisp],
        ];
        return declarations;
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        if (property === 'move') {
            this.moved = true;
        } else if (property === 'consume') {
            const { fuelConsumed } = value as { fuelConsumed: number };
            this.fuel = fuelConsumed;
        }
    }

    public startTrip(fuelUsed: number): void {
        this.pulse('start', fuelUsed);
    }

    public attachCapability(capability: ICapability): void {
        this.attach(capability);
    }
}

class CounterCapability extends Capability {
    constructor(id = 'counter') {
        super(id);
    }

    protected override react(): void {
        this.pulse('counter.increment', 1);
    }
}

class DuplicateNameUca extends Uca {
    public count = 0;

    constructor(id = 'dup', purpose = 'Contador') {
        super(id, purpose);
    }

    public override innervate(target?: EventTarget): this {
        const disposition = Capability.createDisposition(this.purpose, undefined, ['counter.increment']);
        return super.innervate(target, disposition);
    }

    protected override capabilities(): Cooky {
        const disp = Capability.createDisposition('Contar pulsos', undefined, ['tick']);
        const declarations: Cooky = [[CounterCapability, disp]];
        return declarations;
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        if (property === 'counter.increment') {
            this.count += 1;
        }
    }

    public sendTick(): void {
        this.pulse('tick', null);
    }
}

const waitForDelay = async (duration = 30): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, duration));
};

// 1. Declaración de Capabilities mediante Cooky
async function testDeclaration_CookyMapping(): Promise<void> {
    const vehicle = new VehicleUca('decl-v', 'Transportar');
    vehicle.innervate();
    const moveCap = (vehicle as unknown as { registry: Map<string, ICapability> }).registry.get('move');
    const consumeCap = (vehicle as unknown as { registry: Map<string, ICapability> }).registry.get('consume');
    assert.ok(moveCap instanceof MoveCapability);
    assert.ok(consumeCap instanceof ConsumeCapability);
    assert.strictEqual(moveCap.disposition.aim.description, 'Mover vehículo');
    vehicle.denervate();
}

// 2. Lifecycle: innervate conecta capabilities declaradas
async function testLifecycle_InnervateConnects(): Promise<void> {
    const vehicle = new VehicleUca('v1', 'Transportar').innervate();
    vehicle.startTrip(6);
    await waitForDelay();
    assert.strictEqual(vehicle.moved, true);
    assert.strictEqual(vehicle.fuel, 6);
    vehicle.denervate();
}

// 3. Lifecycle: re-innervate no deja instancias huérfanas
async function testLifecycle_ReinnervateNoOrphans(): Promise<void> {
    const vehicle = new VehicleUca('v-re', 'Transportar').innervate();
    vehicle.innervate();
    vehicle.startTrip(4);
    await waitForDelay();
    assert.strictEqual(vehicle.fuel, 4);
    vehicle.denervate();
}

// 4. Lifecycle: denervate desconecta todas las capabilities
async function testLifecycle_DenervateDisconnects(): Promise<void> {
    const uca = new DuplicateNameUca('d1', 'Counter').innervate();
    uca.sendTick();
    await waitForDelay();
    assert.strictEqual(uca.count, 1);
    uca.denervate();
    uca.sendTick();
    await waitForDelay();
    assert.strictEqual(uca.count, 1);
}

// 5. Lifecycle: Reemplazo por id denerva la instancia anterior
async function testLifecycle_IdReplacementDenervatesPrevious(): Promise<void> {
    const uca = new VehicleUca('v-replace', 'Transportar').innervate();
    let oldDenervated = false;
    const oldCap = new MockCapability('cap-x', Capability.createDisposition('Old', undefined, ['ping']));
    const originalDenervate = oldCap.denervate.bind(oldCap);
    oldCap.denervate = () => {
        oldDenervated = true;
        originalDenervate();
    };
    uca.attachCapability(oldCap);
    const newCap = new MockCapability('cap-x', Capability.createDisposition('New', undefined, ['ping']));
    uca.attachCapability(newCap);
    assert.strictEqual(oldDenervated, true);
    uca.denervate();
}

// 6. Registry: Fuente única de verdad para declarativas y dinámicas
async function testRegistry_SingleSourceOfTruth(): Promise<void> {
    const vehicle = new VehicleUca('v-single', 'Transportar').innervate();
    const dynamic = new MockCapability('dyn', Capability.createDisposition('Dyn', undefined, ['start']));
    vehicle.attachCapability(dynamic);
    const registry = (vehicle as unknown as { registry: Map<string, ICapability> }).registry;
    assert.strictEqual(registry.size, 3);
    assert.ok(registry.has('move'));
    assert.ok(registry.has('consume'));
    assert.ok(registry.has('dyn'));
    vehicle.denervate();
}

// 7. Targets: attach(capability) utiliza el target de la UCA
async function testTargets_DefaultUsesUcaTarget(): Promise<void> {
    const vehicle = new VehicleUca('v-target', 'Transportar').innervate();
    const cap = new MockCapability('def-cap', Capability.createDisposition('Def', undefined, ['ping']));
    vehicle.attachCapability(cap);
    assert.strictEqual(cap.target, vehicle.target);
    vehicle.denervate();
}

class MockElement {
    public parent: MockElement | null = null;
    public children: MockElement[] = [];

    public appendChild(child: MockElement): void {
        child.parent = this;
        this.children.push(child);
    }
}

class MockHtmlCapability extends Capability {
    public readonly element: MockElement;

    constructor(id = 'mock-html') {
        super(id);
        this.element = new MockElement();
    }

    protected override react(): void {}
}

// 8. Separación DOM: el target es exclusivamente nervioso y el elemento es recurso de dominio
async function testSeparation_DomainResourceFromNervousTarget(): Promise<void> {
    const vehicle = new VehicleUca('v-dom', 'Transportar').innervate();
    const htmlCap = new MockHtmlCapability();
    vehicle.attachCapability(htmlCap);
    assert.strictEqual(htmlCap.target, vehicle.target);
    assert.notStrictEqual(htmlCap.element, htmlCap.target);
    const parentA = new MockElement();
    const parentB = new MockElement();
    parentA.appendChild(htmlCap.element);
    assert.strictEqual(htmlCap.target, vehicle.target);
    parentB.appendChild(htmlCap.element);
    assert.strictEqual(htmlCap.target, vehicle.target);
    vehicle.denervate();
}

class DashboardCapability extends Capability {
    public sparkDetected = false;

    constructor(id = 'dashboard', disposition?: Disposition) {
        const defaultDisp = Capability.createDisposition('Supervisar estado', undefined, ['spark']);
        super(id, disposition ?? defaultDisp);
    }

    protected override react(): void {
        this.sparkDetected = true;
    }
}

class SparkCapability extends Capability {
    constructor(id = 'spark-plug', disposition?: Disposition) {
        const defaultDisp = Capability.createDisposition('Chispa', undefined, ['ignite']);
        super(id, disposition ?? defaultDisp);
    }

    protected override react(): void {
        this.pulse('spark', { fired: true });
    }
}

class EngineUca extends Uca {
    constructor(id = 'engine-core', purpose = 'Planta motriz') {
        super(id, purpose);
    }

    protected override capabilities(): Cooky {
        const disp = Capability.createDisposition('Chispa', undefined, ['ignite']);
        const declarations: Cooky = [[SparkCapability, disp]];
        return declarations;
    }
}

class SimpleButtonCapability extends Capability {
    public clicked = false;

    constructor(id = 'btn-default') {
        super(id);
    }

    protected override react(): void {
        this.clicked = true;
    }
}

class MultiButtonUca extends Uca {
    constructor() {
        super('multi-btn', 'Multiples botones');
    }

    protected override capabilities(): Cooky {
        const dispA = Capability.createDisposition('Start', { id: 'btn-start' }, ['button.click']);
        const dispB = Capability.createDisposition('Submit', { id: 'btn-submit' }, ['button.click']);
        const dispC = Capability.createDisposition('Cancel', { id: 'btn-cancel' }, ['button.click']);
        const declarations: Cooky = [
            [SimpleButtonCapability, dispA],
            [SimpleButtonCapability, dispB],
            [SimpleButtonCapability, dispC],
        ];
        return declarations;
    }
}

class EmptyUca extends Uca {
    constructor() {
        super('empty-uca', 'UCA vacia');
    }

    protected override capabilities(): Cooky {
        const declarations: Cooky = [];
        return declarations;
    }
}

class ShipUca extends Uca {
    public readonly dashboard: DashboardCapability;
    public readonly engine: EngineUca;

    constructor(id = 'ship-1', purpose = 'Nave') {
        super(id, purpose);
        this.dashboard = new DashboardCapability();
        this.engine = new EngineUca();
        this.attach(this.engine);
        this.attach(this.dashboard);
    }
}

// 9. Fractalidad: UCA hija comparte nervous target y denervate en cascada
async function testFractality_NestedUcaHierarchy(): Promise<void> {
    const ship = new ShipUca().innervate();
    ship.target?.dispatchEvent(new CustomEvent('ignite', { detail: { value: 1 } }));
    await waitForDelay();
    assert.strictEqual(ship.dashboard.sparkDetected, true);
    ship.denervate();
    assert.strictEqual(ship.target, undefined);
    assert.strictEqual(ship.engine.target, undefined);
}

// 10. Aislamiento entre UCAs diferentes
async function testInterUcaIsolation(): Promise<void> {
    const v1 = new VehicleUca('v1', 'Transportar').innervate();
    const v2 = new VehicleUca('v2', 'Transportar').innervate();
    v1.startTrip(5);
    await waitForDelay();
    assert.strictEqual(v1.moved, true);
    assert.strictEqual(v2.moved, false);
    v1.denervate();
    v2.denervate();
}

// 11. Declaración: UCA vacía funciona correctamente
async function testDeclaration_EmptyUca(): Promise<void> {
    const uca = new EmptyUca().innervate();
    const registry = (uca as unknown as { registry: Map<string, ICapability> }).registry;
    assert.strictEqual(registry.size, 0);
    assert.ok(uca.target instanceof EventTarget);
    uca.denervate();
    assert.strictEqual(uca.target, undefined);
}

function assertRepeatedReactions(registry: Map<string, ICapability>): void {
    const btnStart = registry.get('btn-start') as SimpleButtonCapability;
    const btnSubmit = registry.get('btn-submit') as SimpleButtonCapability;
    const btnCancel = registry.get('btn-cancel') as SimpleButtonCapability;
    assert.strictEqual(btnStart.clicked, true);
    assert.strictEqual(btnSubmit.clicked, true);
    assert.strictEqual(btnCancel.clicked, true);
}

// 12. Declaración: Clases repetidas producen instancias independientes
async function testDeclaration_RepeatedCapabilityClasses(): Promise<void> {
    const uca = new MultiButtonUca().innervate();
    const registry = (uca as unknown as { registry: Map<string, ICapability> }).registry;
    const signalDetail = { source: 'test', property: 'button.click', value: null };
    uca.target?.dispatchEvent(new CustomEvent('button.click', { detail: signalDetail }));
    await waitForDelay();
    assertRepeatedReactions(registry);
    uca.denervate();
    assert.strictEqual(registry.size, 3);
    assert.strictEqual(registry.get('btn-start')?.target, undefined);
}

// 13. Declaración: Core preserva el orden declarativo
async function testDeclaration_OrderPreserved(): Promise<void> {
    const uca = new MultiButtonUca().innervate();
    const registry = (uca as unknown as { registry: Map<string, ICapability> }).registry;
    const keys = Array.from(registry.keys());
    assert.deepStrictEqual(keys, ['btn-start', 'btn-submit', 'btn-cancel']);
    uca.denervate();
}

class ProbeCapability extends Capability {
    public reactCount = 0;

    constructor(id: string, reactTo: string[]) {
        super(id, Capability.createDisposition(`Probe ${id}`, undefined, reactTo));
    }

    protected override react(): void {
        this.reactCount += 1;
    }
}

// 14. Lifecycle: Instanciación e inervación no implican reacción
async function testLifecycle_ExistenceAndConnectivityDoNotReact(): Promise<void> {
    const target = new EventTarget();
    const probe = new ProbeCapability('probe-1', ['match.signal']);
    assert.strictEqual(probe.reactCount, 0);
    probe.innervate(target);
    assert.strictEqual(probe.reactCount, 0);
    const otherDetail = { source: 't', property: 'other.signal', value: null };
    target.dispatchEvent(new CustomEvent('other.signal', { detail: otherDetail }));
    await waitForDelay();
    assert.strictEqual(probe.reactCount, 0);
    probe.denervate();
}

// 15. Lifecycle: Señal coincidente dispara reacción
async function testLifecycle_MatchingSignalTriggersReaction(): Promise<void> {
    const target = new EventTarget();
    const probe = new ProbeCapability('probe-match', ['match.signal']);
    probe.innervate(target);
    const matchDetail = { source: 't', property: 'match.signal', value: null };
    target.dispatchEvent(new CustomEvent('match.signal', { detail: matchDetail }));
    await waitForDelay();
    assert.strictEqual(probe.reactCount, 1);
    probe.denervate();
}

function verifyProbeCounts(probeA: ProbeCapability, probeB: ProbeCapability, probeC: ProbeCapability): void {
    assert.strictEqual(probeA.reactCount, 0);
    assert.strictEqual(probeB.reactCount, 1);
    assert.strictEqual(probeC.reactCount, 0);
}

// 16. Lifecycle: Múltiples capabilities inervadas solo reaccionan las relevantes
async function testLifecycle_MultipleInnervatedSelectiveReaction(): Promise<void> {
    const target = new EventTarget();
    const probeA = new ProbeCapability('probe-a', ['signal.a']).innervate(target) as ProbeCapability;
    const probeB = new ProbeCapability('probe-b', ['signal.b']).innervate(target) as ProbeCapability;
    const probeC = new ProbeCapability('probe-c', ['signal.c']).innervate(target) as ProbeCapability;
    const bDetail = { source: 't', property: 'signal.b', value: null };
    target.dispatchEvent(new CustomEvent('signal.b', { detail: bDetail }));
    await waitForDelay();
    verifyProbeCounts(probeA, probeB, probeC);
    probeA.denervate();
    probeB.denervate();
    probeC.denervate();
}

class PrivateButtonCapability extends Capability {
    private domElement: HTMLElement | null = null;
    private readonly container: HTMLElement;

    constructor(container: HTMLElement, config?: { id?: string; disposition?: Disposition }) {
        const defaultDisp = Capability.createDisposition('Boton Privado', undefined, ['button.render']);
        super(config?.id ?? 'private-btn', config?.disposition ?? defaultDisp);
        this.container = container;
    }

    private ensureElement(): HTMLElement {
        if (!this.domElement) {
            this.domElement = document.createElement('button');
            this.domElement.textContent = 'Click me';
            this.container.appendChild(this.domElement);
        }
        return this.domElement;
    }

    protected override react(): void {
        this.ensureElement();
    }

    public override denervate(): void {
        super.denervate();
        this.domElement?.remove();
        this.domElement = null;
    }
}

function assertNoDomResource(container: HTMLElement, button: PrivateButtonCapability, target: EventTarget): void {
    assert.strictEqual(container.querySelector('button'), null);
    button.innervate(target);
    assert.strictEqual(container.querySelector('button'), null);
}

function assertMatchingSignalRenders(container: HTMLElement, target: EventTarget): void {
    const renderDetail = { source: 't', property: 'button.render', value: null };
    target.dispatchEvent(new CustomEvent('button.render', { detail: renderDetail }));
}

// 17. HTML Acceptance: Construcción e inervación no crean recurso DOM; solo la reacción lo materializa
async function testHtmlAcceptance_ReactionMaterializesDomResource(): Promise<void> {
    const container = document.createElement('div');
    const button = new PrivateButtonCapability(container);
    const target = new EventTarget();
    assertNoDomResource(container, button, target);
    assertMatchingSignalRenders(container, target);
    await waitForDelay();
    const rendered = container.querySelector('button');
    assert.strictEqual(rendered?.textContent, 'Click me');
    button.denervate();
    assert.strictEqual(container.querySelector('button'), null);
}

class MultiCapabilityUca extends Uca<{ role?: string; label?: string; hidden?: boolean }> {
    constructor(id = 'multi', purpose = 'Multi-capability testing') {
        super(id, purpose);
    }

    public override innervate(target?: EventTarget): this {
        const disposition = Capability.createDisposition(this.purpose, { role: 'region', label: 'header', hidden: true });
        return super.innervate(target, disposition);
    }

    public getAttributesFor(capabilityId?: string): Record<string, string> {
        return this.buildAttributes(capabilityId);
    }

    protected override getAttributeMapping(capabilityId?: string): Record<string, unknown> {
        const { aim } = this.disposition;
        const { role, label, hidden } = aim.body ?? {};
        if (capabilityId === 'canvas') {
            return { 'role': role, 'aria-label': label };
        }
        return { 'role': role, 'class': label, 'hidden': hidden ? '' : undefined };
    }
}

// 18. BuildAttributes: Distingue atributos según el capabilityId
async function testCore_BuildAttributesDistinguishesCapabilities(): Promise<void> {
    const uca = new MultiCapabilityUca().innervate();
    const webComponentAttributes = uca.getAttributesFor('web-component');
    assert.deepStrictEqual(webComponentAttributes, { role: 'region', class: 'header', hidden: '' });
    const canvasAttributes = uca.getAttributesFor('canvas');
    assert.deepStrictEqual(canvasAttributes, { role: 'region', 'aria-label': 'header' });
    uca.denervate();
}

async function runAllTests(): Promise<void> {
    await testDeclaration_CookyMapping();
    await testDeclaration_EmptyUca();
    await testDeclaration_RepeatedCapabilityClasses();
    await testDeclaration_OrderPreserved();
    await testLifecycle_InnervateConnects();
    await testLifecycle_ReinnervateNoOrphans();
    await testLifecycle_DenervateDisconnects();
    await testLifecycle_IdReplacementDenervatesPrevious();
    await testRegistry_SingleSourceOfTruth();
    await testTargets_DefaultUsesUcaTarget();
    await testSeparation_DomainResourceFromNervousTarget();
    await testFractality_NestedUcaHierarchy();
    await testInterUcaIsolation();
    await testLifecycle_ExistenceAndConnectivityDoNotReact();
    await testLifecycle_MatchingSignalTriggersReaction();
    await testLifecycle_MultipleInnervatedSelectiveReaction();
    await testHtmlAcceptance_ReactionMaterializesDomResource();
    await testCore_BuildAttributesDistinguishesCapabilities();
    console.log('✔ All 18 Core UCA lifecycle, Cooky and attribute mapping tests passed successfully.');
}

runAllTests().catch((error: unknown) => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
