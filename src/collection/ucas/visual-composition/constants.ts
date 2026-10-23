export const __ID__ = 'visual-composition';

export const VISUAL_DOMAIN_NAMES = [
    'direction',
    'division',
    'gap',
    'spacing',
    'spacingInline',
    'spacingBlock',
    'marginInline',
    'marginBlock',
    'order',
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'flex',
    'span',
    'alignment',
    'distribution',
    'wrap',
    'overflow',
    'surface',
    'outline',
    'outlineTop',
    'outlineRight',
    'outlineBottom',
    'outlineLeft',
    'shape',
    'elevation',
    'textColor',
    'textSize',
    'fontWeight',
    'lineHeight',
    'textAlign',
] as const;

export const PLAN_PURPOSE = 'Select visual domain names from a finite CSS catalog' as const;
export const PLAN_GOAL = 'Select only the CSS domain names required by each node to satisfy its purpose and intention.' as const;
export const PLAN_INSTRUCTIONS = `Return a plan keyed by structural node id. Each value is an array containing only justified names from: ${VISUAL_DOMAIN_NAMES.join(', ')}. Select domain names, never CSS values. For every node with two or more direct children, include gap, spacing, or marginBlock. Select direction or division, never both. Include surface and textColor together whenever a node visibly contains text.` as const;
export const VISUAL_GOAL_DIRECTIVE = 'Preserve the supplied structure exactly. Assign qualities only for domain names selected in visualPlan. For nodes with two or more direct children, choose one separation quality: gap, spacing, or marginBlock. Choose direction or division, never both. Pair every visible surface with a contrasting textColor: dark on light brand or accent surfaces; light or muted on dark surfaces.' as const;
