import { z, type ZodType } from 'zod';
import { Box, bodySchema as boxBodySchema, emittedSignals as boxEmittedSignals } from '@uca/box';
import { Action, bodySchema as actionBodySchema, emittedSignals as actionEmittedSignals } from '@uca/action';
import { List, bodySchema as listBodySchema, emittedSignals as listEmittedSignals } from '@uca/list';
import { Toggle, bodySchema as toggleBodySchema, emittedSignals as toggleEmittedSignals } from '@uca/toggle';
import { Picture, bodySchema as pictureBodySchema, emittedSignals as pictureEmittedSignals } from '@uca/picture';
import { Input, bodySchema as inputBodySchema, emittedSignals as inputEmittedSignals } from '@uca/input';
import { Dropdown, bodySchema as dropdownBodySchema, emittedSignals as dropdownEmittedSignals } from '@uca/dropdown';
import { Choice, bodySchema as choiceBodySchema, emittedSignals as choiceEmittedSignals } from '@uca/choice';
import type { UcaSchemaDefinition } from './types.js';

interface JsonSchemaProperty {
    readonly type?: string | string[];
    readonly enum?: readonly string[];
    readonly items?: { readonly type?: string };
}

function formatArrayOrPrimitiveType(type?: string | string[], items?: { readonly type?: string }): string {
    if (type === 'array' && items?.type) {
        return `${items.type}[]`;
    }
    return typeof type === 'string' ? type : 'unknown';
}

function formatPropertyType(property: JsonSchemaProperty): string {
    const { enum: enumValues, type, items } = property;
    if (enumValues) {
        return enumValues.map((val) => `'${val}'`).join(' | ');
    }
    if (Array.isArray(type)) {
        return type.join(' | ');
    }
    return formatArrayOrPrimitiveType(type, items);
}

function formatPropertyEntries(properties: Record<string, JsonSchemaProperty>): string[] {
    return Object.entries(properties).map(([key, property]) => {
        const typeDescription = formatPropertyType(property);
        return `${key}?: ${typeDescription}`;
    });
}

export function formatSchemaShape(bodySchema: ZodType): string {
    const jsonSchema = z.toJSONSchema(bodySchema) as { properties?: Record<string, JsonSchemaProperty> };
    const { properties = {} } = jsonSchema;
    const formattedEntries = formatPropertyEntries(properties);
    return `{ ${formattedEntries.join(', ')} }`;
}

function formatEmittedSignals(prefix: string, emittedSignals?: readonly string[]): string {
    const signals = emittedSignals ?? [];
    if (signals.length === 0) {
        return 'none';
    }
    const formattedSignals = signals.map((signal) => `"${prefix}:<id>.${signal}"`);
    return formattedSignals.join(', ');
}

export function formatDefinitionForPrompt(definition: UcaSchemaDefinition): string {
    const { name, prefix, description, bodySchema, emittedSignals } = definition;
    const shape = formatSchemaShape(bodySchema);
    const emits = formatEmittedSignals(prefix, emittedSignals);
    return `- ${name} (prefix "${prefix}:<id>"): ${description}\n  Allowed aim.body: ${shape}\n  Emits outcomes: ${emits}`;
}

export function buildDynamicCatalogSpecification(definitions: Iterable<UcaSchemaDefinition>): string {
    const lines = Array.from(definitions).map((definition) => formatDefinitionForPrompt(definition));
    return `Available UCAs Catalog (Dynamic Schemas):\n${lines.join('\n')}`;
}

function createStructuralDefinitions(): UcaSchemaDefinition[] {
    return [
        { name: 'Box', prefix: 'box', description: 'Visual container and textual projection', bodySchema: boxBodySchema, emittedSignals: boxEmittedSignals, constructor: Box },
        { name: 'Picture', prefix: 'picture', description: 'Visual architectural diagram or illustration', bodySchema: pictureBodySchema, emittedSignals: pictureEmittedSignals, constructor: Picture },
        { name: 'List', prefix: 'list', description: 'Ordered or unordered items sequence', bodySchema: listBodySchema, emittedSignals: listEmittedSignals, constructor: List },
    ];
}

function createInteractiveDefinitions(): UcaSchemaDefinition[] {
    return [
        { name: 'Action', prefix: 'action', description: 'Interactive button trigger', bodySchema: actionBodySchema, emittedSignals: actionEmittedSignals, constructor: Action },
        { name: 'Toggle', prefix: 'toggle', description: 'Binary on/off switch toggle', bodySchema: toggleBodySchema, emittedSignals: toggleEmittedSignals, constructor: Toggle },
        { name: 'Input', prefix: 'input', description: 'Text input capture', bodySchema: inputBodySchema, emittedSignals: inputEmittedSignals, constructor: Input },
        { name: 'Dropdown', prefix: 'dropdown', description: 'Selectable items dropdown', bodySchema: dropdownBodySchema, emittedSignals: dropdownEmittedSignals, constructor: Dropdown },
        { name: 'Choice', prefix: 'choice', description: 'Multi/single option choice selector', bodySchema: choiceBodySchema, emittedSignals: choiceEmittedSignals, constructor: Choice },
    ];
}

export function createDefaultUcaDefinitions(): UcaSchemaDefinition[] {
    const structural = createStructuralDefinitions();
    const interactive = createInteractiveDefinitions();
    return [...structural, ...interactive];
}
