/**
 * Ejemplo de Referencia No Normativo: ConversationalAgent con Capabilities en camelCase.
 *
 * Este archivo ilustra de forma práctica cómo los principios de la especificación UCA
 * se implementan en un runtime de TypeScript/JavaScript.
 */

export interface Signal<T = unknown> {
    type?: string;
    source: string;
    sourceName: string;
    sourceType: string;
    property: string;
    value: T;
    timestamp: number;
    traceId?: string;
    dispositionVersion?: number;
}

export type SignalListener = (signal: Signal) => Promise<void> | void;

export interface IChannel {
    broadcast(signal: Signal): Promise<void>;
    subscribe(listener: SignalListener): () => void;
}

export class SimpleChannel implements IChannel {
    private readonly listeners = new Set<SignalListener>();

    public async broadcast(signal: Signal): Promise<void> {
        const promises = Array.from(this.listeners).map(async (listener) => {
            await listener(signal);
        });
        await Promise.all(promises);
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

export interface DispositionSnapshot<T = Record<string, unknown>> {
    version: number;
    timestamp: number;
    disposition: T;
}

// Clase base mínima UCA ilustrativa
export class BaseUca {
    public id: string;
    public name: string;
    public purpose = '';
    public capabilities: Record<string, Record<string, unknown>> = {};
    public disposition: Record<string, unknown> = {};
    protected channel: IChannel;
    protected reactTo: string[] = [];
    protected dispositionHistory: DispositionSnapshot[] = [];

    constructor(id: string, name: string, config?: UcaConfig) {
        this.id = id;
        this.name = name;
        if (config?.disposition) {
            this.disposition = { ...this.disposition, ...config.disposition };
        }
        this.channel = config?.channel ?? new SimpleChannel();

        // Guardar snapshot inicial de concepción D0
        this.dispositionHistory.push({
            version: 0,
            timestamp: Date.now(),
            disposition: { ...this.disposition },
        });

        // Proxy reactivo: detecta mutaciones de propiedades públicas y emite señales
        const proxy = new Proxy(this, {
            set: (target, prop, value) => {
                const oldValue = Reflect.get(target, prop);
                const success = Reflect.set(target, prop, value);
                if (success && typeof prop === 'string' && oldValue !== value) {
                    void this.channel.broadcast({
                        type: `${this.constructor.name}.${prop}`,
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
        this.channel.subscribe(async (signal) => {
            await proxy.handleSignal(signal);
        });
        return proxy;
    }

    public get dispositionSequence(): readonly DispositionSnapshot[] {
        return [...this.dispositionHistory];
    }

    // Métodos de reversión protegidos: NUNCA públicos ni auto-invocados arbitrariamente.
    // Se ejecutan únicamente al procesar un impulso mediado por el exterior.
    protected revertTo(version: number): boolean {
        if (version < 0 || version >= this.dispositionHistory.length) {
            return false;
        }
        const target = this.dispositionHistory[version];
        this.disposition = { ...target.disposition };
        return true;
    }

    protected revert(steps: number = 1): boolean {
        if (steps <= 0 || this.dispositionHistory.length <= 1) {
            return false;
        }
        const targetVersion = Math.max(0, this.dispositionHistory.length - 1 - steps);
        return this.revertTo(targetVersion);
    }

    // Entrada reactiva soberana para impulsos mediados
    public async processImpulse(impulse: { action?: string; steps?: number; version?: number; payload?: Record<string, unknown> }): Promise<void> {
        if (impulse.action === 'revert') {
            this.revert(impulse.steps ?? 1);
        } else if (impulse.action === 'revertTo' && impulse.version !== undefined) {
            this.revertTo(impulse.version);
        } else if (impulse.payload) {
            this.disposition = { ...this.disposition, ...impulse.payload };
            this.dispositionHistory.push({
                version: this.dispositionHistory.length,
                timestamp: Date.now(),
                disposition: { ...this.disposition },
            });
        }
    }

    public async react(_signal: Signal): Promise<void> {}

    private async handleSignal(signal: Signal): Promise<void> {
        if (signal.source === this.id) {
            return;
        }
        const matchesName = this.reactTo.includes(`${signal.sourceName}.${signal.property}`);
        const matchesType = this.reactTo.includes(`${signal.sourceType}.${signal.property}`);
        const matchesEvent = Boolean(signal.type && this.reactTo.includes(signal.type));
        if (matchesName || matchesType || matchesEvent) {
            await this.react(signal);
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
    public readonly owner = 'ConversationalAgent'; // Owner UCA
    public override disposition = {
        sampleRate: 16000,
        framingMs: 100,
    };
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
            const sampleRate = (this.disposition.sampleRate as number) ?? 16000;
            const framingMs = (this.disposition.framingMs as number) ?? 100;
            const frame = this.framingService.sliceFrame(value, sampleRate, framingMs);
            console.log(`AcousticEar: Percibido estímulo acústico -> "${value}" (${frame})`);
        }
    }
}

export class VocalMouth extends BaseUca {
    public override purpose = 'Síntesis y alocución vocal hacia el exterior';
    public readonly owner = 'ConversationalAgent'; // Owner UCA
    public override disposition = {
        voice: 'alloy',
        rate: 1.0,
    };
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    // Capacidad terminal pura (mecanismo sin Uca)
    private readonly synthesizerService = new SpeechSynthesizerService();

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            const voice = (this.disposition.voice as string) ?? 'alloy';
            const rate = (this.disposition.rate as number) ?? 1.0;
            const spoken = this.synthesizerService.synthesize(value, voice, rate);
            this.speechQueue.push(spoken);
            console.log(`VocalMouth: Emitiendo alocución -> "${spoken}"`);
        }
    }
}

// --- 3. Composición Recursiva de UCAs Primitivas (§3.1) ---

export class ConversationalAgent extends BaseUca {
    public override purpose = 'Agente de alocución interactiva';
    public readonly rootOwner = 'HumanArchitect'; // Owner Raíz (humano/creador)

    // No se duplican las disposiciones innatas; solo se declaran las UCAs constituyentes
    public override capabilities = {
        acousticEar: {},
        vocalMouth: {},
    };

    public acousticEar: AcousticEar;
    public vocalMouth: VocalMouth;

    constructor(id: string, name: string, config?: UcaConfig) {
        super(id, name, config);
        // Cada UCA primitiva constituyente se instancia de forma soberana
        this.acousticEar = new AcousticEar(`${id}-ear`, 'acousticEar', {
            channel: this.channel,
        });
        this.vocalMouth = new VocalMouth(`${id}-mouth`, 'vocalMouth', {
            channel: this.channel,
        });
    }
}

// --- 4. Ejecución del Ejemplo ---
export async function runVoiceAgentExample(): Promise<void> {
    console.log('--- Iniciando Ejemplo de Uso: ConversationalAgent ---');
    const channel = new SimpleChannel();
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent', { channel });

    console.log(`Propósito del Agente: ${agent.purpose}`);
    console.log(`Owner Raíz del Agente: ${agent.rootOwner}`);
    console.log('Disposición innata de acousticEar:', agent.acousticEar.disposition);
    console.log('Disposición innata de vocalMouth:', agent.vocalMouth.disposition);

    // Activación reactiva pura: el entorno difunde una señal por el canal común
    await channel.broadcast({
        type: 'Environment.audioInput',
        source: 'Environment',
        sourceName: 'environment',
        sourceType: 'Environment',
        property: 'audioInput',
        value: 'Hola, arquitecto cognitivo',
        timestamp: Date.now(),
    });

    // Como el broadcast es asíncrono y se ha esperado con await,
    // el resultado ya está completamente consolidado:
    console.log('Estado interno de acousticEar (isListening):', agent.acousticEar.isListening);
    console.log('Cola de habla en vocalMouth:', agent.vocalMouth.speechQueue);

    // Demostración de reversión mediada: NUNCA se llama a un método público directo imperativo.
    // Se procesa mediante un impulso mediado emitido hacia la UCA:
    await agent.acousticEar.processImpulse({ action: 'revert', steps: 1 });
    console.log('Snapshots de acousticEar tras reversión mediada:', agent.acousticEar.dispositionSequence.length);
}

runVoiceAgentExample();
