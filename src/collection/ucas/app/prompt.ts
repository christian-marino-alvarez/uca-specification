import { UCA_ARCHITECTURE_DOCUMENTATION } from './docs.js';

export function buildAppPrompt(request: string, documentation?: string): string {
    const context = documentation ?? UCA_ARCHITECTURE_DOCUMENTATION;
    const guidelines = `VIEW IMAGINATION GUIDELINES:
- Imagine and compose an engaging, didactic view hierarchy for developers from scratch. Do not use any hardcoded structure.
- Assign unique descriptive IDs (e.g. "box:hero", "picture:architecture", "list:advantages", "list:strengths", "box:what-is-not-uca", "action:explore").
- Connect interactive triggers with real reactTo subscriptions (e.g. reactTo: ["action:explore.triggered"]).
- Use "parentTo": { "uca": "<parentUcaId>", "relation": "..." } for structural visual nesting inside parent containers. Root containers omit parentTo.`;

    const schema = `OUTPUT JSON SCHEMA (Strict response format):
{
  "data": {
    "ucas": [
      {
        "id": "<prefix>:<uniqueName>",
        "disposition": {
          "aim": { "description": string, "body": { ...valid keys for UCA... } },
          "reactTo": ["<producerUcaId>.<emittedOutcome>"],
          "parentTo": { "uca": "<parentUcaId>", "relation": "<description of relation>" }
        }
      }
    ],
    "answer": "<concise explanation>"
  },
  "error": null,
  "metadata": {}
}

CRITICAL RULES:
1. reactTo: external signals from OTHER UCAs (e.g. ["action:explore.triggered"]). Empty array [] if no trigger.
2. parentTo: structural visual hierarchy { "uca": "<parentUcaId>", "relation": "child" }. Omit on root containers.
3. FORBIDDEN: NEVER put a UCA's own name in its reactTo.`;

    return `${context}\n\n${guidelines}\n\nTask: ${request}\n${schema}`;
}
