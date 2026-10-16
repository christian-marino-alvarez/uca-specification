import {
    DEFAULT_GEMINI_MODEL,
} from '@uca/capability-llm/constants';

export const __ID__ = 'layout';
export const PARENT_SKELETON_KIND = 'container';

export const DEFAULT_CONFIGURATION = {
    provider: 'gemini',
    model: DEFAULT_GEMINI_MODEL,
} as const;

export const GOAL = 'Create the direct child areas needed to fulfill the supplied purpose within its context and limits.';

export const LAYOUT_REPAIR_REASON = 'The completed LAYOUT contains fewer direct child areas than required by its binding decision.';

export const RECOVERY_GOAL = 'Correct exactly one invalid structural area entry and return only that corrected entry.';

export const INFERENCE_LIMITS = {
    structure: 'Return one JSON object keyed by stable area identifier. Every value is one direct child area of the requested target and its name identifies the UCA responsible for managing it. Do not create descendants of those areas. Do not return HTML tags, final controls, final copy, or CSS declarations.',
    order: 'Emit the direct child areas in ascending order. The order property is their zero-based position inside the requested target.',
    coverage: 'Together, the direct child areas must cover the target purpose without duplicating functional responsibility.',
    decomposition: 'Define direct child areas by independent functional responsibility instead of conventional page position.',
    naming: 'Use function-based area identifiers. Do not use generic identifiers such as header, content, main, section, or footer unless that position is itself the declared functional purpose.',
    minimality: 'Create only the direct child areas needed to fulfill the target purpose while respecting the binding minimum.',
    atomicity: 'Give each child one coherent functional purpose that Builder can evaluate independently.',
    availability: 'Create only areas whose purpose can be materialized by the available web and logic UCAs. Use the exact catalog UCA name responsible for each area without creating final components.',
    brand: 'Keep context.design.identity available to every child purpose. Let the brand influence hierarchy and composition without creating duplicate identity areas or attempting to render its assets in LAYOUT.',
    design: 'For every area separate dimensions, spatial qualities, and visual design. Use only semantic values compatible with the declared design system. Physical rendering belongs to terminal capabilities.',
    limits: 'Respect every declared environmental and design limit, including columns, content width, accessibility, responsiveness, and performance.',
    identity: 'Each object key must equal the id of its area. Area identifiers must be unique direct children of the requested target identifier.',
    continuity: 'When a current composition is supplied, preserve every compatible area identifier and structure. Change only what the new browser context, design, aim, or limits require.',
    decision: 'The LAYOUT path is already decided. Do not reconsider it. Create at least the supplied minimumAreas.',
} as const;

export const RECOVERY_LIMITS = {
    output: 'Return one JSON object containing exactly one corrected area entry.',
    identity: 'Preserve the invalid entry identifier unless it conflicts with an already accepted identifier.',
    scope: 'Correct only the supplied invalid entry according to the schema and validation error.',
} as const;

export const INVALID_CORRELATION = 'Layout inference correlation does not match the creation request';
