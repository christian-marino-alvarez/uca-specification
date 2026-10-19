import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { SignalType } from './types.js';

export const __ID__ = 'options';

export const SIGNALS: Readonly<Record<string, string>> = {
    [ChoiceSignalType.RENDER]: SignalType.RENDER,
    [ChoiceSignalType.UPDATE]: SignalType.UPDATE,
    [ChoiceSignalType.REMOVE]: SignalType.REMOVE,
    [ChoiceSignalType.CREATED]: SignalType.CREATED,
    [ChoiceSignalType.UPDATED]: SignalType.UPDATED,
    [ChoiceSignalType.REMOVED]: SignalType.REMOVED,
    [ChoiceSignalType.CHANGED]: SignalType.EVENT,
    [ChoiceSignalType.ERROR]: SignalType.ERROR,
};
