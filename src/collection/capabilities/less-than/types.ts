export enum SignalType {
    EVALUATE = 'less-than.evaluate',
    EVALUATED = 'less-than.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    BOOLEAN = 'boolean',
}

export type Operands = readonly [number, number];

export interface Body {
    readonly operands?: Operands;
}
