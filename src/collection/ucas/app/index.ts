import { Uca } from '@uca/core/uca';
import {
    type Cooky,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import { ScaffoldComposer } from '@uca/scaffold-composer';
import {
    SignalType as ScaffoldComposerSignalType,
    type Body as ScaffoldComposerBody,
    type GraphNode,
    type GraphStreamPayload,
    type Scaffold,
} from '@uca/scaffold-composer/types';
import { __ID__, DEFAULT_SIGNALS } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Crear una web muy profesional y didáctica para explicar de forma muy fácil y sencilla qué es la arquitectura UCA, sus ventajas, puntos fuertes y qué no es UCA';

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: ScaffoldComposerSignalType.CREATED, type: DataType.RECORD, description: 'Receive synthesized scaffold' },
            { signal: ScaffoldComposerSignalType.STREAM, type: DataType.STREAM, description: 'Receive scaffold nodes as final objects in real time' },
            { signal: ScaffoldComposerSignalType.UPDATED, type: DataType.RECORD, description: 'Receive updated scaffold' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'Application initialized with scaffold' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Application updated with scaffold' },
            { signal: ScaffoldComposerSignalType.CREATE, type: DataType.RECORD, description: 'Request conceptual scaffold' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { description = App.purpose } = aim;
        const disposition: Disposition<ScaffoldComposerBody> = {
            aim: { description: ScaffoldComposer.purpose, body: { prompt: description } },
            reactTo: [...ScaffoldComposer.disposition.reactTo ?? []],
        };
        return [[ScaffoldComposer, disposition]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate();
                break;
            case ScaffoldComposerSignalType.CREATED:
                this.handleScaffoldCreated(value);
                break;
            case ScaffoldComposerSignalType.STREAM:
                this.handleScaffoldStream(value);
                break;
            case ScaffoldComposerSignalType.UPDATED:
                this.handleScaffoldUpdated(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(): void {
        this.pulse(ScaffoldComposerSignalType.CREATE, this.getDomainProperties());
    }

    private handleScaffoldCreated(value: unknown): void {
        const { scaffold } = (value ?? {}) as { scaffold?: Scaffold };
        if (!scaffold) { return; }
        const { purpose, ucas = {}, theme } = scaffold;
        console.log(`\n🏗️ [app] -> scaffold.created: "${purpose}" (${Object.keys(ucas).length} ucas)`);
        console.log(`🎨 [app] -> theme:`, theme);
        console.log(`📑 [app] -> ucas:`, ucas);
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), scaffold });
    }

    private handleScaffoldStream(value: unknown): void {
        const { stream } = (value ?? {}) as GraphStreamPayload;
        const consumer = new WritableStream<GraphNode>({
            write: (node) => this.handleScaffoldNode(node),
        });
        stream.pipeTo(consumer);
    }

    private handleScaffoldNode(node: GraphNode): void {
        const { key, value } = node;
        console.log(`🧩 [app] -> scaffold node "${key}":`, value);
    }

    private handleScaffoldUpdated(value: unknown): void {
        const { scaffold } = (value ?? {}) as { scaffold?: Scaffold };
        if (!scaffold) { return; }
        const { purpose, ucas = {} } = scaffold;
        console.log(`\n🔄 [app] -> scaffold.updated: "${purpose}" (${Object.keys(ucas).length} ucas)`);
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), scaffold });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}
