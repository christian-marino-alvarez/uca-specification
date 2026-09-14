# UCA — Unidad Cognitiva Autónoma (Autonomous Cognitive Unit)
*Especificación de Arquitectura (Open Specification RFC)*

[ [English](SPECIFICATION.md) | Español ]

---

## Especificación frente a Implementación

Este documento define el contrato conceptual formal de una **Unidad Cognitiva Autónoma (UCA)**.

La especificación define deliberadamente:
- Qué constituye una UCA;
- Cómo se activa una UCA;
- Cómo delibera y ejecuta acciones;
- Cómo se compone con otras capacidades y unidades;
- Las invariantes que preservan su autonomía y alcance acotado.

Esta especificación **no prescribe deliberadamente**:
- Una topología cognitiva o jerarquía obligatoria;
- Unidades cognitivas específicas que todo sistema deba instanciar;
- Analogías biológicas, neurológicas o anatómicas;
- Una tecnología de comunicación, bus o protocolo de red concreto;
- Un modelo de lenguaje, framework o proveedor específico;
- Un motor de memoria o base de datos particular;
- Una representación centralizada de estado global;
- Un entorno de ejecución (runtime) específico.

Cualquier sistema puede implementar los conceptos de UCA utilizando diferentes lenguajes de programación, modelos de actores, buses de eventos, arquitecturas distribuidas, modelos de lenguaje locales o remotos, y diversas topologías organizativas. Un proyecto o runtime de referencia (como Extensio) puede implementar la abstracción UCA, pero UCA permanece como una especificación abierta e independiente.

---

# PARTE I — CORE UCA

El Core de UCA establece los principios mínimos, necesarios y suficientes que definen una Unidad Cognitiva Autónoma.

---

## 1. Definición

Una **Unidad Cognitiva Autónoma (UCA)** es una unidad funcional de un sistema cognitivo definida por un **propósito autónomo (`Purpose`)**.

Una UCA no se define por el algoritmo que ejecuta, por el modelo al que consulta ni por los datos que procesa.

Se define por **para qué existe dentro del sistema cognitivo**.

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

Una UCA puede utilizar algoritmos deterministas, rutinas matemáticas, motores de almacenamiento, drivers, herramientas externas, servicios web, modelos de lenguaje (LLMs) u otras UCAs subordinadas para satisfacer su propósito.

---

## 2. Purpose (Propósito)

El `Purpose` expresa **por qué existe una UCA**.

Es estable, persistente e independiente de ejecuciones específicas y de los mecanismos técnicos de implementación.

- **Propósito válido**: Proporcionar conocimiento previamente adquirido relevante para una necesidad operativa activa.
- **Propósito inválido**: Consultar una base de datos vectorial mediante similitud coseno.

Consultar una base de datos vectorial es un mecanismo o capability; no constituye un propósito cognitivo autónomo.

El Purpose debe permanecer siempre desacoplado de los detalles mecánicos de la implementación.

---

## 3. Goal (Meta u Objetivo Contextual)

El `Goal` representa **qué resultado concreto debe alcanzarse en una activación determinada**.

En contraste con el Purpose:

```text
PURPOSE
¿Por qué existe esta UCA? (Estable, persistente, invariante)

GOAL
¿Qué resultado concreto se requiere ahora? (Contextual, efímero, específico de la activación)
```

Una UCA siempre interpreta un Goal recibido bajo el marco de su propio Purpose.

---

## 4. Compatibilidad entre Goal y Purpose

Una UCA debe aceptar únicamente Goals que sean estrictamente compatibles con su Purpose.

- **Compatible**: Una UCA orientada a conocimiento recibe el Goal de recuperar hechos históricos sobre un tema.
- **Incompatible**: Una UCA orientada a conocimiento recibe el Goal de sintetizar formas de onda de audio y hablar con un usuario.

Un Goal perteneciente a otro dominio operativo debe rechazarse o enrutarse a la unidad correspondiente. Este principio de especialización evita que las UCAs degeneren en agentes genéricos ilimitados que asuman cualquier tarea arbitraria.

---

## 5. Stimulus (Estímulo)

Una UCA se ejecuta exclusivamente al recibir un `Stimulus`.

El Stimulus representa la **activación cognitiva de la UCA**.

Conceptualmente, se compone de:

```text
Stimulus
├── Goal
└── Context
```

El Stimulus es un contrato puramente cognitivo, diferenciado de paquetes de red, sobres de mensajería o mecanismos físicos de transporte.

---

## 6. Context (Contexto)

El `Context` contiene la información estrictamente necesaria para que una UCA pueda interpretar y satisfacer su Goal.

No debe representar el estado completo del sistema ni una fotografía no delimitada de toda la memoria. Se restringe a aquello relevante para la activación específica:

```text
Outcomes previos
       +
Evidencia activa
       +
Estímulo actual
       ↓
    Context
       ↓
Cognición activa
```

El pasado contextual condiciona y modula la interpretación del presente inmediato.

---

## 7. Observation (Observación)

Al activarse, la UCA procesa el Stimulus y su Context.

La `Observation` representa los datos cognitivamente significativos (salience, restricciones detectadas, parámetros clave) extraídos de dicha entrada.

La observación no es una fase introspectiva o moral de autoevaluación. Una UCA no se inspecciona a sí misma para juzgar si es "buena"; observa el estímulo entrante, el contexto, la evidencia externa o los resultados generados por otras unidades.

---

## 8. Disposition (Disposición de Comportamiento)

La `Disposition` representa la predisposición de comportamiento de una UCA.

No es mera configuración técnica; pondera y condiciona cómo la UCA razona, delibera y selecciona capacidades.

Ejemplos de parámetros gobernados por la Disposition:
- tolerancia a la ambigüedad;
- sensibilidad a contradicciones;
- umbral de confianza requerido antes de emitir un resultado;
- ponderación de evidencia directa vs indirecta;
- propensión a invocar capacidades computacionalmente costosas;
- tolerancia al riesgo bajo incertidumbre.

La Disposition condiciona cómo una UCA orquesta sus capacidades para cumplir su Purpose.

---

## 9. No Auto-Mutación de la Disposition

Una UCA no debe evaluarse a sí misma y mutar directamente su propia disposición de comportamiento durante su ciclo de ejecución.

Si una UCA actúa, juzga simultáneamente su propio rendimiento y modifica sus propias reglas, emergen derivas sistémicas y conductas no calibradas. La adaptación debe proceder de una capacidad supervisora externa cuyo Purpose diferenciado justifique evaluar y adaptar dicha disposición.

---

## 10. Capabilities (Capacidades)

Las `Capabilities` son los recursos operacionales que una UCA puede aprovechar para satisfacer su Purpose.

Abarcan:
- algoritmos deterministas y heurísticas;
- parsers, compiladores y serializadores;
- índices de bases de datos y almacenes vectoriales;
- APIs y herramientas externas del entorno;
- modelos predictivos y LLMs;
- otras UCAs subordinadas.

Una Capability es un instrumento. Una Capability no es automáticamente una UCA.

---

## 11. Capacidades Terminales vs Capacidades Autónomas

Una Capability se convierte en una UCA cuando en su diseño emerge un **Purpose autónomo**.

Regla de descomposición:
> La descomposición en UCAs continúa mientras emerjan propósitos cognitivos autónomos y diferenciados.
> Cuando dejan de aparecer propósitos autónomos y solo restan mecanismos funcionales, se han alcanzado capacidades terminales.

Si una capacidad únicamente ejecuta un paso algorítmico (ej. multiplicación de matrices, regex, consulta SQL) sin un propósito cognitivo independiente dentro del sistema, permanece como capacidad terminal.

---

## 12. Composición Recursiva

Las UCAs pueden componerse jerárquica y recursivamente:

```text
UCA₁
├── Capability A (Algoritmo)
├── Capability B (Herramienta Externa)
└── UCA₂ (UCA subordinada con su propio Purpose)
      ├── Capability C
      └── Capability D
```

Una UCA puede invocar a otra UCA como una de sus capacidades siempre que dicha unidad subordinada cumpla un propósito acotado y diferenciado.

---

## 13. Alcance y Especialización

Una UCA especializada no es un mini-agente omnipotente.

Una unidad no debe decidir arbitrariamente desencadenar acciones no relacionadas fuera de su dominio, a menos que la coordinación entre dominios constituya explícitamente su Purpose definido. La coordinación pertenece a unidades diseñadas para tal fin.

---

## 14. Action (Acción)

La `Action` representa lo que una UCA ejecuta para satisfacer el Goal recibido bajo su Purpose:

```text
Purpose + Goal + Context + Observation + Disposition + Capabilities ──► Action
```

Una Action no implica necesariamente una inferencia por modelo de lenguaje; puede ser una ejecución determinista, una recuperación de datos, una transformación estructural o la invocación de una unidad subordinada.

---

## 15. Los LLMs como Capabilities

Un modelo de lenguaje (LLM) no es una UCA; es una Capability instrumental.

Una UCA puede consultar un LLM cuando su Purpose requiere razonamiento probabilístico, procesamiento de lenguaje natural o síntesis semántica que no puede resolverse de forma determinista.

Tratar los modelos como capacidades intercambiables permite actualizar, reemplazar o combinar proveedores y modelos locales sin alterar la arquitectura cognitiva.

---

## 16. Outcome (Resultado Producido)

El `Outcome` representa **lo que la Action produjo efectivamente en la realidad**.

Distinción ontológica:
```text
GOAL: ¿Qué se pretendía alcanzar?
OUTCOME: ¿Qué produjo realmente la acción ejecutada?
```

El Outcome sustituye abstracciones puramente computacionales como `Result` o `Response`. El Outcome pertenece estrictamente a la unidad ejecutora.

---

## 17. Attainment (Evaluación del Cumplimiento del Objetivo)

`Attainment` representa el grado en que un Outcome satisface el Goal que originó la activación.

Principio de separación:
> El Outcome pertenece a quien ejecuta.
> El Attainment pertenece a quien estableció el Goal.

La UCA ejecutora produce el Outcome; no determina si dicho Outcome satisface la necesidad operacional global de la entidad invocadora. Es el solicitante quien evalúa el Outcome frente a su Goal original para determinar el Attainment.

---

## 18. Relatividad del Attainment

El Attainment no es una métrica absoluta o universal. Se evalúa en relación al Goal de la entidad que observa y consume el Outcome.

Una unidad no puede auto-declarar unilateralmente el éxito global; el éxito lo mide el emisor de la demanda.

---

## 19. Reactividad

Una UCA nunca se auto-activa de forma espontánea.

Regla:
> Una UCA ejecuta su ciclo estrictamente al recibir un Stimulus.

No existe una máquina de estados interna que despierte a una UCA sin causa. Toda activación es localmente reactiva a un estímulo recibido.

---

## 20. Causalidad Externa

Toda cadena de activaciones cognitivas debe tener su origen en un evento externo al propio sistema cognitivo.

Las fuentes externas incluyen:
- mensajes de usuarios o interlocutores;
- entradas perceptivas sensoriales o de audio;
- eventos del entorno o del sistema operativo;
- notificaciones de temporizadores programados;
- respuestas de herramientas externas;
- eventos de ciclo de vida del sistema (arranque / inicialización).

Las unidades internas pueden encadenar activaciones posteriores como consecuencia causal de ese origen, pero ninguna cadena surge ex nihilo.

---

## 21. Modelo Conceptual Mínimo de una UCA

La definición persistente de una UCA:

```text
UCA
├── Purpose
├── Disposition
└── Capabilities
```

El flujo de activación canónico:

```text
Stimulus (Goal + Context)
        ↓
   Observation
        ↓
Disposition + Capabilities
        ↓
     Action
        ↓
    Outcome
```

---

# PARTE II — CONSECUENCIAS ARQUITECTÓNICAS Y PATRONES DE COMPOSICIÓN

Esta sección describe patrones y consecuencias arquitectónicas que emergen al componer múltiples UCAs. Estos patrones son ilustrativos y recomendados; no constituyen restricciones obligatorias del Core UCA.

---

## 22. Cadenas Causales e Interacción Multi-UCA

Cuando interactúan múltiples UCAs, un estímulo inicial desencadena una cadena causal:

```text
Estímulo Externo ──► UCA₁ ──► Outcome₁ ──► Context₂ ──► UCA₂ ──► Outcome₂ ──► Acción Externa
```

Las unidades colaboran intercambiando estímulos y outcomes. No se requiere un cerebro central monolítico que dicte cada transición intermedia de estado.

---

## 23. El Impulse: Sobre de Transporte para Infraestructura

El `Impulse` representa infraestructura, no cognición.

Es un sobre de transporte utilizado para enrutar un `Stimulus`, un `Outcome` o metadatos operacionales a través de una capa de comunicación:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload (Stimulus | Outcome | datos)
```

Las implementaciones pueden recurrir a un bus de eventos, buzones de actores, colas de mensajes, llamadas asíncronas de funciones o protocolos distribuidos. La elección del transporte no afecta a la conformidad con UCA.

---

## 24. Trazabilidad Causal

En sistemas multi-UCA asíncronos o distribuidos, las interacciones deben preservar metadatos de trazabilidad causal:
- `traceId`: Identificador raíz de la transacción;
- `parentImpulseId`: Identificador del sobre precedente;
- `sessionId`: Ámbito de la sesión de interacción;
- `timestamp`: Registro temporal del evento.

Esto facilita la auditoría, la depuración y el diagnóstico de desviaciones a posteriori.

---

## 25. Patrón Opcional: Coordinación y Dispatch

Un sistema cognitivo **PUEDE** definir una UCA cuyo Purpose incluya coordinar o distribuir estímulos entre unidades especializadas:

```text
                  UCA (Coordinador)
                /        |        \
               ↓         ↓         ↓
             UCA₁      UCA₂      UCA₃
```

De implementarse, un coordinador no debe convertirse en un cerebro monolítico omnipotente; su alcance está acotado por su Purpose específico de coordinación. Los sistemas también pueden adoptar topologías descentralizadas, coreográficas o en pipeline.

---

## 26. Patrón Opcional: Supervisión y Preservación de Coherencia

Un sistema cognitivo **PUEDE** definir una o varias UCAs cuyo Purpose autónomo implique monitorizar la coherencia del comportamiento, diagnosticar desviaciones o adaptar disposiciones:

```text
UCA de Supervisión
├── UCA de Diagnóstico (Identifica la causa raíz de desviaciones)
└── UCA de Adaptación (Calcula los ajustes necesarios en las disposiciones)
```

Las unidades supervisoras no microgestionan las decisiones operacionales inmediatas; observan evidencia a lo largo del tiempo y adaptan las disposiciones de las unidades destino.

---

## 27. Patrón Opcional: Representación de Identidad / Self

Un sistema cognitivo **PUEDE** definir una UCA cuyo Purpose sea mantener una representación coherente de la identidad, límites y rol del sistema.

Esta es una opción arquitectónica, no un requisito universal. Agentes de utilidad especializados (como parsers desatendidos o procesadores en pipeline) pueden operar sin una UCA de Identidad explícita.

---

## 28. Patrón Opcional: Almacenes de Memoria y Conocimiento

Un sistema cognitivo **PUEDE** definir una o varias UCAs cuyo Purpose sea la curación, recuperación y suministro contextual de conocimiento adquirido.

Almacenar datos es una capacidad instrumental; interpretar activamente y proporcionar conocimiento ante un objetivo cognitivo constituye una UCA.

---

## 29. Análisis Arquitectónico: Deconstrucción del Estado Cognitivo Global

Muchas arquitecturas tradicionales de agentes mantienen un único objeto de estado centralizado (habitualmente denominado snapshot global o blackboard) que acumula identidad, memoria, historial de diálogo, árboles de tareas y variables del runtime.

En una arquitectura basada en UCA, el estado global puede analizarse y descomponerse ontológicamente:
- **Hechos persistentes**: Gestionados por capacidades de memoria/conocimiento;
- **Estado de ejecución técnica**: Gestionado por la infraestructura de transporte y ciclo de vida;
- **Contexto de razonamiento activo**: Sintetizado dinámicamente bajo demanda a partir de los outcomes de las unidades pertinentes.

Una implementación UCA no está obligada a eliminar por completo el estado global, ni está obligada a adoptarlo; la distribución del estado es una decisión arquitectónica de implementación.

---

## 30. Contexto Dinámico como Construcción Cognitiva

En lugar de propagar un estado global indiscriminado a cada unidad, el Context puede sintetizarse dinámicamente a partir de los Outcomes de las capacidades pertinentes:

```text
UCA (Solicitante)
├── Unidad de Conocimiento ──► Outcome (Hechos relevantes)
├── Unidad de Identidad    ──► Outcome (Restricciones de rol)
└── Unidad Interlocutora   ──► Outcome (Preferencias del usuario)
        ↓
Contexto enfocado y compacto, adaptado al Goal inmediato
```

Esto reduce el consumo de tokens, elimina ruido y mitiga la degradación atencional en modelos de lenguaje.

---

## 31. El Entorno Exterior en el Bucle Cognitivo

El sistema cognitivo actúa sobre el entorno exterior y el entorno responde. Esa respuesta se convierte en nueva evidencia externa:

```text
Acción del Sistema ──► Entorno ──► Respuesta / Corrección ──► Nuevo Estímulo Externo
```

El sistema no necesita simular ni predecir internamente todas las consecuencias ambientales. El bucle continuo con el mundo exterior aporta evidencia empírica directa.

---

# PARTE III — HIPÓTESIS EXPERIMENTALES Y PREGUNTAS ABIERTAS

Los conceptos de esta sección representan hipótesis de investigación activas e ideas exploratorias. No constituyen hechos demostrados ni requisitos normativos del Core UCA.

---

## 32. Hipótesis: Cognición Emergente

Se plantea como hipótesis que el comportamiento cognitivo complejo no requiere programarse centralizadamente ni residir en un único modelo de gran tamaño. En su lugar, capacidades cognitivas útiles pueden **emerger** de la interacción estructurada y contextual entre unidades acotadas por propósitos especializados.

---

## 33. Hipótesis: Proactividad Emergente

Aunque las UCAs individuales son estrictamente reactivas a los estímulos recibidos, un conjunto de UCAs interactuando puede exhibir un comportamiento que aparenta ser proactivo ante un observador externo.

Dado que el Outcome de una unidad puede alimentar el Contexto o detonar un Stimulus para otra unidad, la persecución de metas compuestas puede desarrollarse a partir de un estímulo externo inicial sin requerir un planificador monolítico omnipresente.

---

## 34. Hipótesis: Bucles Adaptativos y Aprendizaje Conductual

Se plantea como hipótesis que el aprendizaje estructural puede ocurrir sin reentrenamiento de pesos y sin modificación de código fuente:
1. El sistema ejecuta una acción sobre el entorno exterior;
2. El entorno proporciona retroalimentación o correcciones;
3. Una capacidad supervisora diagnostica la desviación;
4. La capacidad supervisora adapta la `Disposition` de la unidad responsable;
5. El sistema exhibe un comportamiento corregido en situaciones futuras equivalentes.

La estabilidad a largo plazo de esta adaptación y la prevención de derivas catastróficas constituyen preguntas abiertas de investigación.

---

## 35. Exploración: Adaptación Inter-UCA y Plasticidad Relacional (Concepto de Sinapsis)

La adaptación actual en UCA se concentra en la **adaptación intra-unidad** (modificación de la `Disposition` interna).

Un área exploratoria de investigación analiza la **adaptación inter-unidad** (el ajuste dinámico de la topología de comunicación, ponderación de rutas o afinidad de interacción entre unidades):

```text
Adaptación INTRA-UCA  ──► Disposition (Umbral interno de comportamiento)
Adaptación INTER-UCA  ──► Plasticidad Relacional / Sinapsis (Ponderación de enlaces entre unidades)
```

La formalización de la plasticidad relacional y sus condiciones de estabilidad es objeto de estudio activo y queda expresamente fuera del Core normativo de UCA.

---

## 36. Criterios de Validación Empírica

Para validar empíricamente el modelo UCA, una implementación de referencia debe demostrar que un conjunto mínimo de unidades es capaz de:

1. Recibir un estímulo externo;
2. Reaccionar según sus propósitos especializados sin un controlador monolítico;
3. Colaborar mediante intercambio de estímulos y outcomes;
4. Generar una acción hacia el entorno exterior;
5. Recibir retroalimentación o corrección externa respecto a dicha acción;
6. Utilizar esa evidencia para diagnosticar desviaciones;
7. Adaptar una o más `Dispositions`;
8. Reaccionar correctamente en un escenario futuro equivalente;
9. Lograrlo **sin modificación de código fuente**;
10. Lograrlo **sin reentrenamiento de pesos de modelos**;
11. Lograrlo **sin reglas cableadas ad-hoc diseñadas para el caso de prueba**.

Si una implementación demuestra esto, el comportamiento adaptativo habrá emergido de la propia arquitectura.

---

## 37. Tesis Central

> **Una UCA es una unidad cognitiva funcional definida por un Purpose autónomo.**
>
> **Es autónoma en su Purpose y reactiva en su ejecución.**
>
> **Al activarse, recibe un Goal dentro de un Context, utiliza Capabilities acotadas condicionadas por su Disposition, ejecuta una Action y produce un Outcome.**
>
> **El Outcome es evaluado respecto al Goal por la entidad que originó la necesidad (Attainment).**
>
> **Las UCAs pueden componer recursivamente otras UCAs cuando existe un propósito autónomo diferenciado.**

---

## Licencia

UCA Specification © 2026 Christian Marino Alvarez.

Esta especificación y su documentación están licenciadas bajo la
Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).

Eres libre de usar, compartir, adaptar e implementar esta especificación,
incluso con fines comerciales, siempre que se proporcione la atribución
adecuada.

Las implementaciones de software y los runtimes de referencia se licencian por separado.
