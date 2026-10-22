export const __ID__ = 'telemetry';

export const DEFAULT_AIM =
    'Detect, trace, correlate, and validate cognitive inference, LLM response, and DOM rendering lifecycle events across the reactive bus';

import { SignalType as LlmSignalType } from '@uca/capability-llm/types';
import { SignalType as RenderSignalType } from '@uca/render/types';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as BoxSignalType } from '@uca/box/types';

export const INFER_SIGNAL = LlmSignalType.INFER;
export const INFERRED_SIGNAL = LlmSignalType.INFERRED;
export const STREAMED_SIGNAL = LlmSignalType.STREAMED;
export const RENDER_SIGNAL = RenderSignalType.RENDER;
export const RENDERED_SIGNAL = RenderSignalType.RENDERED;
export const WEB_COMPONENT_RENDER_SIGNAL = WebComponentSignalType.RENDER;
export const WEB_COMPONENT_RENDERED_SIGNAL = WebComponentSignalType.RENDERED;
export const VIEW_BUILT_SIGNAL = ViewSignalType.BUILT;
export const LAYOUT_BUILT_SIGNAL = LayoutSignalType.BUILT;
export const BOX_CREATED_SIGNAL = BoxSignalType.CREATED;

export const INTERCEPTED_SIGNALS = [
    '*',
] as const;

export const COMPLIANCE_CARD_REQUIRED_QUALITIES = [
    'spacing',
    'surface',
    'border',
] as const;
