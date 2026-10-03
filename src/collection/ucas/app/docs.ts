export const UCA_ARCHITECTURE_DOCUMENTATION = `
# Universal Cognitive Architecture (UCA) - Specification & Developer Guide

## 1. Fundamento Ontológico
Una UCA (Unidad Cognitiva Artificial / Artificial Cognitive Unit) no se define por lo que ejecuta, sino por el propósito que es responsable de alcanzar:
  u = (p, d, C, O) ∈ ℙ × 𝔻 × 𝒫(ℂ) × 𝕆_def
- p (Purpose): Razón ontológica e invariable de existencia definida por su creador en Concepción.
- d (Disposition): Predisposición reactiva mediante constitución (aim.body) y suscripciones reactivas locales (reactTo).
- C (Capabilities): Límites funcionales y recursos operacionales terminales (algoritmos, modelos, transformaciones, sub-UCAs).
- O (Outcome): Cambio observable producido por la actividad de la UCA, con propiedades empíricas y validación externa (no auto-validación).
- Activación por Estímulo (s): Recepción mecánica universal de perturbaciones externas que provocan la reacción interna de la unidad.

## 2. Ventajas y Puntos Fuertes de UCA
1. Desacoplamiento Total: Las unidades interactúan exclusivamente por señales nerviosas ("reactTo") sin conocer las implementaciones internas ni acoplarse directamente.
2. Composición Fractal mediante Cooky: Cada UCA compone capacidades o sub-UCAs de forma recursiva y uniforme: Cooky = Array<[CapabilityConstructor, Disposition]>.
3. Invariante Sin Estado Mutable: Las UCAs y Capabilities no almacenan estado de dominio en variables de instancia; reaccionan y transducen impulsos en tiempo real.
4. Adaptabilidad Estructural sin Reentrenamiento: Las Disposiciones pueden evolucionar y reconfigurarse mediante evidencia histórica sin alterar código ni reentrenar modelos.
5. No Auto-Validación: El Outcome pertenece a la UCA que ejecuta, pero los criterios de evaluación y validación pertenecen exclusivamente a un Owner externo.

## 3. Qué NO es UCA
1. NO es un agente monolítico: No depende de un mega-prompt centralizado ni de un snapshot de estado global mutable.
2. NO es un orquestador central: No existe un coordinador, despachador ni supervisor omnisciente que dirija la ejecución paso a paso.
3. NO prescribe un LLM ni un framework: El Core es estrictamente computacional y abstracto; los modelos o APIs son meras capacidades operacionales.
4. NO es cognición aislada: Una UCA individual no es cognición; la cognición es un comportamiento emergente de la red de interacciones entre unidades acotadas.

## 4. Catálogo de UCAs Disponibles
- Box (prefix "box:<id>"): Contenedores visuales y proyección textual explicativa (hero, tarjetas, secciones, código).
- Picture (prefix "picture:<id>"): Diagramas de arquitectura e ilustraciones didácticas visuales (diagramas de flujo, esquemas ontológicos, iconos).
- List (prefix "list:<id>"): Secuencias ordenadas o no ordenadas de elementos (ventajas, puntos fuertes, diferencias, qué no es UCA).
- Action (prefix "action:<id>"): Botones e interactividad (exploración, simulación, disparadores de pulso). Emite "<id>.triggered".
- Toggle (prefix "toggle:<id>"): Interruptores binarios on/off (modo técnico vs divulgativo, filtros). Emite "<id>.toggled".

## 5. Reglas de Interconexión Causal (reactTo)
- Si una UCA reacciona a un evento emitido por otra UCA (ej: un Box que se actualiza cuando un Action es presionado), debe declarar:
  reactTo: ["action:<buttonId>.triggered"]
- Si una UCA no tiene dependencias reactivas externas, su reactTo DEBE ser un array vacío: [].
- PROHIBIDO: Una UCA nunca debe incluir su propio ID o señales internas en su propio reactTo.
`.trim();
