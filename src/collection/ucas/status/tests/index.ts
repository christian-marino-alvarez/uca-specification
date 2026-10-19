import { Status } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Status(),
    disposition: Status.disposition,
    signals: SignalType,
    body: {
        text: "Ready",
        tone: "success",
    },
    patch: {
        text: "Waiting",
        tone: "neutral",
    },
    tag: 'output',
    updatedTag: 'output',
});
