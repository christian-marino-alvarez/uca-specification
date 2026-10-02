/**
 * Signal: Representación mínima de un cambio observable.
 */
export interface Signal<T = unknown> {
    source: string;
    property: string;
    value: T;
    timestamp?: number;
}

/**
 * Aim: Determinación y propósito de la disposición de una Capability.
 */
export interface Aim<TBody = unknown> {
    description: string;
    body?: TBody;
}

/**
 * Port: Descriptor formal de un canal nervioso de entrada o salida.
 */
export interface Port {
    readonly signal: string;
    readonly type: string;
    readonly schema?: unknown;
    readonly description?: string;
}

export type PortDeclaration = Port;


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
    readonly inputs?: readonly Port[];
    readonly outputs?: readonly Port[];
}

/**
 * DispositionSignal: Señales nerviosas ontológicas para actualización reactiva de la disposición.
 */
export enum DispositionSignal {
    UPDATE = 'disposition.update',
    UPDATED = 'disposition.updated',
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
 * DispositionUpdatePayload: Contrato para actualización reactiva de la disposición.
 */
export interface DispositionUpdatePayload<TBody = unknown> {
    readonly id: string;
    readonly disposition: Partial<Disposition<TBody>>;
}

/**
 * DispositionUpdatedPayload: Contrato emitido tras la actualización reactiva de la disposición.
 */
export interface DispositionUpdatedPayload<TBody = unknown> {
    readonly id: string;
    readonly disposition: Disposition<TBody>;
}

/**
 * ICapability: Interfaz unificada de capacidad dentro de una UCA.
 */
export interface ICapability<TBody = unknown> {
    readonly id: string;
    readonly disposition: Disposition<TBody>;
    readonly target?: EventTarget;
    innervate(target?: EventTarget, disposition?: Disposition<TBody>): this;
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

