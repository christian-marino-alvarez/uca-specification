import { Moment } from '../index.js';
import { SignalType } from '../types.js';
import { verifyPrimitive } from '../../../../../tests/shared/primitive.js';

verifyPrimitive({
    create: () => new Moment(),
    disposition: Moment.disposition,
    signals: SignalType,
    body: {
        label: "Date",
        value: "2026-10-19",
    },
    patch: {
        value: "2026-10-20",
    },
    tag: 'input',
    updatedTag: 'input',
});
