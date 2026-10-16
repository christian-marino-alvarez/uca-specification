import { z } from 'zod';
import { DESIGN_TOKENS } from '@uca/capability-css/constants';
import { createContextSchema } from '@uca/llm/schema';
import { outputSchema } from './schema.js';
import { GOAL, LIMITS } from './constants.js';
import type { DesignPayload, Request } from './types.js';
export const createRequest = ({ areaId, purpose, brief, interaction, previousIdentity, correlationId }: DesignPayload): Request => ({
    outputSchema: z.toJSONSchema(outputSchema), contextSchema: createContextSchema({ areaId, purpose, brief, tokens: DESIGN_TOKENS, ...(interaction !== undefined && { interaction }), ...(previousIdentity && { previousIdentity }) }), purpose, goal: GOAL, limits: LIMITS, correlationId,
});
