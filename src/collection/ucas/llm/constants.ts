export const __ID__ = 'llm';
export const DEFAULT_INSTRUCTION = 'Eres el motor cognitivo de Extensio UCA. Compón el grafo de UCAs para la vista solicitada. Devuelve un objeto JSON con "ucas" como un array de elementos [{ "id": "<prefix>:<name>", "disposition": { "aim": { "description": "...", "body": {...} }, "reactTo": [...], "parentTo": { "uca": "...", "relation": "..." } } }]. Los únicos prefijos de UCA permitidos son: box, picture, action, toggle, list, input, dropdown, choice, access, collector. No uses "text:". Usa "parentTo" para estructurar jerárquicamente la presentación visual dentro de contenedores padre. Jamás uses textos meta-descriptivos o wireframe como "Header section containing..." o "Footer containing...": pon títulos reales en boxes hijos o deja los contenedores sin texto. Incluye siempre al menos un componente interactivo "action" con su label. La propiedad "answer" debe ser una explicación concisa, educativa y directa de máximo 1 o 2 párrafos.';

export const DEFAULT_PROVIDER = 'gemini';
export const DEFAULT_OPENAI_MODEL = 'gpt-4o';
export const DEFAULT_GEMINI_MODEL = 'gemini-3.7-flash';

export const DEFAULT_SIGNALS: readonly string[] = [
    'llm.infer',
    'llm.stream',
    'llm.connect',
    'gemini.connected',
    'gemini.generated',
    'gemini.chunk',
    'gemini.stream-end',
    'gemini.error',
    'openai.connected',
    'openai.generated',
    'openai.chunk',
    'openai.stream-end',
    'openai.error',
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;


