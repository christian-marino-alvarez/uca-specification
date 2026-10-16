import {
    DEFAULT_GEMINI_MODEL,
} from '@uca/capability-llm/constants';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { SignalType as ConnectionSignalType } from '@uca/capability-connection/types';
import { SignalType as InputSignalType } from '@uca/input/types';
import { SignalType as InteractionSignalType } from '@uca/interaction/types';
import { SignalType as SkeletonSignalType } from '@uca/skeleton/types';
import { SignalType as SseSignalType } from '@uca/capability-sse-client/types';
import { SignalType as TransformerSignalType } from '@uca/capability-stream-transformer/types';
import { SignalType } from './types.js';

export const __ID__ = 'view';

export const DEFAULT_CONFIGURATION = {
    provider: 'gemini',
    model: DEFAULT_GEMINI_MODEL,
} as const;

export const GOAL = 'Create a final composition of visual UCAs, logical UCAs, and declared reactive connections that fulfills the supplied purpose.';
export const RECOVERY_GOAL = 'Correct exactly one invalid final component entry and return only that corrected entry.';
export const INCOMPLETE_COMPOSITION_ERROR = 'The completed VIEW does not contain every required visual and logical UCA.';
export const VIEW_SKELETON_KIND = 'media';

export const INFERENCE_LIMITS = {
    finality: 'Create final visual and logical UCAs inside the target area. Do not create structural areas or reconsider the VIEW decision.',
    availability: 'Use only UCAs declared in availableUcas and preserve their exact catalog names and contracts.',
    identity: 'Treat context.design.identity as persistent brand context. In root or complete page views include its logo once through Picture using the exact source and alternative text. Never recreate, alter, or duplicate the asset.',
    hierarchy: 'A component parentId must reference the target area or a component emitted earlier in the ordered composition.',
    presentation: 'Use domain properties and semantic qualities whose token names and visual meaning come from context.design. Treat that design as authoritative for color, typography, spacing, dimensions, surfaces, and motion. Do not emit HTML tags, selectors, inline CSS, or platform attributes.',
    integration: 'Declare reactive connections between visual and logical UCAs. Do not centralize runtime events in View.',
    variants: 'Every entry must satisfy exactly one complete schema variant. Never combine the properties of one UCA with the name or kind of another.',
    routing: 'Every connection source must reference a declared visual identifier and one of its output signals; every target must reference declared Interaction logic and use interaction.handle.',
    autonomy: 'After construction, composed UCAs must collaborate directly through their declared reactive connections.',
    confirmation: 'A component is created only after its responsible UCA emits its creation confirmation.',
    fulfillment: 'Implement every explicit interface requirement in context.fulfillment and context.requirements with concrete available UCAs. Do not replace requested controls or interactions with explanatory text.',
    purpose: 'Every visual component, logical UCA, and connection must contribute directly to the supplied purpose.',
    order: 'Emit visual components in ascending order with containers before their children.',
    continuity: 'When context.composition is supplied, preserve every compatible component identifier, purpose, and visual structure. Keep the existing identity and input/action controls. Adapt only what the new browser context, design, or limits require.',
} as const;

export const CONNECTION_FORWARD_PROPERTIES = [
    'event',
    'value',
] as const;

export const RECOVERY_LIMITS = {
    output: 'Return one object whose only root property is the original entry identifier and whose value is the corrected entry. Never place entry fields at the root.',
    identity: 'Preserve the invalid component identifier unless it conflicts with an accepted identifier.',
    scope: 'Correct only the supplied invalid entry according to its schema and validation error.',
} as const;

export const LOGGER_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SseSignalType.STREAM,
    SseSignalType.STREAMED,
    SseSignalType.ERROR,
    TransformerSignalType.TRANSFORM,
    TransformerSignalType.TRANSFORMED,
    TransformerSignalType.RECOVER,
    TransformerSignalType.ERROR,
    ConnectionSignalType.CONFIGURE,
    ConnectionSignalType.CONNECTED,
    ConnectionSignalType.ERROR,
    ActionSignalType.EVENT,
    InputSignalType.EVENT,
    InteractionSignalType.HANDLE,
    InteractionSignalType.BIND,
    InteractionSignalType.BOUND,
    InteractionSignalType.INVOKED,
    InteractionSignalType.ERROR,
    SkeletonSignalType.RENDER,
    SkeletonSignalType.RENDERED,
    SkeletonSignalType.REMOVE,
    SkeletonSignalType.REMOVED,
    SkeletonSignalType.ERROR,
    SignalType.ELEMENT_CREATED,
    SignalType.COMPLETED,
    SignalType.ERROR,
];
