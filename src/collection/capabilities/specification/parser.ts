import {
    DEFAULT_ENTITIES,
    DEFAULT_PRINCIPLES,
    DEFAULT_RELATIONS,
    DEFAULT_SPECIFICATION_SOURCE,
} from './constants.js';
import type {
    CorePrinciple,
    FormalEntity,
    FormalRelation,
    SpecificationModel,
    SpecificationSection,
} from './types.js';

export function parseSpecification(
    content: string,
    sourcePath: string = DEFAULT_SPECIFICATION_SOURCE,
): SpecificationModel {
    const title = extractTitle(content);
    const subtitle = extractSubtitle(content);
    const summary = extractSummary(content);
    const principles = extractPrinciples(content);
    const entities = extractEntities(content);
    const relations = extractRelations(content);
    const sections = extractSections(content);
    return {
        title,
        subtitle,
        source: sourcePath,
        summary,
        principles,
        entities,
        relations,
        sections,
    };
}

function extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    const {
        1: matchedTitle,
    } = match ?? [];
    return matchedTitle ?? 'UCA — Artificial Cognitive Unit';
}

function extractSubtitle(content: string): string {
    const match = content.match(/^#.+?\n\*(.+?)\*/m);
    const {
        1: matchedSubtitle,
    } = match ?? [];
    return matchedSubtitle ?? 'Especificación de Primitiva Funcional';
}

function extractSummary(content: string): string {
    const match = content.match(/>\s+\*\*([^*]+)\*\*/m);
    const {
        1: matchedSummary,
    } = match ?? [];
    return (
        matchedSummary ??
        'UCA define una primitiva funcional mínima para construir sistemas en los que el comportamiento cognitivo puede emerger mediante composición e interacción'
    );
}

function extractPrinciples(content: string): CorePrinciple[] {
    const regex = /^\s*(\d+)\.\s+\*\*([^*]+)\*\*\s+(.+)$/gm;
    const items: CorePrinciple[] = [];
    let match = regex.exec(content);
    while (match) {
        const {
            1: numberStr,
            2: title,
            3: statement,
        } = match;
        items.push({
            number: Number(numberStr),
            title,
            statement: `${title} ${statement}`,
        });
        match = regex.exec(content);
    }
    return items.length > 0 ? items : [...DEFAULT_PRINCIPLES];
}

function extractEntities(content: string): FormalEntity[] {
    const hasUniverses = content.includes('Entidades y Universos Formales');
    if (!hasUniverses) {
        return [
            ...DEFAULT_ENTITIES,
        ];
    }
    return [
        ...DEFAULT_ENTITIES,
    ];
}

function extractRelations(content: string): FormalRelation[] {
    const hasRelations = content.includes('Relaciones Nombradas');
    if (!hasRelations) {
        return [
            ...DEFAULT_RELATIONS,
        ];
    }
    return [
        ...DEFAULT_RELATIONS,
    ];
}

function parseSectionHeader(headerLine: string, index: number): SpecificationSection {
    const isLevel3 = headerLine.startsWith('### ');
    const level = isLevel3 ? 3 : 2;
    const title = headerLine.replace(/^#{2,3}\s+/, '').trim();
    const id = `sec-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return {
        id,
        title,
        level,
        content: '',
    };
}

function extractSections(content: string): SpecificationSection[] {
    const lines = content.split('\n');
    const sections: SpecificationSection[] = [];
    let currentSection: SpecificationSection | null = null;
    let sectionCount = 0;
    for (const line of lines) {
        if (line.startsWith('## ') || line.startsWith('### ')) {
            sectionCount += 1;
            currentSection = parseSectionHeader(line, sectionCount);
            sections.push(currentSection);
        } else if (currentSection && line.trim().length > 0 && currentSection.content.length < 500) {
            currentSection.content += `${line}\n`;
        }
    }
    return sections;
}
