/**
 * SignalType: Identificadores de señales que maneja o emite la Capability Loop.
 * Asimetría: estímulo de control (START, STOP, NEXT) vs emisión resultante (ITERATION, COMPLETED).
 */
export enum SignalType {
    START = 'loop.start',
    STOP = 'loop.stop',
    NEXT = 'loop.next',
    ITERATION = 'loop.iteration',
    COMPLETED = 'loop.completed',
}

export enum DataType {
    LOOP_OPTIONS = 'LoopOptions',
    VOID = 'void',
    ITERATION_CONTEXT = 'IterationContext',
    COMPLETION_CONTEXT = 'CompletionContext',
}

/**
 * IterationContext: Payload emitido en cada ciclo del bucle.
 */
export interface IterationContext<T = unknown> {
    index: number;
    item: T;
    total: number;
    isFirst: boolean;
    isLast: boolean;
}

export interface CompletionContext {
    readonly total: number;
}

/**
 * LoopOptions: Parámetros opcionales de ejecución del loop.
 */
export interface LoopOptions<T = unknown> {
    items?: readonly T[];
    count?: number;
    step?: number;
}

/**
 * Body: Configuración de la disposición o payload de señal para Loop.
 */
export interface Body<T = unknown> extends LoopOptions<T> {
    id?: string;
}
