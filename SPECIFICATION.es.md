# UCA — Unidad Cognitiva Autónoma
*Especificación de Arquitectura (RFC Experimental)*

[ [English](SPECIFICATION.md) | Español ]

---

## 1. Definición

Una **UCA (Unidad Cognitiva Autónoma)** es una unidad funcional de un sistema cognitivo definida por un **propósito autónomo (`Purpose`)**.

Una UCA no se define por el algoritmo que ejecuta, por el modelo que utiliza ni por los datos que procesa.

Se define por **para qué existe dentro del sistema cognitivo**.

> Una UCA no se define por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

Ejemplos conceptuales de propósito:

- saber quién soy (preservar y proyectar identidad propia);
- reconocer con quién estoy interactuando;
- proporcionar conocimiento adquirido relevante;
- preservar la coherencia y estabilidad cognitiva;
- expresar información hacia el exterior;
- interpretar estímulos perceptivos de entrada;
- coordinar la reacción ante un flujo de estímulos.

Una UCA puede utilizar algoritmos deterministas, modelos matemáticos, almacenamiento, drivers, herramientas, servicios externos, modelos de lenguaje (LLMs) o incluso otras UCAs para cumplir su propósito.

---

## 2. Purpose (Propósito)

El `Purpose` expresa **por qué existe una UCA**.

Es estable, persistente y no depende de una ejecución concreta ni de los detalles de implementación técnica.

Ejemplo válido:

```text
UCA de Conocimiento / Memoria

Purpose:
Proporcionar conocimiento previamente adquirido
relevante para una necesidad cognitiva.
```

Ejemplo incorrecto:

```text
Purpose:
Buscar vectores en una base de datos vectorial.
```

Buscar vectores es un mecanismo o capability.

No es un propósito cognitivo autónomo.

Otro ejemplo válido:

```text
UCA de Identidad (Self UCA)

Purpose:
Mantener una representación coherente
de la identidad del agente.
```

El Purpose debe ser siempre agnóstico a la implementación subyacente.

---

## 3. Goal (Meta u Objetivo Contextual)

El `Goal` representa **qué resultado concreto necesita obtenerse en una activación determinada**.

A diferencia del Purpose:

```text
PURPOSE
¿Por qué existe esta UCA? (Estable y persistente)

GOAL
¿Qué resultado concreto necesito conseguir ahora? (Contextual y efímero)
```

Ejemplo:

```text
UCA de Conocimiento / Memoria

Purpose:
Proporcionar conocimiento adquirido relevante.

Goal:
Obtener información relacionada con la decisión técnica de adoptar WebRTC.
```

Una UCA interpreta el Goal recibido siempre bajo el marco de su propio Purpose.

---

## 4. Compatibilidad entre Goal y Purpose

Una UCA solamente debe aceptar Goals que sean estrictamente compatibles con su Purpose.

Ejemplo compatible:

```text
UCA de Conocimiento

Purpose:
Proporcionar conocimiento adquirido.

Goal:
Recuperar información registrada sobre el interlocutor.
```

Ejemplo incompatible:

```text
UCA de Conocimiento

Purpose:
Proporcionar conocimiento adquirido.

Goal:
Generar una locución verbal y responder al usuario.
```

Ese Goal pertenece al dominio de una UCA de expresión o salida.

Esta restricción de compatibilidad evita desvirtuar las UCAs convirtiéndolas en agentes genéricos monolíticos capaces de asumir cualquier tarea.

---

## 5. Stimulus (Estímulo)

Una UCA solamente se activa y ejecuta cuando recibe un `Stimulus`.

El Stimulus representa **la activación cognitiva de la UCA**.

Conceptualmente contiene:

```text
Stimulus
├── Goal
└── Context
```

El Stimulus es un concepto puramente cognitivo, no un mecanismo de red o transporte físico.

El transporte corresponde a la capa de infraestructura o `Impulse`.

---

## 6. Impulse (Impulso de Transporte)

El `Impulse` pertenece a la capa de transporte y mensajería del sistema.

Es el vehículo técnico utilizado para transportar activaciones, estímulos y resultados entre componentes.

Contiene metadatos de control y entrega:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── stimulus
```

Conceptualmente:

```text
Impulse
   ↓ transporta
Stimulus
   ↓ activa
UCA
```

Por tanto:

> Una UCA no es un mensaje.

> Un Stimulus no es un Impulse.

> El Impulse transporta un Stimulus para activar una UCA.

---

## 7. Context (Contexto)

El `Context` contiene la información estrictamente necesaria para que una UCA pueda interpretar y resolver adecuadamente su Goal.

No debe representar todo el conocimiento del agente ni una fotografía monolítica de todo el sistema.

Debe delimitarse a aquello relevante para esa activación concreta.

Conceptualmente:

```text
Stimulus
├── Goal
└── Context
```

El Context proporciona continuidad cognitiva entre interacciones sucesivas:

```text
Outcomes anteriores
        +
Evidencia externa
        +
Estímulo actual
        ↓
     Context
        ↓
Cognición actual
```

El pasado contextual condiciona y modula la interpretación del presente.

---

## 8. Observation (Observación)

La UCA procesa y extrae información a través del Stimulus y su Context.

La `Observation` representa los datos cognitivamente significativos (salience, patrones, entidades relevantes) que la UCA abstrae de dicha entrada.

No debe entenderse como una fase introspectiva de auto-evaluación moral o meta-cognitiva.

Una UCA no requiere observarse a sí misma para decidir si ha actuado correctamente; observa el estímulo, el contexto, evidencias externas o resultados previos de otras unidades.

---

## 9. Disposition (Disposición de Comportamiento)

La `Disposition` representa la predisposición operativa de una UCA.

No es una simple variable de configuración técnica; modula y pondera cómo la UCA razona o actúa.

Puede gobernar, por ejemplo:

- tolerancia a la ambigüedad;
- sensibilidad ante contradicciones;
- umbral de confianza necesario para emitir un resultado;
- ponderación de evidencias directas vs indirectas;
- propensión a invocar capacidades de alto coste computacional;
- comportamiento ante incertidumbre.

Ejemplo conceptual:

```text
Disposition
├── ambiguityTolerance: 0.2
├── confidenceSensitivity: 0.85
└── inferenceThreshold: 0.7
```

La Disposition condiciona cómo una UCA orquesta sus capacidades para cumplir su Purpose.

---

## 10. Una UCA no modifica su propia Disposition

Una UCA no debe evaluarse a sí misma y modificar directamente su propio comportamiento interno.

La adaptación debe proceder siempre de otra capacidad cognitiva diferenciada cuyo Purpose justifique dicha supervisión:

```text
UCA de Supervisión (Supervisory UCA)
    ↓
UCA de Diagnóstico (Diagnostic UCA)
    ↓
UCA de Adaptación (Adaptation UCA)
    ↓
Modificación de la Disposition de otra UCA (ej. UCA de Ingress o Conocimiento)
```

Esto previene la creación de componentes que simultáneamente actúen, se juzguen a sí mismos y se muten sin control externo.

---

## 11. Capabilities (Capacidades)

Las `Capabilities` son los recursos instrumentales y ejecutores que una UCA puede utilizar para satisfacer su Purpose.

Pueden ser:

```text
algoritmos deterministas
drivers y protocolos
parsers y analizadores sintácticos
modelos de embeddings
índices vectoriales o relacionales
servicios de red
modelos predictivos o LLMs
herramientas del entorno (tools)
otras UCAs
```

Una Capability no es automáticamente una UCA.

---

## 12. Cuándo una Capability se convierte en UCA

Una Capability se convierte en una UCA cuando en su diseño emerge un **Purpose cognitivo autónomo**.

Ejemplo:

```text
UCA de Memoria / Conocimiento
```

puede utilizar internamente:

```text
tokenizer
embeddings
almacén vectorial
similitud coseno
algoritmo de re-ranking
fallback inferencial
```

Estos elementos son meros mecanismos o capacidades terminales.

No precisan convertirse en UCAs independientes salvo que se identifique en alguno un propósito cognitivo autónomo real.

Regla:

> La descomposición en UCAs continúa mientras aparezcan propósitos autónomos.

> Cuando dejan de aparecer propósitos autónomos y solo restan mecanismos funcionales, se han alcanzado capacidades terminales.

---

## 13. Una UCA puede ser Capability de otra UCA (Composición Recursiva)

Las UCAs pueden componerse jerárquica y recursivamente.

Ejemplo:

```text
UCA de Coherencia y Supervisión (UCA₁)
├── UCA de Diagnóstico (UCA₂)
└── UCA de Adaptación (UCA₃)
```

Siempre que `UCA₂` y `UCA₃` posean propósitos cognitivos autónomos:

```text
UCA de Diagnóstico (UCA₂)
Purpose: Identificar la causa raíz de una desviación cognitiva a partir de la evidencia.

UCA de Adaptación (UCA₃)
Purpose: Ajustar las disposiciones de comportamiento ante evidencia de desviación.
```

La UCA de supervisión utiliza a ambas como capacidades subordinadas para cumplir su propio propósito superior.

---

## 14. Las UCAs especializadas no son mini-agentes omnipotentes

Una UCA especializada no debe transformarse en un mini-agente genérico que decida libremente su curso de acción fuera de su ámbito.

Una UCA de conocimiento puede decidir internamente qué parser o índice consultar, pero no debe decidir arbitrariamente invocar a una UCA de supervisión o emitir una respuesta externa, salvo que dicha coordinación constituya de forma explícita su Purpose.

La coordinación entre dominios corresponde a una UCA cuyo Purpose justifique dicha orquestación.

---

## 15. Action (Acción)

La `Action` representa aquello que una UCA ejecuta para intentar satisfacer el Goal recibido.

Conceptualmente:

```text
Purpose + Goal + Context + Observation + Disposition + Capabilities ──► Action
```

Una Action no equivale necesariamente a una llamada a un LLM; puede ser una operación completamente determinista, una búsqueda, una transformación o una invocación a otra unidad:

```text
recuperar registro de conocimiento
identificar atributos de interlocutor
parsear estructura de datos
sintetizar expresión de salida
contrastar evidencias
invocar UCA subordinada
```

---

## 16. Los LLMs como Capabilities, no como UCAs

Un modelo de lenguaje (LLM) no es una UCA por definición; es una Capability instrumental.

Una UCA puede recurrir a un LLM cuando su Purpose demanda inferencia o razonamiento que no puede resolverse de forma determinista.

Por tanto:

> Una UCA no es un LLM.

> Un LLM es solo una posible Capability al servicio del Purpose de una UCA.

Esto permite reemplazar proveedores, modelos locales o algoritmos sin alterar la arquitectura cognitiva del sistema.

---

## 17. Outcome (Resultado Producido)

El `Outcome` representa **lo que la Action produjo efectivamente en la realidad**.

Distinción:

```text
GOAL: ¿Qué resultado se pretendía alcanzar?
OUTCOME: ¿Qué produjo realmente la acción ejecutada?
```

El concepto de Outcome sustituye conceptos puramente computacionales como `Result` o `Response`.

Las UCAs producen Outcomes; estos Outcomes pueden empaquetarse y transportarse a través de impulsos por la capa de transporte.

---

## 18. Attainment (Grado de Satisfacción del Objetivo)

`Attainment` representa el grado en que un Outcome satisface el Goal que originó la activación.

Existe un principio de separación ontológica fundamental:

> El Outcome pertenece a quien ejecuta.

> El Attainment pertenece a quien estableció el Goal.

La UCA que ejecuta una acción produce un Outcome y no tiene por qué determinar si satisface la necesidad global del solicitante.

Ejemplo:

```text
UCA₁ (Coordinador)
Goal: "Obtener quién decidió adoptar la tecnología X"
        ↓
UCA₂ (Conocimiento / Memoria)
Outcome: "Christian decidió adoptar la tecnología X"
        ↓
UCA₁ (Coordinador)
Attainment: Evalúa si el Outcome responde satisfactoriamente a su necesidad.
```

---

## 19. El Attainment es Relativo al Evaluador

No existe necesariamente un Attainment universal o absoluto; siempre se evalúa en relación al Goal del observador.

Ejemplo a escala global:

```text
Diseñador del Sistema
Purpose: Diseñar un sistema cognitivo adaptativo.
Goal: Implementar la especificación UCA.
        ↓
Sistema Cognitivo
Outcome: Conjunto de UCAs interactuando.
        ↓
Diseñador del Sistema
Attainment: ¿El sistema obtenido satisface la meta original del diseño?
```

El sistema no puede auto-declarar unilateralmente que ha alcanzado el éxito; es el emisor de la meta quien determina el Attainment.

---

## 20. Reactividad

Una UCA nunca se auto-ejecuta de manera espontánea.

Regla:

> Una UCA ejecuta su ciclo exclusivamente cuando recibe un Stimulus.

No existe el flujo en el que una UCA "despierta" por sí misma sin causa. Toda ejecución es localmente reactiva a un estímulo recibido.

---

## 21. Causalidad Externa

Toda cadena de activación dentro de un agente o sistema cognitivo debe tener un origen causal externo al propio sistema cognitivo.

Un estímulo externo puede provenir de:

```text
mensaje de un interlocutor
señal de voz o audio
evento del entorno o sistema operativo
notificación de un temporizador (timer)
retorno de una herramienta externa
evento de ciclo de vida del sistema (inicialización / startup)
```

Las UCAs internas pueden encadenar activaciones subsiguientes como consecuencia causal directa de ese estímulo inicial, pero ninguna cadena surge espontáneamente en el vacío.

---

## 22. Inicialización del Sistema como Estímulo Externo

El arranque inicial de un agente cognitivo constituye también un estímulo causal externo:

```text
INICIALIZACIÓN DEL SISTEMA
           ↓
        Impulse
           ↓
        Stimulus
           ↓
   UCAs Fundamentales (ej. UCA de Identidad)
```

Esto permite que ciertas capacidades cognitivas (como la representación de quién es el agente) se configuren antes de iniciar una conversación o recibir órdenes de un usuario.

---

## 23. UCA de Identidad (Self UCA)

Una UCA fundamental en un agente cognitivo es aquella responsable de la identidad propia:

```text
UCA de Identidad

Purpose:
Mantener y proyectar una representación coherente
de la identidad, límites y rol del sistema.
```

Puede utilizar como Capabilities:

```text
directrices declaradas
memorias autobiográficas
relaciones registradas
inferencia
```

El dato estático `"NombreDelAgente"` no es la UCA.

La UCA es **la capacidad cognitiva de mantener y articular quién es el agente**.

---

## 24. Conocimiento vs Capacidad Cognitiva

Almacenar datos o representaciones no equivale a poseer una capacidad cognitiva.

Ejemplo:

```text
Registro de Memoria:
Contiene datos estructurados sobre identidad o usuarios.
```

frente a:

```text
UCA de Identidad / Relación:
Capacidad activa de interpretar, razonar y proporcionar coherencia situacional.
```

El almacén suministra evidencia; la UCA ejerce una capacidad cognitiva guiada por su Purpose.

---

## 25. Proactividad Emergente

Una UCA individual no es proactiva; es puramente reactiva a su estímulo.

Sin embargo, el sistema en su conjunto puede exhibir comportamiento proactivo emergente:

```text
Estímulo Externo
      ↓
UCA₁ (Ingress / Coordinación)
      ↓ Outcome
UCA₂ (Análisis / Memoria)
      ↓ Outcome
UCA₃ (Planificación / Expresión)
      ↓
Acción orientada al exterior
```

Aunque el estímulo externo inicial fuera mínimo, la interacción en cadena entre múltiples unidades autónomas produce acciones compuestas no solicitadas explícitamente en el primer paso.

> La autonomía reside en el Purpose.
> La reactividad gobierna la ejecución de cada unidad.
> La proactividad emerge de la interacción entre unidades.

---

## 26. Cognición Emergente

La cognición no reside en una UCA aislada ni en un modelo central monolítico.

Emerge de la interacción causal, distribuida y contextual entre unidades especializadas:

```text
Cognición = Interacción(
    Purposes,
    Goals,
    Contextos,
    Dispositions,
    Capabilities,
    Actions,
    Outcomes,
    Evidencias Externas
)
```

Cada UCA mantiene una responsabilidad acotada; el comportamiento inteligente pertenece al sistema resultante.

---

## 27. El Entorno Exterior como Parte del Bucle Cognitivo

El sistema actúa sobre el exterior y el exterior responde. Esa respuesta exterior se transforma en nueva evidencia:

```text
Agente emite Outcome
         ↓
      Exterior
         ↓
Respuesta / Corrección Externa
         ↓
Nuevo Estímulo Externo
```

El sistema no necesita anticipar o precalcular todo internamente; la interacción con el entorno aporta la evidencia necesaria para verificar o corregir su comportamiento.

---

## 28. Aprendizaje Mediante Interacción y Adaptación de Disposiciones

El aprendizaje no consiste en que cada unidad modifique su propio código o prompt en caliente.

Emerge del circuito:

```text
Outcome del Sistema
       ↓
    Exterior
       ↓
Evidencia Externa (corrección o validación)
       ↓
Nuevo Estímulo
       ↓
UCA de Supervisión / Diagnóstico
       ↓
UCA de Adaptación
       ↓
Modificación de la Disposition de la UCA responsable
       ↓
Comportamiento futuro adaptado
```

Aprender consiste en que la interacción genere evidencia para que unidades especializadas adapten las `Dispositions` que gobernarán activaciones futuras.

---

## 29. UCA de Supervisión y Preservación de Coherencia

Una arquitectura basada en UCAs puede contar con una o más unidades dedicadas a preservar la coherencia y calidad del sistema:

```text
UCA de Coherencia y Supervisión (UCA₁)
├── UCA de Diagnóstico (UCA₂)
└── UCA de Adaptación (UCA₃)
```

- `UCA₂ (Diagnóstico)`: Evalúa discrepancias entre lo esperado y lo ocurrido para determinar la causa de un fallo o desviación.
- `UCA₃ (Adaptación)`: Determina qué `Disposition` debe ajustarse en la UCA causante para mitigar el error en situaciones equivalentes.

---

## 30. UCA de Coordinación y Enrutamiento

En sistemas con múltiples canales de entrada o dominios, una UCA puede tener como Purpose coordinar y distribuir estímulos:

```text
              UCA₁ (Coordinador)
            /         |         \
           /          |          \
          ↓           ↓           ↓
     UCA₂ (Self)  UCA₃ (Memoria)  UCA₄ (Expresión)
```

El coordinador no contiene la lógica ni las capacidades de las demás unidades; simplemente coordina su activación según su Purpose específico.

---

## 31. Comunicación entre UCAs y Capa de Transporte

Las UCAs no requieren acoplamiento directo ni referencias duras entre sí.

La interacción se produce a través de la capa de transporte del sistema (`Transport Layer` / `Event Bus`) mediante `Impulses`:

```text
UCA₁
  ↓ emite
Stimulus { Goal, Context }
  ↓ transportado por
Impulse
  ↓ vía
Capa de Transporte
  ↓ entrega
UCA₂
  ↓ ejecuta ciclo
Outcome
  ↓ transportado por
Impulse de Retorno
  ↓ vía
Capa de Transporte
  ↓ entrega
UCA₁
```

Esto garantiza desacoplamiento, concurrencia y tolerancia a fallos.

---

## 32. Trazabilidad Causal

Aunque las UCAs sean independientes y asíncronas, la cadena causal completa debe ser trazable mediante metadatos en el impulso:

- `traceId`: Identificador único de la transacción o interacción de origen.
- `parentImpulseId`: Referencia causal al impulso precedente.
- `sessionId`: Identificador de la sesión de interacción.
- `timestamp`: Marca temporal del evento.

Cadena conceptual:

```text
Estímulo Externo ──► UCA Ingress [trace X] ──► UCA₁ [trace X] ──► UCA₂ [trace X] ──► UCA Egress [trace X] ──► Exterior
```

---

## 33. Reevaluación del Patrón de Snapshot Global Centralizado

En muchas arquitecturas clásicas de agentes, se recurre a un objeto monolítico central (habitualmente denominado *CognitiveSnapshot* o *AgentState*) que agrupa todo el estado: identidad, usuarios, tareas, diálogo reciente, relaciones y variables del entorno.

Dentro de la arquitectura UCA, este patrón se identifica a menudo como un síntoma de diseño: un repositorio contenedor que acumula resultados de capacidades que aún no han sido modeladas como unidades cognitivas autónomas.

---

## 34. Descomposición del Estado Global

Cualquier fragmento de un estado global monolítico debe someterse al siguiente análisis ontológico:

```text
¿Qué representa conceptualmente este dato?
├── 1. ¿Conocimiento persistente? ──► Pertenece a una UCA de Memoria / Almacén.
├── 2. ¿Estado técnico de ejecución? ──► Pertenece al Runtime / Transporte.
└── 3. ¿Capacidad cognitiva activa? ──► Identificar su Purpose y formalizar una UCA.
```

---

## 35. El Estado Distribuido en la Organización Cognitiva

El estado de un sistema cognitivo no requiere residir en un único objeto serializado en memoria.

Emerge de:
- las UCAs activas en el sistema;
- las `Dispositions` vigentes en cada UCA;
- el conocimiento adquirido disponible;
- los Outcomes previos relevantes;
- el Contexto delimitado de la cadena causal en curso.

---

## 36. Contexto Dinámico como Construcción Cognitiva

El `Context` para una activación no es una copia indiscriminada del sistema entero; se construye dinámicamente mediante los Outcomes de las capacidades pertinentes:

```text
UCA Coordinadora
├── UCA de Identidad ──► Outcome (Contexto de rol)
├── UCA de Memoria   ──► Outcome (Conocimiento relevante)
└── UCA Social       ──► Outcome (Datos del interlocutor)
        ↓
Contexto especializado y compacto para la acción actual
```

---

## 37. Abstracción Fundamental de una UCA

Una UCA puede expresarse mediante una interfaz minimalista:

```typescript
interface UCA<TGoal, TContext, TOutcome, TDisposition> {
  readonly purpose: string;
  disposition: TDisposition;
  readonly capabilities: Capability[];

  execute(stimulus: Stimulus<TGoal, TContext>): Promise<Outcome<TOutcome>>;
}
```

Donde:
- `Stimulus` agrupa `Goal` y `Context`.
- `execute` aplica la observación, pondera la disposición y capacidades, ejecuta la acción y devuelve el `Outcome`.

---

## 38. Separación entre UCA y Runtime

El **Runtime** se responsabiliza de los aspectos operacionales de infraestructura:
- enrutamiento de impulsos y entrega;
- serialización, tiempos límite (timeouts) y concurrencia;
- trazabilidad de trazas e identificadores causales;
- ciclo de vida del proceso y reactividad del bus.

La **UCA** se concentra de forma pura en los aspectos cognitivos:
- `Purpose`, `Disposition`, `Capabilities`, `Stimulus`, `Action` y `Outcome`.

---

## 39. Descubrimiento y Delimitación de UCAs

Las UCAs no deben derivarse de taxonomías prefabricadas ni de clasificaciones arbitrarias. Se descubren identificando propósitos autónomos:

```text
Necesidad funcional en el sistema
              ↓
¿Existe un propósito cognitivo autónomo y estable?
              ├── NO ──► Es una Capability o un mecanismo funcional ordinario.
              └── SÍ ──► Formalizar una nueva UCA.
                              ↓
                      ¿Qué capacidades requiere para cumplirlo?
                              ↓
              ¿Alguna de esas capacidades tiene a su vez un propósito autónomo?
                              ├── SÍ ──► Nueva UCA subordinada (Composición).
                              └── NO ──► Capacidad terminal (Algoritmo, LLM, herramienta).
```

---

## 40. Ejemplo de Adaptación: Corrección de Hechos

1. **Estímulo inicial**: El interlocutor afirma: *"Christian decidió utilizar WebRTC"*.
2. La UCA de Ingress percibe el mensaje y activa a la UCA Coordinadora ($UCA_1$).
3. $UCA_1$ consulta a la UCA de Memoria ($UCA_2$) y emite una respuesta incorrecta a través de la UCA de Egress: *"Marco decidió utilizar WebRTC"*.
4. **Evidencia externa de error**: El usuario replica: *"No, te acabo de decir que fue Christian, no Marco"*.
5. La UCA Coordinadora detecta la discrepancia contextual y activa la UCA de Supervisión ($UCA_3$).
6. $UCA_3$ diagnostica que la ponderación de la memoria reciente fue insuficiente ante una contradicción y adapta la `Disposition` de la UCA de Memoria (incrementando su sensibilidad a correcciones directas).
7. Ante una situación futura equivalente, la UCA de Memoria actúa con la nueva disposición y emite el resultado correcto, **sin modificar código y sin necesidad de reentrenar ningún modelo**.

---

## 41. Qué NO es una UCA

No constituyen por sí mismos una UCA:

```text
un mensaje o evento
un impulso de red
un prompt o plantilla de texto
un LLM o API de modelo
un algoritmo de búsqueda o parser
una base de datos o índice vectorial
un registro o propiedad de estado
```

Todos ellos son valiosos componentes instrumentales (`Capabilities` o `Transport`), pero solo existe UCA cuando se articula alrededor de un `Purpose` autónomo.

---

## 42. Principios Fundamentales del Modelo UCA

1. **Principio de Purpose**: Una UCA existe porque posee un propósito autónomo y estable.
2. **Principio de Especialización**: Solo acepta Goals compatibles con su Purpose.
3. **Principio de Reactividad**: No existe autoactivación espontánea; opera únicamente ante un Stimulus.
4. **Principio de Causalidad Externa**: Toda cadena cognitiva se origina en el exterior del sistema cognitivo.
5. **Principio de Composición**: Una UCA puede utilizar otra UCA como Capability subordinada.
6. **Principio de Terminación**: Cuando dejan de emerger propósitos autónomos y solo restan mecanismos, se han alcanzado capacidades terminales.
7. **Principio de Outcome**: Una UCA produce Outcomes reales; no se autoevalúa en abstracto.
8. **Principio de Attainment**: El Outcome pertenece a quien ejecuta; el Attainment pertenece a quien fijó el Goal.
9. **Principio de No Autoadaptación**: Una UCA no altera su propia Disposition; la adaptación procede de una capacidad supervisora independiente.
10. **Principio de Emergencia**: La cognición no reside en una unidad central; emerge de la interacción contextual entre unidades.
11. **Principio de Proactividad**: La autonomía está en el Purpose, la reactividad en la ejecución y la proactividad emerge del encadenamiento causal.
12. **Principio de Representación**: Poseer el dato producido por una capacidad cognitiva no equivale a poseer la capacidad cognitiva que lo genera.

---

## 43. Modelo Global de Interacción

```text
                         EXTERIOR
                            │
                         Stimulus
                            │
                            ▼
                    ┌───────────────┐
                    │ SISTEMA UCA   │
                    │               │
                    │     UCA₁      │
                    │    /  |  \    │
                    │  UCA₂ UCA₃ UCA₄│
                    │    \  |  /    │
                    │    Outcomes   │
                    │       │       │
                    │    Context    │
                    │       │       │
                    │  Nuevas Acciones│
                    └───────┬───────┘
                            │
                         Outcome
                            │
                            ▼
                         EXTERIOR
                            │
                      Nueva Evidencia
                            │
                            └──────────────► (Alimenta adaptaciones futuras)
```

---

## 44. Criterios de Validación Empírica

El modelo UCA se valida cuando un conjunto de unidades es capaz de:

1. Recibir un estímulo externo;
2. Reaccionar según sus propósitos especializados sin una entidad central omnisciente;
3. Colaborar mediante intercambio de estímulos y resultados;
4. Producir una acción hacia el entorno exterior;
5. Recibir evidencia externa sobre el resultado de dicha acción;
6. Emplear esa evidencia para diagnosticar desviaciones;
7. Adaptar una o más `Dispositions`;
8. Reaccionar de forma adaptada y correcta ante un escenario futuro equivalente;
9. Lograrlo **sin alteración de código fuente**;
10. Lograrlo **sin reentrenamiento de modelos**;
11. Lograrlo **sin reglas cableadas ad-hoc diseñadas para el caso concreto**.

---

## 45. Tesis Central

> **Una UCA es una unidad funcional autónoma en propósito y reactiva en ejecución.**
>
> **Recibe un Goal dentro de un Context, aplica sus Dispositions y Capabilities, ejecuta una Action y produce un Outcome.**
>
> **El Outcome es evaluado respecto al Goal por quien originó la necesidad (Attainment).**
>
> **Toda actividad cognitiva parte de causas externas, pero la interacción contextual entre unidades produce cognición y proactividad emergente.**
>
> **El conocimiento aporta evidencia; las UCAs aportan capacidades orientadas a propósitos; el runtime aporta transporte e infraestructura.**
>
> **La cognición no reside en una única UCA ni en un modelo central: emerge de la interacción dinámica entre capacidades especializadas y su entorno.**
