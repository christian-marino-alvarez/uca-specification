/**
 * Ejemplo de Referencia No Normativo: ConversationalAgent con Capabilities en camelCase.
 *
 * Este archivo ilustra de forma práctica cómo los principios de la especificación UCA
 * se implementan en un runtime de TypeScript/JavaScript.
 */

export interface Signal {
    source: string;
    property: string;
    value: unknown;
    timestamp: number;
}

export type SignalListener = (signal: Signal) => Promise<void> | void;

export interface IChannel {
    emit(signal: Signal): void;
    subscribe(listener: SignalListener): () => void;
}

export class SimpleChannel implements IChannel {
    private readonly listeners = new Set<SignalListener>();

    public emit(signal: Signal): void {
        this.listeners.forEach((listener) => {
            void listener(signal);
        });
    }

    public subscribe(listener: SignalListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export interface UcaConfig {
    channel?: IChannel;
    disposition?: Record<string, unknown>;
}

// Clase base mínima UCA ilustrativa
export class BaseUca {
    public id: string;
    public name: string;
    public purpose = '';
    public capabilities: Record<string, Record<string, unknown>> = {};
    public disposition?: Record<string, unknown>;
    protected channel: IChannel;
    protected reactTo: string[] = [];

    constructor(id: string, name: string, config?: UcaConfig) {
        this.id = id;
        this.name = name;
        this.disposition = config?.disposition;
        this.channel = config?.channel ?? new SimpleChannel();
        this.channel.subscribe((signal) => this.handleSignal(signal));

        // Proxy reactivo: detecta mutaciones de propiedades públicas y emite señales
        return new Proxy(this, {
            set: (target, prop, value) => {
                const oldValue = Reflect.get(target, prop);
                const success = Reflect.set(target, prop, value);
                if (success && typeof prop === 'string' && oldValue !== value) {
                    this.channel.emit({
                        source: this.constructor.name,
                        property: prop,
                        value,
                        timestamp: Date.now(),
                    });
                }
                return success;
            },
        });
    }

    public async react(_signal: Signal): Promise<void> {}

    private handleSignal(signal: Signal): void {
        const signalKey = `${signal.source}.${signal.property}`;
        if (this.reactTo.includes(signalKey)) {
            void this.react(signal);
        }
    }
}

// 1. Primitive Capabilities
export class AcousticEar extends BaseUca {
    public override purpose = 'Percepción acústica y transcripción continua de voz';
    public isListening = false;
    public lastTranscript = '';

    public transcribe(text: string): void {
        this.lastTranscript = text;
    }
}

export class VocalMouth extends BaseUca {
    public override purpose = 'Síntesis y alocución vocal hacia el exterior';
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            this.speechQueue.push(`[Voz sintetizada] ${value}`);
        }
    }
}

// 2. Organismo con Capabilities Innatas y Disposición en camelCase
export class ConversationalAgent extends BaseUca {
    public override purpose = 'Agente biológico de alocución interactiva';
    public override capabilities = {
        acousticEar: { sampleRate: 16000, framingMs: 100 },
        vocalMouth: { voice: 'alloy', rate: 1.0 },
    };

    public acousticEar: AcousticEar;
    public vocalMouth: VocalMouth;

    constructor(id: string, name: string, config?: UcaConfig) {
        super(id, name, config);
        // Cada capability se instancia de forma aislada inyectándole su propia disposición
        this.acousticEar = new AcousticEar(`${id}-ear`, 'AcousticEar', {
            channel: this.channel,
            disposition: this.capabilities.acousticEar,
        });
        this.vocalMouth = new VocalMouth(`${id}-mouth`, 'VocalMouth', {
            channel: this.channel,
            disposition: this.capabilities.vocalMouth,
        });
    }
}

// 3. Ejecución del Ejemplo
export async function runVoiceAgentExample(): Promise<void> {
    console.log('--- Iniciando Ejemplo de Uso: ConversationalAgent ---');
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    console.log(`Propósito del Agente: ${agent.purpose}`);
    console.log('Disposición inyectada a acousticEar:', agent.acousticEar.disposition);
    console.log('Disposición inyectada a vocalMouth:', agent.vocalMouth.disposition);

    // Activación reactiva
    agent.acousticEar.isListening = true;
    agent.acousticEar.transcribe('Hola, arquitecto cognitivo');

    console.log('Cola de habla en vocalMouth:', agent.vocalMouth.speechQueue);
}

runVoiceAgentExample();
