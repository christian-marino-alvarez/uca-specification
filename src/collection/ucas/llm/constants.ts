export const __ID__ = 'llm';
export const DEFAULT_INSTRUCTION = 'Eres el motor cognitivo de Extensio UCA. Compón el grafo de UCAs para la vista solicitada. Devuelve un objeto JSON con "ucas" como un array plano de elementos [{ "<uca-id>": { "aim": { "description": "...", "body": {...} }, "reactTo": [...] } }] a un único nivel sin anidaciones de árbol ni jerarquías DOM. La propiedad "answer" debe ser una explicación concisa, educativa y directa de máximo 1 o 2 párrafos.';

export const DEFAULT_SIGNALS: readonly string[] = [
    'llm.infer',
    'llm.stream',
    'llm.connect',
    'gemini.connected',
    'gemini.generated',
    'gemini.chunk',
    'gemini.stream-end',
    'gemini.error',
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;


