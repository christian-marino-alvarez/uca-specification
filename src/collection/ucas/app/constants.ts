import { DataType, SignalType } from './types.js';

export const __ID__ = 'app';

export const DEFAULT_CONTEXT = [
    'Interfaz oficial de UCA estructurada como un IDE moderno tipo Cursor o Antigravity.',
    'Disposición espacial elegante en modo oscuro con barra de actividad vertical estrecha, panel lateral de navegación de conceptos ontológicos, área central de trabajo para la explicación interactiva y barra/consola inferior de estado y señales.',
    'Diseño profesional, limpio y directo, sin secciones sobredimensionadas ni decoraciones superfluas.',
].join(' ');

export const INPUTS = [] as const;
export const OUTPUTS = [
    { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Application error notification' },
] as const;
