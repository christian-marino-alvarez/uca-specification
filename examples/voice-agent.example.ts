/**
 * Ejemplo de Referencia No Normativo: ConversationalAgent con Capabilities en camelCase.
 *
 * Este archivo ilustra de forma práctica cómo los principios de la especificación UCA
 * se implementan en un runtime de TypeScript/JavaScript.
 */

export interface Signal {
    source: string;
    sourceName: string;
    sourceType: string;
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

        // Proxy reactivo: detecta mutaciones de propiedades públicas y emite señales
        const proxy = new Proxy(this, {
            set: (target, prop, value) => {
                const oldValue = Reflect.get(target, prop);
                const success = Reflect.set(target, prop, value);
                if (success && typeof prop === 'string' && oldValue !== value) {
                    this.channel.emit({
                        source: this.id,
                        sourceName: this.name,
                        sourceType: this.constructor.name,
                        property: prop,
                        value,
                        timestamp: Date.now(),
                    });
                }
                return success;
            },
        });
        this.channel.subscribe((signal) => proxy.handleSignal(signal));
        return proxy;
    }

    public async react(_signal: Signal): Promise<void> {}

    private handleSignal(signal: Signal): void {
        if (signal.source === this.id) {
            return;
        }
        const matchesName = this.reactTo.includes(`${signal.sourceName}.${signal.property}`);
        const matchesType = this.reactTo.includes(`${signal.sourceType}.${signal.property}`);
        if (matchesName || matchesType) {
            void this.react(signal);
        }
    }
}

// --- 1. Capacidades Terminales (Funcionalidad Pura sin Uca ni Purpose, §3.2) ---

/**
 * Capacidad terminal mecánica para encuadre y segmentación acústica.
 * No extiende Uca ni posee Purpose (§3.2).
 */
export class AudioFramingService {
    public sliceFrame(audioData: string, sampleRate: number, framingMs: number): string {
        return `[frame:${sampleRate}Hz:${framingMs}ms] ${audioData}`;
    }
}

/**
 * Capacidad terminal puramente algorítmica para síntesis y conversión TTS.
 * No extiende Uca ni posee Purpose (§3.2).
 */
export class SpeechSynthesizerService {
    public synthesize(text: string, voice: string, rate: number): string {
        return `[Voz sintetizada:${voice}:x${rate.toFixed(1)}] ${text}`;
    }
}

// --- 2. UCAs Primitivas (poseen Purpose propio y usan capacidades terminales) ---

export class AcousticEar extends BaseUca {
    public override purpose = 'Percepción acústica y transcripción continua de voz';
    public isListening = false;
    public lastTranscript = '';
    protected override reactTo = ['Environment.audioInput'];

    // Capacidad terminal pura (mecanismo sin Uca)
    private readonly framingService = new AudioFramingService();

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            this.isListening = true;
            this.lastTranscript = value;
            const sampleRate = (this.disposition?.sampleRate as number) ?? 16000;
            const framingMs = (this.disposition?.framingMs as number) ?? 100;
            const frame = this.framingService.sliceFrame(value, sampleRate, framingMs);
            console.log(`AcousticEar: Percibido estímulo acústico -> "${value}" (${frame})`);
        }
    }
}

export class VocalMouth extends BaseUca {
    public override purpose = 'Síntesis y alocución vocal hacia el exterior';
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    // Capacidad terminal pura (mecanismo sin Uca)
    private readonly synthesizerService = new SpeechSynthesizerService();

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            const voice = (this.disposition?.voice as string) ?? 'alloy';
            const rate = (this.disposition?.rate as number) ?? 1.0;
            const spoken = this.synthesizerService.synthesize(value, voice, rate);
            this.speechQueue.push(spoken);
            console.log(`VocalMouth: Emitiendo alocución -> "${spoken}"`);
        }
    }
}

// --- 3. Composición Recursiva de UCAs Primitivas (§3.1) ---

export class ConversationalAgent extends BaseUca {
    public override purpose = 'Agente de alocución interactiva';
    public override capabilities = {
        acousticEar: { sampleRate: 16000, framingMs: 100 },
        vocalMouth: { voice: 'alloy', rate: 1.0 },
    };

    public acousticEar: AcousticEar;
    public vocalMouth: VocalMouth;

    constructor(id: string, name: string, config?: UcaConfig) {
        super(id, name, config);
        // Cada UCA primitiva constituyente se instancia de forma soberana con su disposición
        this.acousticEar = new AcousticEar(`${id}-ear`, 'acousticEar', {
            channel: this.channel,
            disposition: this.capabilities.acousticEar,
        });
        this.vocalMouth = new VocalMouth(`${id}-mouth`, 'vocalMouth', {
            channel: this.channel,
            disposition: this.capabilities.vocalMouth,
        });
    }

    public get internalChannel(): IChannel {
        return this.channel;
    }
}

// 3. Ejecución del Ejemplo
export async function runVoiceAgentExample(): Promise<void> {
    console.log('--- Iniciando Ejemplo de Uso: ConversationalAgent ---');
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    console.log(`Propósito del Agente: ${agent.purpose}`);
    console.log('Disposición inyectada a acousticEar:', agent.acousticEar.disposition);
    console.log('Disposición inyectada a vocalMouth:', agent.vocalMouth.disposition);

    // Activación reactiva pura: la comunicación con el exterior se realiza exclusivamente
    // mediante señales o impulsos. Las propiedades de una UCA NUNCA se alteran desde fuera.
    // Se setean internamente dentro de la propia clase al reaccionar a un estímulo recibido.
    agent.internalChannel.emit({
        source: 'Environment',
        sourceName: 'environment',
        sourceType: 'Environment',
        property: 'audioInput',
        value: 'Hola, arquitecto cognitivo',
        timestamp: Date.now(),
    });

    console.log('Estado interno de acousticEar (isListening):', agent.acousticEar.isListening);
    console.log('Cola de habla en vocalMouth:', agent.vocalMouth.speechQueue);
}

runVoiceAgentExample();
