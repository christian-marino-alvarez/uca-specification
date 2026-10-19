import { Progress } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Progress(),
    disposition: Progress.disposition,
    signals: SignalType,
    body: {
        label: "Task",
        value: 20,
        total: 100,
    },
    patch: {
        value: 60,
    },
    tag: 'progress',
    updatedTag: 'progress',
});
