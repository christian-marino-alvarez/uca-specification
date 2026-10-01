export enum SignalType {
    EVALUATE = 'equal.evaluate',
    EVALUATED = 'equal.evaluated',
}

export enum DataType {
    OPERANDS = 'Operands',
    BOOLEAN = 'boolean',
}

export type Operands = readonly [unknown, unknown];

export interface Body {
    readonly operands?: Operands;
}
