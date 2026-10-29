export enum EntityKind {
    UCA = 'UCA',
    CAPABILITY = 'CAPABILITY',
    EXTERNAL = 'EXTERNAL',
}

/**
 * Signal: Representación mínima de un cambio observable.
 */
export interface Signal<T = unknown> {
    source: string;
    readonly sourceKind?: EntityKind;
    /** Destination resolved by Core from active catalog input ports, or explicitly supplied. */
    readonly targetId?: string;
    property: string;
    value: T;
    timestamp?: number;
    sessionId?: string;
}

/**
 * Aim: Determinación y propósito de la disposición de una Capability.
 */
export interface Aim<TBody = unknown> {
    description: string;
    body?: TBody;
}

export type SignalHandler = (signal: Signal) => void | Promise<void>;

/**
 * Port: Descriptor formal de un canal nervioso de entrada o salida.
 */
export interface Port {
    readonly signal: string;
    readonly type: string;
    readonly schema?: unknown;
    readonly description?: string;
    readonly handler?: SignalHandler;
}

export type PortDeclaration = Port;
export type PortDirection = 'inputs' | 'outputs';


/**
 * DispositionOptions: Opciones complementarias para la creación de una Disposition.
 */
export interface DispositionOptions {
    readonly inputs?: readonly PortDeclaration[];
    readonly outputs?: readonly PortDeclaration[];
}

/**
 * Disposition: Predisposición y condiciones reactivas de una Capability o UCA.
 * Define a qué estímulos reacciona (reactTo), su aim (description y body),
 * y los puertos formales de entrada (inputs) y salida (outputs).
 */
export interface Disposition<TBody = unknown> {
    reactTo?: string[];
    aim: Aim<TBody>;
    readonly limits?: Record<string, unknown>;
    readonly inputs?: readonly Port[];
    readonly outputs?: readonly Port[];
}

/**
 * TransportPayload: Contrato ontológico universal de transporte de estímulos entre UCAs.
 * Nutre y refleja directamente la anatomía de Disposition (aim, limits).
 */
export interface TransportPayload<TBody = unknown> {
    readonly aim: Aim<TBody>;
    readonly limits?: Record<string, unknown>;
    readonly sessionId?: string;
}

/**
 * DispositionSignal: Señales nerviosas ontológicas para actualización reactiva de la disposición.
 */
export enum DispositionSignal {
    UPDATE = 'UPDATE',
    UPDATED = 'disposition.updated',
    GET = 'GET',
    PROVIDE = 'disposition.provide',
    INNERVATED = 'innervated',
    DENERVATED = 'denervated',
}

export type DispositionSignalType = DispositionSignal;

/**
 * StorageSignal: Señales nerviosas ontológicas para operaciones de almacenamiento.
 */
export enum StorageSignal {
    SET = 'local-storage.set',
    GET = 'local-storage.get',
    REMOVE = 'local-storage.remove',
    CLEAR = 'local-storage.clear',
}

export type StorageSignalType = StorageSignal;

/**
 * DispositionUpdatedPayload: Contrato emitido tras la actualización reactiva de la disposición.
 */
export interface DispositionUpdatedPayload<TBody = unknown> {
    readonly id: string;
    readonly disposition: Disposition<TBody>;
}

/**
 * DispositionProvidePayload: Contrato emitido por una UCA al responder a una petición disposition.get.
 */
export interface DispositionProvidePayload<TBody = unknown> {
    readonly id: string;
    readonly disposition: Disposition<TBody>;
    readonly ucaId?: string;
    readonly prefix?: string;
    readonly purpose?: string;
    readonly ucaConstructor?: CapabilityConstructor;
}

/**
 * ICapability: Interfaz unificada de capacidad dentro de una UCA.
 */
export interface ICapability<TBody = unknown> {
    readonly id: string;
    readonly updateEvent: string;
    readonly getEvent: string;
    readonly disposition: Disposition<TBody>;
    readonly body?: TBody;
    readonly target?: EventTarget;
    innervate(target?: EventTarget): this;
    denervate(): void;
}

/**
 * CommunicationImpulse: Paquete de datos transmitido a través del canal de comunicación.
 */
export interface CommunicationImpulse<T = unknown> {
    readonly source: string;
    readonly property: string;
    readonly payload: T;
    readonly timestamp: number;
}

/**
 * CommunicationConfig: Configuración para la UCA y Capability de comunicación.
 */
export interface CommunicationConfig {
    readonly id?: string;
    readonly reactTo?: readonly string[];
}

export type Impulse<T = unknown> = CommunicationImpulse<T>;
export type BroadcastImpulse<T = unknown> = CommunicationImpulse<T>;
export type BroadcastNervousSystemConfig = CommunicationConfig;

/**
 * CapabilityConstructor: Tipo de constructor para instanciar Capabilities.
 */
export type CapabilityConstructor<TCapability extends ICapability = ICapability> = abstract new (
    ...args: never[]
) => TCapability;

/**
 * Declaration: Tupla declarativa [Clase de Capability, Disposition].
 */
export type Declaration<TCapability extends ICapability = ICapability> = readonly [
    CapabilityConstructor<TCapability>,
    Disposition,
];

export type CookyEntry<TCapability extends ICapability = ICapability> = Declaration<TCapability>;

/**
 * Cooky: Array ordenado de tuplas declarativas [Clase de Capability, Disposition].
 */
export type Cooky = readonly Declaration[];
