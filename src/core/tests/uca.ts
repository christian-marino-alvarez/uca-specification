import '../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import {
    Capability,
    type CapabilityConstructor,
    type Cooky,
    DispositionSignal,
    Uca,
    type Disposition,
    type DispositionProvidePayload,
    type ICapability,
    type Signal,
} from '../index.js';

function updateDisposition(bus: EventTarget, id: string, disposition: Disposition): void {
    const signal: Signal = {
        source: 'test',
        property: Capability.updateEvent(id),
        value: disposition,
        timestamp: Date.now(),
    };
    bus.dispatchEvent(new CustomEvent(Capability.updateEvent(id), { detail: signal }));
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
    public static override purpose = 'Transportar';
    public moved = false;
    public fuel = 0;

    constructor(id = 'v1') {
        super(id);
    }

    protected override catalog(): Cooky {
        const moveDisp: Disposition = { aim: { description: 'Mover vehículo', body: { id: 'move' } }, reactTo: ['start'] };
        const consumeDisp: Disposition = { aim: { description: 'Consumir combustible', body: { id: 'consume' } }, reactTo: ['start'] };
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
    public static override purpose = 'Contador';
    public count = 0;

    constructor(id = 'dup') {
        super(id);
    }

    protected override catalog(): Cooky {
        const disp: Disposition = { aim: { description: 'Contar pulsos', body: { id: 'counter' } }, reactTo: ['tick'] };
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
    const bus = new EventTarget();
    const vehicle = new VehicleUca('decl-v').innervate(bus);
    updateDisposition(bus, 'decl-v', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    const moveCap = (vehicle as unknown as { registry: Map<string, ICapability> }).registry.get('move');
    const consumeCap = (vehicle as unknown as { registry: Map<string, ICapability> }).registry.get('consume');
    assert.ok(moveCap instanceof MoveCapability);
    assert.ok(consumeCap instanceof ConsumeCapability);
    assert.strictEqual(moveCap.disposition.aim.description, 'Mover vehículo');
    vehicle.denervate();
}

// 2. Lifecycle: innervate conecta capabilities declaradas
async function testLifecycle_InnervateConnects(): Promise<void> {
    const bus = new EventTarget();
    const vehicle = new VehicleUca('v1').innervate(bus);
    updateDisposition(bus, 'v1', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    vehicle.startTrip(6);
    await waitForDelay();
    assert.strictEqual(vehicle.moved, true);
    assert.strictEqual(vehicle.fuel, 6);
    vehicle.denervate();
}

// 3. Lifecycle: re-innervate no deja instancias huérfanas
async function testLifecycle_ReinnervateNoOrphans(): Promise<void> {
    const bus = new EventTarget();
    const vehicle = new VehicleUca('v-re').innervate(bus);
    updateDisposition(bus, 'v-re', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    vehicle.innervate(bus);
    updateDisposition(bus, 'v-re', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    vehicle.startTrip(4);
    await waitForDelay();
    assert.strictEqual(vehicle.fuel, 4);
    vehicle.denervate();
}

// 4. Lifecycle: denervate desconecta todas las capabilities
async function testLifecycle_DenervateDisconnects(): Promise<void> {
    const bus = new EventTarget();
    const uca = new DuplicateNameUca('d1').innervate(bus);
    updateDisposition(bus, 'd1', { aim: { description: 'Contador' }, reactTo: ['tick', 'counter.increment'] });
    uca.sendTick();
    await waitForDelay();
    assert.strictEqual(uca.count, 1);
    uca.denervate();
    uca.sendTick();
    await waitForDelay();
    assert.strictEqual(uca.count, 1);
}

class DashboardCapability extends Capability {
    public static override disposition: Disposition = { aim: { description: 'Supervisar estado' }, reactTo: ['spark'] };
    public sparkDetected = false;

    constructor(id = 'dashboard') {
        super(id);
    }

    protected override react(): void {
        this.sparkDetected = true;
    }
}

class SparkCapability extends Capability {
    public static override disposition: Disposition = { aim: { description: 'Chispa' }, reactTo: ['ignite'] };

    constructor(id = 'spark-plug') {
        super(id);
    }

    protected override react(): void {
        this.pulse('spark', { fired: true });
    }
}

class EngineUca extends Uca {
    public static override purpose = 'Planta motriz';

    constructor(id = 'engine-core') {
        super(id);
    }

    protected override catalog(): Cooky {
        const disp: Disposition = { aim: { description: 'Chispa', body: { id: 'spark-plug' } }, reactTo: ['ignite'] };
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
    public static override purpose = 'Multiples botones';

    constructor(id = 'multi-btn') {
        super(id);
    }

    protected override catalog(): Cooky {
        const dispA: Disposition = { aim: { description: 'Start', body: { id: 'btn-start' } }, reactTo: ['button.click'] };
        const dispB: Disposition = { aim: { description: 'Submit', body: { id: 'btn-submit' } }, reactTo: ['button.click'] };
        const dispC: Disposition = { aim: { description: 'Cancel', body: { id: 'btn-cancel' } }, reactTo: ['button.click'] };
        const declarations: Cooky = [
            [SimpleButtonCapability, dispA],
            [SimpleButtonCapability, dispB],
            [SimpleButtonCapability, dispC],
        ];
        return declarations;
    }
}

class EmptyUca extends Uca {
    public static override purpose = 'UCA vacia';

    constructor(id = 'empty-uca') {
        super(id);
    }

    protected override catalog(): Cooky {
        const declarations: Cooky = [];
        return declarations;
    }
}

class ShipUca extends Uca {
    public static override purpose = 'Nave';

    constructor(id = 'ship-1') {
        super(id);
    }

    protected override catalog(): Cooky {
        const engineDisp: Disposition = { aim: { description: 'Motor', body: { id: 'engine-core' } }, reactTo: ['ignite'] };
        const dashboardDisp: Disposition = { aim: { description: 'Dashboard', body: { id: 'dashboard' } }, reactTo: ['spark'] };
        const declarations: Cooky = [
            [EngineUca as unknown as CapabilityConstructor, engineDisp],
            [DashboardCapability, dashboardDisp],
        ];
        return declarations;
    }

    public get dashboard(): DashboardCapability | undefined {
        return this.getCapability('dashboard') as DashboardCapability | undefined;
    }

    public get engine(): EngineUca | undefined {
        return this.getCapability('engine-core') as EngineUca | undefined;
    }
}

// 5. Fractalidad: UCA hija comparte nervous target y desactivación por reactTo
async function testFractality_NestedUcaHierarchy(): Promise<void> {
    const bus = new EventTarget();
    const ship = new ShipUca('ship-1').innervate(bus);
    updateDisposition(bus, 'ship-1', { aim: { description: 'Nave' }, reactTo: ['ignite', 'spark'] });
    const igniteSignal: Signal = { source: 'test', property: 'ignite', value: 1, timestamp: Date.now() };
    ship.target?.dispatchEvent(new CustomEvent('ignite', { detail: igniteSignal }));
    await waitForDelay();
    assert.strictEqual(ship.dashboard?.sparkDetected, true);
    updateDisposition(bus, 'ship-1', { aim: { description: 'Nave' }, reactTo: [] });
    assert.strictEqual(ship.engine?.target, undefined);
    ship.denervate();
    assert.strictEqual(ship.target, undefined);
}

// 6. Aislamiento entre UCAs diferentes
async function testInterUcaIsolation(): Promise<void> {
    const bus1 = new EventTarget();
    const bus2 = new EventTarget();
    const v1 = new VehicleUca('v1').innervate(bus1);
    const v2 = new VehicleUca('v2').innervate(bus2);
    updateDisposition(bus1, 'v1', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    updateDisposition(bus2, 'v2', { aim: { description: 'Transportar' }, reactTo: ['start', 'move', 'consume'] });
    v1.startTrip(5);
    await waitForDelay();
    assert.strictEqual(v1.moved, true);
    assert.strictEqual(v2.moved, false);
    v1.denervate();
    v2.denervate();
}

// 7. Declaración: UCA vacía contiene registry vacío
async function testDeclaration_EmptyUca(): Promise<void> {
    const bus = new EventTarget();
    const uca = new EmptyUca('empty-uca').innervate(bus);
    updateDisposition(bus, 'empty-uca', { aim: { description: 'Vacia' }, reactTo: [] });
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

// 8. Declaración: Clases repetidas producen instancias independientes
async function testDeclaration_RepeatedCapabilityClasses(): Promise<void> {
    const bus = new EventTarget();
    const uca = new MultiButtonUca('multi-btn').innervate(bus);
    updateDisposition(bus, 'multi-btn', { aim: { description: 'Botones' }, reactTo: ['button.click'] });
    const registry = (uca as unknown as { registry: Map<string, ICapability> }).registry;
    const signalDetail = { source: 'test', property: 'button.click', value: null };
    uca.target?.dispatchEvent(new CustomEvent('button.click', { detail: signalDetail }));
    await waitForDelay();
    assertRepeatedReactions(registry);
    updateDisposition(bus, 'multi-btn', { aim: { description: 'Botones' }, reactTo: [] });
    assert.strictEqual(registry.size, 3);
    assert.strictEqual(registry.get('btn-start')?.target, undefined);
    uca.denervate();
}

// 9. Declaración: Core preserva el orden declarativo
async function testDeclaration_OrderPreserved(): Promise<void> {
    const bus = new EventTarget();
    const uca = new MultiButtonUca('multi-btn').innervate(bus);
    updateDisposition(bus, 'multi-btn', { aim: { description: 'Botones' }, reactTo: ['button.click'] });
    const registry = (uca as unknown as { registry: Map<string, ICapability> }).registry;
    const keys = Array.from(registry.keys());
    assert.deepStrictEqual(keys, ['btn-start', 'btn-submit', 'btn-cancel']);
    uca.denervate();
}

class ProbeCapability extends Capability {
    public reactCount = 0;

    constructor(id: string) {
        super(id);
    }

    protected override react(): void {
        this.reactCount += 1;
    }
}

// 10. Lifecycle: Instanciación e inervación no implican reacción sin actualización de disposición
async function testLifecycle_ExistenceAndConnectivityDoNotReact(): Promise<void> {
    const target = new EventTarget();
    const probe = new ProbeCapability('probe-1');
    assert.strictEqual(probe.reactCount, 0);
    probe.innervate(target);
    assert.strictEqual(probe.reactCount, 0);
    const otherDetail = { source: 't', property: 'other.signal', value: null };
    target.dispatchEvent(new CustomEvent('other.signal', { detail: otherDetail }));
    await waitForDelay();
    assert.strictEqual(probe.reactCount, 0);
    probe.denervate();
}

// 11. Lifecycle: Señal coincidente dispara reacción tras UPDATE
async function testLifecycle_MatchingSignalTriggersReaction(): Promise<void> {
    const target = new EventTarget();
    const probe = new ProbeCapability('probe-match');
    probe.innervate(target);
    updateDisposition(target, 'probe-match', { aim: { description: 'Probe' }, reactTo: ['match.signal'] });
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

// 12. Lifecycle: Múltiples capabilities inervadas solo reaccionan las relevantes
async function testLifecycle_MultipleInnervatedSelectiveReaction(): Promise<void> {
    const target = new EventTarget();
    const probeA = new ProbeCapability('probe-a').innervate(target) as ProbeCapability;
    const probeB = new ProbeCapability('probe-b').innervate(target) as ProbeCapability;
    const probeC = new ProbeCapability('probe-c').innervate(target) as ProbeCapability;
    updateDisposition(target, 'probe-a', { aim: { description: 'A' }, reactTo: ['signal.a'] });
    updateDisposition(target, 'probe-b', { aim: { description: 'B' }, reactTo: ['signal.b'] });
    updateDisposition(target, 'probe-c', { aim: { description: 'C' }, reactTo: ['signal.c'] });
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

    constructor(container: HTMLElement, config?: { id?: string }) {
        super(config?.id ?? 'private-btn');
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

// 13. HTML Acceptance: Construcción e inervación no crean recurso DOM; solo la reacción lo materializa
async function testHtmlAcceptance_ReactionMaterializesDomResource(): Promise<void> {
    const container = document.createElement('div');
    const button = new PrivateButtonCapability(container);
    const target = new EventTarget();
    assert.strictEqual(container.querySelector('button'), null);
    button.innervate(target);
    updateDisposition(target, 'private-btn', { aim: { description: 'Boton' }, reactTo: ['button.render'] });
    assert.strictEqual(container.querySelector('button'), null);
    const renderDetail = { source: 't', property: 'button.render', value: null };
    target.dispatchEvent(new CustomEvent('button.render', { detail: renderDetail }));
    await waitForDelay();
    const rendered = container.querySelector('button');
    assert.strictEqual(rendered?.textContent, 'Click me');
    button.denervate();
    assert.strictEqual(container.querySelector('button'), null);
}

// 14. Activación y desactivación dinámica de capabilities según reactTo
async function testCore_DynamicCapabilityActivationDeactivation(): Promise<void> {
    const bus = new EventTarget();
    const vehicle = new VehicleUca('dyn-v').innervate(bus);
    const registry = (vehicle as unknown as { registry: Map<string, ICapability> }).registry;

    // Activar capabilities con reactTo: ['start']
    updateDisposition(bus, 'dyn-v', { aim: { description: 'V' }, reactTo: ['start'] });
    assert.strictEqual(registry.get('move')?.target !== undefined, true);
    assert.strictEqual(registry.get('consume')?.target !== undefined, true);

    // Desactivar todas con reactTo: []
    updateDisposition(bus, 'dyn-v', { aim: { description: 'V' }, reactTo: [] });
    assert.strictEqual(registry.get('move')?.target, undefined);
    assert.strictEqual(registry.get('consume')?.target, undefined);

    vehicle.denervate();
}

class SimpleProbeUca extends Uca {
    public static override purpose = 'Simple probe';
    constructor(id = 'probe-uca') {
        super(id);
    }
}

// 15. Actualización de disposición y pulso UPDATED
async function testCore_UcaDispositionUpdate(): Promise<void> {
    const bus = new EventTarget();
    const probe = new SimpleProbeUca('uca-target').innervate(bus);

    let updatedPayload: unknown;
    bus.addEventListener(DispositionSignal.UPDATED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        updatedPayload = customEvent.detail.value;
    });

    updateDisposition(bus, 'uca-target', { reactTo: ['updated.signal'], aim: { description: 'Updated probe' } });

    assert.ok(updatedPayload);
    assert.strictEqual(probe.disposition.aim.description, 'Updated probe');
    assert.ok(probe.disposition.reactTo?.includes('updated.signal'));

    probe.denervate();
}

// 16. Respuesta a GET con PROVIDE
async function testCore_UcaRespondsToDispositionGetWithProvide(): Promise<void> {
    const bus = new EventTarget();
    class CardUca extends Uca {
        public static override purpose: string = 'Display informational card';
        public static override disposition: Disposition = {
            aim: { description: CardUca.purpose },
        };
    }
    const card = new CardUca('card:user-profile').innervate(bus);
    let capturedProvide: DispositionProvidePayload | undefined;

    bus.addEventListener(DispositionSignal.PROVIDE, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<DispositionProvidePayload>>;
        capturedProvide = customEvent.detail.value;
    });

    const getSignal: Signal = {
        source: 'view-composer',
        property: Capability.getEvent('card:user-profile'),
        value: {},
        timestamp: Date.now(),
    };
    bus.dispatchEvent(new CustomEvent(Capability.getEvent('card:user-profile'), { detail: getSignal }));

    assert.ok(capturedProvide);
    assert.strictEqual(capturedProvide?.ucaId, 'card:user-profile');
    assert.strictEqual(capturedProvide?.prefix, 'card');
    assert.strictEqual(capturedProvide?.purpose, 'Display informational card');
    assert.strictEqual(capturedProvide?.disposition.aim.description, 'Display informational card');
    card.denervate();
}

// 17. Aislamiento de matchesId
async function testCore_UcaMatchesIdIsolation(): Promise<void> {
    class ProbeUca extends Uca {
        public checkMatch(targetId?: string): boolean {
            return this.matchesId(targetId);
        }
    }
    const headerScaffold = new ProbeUca('header:scaffold');
    const contentScaffold = new ProbeUca('content:scaffold');
    const boxHeader = new ProbeUca('box:header');

    assert.strictEqual(headerScaffold.checkMatch('header:scaffold'), true);
    assert.strictEqual(headerScaffold.checkMatch('content:scaffold'), false);
    assert.strictEqual(contentScaffold.checkMatch('header:scaffold'), false);
    assert.strictEqual(boxHeader.checkMatch('header'), true);
    assert.strictEqual(boxHeader.checkMatch('content'), false);
    assert.strictEqual(headerScaffold.checkMatch(undefined), true);
}

function assertChildPropagation(parent: Uca): Uca {
    const child = (parent as unknown as { registry: Map<string, Uca> }).registry.get('child-1');
    assert.ok(child !== undefined);
    assert.strictEqual(child?.context, 'Parent master purpose');
    return child!;
}

function assertGrandchildPropagation(child: Uca): void {
    const grandchild = (child as unknown as { registry: Map<string, Uca> }).registry.get('grandchild-1');
    assert.ok(grandchild !== undefined);
    assert.strictEqual(grandchild?.context, 'Parent master purpose → Child purpose');
}

// 18. Propagación de contexto
async function testCore_UcaContextPropagation(): Promise<void> {
    const bus = new EventTarget();
    class GrandchildProbe extends Uca { public static override purpose = 'Grandchild purpose'; }
    class ChildProbe extends Uca {
        public static override purpose = 'Child purpose';
        protected override catalog(): Cooky { return [[GrandchildProbe, { aim: { description: GrandchildProbe.purpose, body: { id: 'grandchild-1' } }, reactTo: ['grandchild.signal'] }]]; }
    }
    class ParentProbe extends Uca {
        public static override purpose = 'Parent master purpose';
        protected override catalog(): Cooky { return [[ChildProbe, { aim: { description: ChildProbe.purpose, body: { id: 'child-1' } }, reactTo: ['child.signal', 'grandchild.signal'] }]]; }
    }
    const parent = new ParentProbe('parent-1').innervate(bus);
    updateDisposition(bus, 'parent-1', { aim: { description: 'Parent master purpose' }, reactTo: ['child.signal', 'grandchild.signal'] });
    const child = assertChildPropagation(parent);
    assertGrandchildPropagation(child);
    parent.denervate();
}

async function runAllTests(): Promise<void> {
    await testDeclaration_CookyMapping();
    await testDeclaration_EmptyUca();
    await testDeclaration_RepeatedCapabilityClasses();
    await testDeclaration_OrderPreserved();
    await testLifecycle_InnervateConnects();
    await testLifecycle_ReinnervateNoOrphans();
    await testLifecycle_DenervateDisconnects();
    await testFractality_NestedUcaHierarchy();
    await testInterUcaIsolation();
    await testLifecycle_ExistenceAndConnectivityDoNotReact();
    await testLifecycle_MatchingSignalTriggersReaction();
    await testLifecycle_MultipleInnervatedSelectiveReaction();
    await testHtmlAcceptance_ReactionMaterializesDomResource();
    await testCore_DynamicCapabilityActivationDeactivation();
    await testCore_UcaDispositionUpdate();
    await testCore_UcaRespondsToDispositionGetWithProvide();
    await testCore_UcaMatchesIdIsolation();
    await testCore_UcaContextPropagation();
    console.log('✔ All 18 Core UCA lifecycle, Cooky, dynamic activation, context and isolation tests passed successfully.');
}

runAllTests().catch((error: unknown) => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
