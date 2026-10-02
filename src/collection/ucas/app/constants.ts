import { SignalType } from './types.js';

export const __ID__ = 'app';

export const PURPOSE = 'Crear una web con un texto central que ponga ¿Quieres saber que es Uca? y un boton debajo para clickar y que viewComposer cree una web de que es Uca';

export const DEFAULT_QUESTION = '🧠 Conectando con la red neuronal cognitiva UCA...';
export const DEFAULT_BUTTON_LABEL = 'Descubrir qué es UCA';

export const DEFAULT_SIGNALS = [
    SignalType.CREATE,
    SignalType.UPDATE,
    SignalType.REMOVE,
    SignalType.EXPLAIN,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;
