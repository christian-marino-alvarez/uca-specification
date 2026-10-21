import type {
    CorePrinciple,
    FormalEntity,
    FormalRelation,
} from './types.js';

export const __ID__ = 'specification';

export const AIM =
    'Read, parse, and transform the UCA architectural specification from markdown into an ontological data model';

export const DEFAULT_SPECIFICATION_SOURCE = 'SPECIFICATION.es.md';

export const DEFAULT_WEB_SOURCE = '/SPECIFICATION.es.md';

export const DEFAULT_ENTITIES: readonly FormalEntity[] = [
    {
        domain: 'U',
        symbol: 'u',
        name: 'UCA',
        definition: 'Instancia conceptual de una Unidad Cognitiva Artificial (UCA)',
    },
    {
        domain: 'P',
        symbol: 'p',
        name: 'Purpose',
        definition: 'Propósito propio, explícito e invariante de una UCA que determina qué es y qué persigue',
    },
    {
        domain: 'D',
        symbol: 'd',
        name: 'Disposition',
        definition: 'Condiciones constitutivas, paramétricas e interactivas de las Capabilities',
    },
    {
        domain: 'C',
        symbol: 'c',
        name: 'Capability',
        definition: 'Recurso operacional concreto; delimita los límites de lo que la UCA puede hacer',
    },
    {
        domain: 'S',
        symbol: 's',
        name: 'Stimulus',
        definition: 'Recepción por una UCA de un cambio observable externo a su dominio que provoca su reacción',
    },
    {
        domain: 'O',
        symbol: 'o',
        name: 'Outcome',
        definition: 'Cambio observable estructurado producido por una UCA como consecuencia de su actividad',
    },
    {
        domain: 'Rxn',
        symbol: 'r',
        name: 'Reaction',
        definition: 'Proceso interno desencadenado por un Stimulus, compuesto por Actions y dinámica interna',
    },
    {
        domain: 'A',
        symbol: 'a',
        name: 'Action',
        definition: 'Operación o transición interna perteneciente a la Reaction encapsulada de la UCA',
    },
    {
        domain: 'Mut',
        symbol: 'μ',
        name: 'Mutation',
        definition: 'Cambio atómico identificable sobre la Disposition',
    },
] as const;

export const DEFAULT_RELATIONS: readonly FormalRelation[] = [
    {
        name: 'hasPurpose(u, p)',
        description: 'Afirma que la UCA u posee el propósito propio p (existencia de un único propósito invariante)',
    },
    {
        name: 'hasDisposition(u, d)',
        description: 'Afirma que la UCA u está predispuesta por la disposición efectiva d',
    },
    {
        name: 'hasCapability(u, c)',
        description: 'Afirma que la capacidad c pertenece al conjunto constitutivo de u',
    },
    {
        name: 'receives(u, Δx)',
        description: 'Afirma que la UCA u recibe mecánicamente en su frontera el cambio observable externo Δx',
    },
    {
        name: 'triggers(s, u)',
        description: 'Afirma que la recepción del estímulo externo s por u desencadena su proceso interno de reacción',
    },
    {
        name: 'produces(u, o)',
        description: 'Afirma que la reacción de la UCA u genera como consecuencia observable externa el outcome o',
    },
    {
        name: 'reactsTo(target, change)',
        description: 'Afirma una relación reactiva declarada donde una Capability responde a un cambio local observable',
    },
] as const;

export const DEFAULT_PRINCIPLES: readonly CorePrinciple[] = [
    {
        number: 1,
        title: 'Conception',
        statement: 'Conception determina qué UCA existe',
    },
    {
        number: 2,
        title: 'Purpose',
        statement: 'Purpose determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia',
    },
    {
        number: 3,
        title: 'Capabilities',
        statement: 'Capabilities determinan los límites de lo que la UCA puede hacer',
    },
    {
        number: 4,
        title: 'Disposition',
        statement: 'Disposition determina cómo esas Capabilities están constituidas y predispuestas para comportarse e interactuar',
    },
    {
        number: 5,
        title: 'Stimulus',
        statement: 'Stimulus es una señal externa a la frontera de la UCA cuya recepción provoca la reacción de una UCA ya concebida',
    },
    {
        number: 6,
        title: 'reactTo',
        statement: 'Las Capabilities reaccionan mediante su predisposición reactTo y no mediante dependencias directas ni pipelines centrales',
    },
    {
        number: 7,
        title: 'Process y Actions',
        statement: 'El Process y las Actions emergen dinámicamente de las relaciones reactivas locales entre Capabilities conforme a sus Dispositions',
    },
    {
        number: 8,
        title: 'Outcome',
        statement: 'Outcome es la consecuencia observable de dicha actividad, validada ontológicamente de forma inmutable',
    },
    {
        number: 9,
        title: 'Evolution',
        statement: 'Evolution modifica la Disposition sin abandonar el Purpose ni los límites de las Capabilities',
    },
    {
        number: 10,
        title: 'Mutation',
        statement: 'La unidad mínima de Evolution es una Mutation atómica, limitada, observable y potencialmente reversible',
    },
] as const;
