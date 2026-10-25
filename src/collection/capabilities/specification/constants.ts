import type {
    Audience,
    DomainEntity,
    ExperienceScenario,
    FunctionalDesign,
    GraphicDesign,
    InformationDisposition,
    SpecificationModel,
    UserExperience,
} from './types.js';

export const __ID__ = 'specification';

export const AIM =
    'Provide the ontological, functional, and experiential specification model of the application to cognitive agents and models';

export const DEFAULT_AUDIENCE: Audience = {
    profile: [
        'Desarrolladores',
        'Diseñadores',
        'Arquitectos de Software e IA',
    ],
    cognitiveGoal:
        'Comprobar empíricamente que la arquitectura UCA es un paradigma real, reactivo y viable para sistemas cognitivos.',
};

export const DEFAULT_SCENARIOS: readonly ExperienceScenario[] = [
    {
        name: 'Inspección de Reactividad y Señales',
        context: 'Desarrolladores analizando el flujo de eventos, estímulos y pulsos nerviosos',
        perceptionGoal: 'Verificar la ausencia de callbacks imperativos y comprobar la trazabilidad pura de Signals',
    },
    {
        name: 'Validación de Invariantes Arquitectónicas',
        context: 'Arquitectos evaluando los límites constitutivos, disposiciones e inervación',
        perceptionGoal: 'Comprobar el desacoplamiento total, la idempotencia de disposiciones y la pureza ontológica sin estado mutable',
    },
    {
        name: 'Composición Espacial y Adaptación Ambiental',
        context: 'Diseñadores observando la emergencia de layouts y el contraste bicromático adaptativo',
        perceptionGoal: 'Experimentar una estética inspirada en Material Design con contraste bicromático simple y adaptación temporal y geográfica',
    },
] as const;

export const DEFAULT_USER_EXPERIENCE: UserExperience = {
    scenarios: [
        ...DEFAULT_SCENARIOS,
    ],
    dynamicPrinciples: [
        'La interfaz emerge dinámicamente de la interacción y del estado ontológico; no existen páginas estáticas.',
        'Agilidad e interactividad continua: cada acción del usuario emite impulsos nerviosos que recomponen la vista en tiempo real.',
        'Cercanía contextual: la aplicación modula su presencia estética según el momento del día y la localización del observador.',
        'Prueba de fe ontológica: la propia aplicación se describe y renderiza a través de sus propias UCAs y Capabilities.',
    ],
};

export const DEFAULT_INFORMATION_DISPOSITION: InformationDisposition = {
    tone: 'Didáctico, formal, ágil y conceptualmente riguroso.',
    structure: 'Modular y jerárquica con segmentación semántica según el perfil del observador.',
    segmentation: [
        'Propósito e Intención Ontológica',
        'Grafo de Señales e Impulsos Nerviosos',
        'Catálogo de Capacidades y Disposiciones Vivas',
        'Métricas de Ejecución y Límites Operativos',
    ],
};

export const DEFAULT_FUNCTIONAL_DESIGN: FunctionalDesign = {
    interactiveFeatures: [
        'Árbol reactivo de componentes e inspección de disposiciones vivas',
        'Visualizador en tiempo real del flujo de impulsos y estímulos nerviosos',
        'Mutación interactiva de disposiciones con reconciliación idempotente',
        'Adaptación perceptual según fase horaria y entorno geográfico',
    ],
    feedbackModes: [
        'Respuesta reactiva inmediata mediante pulsos de dominio',
        'Notificación sensorial no intrusiva con contraste positivo/negativo',
        'Trazabilidad de estados y telemetría transparente',
    ],
    dynamicCapabilities: [
        'Composición declarativa mediante Cooky',
        'Inervación y denervación de capacidades bajo demanda',
        'Reconciliación perceptual adaptativa',
    ],
};

export const DEFAULT_GRAPHIC_DESIGN: GraphicDesign = {
    density: 'comfortable',
    contrastMode: 'bichromatic-high-contrast',
    paletteIntent: 'Estética inspirada en Material Design simplificada en 2 colores de contraste positivo y negativo',
    dayPeriodAdaptation: true,
    locationAdaptation: true,
    supportedDevices: [
        'desktop',
        'tablet',
        'mobile',
    ],
};

export const DEFAULT_LIMITS: readonly string[] = [
    'Prohibición estricta de cadenas CSS o estilos inline en capas de dominio',
    'Prohibición de almacenamiento de propiedades de dominio en variables de instancia en UCAs y Capabilities',
    'Máximo estricto de 10 líneas por método con formateo vertical',
    'Cero dependencias circulares y cero acoplamientos imperativos entre UCAs',
    'Toda interacción externa debe transducirse a través de Signals formales',
] as const;

export const DEFAULT_DOMAIN_ENTITIES: readonly DomainEntity[] = [
    {
        name: 'UCA',
        symbol: 'u',
        definition: 'Unidad Cognitiva Autónoma con propósito ontológico explícito e invariante y composición declarativa de capacidades',
    },
    {
        name: 'Purpose',
        symbol: 'p',
        definition: 'Propósito propio, explícito e invariante de una UCA que define su razón de ser y aquello que persigue',
    },
    {
        name: 'Disposition',
        symbol: 'd',
        definition: 'Condición constitutiva, paramétrica y relacional que predispone la conducta de capabilities y UCAs',
    },
    {
        name: 'Capability',
        symbol: 'c',
        definition: 'Recurso operacional concreto y terminal reactivo que delimita lo que una UCA puede hacer',
    },
    {
        name: 'Stimulus',
        symbol: 's',
        definition: 'Cambio observable externo recibido en la frontera de una UCA que dispara su reacción interna',
    },
    {
        name: 'Outcome',
        symbol: 'o',
        definition: 'Consecuencia observable estructurada producida por una UCA como fruto de su actividad',
    },
    {
        name: 'Reaction',
        symbol: 'r',
        definition: 'Proceso interno desencadenado por un estímulo mediante handlers unívocos y dedicados',
    },
    {
        name: 'Action',
        symbol: 'a',
        definition: 'Operación o transición interna perteneciente a la Reaction encapsulada de la UCA',
    },
    {
        name: 'Mutation',
        symbol: 'μ',
        definition: 'Cambio atómico identificable sobre la Disposition sin abandonar el propósito',
    },
    {
        name: 'Signal',
        symbol: 'σ',
        definition: 'Unidad atómica de comunicación nerviosa constituida por source, property y value',
    },
] as const;

export const DEFAULT_SPECIFICATION_MODEL: SpecificationModel = {
    purpose: 'Demostrar empíricamente que la arquitectura UCA es real, reactiva y funcional mediante la ejecución autorreferencial de la propia aplicación.',
    intention: 'Constituir un entorno interactivo y dinámico donde desarrolladores, diseñadores y arquitectos experimenten la reactividad ontológica, inspeccionen el flujo de señales en tiempo real y comprueben la ausencia de dependencias imperativas tradicionales.',
    data: {
        experience: DEFAULT_USER_EXPERIENCE,
        information: DEFAULT_INFORMATION_DISPOSITION,
        functional: DEFAULT_FUNCTIONAL_DESIGN,
        graphic: DEFAULT_GRAPHIC_DESIGN,
        limits: [
            ...DEFAULT_LIMITS,
        ],
        audience: DEFAULT_AUDIENCE,
        domainEntities: [
            ...DEFAULT_DOMAIN_ENTITIES,
        ],
    },
};
