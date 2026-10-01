import { App, SignalType as AppSignalType } from '../collection/ucas/app/index.js';
import { Box } from '../collection/ucas/box/index.js';
import { SignalType as BoxSignalType } from '../collection/ucas/box/types.js';
import { Input } from '../collection/ucas/input/index.js';
import { SignalType as InputSignalType } from '../collection/ucas/input/types.js';
import { Action } from '../collection/ucas/action/index.js';
import { SignalType as ActionSignalType } from '../collection/ucas/action/types.js';
import { ViewComposer, SignalType as ViewComposerSignalType } from '../collection/ucas/view-composer/index.js';
import { SignalType as JevSignalType } from '../collection/capabilities/jev/index.js';

export { App, Box, Input, Action, ViewComposer };

export const SignalType = {
    ...AppSignalType,
    BOX_CREATE: BoxSignalType.CREATE,
    BOX_UPDATE: BoxSignalType.UPDATE,
    INPUT_CREATE: InputSignalType.CREATE,
    INPUT_UPDATE: InputSignalType.UPDATE,
    INPUT_CHANGE: InputSignalType.CHANGE,
    ACTION_CREATE: ActionSignalType.CREATE,
    ACTION_TRIGGER: ActionSignalType.TRIGGER,
    VIEW_COMPOSE: ViewComposerSignalType.COMPOSE,
    VIEW_COMPOSED: ViewComposerSignalType.COMPOSED,
    JEV_CONNECT: JevSignalType.CONNECT,
    JEV_INFER: JevSignalType.INFER,
};
