import type { CapabilityConstructor } from '@uca/core/types';
import type { Uca } from '@uca/core/uca';
import { getOutputJsonSchema } from '@uca/capability-graph';

const UCA_BODY_SPECS: Record<string, string> = {
    box: 'aim.body: { text?: string, role?: string, className?: string } (roles: "header"|"main"|"card"|"footer")',
    picture: 'aim.body: { source: string, alt?: string, dimensions?: { width?: number|string, height?: number|string } }',
    action: 'aim.body: { label: string, title?: string, disabled?: boolean, className?: string } -> Emits "<id>.triggered"',
    toggle: 'aim.body: { label?: string, checked?: boolean, title?: string, disabled?: boolean } -> Emits "<id>.changed"',
    list: 'aim.body: { items: string[], ordered?: boolean, text?: string, spacing?: string|number }',
    input: 'aim.body: { placeholder?: string, value?: string, disabled?: boolean } -> Emits "<id>.changed"',
    dropdown: 'aim.body: { items: string[], value?: string, placeholder?: string } -> Emits "<id>.change"',
    choice: 'aim.body: { options: (string | { value: string, label: string })[], selected?: string[], multiple?: boolean } -> Emits "<id>.selected"',
    access: 'aim.body: { source: string, label: string, title?: string } (navigation link)',
    collector: 'aim.body: { name?: string, title?: string } (form container) -> Emits "<id>.submitted", "<id>.resetted"',
};

const VIEW_GUIDELINES: readonly string[] = [
    'VIEW COMPOSITION & HIERARCHY GUIDELINES:',
    '1. STRICT UCA PREFIXES (ONLY USE THE 10 CATALOG UCAs):',
    '   - You MUST ONLY use the following prefixes for IDs: box, picture, action, toggle, list, input, dropdown, choice, access, collector.',
    '   - DO NOT invent new prefixes such as "text:", "button:", "div:", "form:". Text is placed inside Box (aim.body.text), Action (aim.body.label), or List (aim.body.items).',
    '2. PARENTTO STRUCTURAL NESTING:',
    '   - Build a coherent visual DOM tree using "parentTo": { "uca": "<parentUcaId>", "relation": "<role>" }.',
    '   - Root containers (e.g. "box:root", "box:hero", "collector:form") OMIT parentTo.',
    '   - Nested children MUST specify parentTo pointing to their parent container ID.',
    '   - The relation describes the visual role (e.g. "header", "content", "media", "action", "child").',
    '3. IMAGINATIVE MULTI-UCA COMPOSITION & MANDATORY AIM.BODY:',
    '   - Freely use all 10 available Web UCAs: Box, Picture, Action, Toggle, List, Input, Dropdown, Choice, Access, Collector.',
    '   - Always populate "aim.body" with rich content according to each UCA specification (e.g. for Box: { "text": "..." }, for Action: { "label": "..." }, for List: { "items": [...] }).',
    '   - Design rich components: hero banners with Picture, cards with Box, form groups with Collector, interactive buttons with Action, switches with Toggle, nav links with Access, and features with List.',
    '4. REACTIVE EVENT WIRING:',
    '   - Wire interactions using reactTo: ["<producerUcaId>.<outcome>"] (e.g. ["action:search.triggered", "toggle:theme.changed"]).',
    '   - NEVER subscribe a UCA to its own signals.',
];

export function formatUcaSpecification(prefix: string, UcaClass: CapabilityConstructor): string {
    const TargetClass = UcaClass as unknown as typeof Uca;
    const { purpose } = TargetClass;
    const bodySpec = UCA_BODY_SPECS[prefix] ?? 'aim.body: Record<string, unknown>';
    return `- ${TargetClass.name} (prefix "${prefix}:<id>"):\n  Purpose: ${purpose}\n  Spec: ${bodySpec}`;
}

export function buildCatalogSpecification(catalog: Record<string, CapabilityConstructor>): string {
    const lines = Object.entries(catalog).map(([prefix, UcaClass]) => {
        return formatUcaSpecification(prefix, UcaClass);
    });
    return `Available UCAs Catalog (Fractal Cooky):\n${lines.join('\n')}`;
}

export function getViewGuidelines(): string {
    return VIEW_GUIDELINES.join('\n');
}

export { getOutputJsonSchema };

export function buildCompositionPrompt(
    request: string,
    catalog: Record<string, CapabilityConstructor>,
    documentation?: string,
): string {
    const catalogSpec = buildCatalogSpecification(catalog);
    const guidelines = getViewGuidelines();
    const schema = getOutputJsonSchema();
    const context = documentation ? `${documentation}\n\n` : '';
    return `${context}${catalogSpec}\n\n${guidelines}\n\nTask: ${request}\n\nOUTPUT JSON SCHEMA (defined with Zod):\n${schema}`;
}
