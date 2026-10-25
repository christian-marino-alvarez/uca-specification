import { z } from 'zod';
import { qualitiesSchema } from '@uca/capability-css/schema';

export const identitySchema = z.object({
    elementId: z.string().min(1).optional(),
    parentId: z.string().min(1).optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    qualities: qualitiesSchema.optional(),
    context: z.unknown().optional(),
});

export const areaContainerDimensionsSchema = z.object({
    width: z.string().optional().describe('Anchura espacial del contenedor (ej. full, compact, regular, sidebar, wide, auto o medida dimensional)'),
    height: z.string().optional().describe('Altura espacial del contenedor (ej. full, header, footer, screen, auto o medida dimensional)'),
    flex: z.string().optional().describe('Comportamiento flex en el flujo padre (ej. none, initial, auto, fill, grow, shrink)'),
    minWidth: z.string().optional().describe('Anchura minima permitida para el area contenedora'),
    maxWidth: z.string().optional().describe('Anchura maxima delimitada para el area contenedora'),
    minHeight: z.string().optional().describe('Altura minima permitida para el area contenedora'),
    maxHeight: z.string().optional().describe('Altura maxima delimitada para el area contenedora'),
    aspectRatio: z.string().optional().describe('Proporcion o relacion de aspecto (ej. 16/9, 1/1, auto)'),
}).passthrough().describe('Propiedades dimensionales y restricciones espaciales del area contenedora padre');

export const limitsSchema = z.record(
    z.string(),
    z.unknown(),
).default({}).describe('Límites operativos, dimensionales, de viewport y restricciones espaciales del contexto');

export const webContextSchema = z.object({
    containerId: z.string().min(1).describe('Identificador unico de la UCA contenedora padre directa en la jerarquia (ej. root, header, sidebar, workspace)'),
    areaId: z.string().optional().describe('Identificador del area asignada para renderizar los componentes'),
    areaContainerDimensions: areaContainerDimensionsSchema.describe('Objeto con las propiedades dimensionales del area contenedora padre'),
    webCapabilitiesAvailables: z.union([
        z.array(z.string()),
        z.array(z.record(z.string(), z.unknown())),
    ]).default([]).describe('Coleccion de capabilities y descriptores ontológicos de Web UCAs activas en el catalogo disponibles para construir la composicion'),
    visualIntention: z.string().min(1).describe('Estrategia de manifestacion visual y directriz de comportamiento espacial dictada por el contenedor padre'),
    disposicionEspacial: z.string().optional().describe('Ubicación y anclaje espacial respecto al contenedor padre y áreas hermanas'),
    disposicionInformacion: z.string().optional().describe('Naturaleza y alcance semántico de la información a albergar en el área'),
    styleDomains: z.array(z.string()).default([]).describe('Coleccion de dominios atomicos del sistema de diseño (typography, palette, spacing, border, elevation, layout) disponibles para construir el componente web'),
    theme: z.string().optional().describe('Modo de tema cromático activo en el sistema de diseño (light o dark)'),
    contrastRule: z.string().optional().describe('Regla de contraste: en superficies claras usar textColor dark/brand; en superficies oscuras usar textColor light'),
    limits: limitsSchema,
}).describe('Contexto operativo y ambiental estandarizado para la composicion de componentes en UCAs Web');

export const jsonSchemaObject = z.record(z.string(), z.unknown());

export const signalBodySchema = z.object({
    id: z.string().min(1).describe('Identificador de la UCA que crea y transmite este cuerpo de señal'),
    purpose: z.string().min(1).describe('Proposito ontologico fundamental de la UCA identificado en su clase'),
    intention: z.string().min(1).describe('Intencion operativa o directriz de comportamiento de la UCA identificada en su disposicion'),
    outputSchema: z.union([
        z.instanceof(z.ZodType),
        jsonSchemaObject,
    ]).describe('Esquema formal (instancia Zod o especificacion JSON Schema) de la respuesta o estructura esperada'),
    context: z.record(z.string(), z.unknown()).describe('Contexto de la disposicion y hechos de dominio de la UCA identificado en su aim'),
    contextSchema: jsonSchemaObject.optional().describe('Especificacion JSON Schema opcional que define semanticamente cada clave del contexto para inferencias cognitivas'),
}).describe('Cuerpo de señal estandarizado para el transporte e intercambio determinista entre UCAs');

export const webSignalBodySchema = signalBodySchema.extend({
    context: webContextSchema.describe('Contexto web estructurado con contenedor, dimensiones, capacidades disponibles y dominios de estilo'),
}).describe('Cuerpo de señal estandarizado especializado para la comunicacion e inferencia en UCAs Web');

export const signalSchema = z.object({
    source: z.string().min(1).describe('Identificador de la entidad emisora'),
    sourceKind: z.enum(['UCA', 'CAPABILITY', 'EXTERNAL']).optional().describe('Naturaleza ontológica de la entidad emisora'),
    targetId: z.string().optional().describe('Identificador opcional de la entidad destino'),
    property: z.string().min(1).describe('Propiedad, evento o estímulo nervioso transmitido'),
    value: z.unknown().describe('Cuerpo o payload transportado dentro de la señal (Body)'),
    timestamp: z.number().optional().describe('Marca temporal de emisión en milisegundos'),
    sessionId: z.string().optional().describe('Identificador único de sesión y trazabilidad nerviosa de la señal a nivel de transporte'),
}).describe('Esquema formal del sobre de transporte Signal para la comunicación nerviosa');
