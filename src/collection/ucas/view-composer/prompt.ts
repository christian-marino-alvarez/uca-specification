import type { CapabilityConstructor } from '@uca/core/types';
import type { Uca } from '@uca/core/uca';

export function formatUcaSpecification(prefix: string, UcaClass: CapabilityConstructor): string {
    const TargetClass = UcaClass as unknown as typeof Uca;
    const { purpose, disposition } = TargetClass;
    const outputs = disposition?.outputs?.map((out) => `"${prefix}:<id>.${out.signal}"`) ?? [];
    const outputsStr = outputs.length > 0 ? outputs.join(', ') : 'none';
    return `- ${TargetClass.name} (prefix "${prefix}:<id>"): ${purpose}\n  Emits outcomes: ${outputsStr}`;
}

export function buildCatalogSpecification(catalog: Record<string, CapabilityConstructor>): string {
    const lines = Object.entries(catalog).map(([prefix, UcaClass]) => {
        return formatUcaSpecification(prefix, UcaClass);
    });
    return `Available UCAs Catalog (Fractal Cooky):\n${lines.join('\n')}`;
}

export function getViewGuidelines(): string {
    const lines = [
        'VIEW IMAGINATION GUIDELINES:',
        '- Imagine and compose an engaging, didactic view hierarchy from scratch.',
        '- Assign unique descriptive IDs (e.g. "box:hero", "picture:logo", "action:start").',
        '- Connect interactive triggers with real reactTo subscriptions (e.g. reactTo: ["action:start.triggered"]).',
        '- Use "parentTo": { "uca": "<parentUcaId>", "relation": "..." } for visual nesting inside parent containers.',
    ];
    return lines.join('\n');
}

export function getOutputJsonSchema(): string {
    return `OUTPUT JSON SCHEMA (Strict response format):
{
  "data": {
    "ucas": [
      {
        "id": "<prefix>:<uniqueName>",
        "disposition": {
          "aim": { "description": string, "body": { ...valid keys for UCA... } },
          "reactTo": ["<producerUcaId>.<emittedOutcome>"],
          "parentTo": { "uca": "<parentUcaId>", "relation": "<description>" }
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
}

export function buildCompositionPrompt(
    request: string,
    catalog: Record<string, CapabilityConstructor>,
    documentation?: string,
): string {
    const catalogSpec = buildCatalogSpecification(catalog);
    const guidelines = getViewGuidelines();
    const schema = getOutputJsonSchema();
    const context = documentation ? `${documentation}\n\n` : '';
    return `${context}${catalogSpec}\n\n${guidelines}\n\nTask: ${request}\n\n${schema}`;
}
