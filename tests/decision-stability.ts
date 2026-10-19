import { Decision } from '../src/collection/ucas/decision/index.js';
import { SignalType as DecisionSignalType } from '../src/collection/ucas/decision/types.js';

interface TestCase {
    readonly id: string;
    readonly title: string;
    readonly purpose: string;
    readonly intention: string;
    readonly expected: 'LAYOUT' | 'VIEW';
    readonly rationale: string;
}

const TEST_CASES: readonly TestCase[] = [
    // --- 5 Casos de LAYOUT (necesitan partición en áreas específicas) ---
    {
        id: 'TC-01',
        title: 'Dashboard Analítico Operativo',
        purpose: 'Monitorear en tiempo real métricas operativas y salud de infraestructura en alta escala',
        intention: 'Proveer un centro de comando que articule panel de alertas críticas, métricas temporales de rendimiento y tabla de incidentes activos',
        expected: 'LAYOUT',
        rationale: 'Exige compartimentar el espacio en áreas específicas diferenciadas (alertas, métricas, tabla).',
    },
    {
        id: 'TC-02',
        title: 'Tienda Online con Catálogo y Carrito',
        purpose: 'Facilitar el descubrimiento y adquisición de productos físicos y digitales',
        intention: 'Estructurar la experiencia de compra articulando barra de búsqueda/filtros, catálogo de productos destacados y panel lateral de carrito activo',
        expected: 'LAYOUT',
        rationale: 'Exige segregar áreas funcionales independientes (filtros, cuadrícula de catálogo, panel de carrito).',
    },
    {
        id: 'TC-03',
        title: 'Entorno de Desarrollo Web (IDE)',
        purpose: 'Ofrecer un entorno de desarrollo cognitivo y pair-programming en la nube',
        intention: 'Coordinar el espacio de trabajo organizando explorador de archivos, lienzo central de edición y terminal interactiva de salida',
        expected: 'LAYOUT',
        rationale: 'Exige estructurar áreas específicas funcionales (árbol de ficheros, editor, terminal).',
    },
    {
        id: 'TC-04',
        title: 'Portal de Aprendizaje Interactivo',
        purpose: 'Gestionar el aprendizaje interactivo y seguimiento pedagógico del estudiante',
        intention: 'Articular el aula virtual dividiendo temario del curso, visor interactivo de lecciones y espacio de notas del alumno',
        expected: 'LAYOUT',
        rationale: 'Exige dividir la pantalla en áreas con responsabilidades distintas (temario, visor, apuntes).',
    },
    {
        id: 'TC-05',
        title: 'App de Presentación de la UCA (Arranque)',
        purpose: 'Demonstrate the Universal Cognitive Architecture through a web application that exhibits cognitive emergence by dynamically orchestrating environment telemetry and adaptive decision-making',
        intention: 'Create an interactive presentation page that enables the user to engage with the App and begin understanding the Universal Cognitive Architecture',
        expected: 'LAYOUT',
        rationale: 'Exige organizar áreas específicas de presentación conceptual, demostración interactiva y navegación.',
    },

    // --- 5 Casos de VIEW (representación directa y esencial sin más áreas) ---
    {
        id: 'TC-06',
        title: 'Formulario de Contacto Rápido',
        purpose: 'Capturar comunicaciones e inquietudes directas de los usuarios',
        intention: 'Recoger nombre, correo electrónico y mensaje mediante un formulario directo con botón de envío',
        expected: 'VIEW',
        rationale: 'Se resuelve directamente combinando inputs y botón en una sola unidad interactiva sin crear más áreas.',
    },
    {
        id: 'TC-07',
        title: 'Modal de Confirmación de Borrado',
        purpose: 'Garantizar la intencionalidad consciente del usuario ante operaciones destructivas',
        intention: 'Presentar advertencia de borrado irreversible y solicitar confirmación mediante opciones de cancelar y proceder',
        expected: 'VIEW',
        rationale: 'Diálogo unitario y autocontenido que no requiere dividir el espacio en áreas específicas.',
    },
    {
        id: 'TC-08',
        title: 'Ficha de Perfil de Usuario',
        purpose: 'Representar la identidad pública y estado de actividad de un miembro',
        intention: 'Mostrar avatar, nombre, biografía corta y botón interactivo de conectar en una ficha visual',
        expected: 'VIEW',
        rationale: 'Representa directamente lo justo y demandado (avatar, datos, botón) sin partición estructural.',
    },
    {
        id: 'TC-09',
        title: 'Campo de Búsqueda con Sugerencias',
        purpose: 'Localizar recursos y entidades de forma rápida y predictiva',
        intention: 'Ofrecer un campo de búsqueda reactivo con menú desplegable de resultados coincidentes',
        expected: 'VIEW',
        rationale: 'Unidad interactiva compacta y terminal ensamblando Input y Dropdown directamente.',
    },
    {
        id: 'TC-10',
        title: 'Banner de Notificación de Éxito',
        purpose: 'Informar al usuario sobre el resultado inmediato de sus acciones en el sistema',
        intention: 'Mostrar un mensaje de éxito temporal con botón de cierre tras completar una tarea',
        expected: 'VIEW',
        rationale: 'Mensaje directo y terminal sin requerir áreas adicionales.',
    },
];

const COMPONENTS_CATALOG = {
    Box: { purpose: 'Autonomous spatial container that groups and arranges visual elements' },
    Action: { purpose: 'Autonomous interactive trigger unit that executes actions or submissions' },
    Input: { purpose: 'Autonomous user input capture unit with validation' },
    Picture: { purpose: 'Autonomous visual representation unit for images' },
    Dropdown: { purpose: 'Autonomous selection unit for single or multiple items' },
    Options: { purpose: 'Autonomous choices and radio selection container' },
    Collection: { purpose: 'Autonomous data collection list container' },
    Navigate: { purpose: 'Autonomous navigation and route synchronization unit' },
    Memory: { purpose: 'Autonomous persistent memory and state retrieval unit' },
};

const BROWSER_TELEMETRY = {
    viewport: { width: 1440, height: 900 },
    screen: { width: 1920, height: 1080, pixelRatio: 2 },
    browser: { type: 'Chrome', platform: 'macOS', colorScheme: 'dark' },
};

const OPTIONS = [
    {
        id: 'LAYOUT',
        label: 'Layout',
        description: 'Partición en áreas específicas',
        criteria: 'Elegir LAYOUT si la intención y propósito en el contexto exigen subdividir el espacio en áreas específicas diferenciadas.',
    },
    {
        id: 'VIEW',
        label: 'View',
        description: 'Representación directa y autocontenida',
        criteria: 'Elegir VIEW si no hace falta usar más áreas y la intención bajo el propósito se resuelve como una unidad autocontenida de interacción o presentación.',
    },
];

async function runTestCase(testCase: TestCase, decision: Decision, bus: EventTarget): Promise<{
    testCase: TestCase;
    actual: string;
    confidence: number;
    probabilities: Record<string, number>;
    passed: boolean;
}> {
    const { id, purpose, intention, expected } = testCase;
    const correlationId = `stability-${id}-${Date.now()}`;

    return new Promise((resolve) => {
        const onDecided = (event: Event) => {
            const { detail } = event as CustomEvent;
            if (detail?.value?.correlationId !== correlationId) { return; }
            bus.removeEventListener(DecisionSignalType.DECIDED, onDecided);
            bus.removeEventListener(DecisionSignalType.ERROR, onError);

            const result = detail?.value?.result;
            const actual = result?.choice ?? 'UNKNOWN';
            const confidence = result?.confidence ?? 0;
            const probabilities = result?.probabilities ?? {};
            const passed = actual === expected;

            resolve({ testCase, actual, confidence, probabilities, passed });
        };

        const onError = (event: Event) => {
            const { detail } = event as CustomEvent;
            if (detail?.value?.correlationId !== correlationId) { return; }
            bus.removeEventListener(DecisionSignalType.DECIDED, onDecided);
            bus.removeEventListener(DecisionSignalType.ERROR, onError);

            resolve({
                testCase,
                actual: `ERROR: ${JSON.stringify(detail?.value?.error)}`,
                confidence: 0,
                probabilities: {},
                passed: false,
            });
        };

        bus.addEventListener(DecisionSignalType.DECIDED, onDecided);
        bus.addEventListener(DecisionSignalType.ERROR, onError);

        bus.dispatchEvent(new CustomEvent(DecisionSignalType.DECIDE, {
            detail: {
                property: DecisionSignalType.DECIDE,
                source: 'test-runner',
                timestamp: Date.now(),
                value: {
                    correlationId,
                    question: {
                        id: 'area_type',
                        type: 'choice',
                        prompt: 'Determina si debemos usar LAYOUT o VIEW evaluando intention y purpose en el contexto provisto.',
                        options: OPTIONS,
                    },
                    context: {
                        purpose,
                        intention,
                        browser: BROWSER_TELEMETRY,
                        session: null,
                    },
                },
            },
        }));
    });
}

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════════════════');
    console.log('🧪 SUITE DE ESTABILIDAD COGNITIVA: DECISIÓN ONTOLÓGICA (LAYOUT vs VIEW)');
    console.log('═══════════════════════════════════════════════════════════════════════════\n');

    const bus = new EventTarget();
    const decision = new Decision('decision-stability-runner');
    decision.innervate(bus);

    bus.dispatchEvent(new CustomEvent(decision.updateEvent, {
        detail: {
            property: decision.updateEvent,
            source: 'test-runner',
            timestamp: Date.now(),
            value: Decision.disposition,
        },
    }));

    // Pequeño retardo de sincronización de catálogo
    await new Promise((resolve) => setTimeout(resolve, 300));

    let passedCount = 0;

    for (const testCase of TEST_CASES) {
        process.stdout.write(`⏳ Ejecutando ${testCase.id}: "${testCase.title}"... `);
        const result = await runTestCase(testCase, decision, bus);

        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} [${result.actual}] (Esperado: ${testCase.expected}) | Confianza: ${result.confidence} | Probabilidades: ${JSON.stringify(result.probabilities)}`);

        if (result.passed) {
            passedCount++;
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════════════════');
    console.log(`📊 RESULTADO FINAL: ${passedCount} / ${TEST_CASES.length} pruebas superadas (${(passedCount / TEST_CASES.length) * 100}% acierto)`);
    console.log('═══════════════════════════════════════════════════════════════════════════\n');

    process.exit(passedCount === TEST_CASES.length ? 0 : 1);
}

main().catch((error) => {
    console.error('Error fatal en suite de estabilidad:', error);
    process.exit(1);
});
