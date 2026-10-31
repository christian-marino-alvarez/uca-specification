export const __ID__ = 'web-component';

export const AIM =
  'Gestionar el ciclo de vida de Custom Elements nativos, el renderizado en Light DOM y la delegación de eventos de interacción';

export const DEFAULT_TAG = 'ext-uca';

export const TAG_PREFIX = 'ext-uca-';

export const ELEMENT_TAGS: Readonly<Record<string, string>> = {
  access: 'a',
  action: 'button',
  choice: 'select',
  input: 'input',
  moment: 'input',
  picture: 'img',
  progress: 'progress',
  quantity: 'input',
  range: 'input',
  separator: 'hr',
  slider: 'input',
  toggle: 'input',
} as const;

export const INPUT_TAG = 'INPUT' as const;

export const DEFAULT_EVENTS: readonly string[] = [
  'click',
  'input',
  'change',
] as const;
