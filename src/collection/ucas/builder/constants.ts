import { Kind } from '@uca/decision/types';
import type { Item } from '@uca/decision/types';
import { Kind as CatalogKind } from '@uca/capability-catalog/types';
import { SignalType as CatalogSignalType } from '@uca/capability-catalog/types';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import {
    Path,
    SignalType,
} from './types.js';

export const __ID__ = 'builder';
export const MINIMUM_LAYOUT_AREAS = 2;
export const INVALID_LAYOUT_ERROR = 'A LAYOUT decision must create at least two direct child areas';
export const DECISION_QUESTION = 'To fulfill the aim of this area with the available web and logic UCAs, must it be decomposed into multiple independently managed child areas, or can it be represented directly as one final view?';

export const CATALOG_KINDS = [
    CatalogKind.WEB,
    CatalogKind.LOGIC,
] as const;

export const DECISION_ITEMS: Item[] = [
    {
        id: Path.LAYOUT,
        data: {
            criterion: 'Choose when fulfilling the area aim requires at least two direct child areas with independent functional purposes.',
        },
    },
    {
        id: Path.VIEW,
        data: {
            criterion: 'Choose when the area aim can be represented directly as one final view with the available web and logic UCAs.',
        },
    },
];

export const DECISION_REQUEST = {
    type: Kind.SELECTION,
    question: DECISION_QUESTION,
    items: DECISION_ITEMS,
};

export const LOGGER_SIGNALS: readonly string[] = [
    SignalType.BUILD,
    CatalogSignalType.LISTED,
    DecisionSignalType.DECIDE,
    DecisionSignalType.DECIDED,
    DecisionSignalType.ERROR,
    LayoutSignalType.CREATE,
    LayoutSignalType.REPAIR,
    LayoutSignalType.COMPLETED,
    LayoutSignalType.ERROR,
    ViewSignalType.CREATE,
    ViewSignalType.COMPLETED,
    ViewSignalType.ERROR,
    SignalType.VIEW_COMPLETED,
    SignalType.ERROR,
];
