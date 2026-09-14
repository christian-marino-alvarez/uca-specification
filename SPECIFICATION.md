# UCA — Unidad Cognitiva Autónoma

## 1. Definición

Una **UCA (Unidad Cognitiva Autónoma)** es una unidad funcional del sistema cognitivo definida por un **propósito autónomo**.

Una UCA no se define por el algoritmo que ejecuta, por el modelo que utiliza ni por los datos que procesa.

Se define por **para qué existe dentro del sistema cognitivo**.

> Una UCA no se define por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

Ejemplos conceptuales:

- saber quién soy;
- reconocer con quién estoy interactuando;
- proporcionar conocimiento adquirido relevante;
- preservar la coherencia cognitiva;
- expresar información hacia el exterior;
- interpretar estímulos auditivos;
- coordinar una reacción cognitiva.

Una UCA puede utilizar algoritmos, modelos, almacenamiento, drivers, herramientas, servicios, LLMs o incluso otras UCAs para cumplir su propósito.

---

# 2. Purpose

El `Purpose` expresa **por qué existe una UCA**.

Es estable y no depende de una ejecución concreta.

Ejemplo:

```text
Memory UCA

Purpose:
Proporcionar conocimiento previamente adquirido
relevante para una necesidad cognitiva.
```

Incorrecto:

```text
Purpose:
Buscar vectores en Qdrant.
```

Buscar vectores es un mecanismo.

No es necesariamente un propósito cognitivo.

Otro ejemplo:

```text
Self UCA

Purpose:
Mantener una representación coherente
de quién es el Agent.
```

El Purpose debe ser independiente de la implementación.

---

# 3. Goal

El `Goal` representa **qué resultado concreto necesita obtenerse en una activación determinada**.

A diferencia del Purpose:

```text
PURPOSE
¿Por qué existe esta UCA?

GOAL
¿Qué necesito conseguir ahora?
```

El Purpose es persistente.

El Goal es contextual.

Ejemplo:

```text
Memory UCA

Purpose:
Proporcionar conocimiento adquirido relevante.

Goal:
Obtener información relacionada
con la decisión de utilizar WebRTC.
```

Una UCA interpreta el Goal siempre bajo su propio Purpose.

---

# 4. Compatibilidad entre Goal y Purpose

Una UCA solamente debería aceptar Goals compatibles con su Purpose.

Ejemplo válido:

```text
Memory UCA

Purpose:
Proporcionar conocimiento adquirido.

Goal:
Recuperar información sobre Christian.
```

Ejemplo inválido:

```text
Memory UCA

Purpose:
Proporcionar conocimiento adquirido.

Goal:
Responder verbalmente al usuario.
```

Ese Goal pertenece al dominio de otra UCA.

Esta restricción evita convertir las UCAs en agentes genéricos capaces de hacer cualquier cosa.

---

# 5. Stimulus

Una UCA solamente se ejecuta cuando recibe un `Stimulus`.

El Stimulus representa **la activación cognitiva de la UCA**.

Conceptualmente contiene:

```text
Stimulus
├── Goal
└── Context
```

El Stimulus no es el mecanismo de transporte.

El transporte pertenece al `Impulse`.

---

# 6. Impulse

El `Impulse` pertenece al sistema nervioso del Agent.

Es el mecanismo utilizado para transportar activaciones e información entre componentes.

Puede contener información técnica como:

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

> UCA no es un mensaje.

> Stimulus no es un Impulse.

> Impulse transporta un Stimulus.

---

# 7. Context

El `Context` contiene la información necesaria para que una UCA pueda interpretar correctamente su Goal.

No debería representar todo el conocimiento disponible del Agent.

Debe contener únicamente aquello que resulte relevante para esa activación.

Conceptualmente:

```text
Stimulus
├── Goal
└── Context
```

El Context proporciona continuidad entre interacciones.

Sin contexto:

```text
Stimulus
→ Reaction

Stimulus
→ Reaction

Stimulus
→ Reaction
```

Cada interacción sería prácticamente independiente.

Con contexto:

```text
previous Outcomes
        +
external evidence
        +
current Stimulus
        ↓
     Context
        ↓
current cognition
```

El pasado puede modificar la interpretación del presente.

---

# 8. Observation

La UCA observa aquello que recibe a través del Stimulus y su Context.

La Observation representa la información cognitivamente relevante que la UCA obtiene de esa entrada.

No debe entenderse como una fase obligatoria de introspección posterior a la ejecución.

Una UCA no necesita observarse a sí misma para decidir si ha actuado correctamente.

Puede observar:

- el Stimulus actual;
- información contextual;
- Outcomes anteriores;
- evidencia procedente de otras UCAs;
- evidencia procedente del exterior.

---

# 9. Disposition

La `Disposition` representa la predisposición de comportamiento de una UCA.

No es simplemente configuración técnica.

Puede afectar, por ejemplo, a:

- tolerancia a ambigüedad;
- sensibilidad a contradicciones;
- confianza necesaria;
- prioridad de determinadas evidencias;
- utilización de capacidades costosas;
- comportamiento ante incertidumbre.

Ejemplo conceptual:

```text
Disposition
├── ambiguityTolerance
├── confidenceSensitivity
└── inferenceThreshold
```

La Disposition condiciona cómo una UCA utiliza sus capacidades para cumplir su Purpose.

---

# 10. Una UCA no modifica su propia Disposition

Una UCA no debería autoevaluarse y modificar directamente su propio comportamiento.

La adaptación debe proceder de otra capacidad cognitiva cuyo Purpose justifique dicha modificación.

Por ejemplo:

```text
Cingulate
    ↓
Diagnosis
    ↓
Adaptation
    ↓
Disposition de otra UCA
```

Esto evita crear UCAs que simultáneamente:

- actúan;
- se evalúan;
- se diagnostican;
- se modifican.

---

# 11. Capabilities

Las `Capabilities` son los recursos que una UCA puede utilizar para alcanzar su Purpose.

Pueden ser:

```text
algoritmos
drivers
parsers
embeddings
vector stores
bases de datos
servicios
modelos ML
LLMs
herramientas
otras UCAs
```

Una Capability no es automáticamente una UCA.

---

# 12. Cuándo una Capability se convierte en UCA

Una Capability se convierte en UCA cuando aparece un **Purpose autónomo**.

Ejemplo:

```text
Memory UCA
```

puede utilizar:

```text
parser
embeddings
Qdrant
cosine similarity
ranking
LLM fallback
```

Estos elementos son mecanismos.

No necesitan convertirse en:

```text
Parser UCA
Embedding UCA
Vector Search UCA
Ranking UCA
```

a menos que descubramos que alguno posee realmente un Purpose cognitivo autónomo.

Regla:

> La descomposición en UCAs continúa mientras exista un propósito autónomo.

> Cuando dejan de aparecer nuevos propósitos y solamente quedan mecanismos, hemos llegado a capacidades terminales.

---

# 13. Una UCA puede ser Capability de otra UCA

Las UCAs pueden componerse recursivamente.

Ejemplo:

```text
Cingulate UCA
├── Diagnosis UCA
└── Adaptation UCA
```

siempre que Diagnosis y Adaptation tengan propósitos autónomos reales.

Por ejemplo:

```text
Diagnosis UCA

Purpose:
Identificar qué produjo una desviación cognitiva
a partir de la evidencia disponible.
```

y:

```text
Adaptation UCA

Purpose:
Adaptar las disposiciones cognitivas
a partir de evidencia de comportamiento inadecuado.
```

Cingulate puede utilizar ambas como Capabilities.

---

# 14. Las UCAs especializadas no son mini-agentes

Una UCA especializada no debe convertirse en un agente genérico capaz de decidir arbitrariamente qué hacer después.

Por ejemplo, Memory puede decidir:

```text
usar parser
usar embeddings
buscar en vector store
utilizar inferencia como fallback
```

porque son capacidades definidas para cumplir su Purpose.

Pero Memory no debería decidir arbitrariamente:

```text
"He encontrado algo extraño.
Voy a llamar a Cingulate."
```

salvo que dicha coordinación forme explícitamente parte de su Purpose.

La coordinación entre dominios corresponde a una UCA cuyo Purpose justifique esa responsabilidad.

---

# 15. Action

La `Action` representa aquello que una UCA hace para intentar satisfacer el Goal recibido bajo su Purpose.

Conceptualmente:

```text
Purpose
+
Goal
+
Context
+
Observation
+
Disposition
+
Capabilities
        ↓
      Action
```

Una Action no tiene por qué ser una inferencia.

Puede ser completamente determinista.

Ejemplos:

```text
retrieve memory
identify speaker
parse language
generate speech
compare evidence
invoke another UCA
```

---

# 16. LLM

Un LLM no es una UCA por definición.

Es una Capability.

Una UCA puede utilizarlo cuando su Purpose requiere interpretación o inferencia que no puede resolverse adecuadamente mediante mecanismos deterministas.

Por tanto:

> Una UCA no es una inferencia.

> Un LLM es solamente una posible Capability de una UCA.

Esto permite sustituir modelos sin modificar la arquitectura cognitiva.

---

# 17. Outcome

El `Outcome` representa **lo que realmente produjo la Action**.

Distinción:

```text
GOAL
¿Qué quería obtener?

OUTCOME
¿Qué produjo realmente la acción?
```

Ejemplo:

```text
Goal:
Obtener quién decidió utilizar WebRTC.

Outcome:
Christian decidió utilizar WebRTC.
```

Outcome sustituye conceptos más computacionales como `Result`.

También evita introducir una abstracción independiente llamada `Response`.

Las UCAs producen Outcomes.

Los Outcomes pueden posteriormente ser transportados mediante Impulses.

---

# 18. Attainment

`Attainment` representa el grado en que un Outcome satisface el Goal que originó la ejecución.

Pero existe una regla fundamental:

> El Outcome pertenece a quien ejecuta.

> El Attainment pertenece a quien estableció el Goal.

La UCA ejecutora no necesita determinar si ha cumplido correctamente la necesidad global de quien la utilizó.

Ejemplo:

```text
Thalamus

Goal:
Obtener conocimiento sobre quién decidió WebRTC.

        ↓

Memory UCA

Outcome:
Christian decidió utilizar WebRTC.

        ↓

Thalamus
```

Memory produce el Outcome.

Thalamus, que estableció la necesidad, es quien puede utilizar ese Outcome respecto a su Goal.

---

# 19. Attainment es relativo

No existe necesariamente un Attainment absoluto.

Existe respecto al Goal de quien observa un Outcome.

Ejemplo global:

```text
Developer

Purpose:
Crear un sistema cognitivo.

Goal:
Construir Extensio.

        ↓

Extensio

Outcome:
Sistema cognitivo funcionando.

        ↓

Developer

Attainment:
¿El sistema obtenido satisface
lo que pretendía construir?
```

Extensio no puede declarar legítimamente por sí mismo:

```text
"Soy un sistema cognitivo,
por tanto el Goal está conseguido."
```

El sistema es el Outcome que está siendo evaluado desde un nivel superior.

---

# 20. Reactividad

Una UCA nunca se autoejecuta.

Regla:

> Una UCA solamente ejecuta su ciclo cuando recibe un Stimulus.

No existe:

```text
UCA
↓
decide despertarse
↓
ejecuta
```

Existe:

```text
Stimulus
↓
UCA
↓
Action
↓
Outcome
```

Por tanto, una UCA es localmente reactiva.

---

# 21. Causalidad externa

Toda cadena cognitiva del Agent debe tener un origen externo al propio sistema cognitivo.

Un estímulo externo puede ser:

```text
voz
mensaje
evento del entorno
resultado de una herramienta
cambio de aplicación
timer
evento del sistema
startup
birth
```

Por ejemplo:

```text
External Stimulus
      ↓
Agent
      ↓
UCA
      ↓
UCA
      ↓
UCA
      ↓
Outcome
      ↓
Exterior
```

Las UCAs internas pueden generar nuevas activaciones como consecuencia causal de esa cadena.

Pero ninguna cadena aparece espontáneamente sin una causa.

---

# 22. Birth

El nacimiento o inicialización del Agent es también un estímulo externo al sistema cognitivo.

Conceptualmente:

```text
BIRTH
  ↓
Impulse
  ↓
Stimulus
  ↓
fundamental UCAs
```

Esto permite que determinadas capacidades cognitivas existan antes de cualquier conversación.

Por ejemplo:

```text
Birth
 ↓
Self UCA
 ↓
Outcome:
representación inicial de quién soy
```

El Agent no necesita esperar a que un usuario pregunte:

```text
"¿Quién eres?"
```

para poseer identidad.

La conversación no crea necesariamente la identidad.

La conversación puede proporcionar nueva evidencia capaz de modificarla.

---

# 23. Self UCA

Una posible UCA fundamental es aquella responsable de la identidad propia.

Ejemplo conceptual:

```text
Self UCA

Purpose:
Mantener una representación coherente
de quién es el Agent.
```

Puede utilizar como Capabilities:

```text
configuración
memoria autobiográfica
experiencias
relaciones
entorno
historial
inferencia
```

El dato:

```text
"Soy Extensio"
```

no es la UCA.

La UCA es:

```text
la capacidad cognitiva de saber quién soy
```

Esta distinción es fundamental.

---

# 24. Conocimiento vs capacidad cognitiva

No debe confundirse almacenar información con poseer una capacidad cognitiva.

Ejemplo:

```text
IDENTITY memory domain
```

puede almacenar información relacionada con identidad.

Pero:

```text
Self UCA
```

representa la capacidad de construir, mantener y proporcionar una representación coherente de la propia identidad.

Por tanto:

```text
Memory
= conocimiento

UCA
= capacidad cognitiva con Purpose
```

Una UCA puede utilizar Memory como Capability.

---

# 25. Proactividad emergente

Una UCA no es proactiva.

Sin embargo, el Agent completo puede exhibir comportamiento aparentemente proactivo.

Esto ocurre porque un Stimulus externo puede desencadenar una cadena de interacciones internas.

Ejemplo:

```text
External Stimulus
      ↓
UCA A
      ↓ Outcome
UCA B
      ↓ Outcome
UCA C
      ↓
acción hacia el exterior
```

Aunque el usuario solamente produjo el primer estímulo, la interacción entre UCAs puede generar nuevas acciones no solicitadas explícitamente.

Por tanto:

> La autonomía está en el Purpose.

> La reactividad está en la ejecución.

> La proactividad emerge de la interacción.

---

# 26. Cognición emergente

La cognición no reside necesariamente en una UCA concreta.

No reside en Thalamus.

No reside en Memory.

No reside en Cingulate.

Y no reside en un LLM.

La cognición emerge de la interacción causal y contextual entre unidades especializadas.

Conceptualmente:

```text
Cognition =
interaction(
    Purposes,
    Goals,
    Context,
    Dispositions,
    Capabilities,
    Actions,
    Outcomes,
    external evidence
)
```

Cada UCA tiene una responsabilidad limitada.

El comportamiento cognitivo pertenece al sistema resultante.

---

# 27. El exterior forma parte del circuito cognitivo

El Agent actúa sobre el exterior.

El exterior responde.

Esa respuesta se convierte en nueva evidencia.

Ejemplo:

```text
Agent:
"Marco decidió utilizar WebRTC."

        ↓

User:
"No. Te acabo de decir que fue Christian."

        ↓

nuevo Stimulus
```

La corrección del usuario proporciona evidencia acerca del comportamiento anterior del Agent.

No es necesario que el Agent haya calculado previamente:

```text
Attainment = FAILED
```

La interacción proporciona esa evidencia.

---

# 28. Aprendizaje mediante interacción

El aprendizaje no requiere que cada UCA se evalúe y modifique a sí misma.

Puede emerger mediante:

```text
Agent Outcome
      ↓
Exterior
      ↓
external evidence
      ↓
new Stimulus
      ↓
Context
      ↓
Cingulate
      ↓
Diagnosis
      ↓
Adaptation
      ↓
Disposition change
      ↓
future behaviour changes
```

Por tanto:

> Aprender no consiste en que una UCA evalúe y modifique su propio comportamiento.

> Consiste en que la interacción produzca evidencia que otras UCAs puedan utilizar para adaptar las Dispositions que condicionarán comportamientos futuros.

---

# 29. Cingulate

Cingulate puede representar una capacidad cognitiva responsable de preservar la coherencia del Agent.

Su Purpose exacto debe definirse independientemente de la implementación.

Conceptualmente podría utilizar otras UCAs como Capabilities:

```text
Cingulate
├── Diagnosis
└── Adaptation
```

Diagnosis podría determinar:

```text
¿Qué produjo la desviación?
```

Adaptation podría determinar:

```text
¿Qué disposición debe cambiar
para reducir la probabilidad de repetirla?
```

Cingulate no necesita convertirse en un LLM que analiza todo el sistema.

---

# 30. Thalamus

Thalamus tampoco debe convertirse en un agente monolítico.

Su posible singularidad procede únicamente de su Purpose.

Si su Purpose es coordinar la reacción cognitiva del Agent ante los estímulos, entonces puede ser legítimo que utilice diferentes UCAs como Capabilities.

Ejemplo:

```text
              Thalamus
            /    |     \
           /     |      \
          ↓      ↓       ↓
       Self    Memory   Cingulate
        UCA      UCA       UCA
```

Thalamus no debe contener las capacidades cognitivas de esas UCAs.

Debe coordinarlas cuando su Purpose lo requiera.

---

# 31. Comunicación entre UCAs

Las UCAs no necesitan dependencias directas entre sí.

La comunicación puede mantenerse sobre NervousSystem + Impulses.

Conceptualmente:

```text
UCA A
 ↓
Stimulus {
    Goal,
    Context
}
 ↓
Impulse
 ↓
NervousSystem
 ↓
UCA B
 ↓
Action
 ↓
Outcome
 ↓
Impulse
 ↓
NervousSystem
 ↓
UCA A
```

Esto conserva la arquitectura reactiva de Extensio.

---

# 32. Trazabilidad causal

Aunque las UCAs sean independientes, debe poder reconstruirse la cadena causal de una interacción.

Por ejemplo mediante:

```text
traceId
parentImpulse
sessionId
timestamp
```

Conceptualmente:

```text
External Stimulus
      ↓ trace X
Ear
      ↓ trace X
Thalamus
      ↓ trace X
Memory
      ↓ trace X
Thalamus
      ↓ trace X
Mouth
      ↓
Exterior
```

Esto resulta especialmente importante para Diagnosis y aprendizaje.

---

# 33. CognitiveSnapshot

`CognitiveSnapshot` debe reconsiderarse dentro de la arquitectura UCA.

Históricamente puede haber servido para materializar en un único objeto diferentes aspectos del estado cognitivo:

```text
CognitiveSnapshot
├── self
├── interlocutors
├── relationships
├── recentDialogs
├── intentions
├── tasks
├── environment
└── ...
```

Pero muchos de esos campos pueden estar representando artificialmente Outcomes de capacidades cognitivas que todavía no estaban modeladas como UCAs.

---

# 34. Descomposición de CognitiveSnapshot

Cada elemento del CognitiveSnapshot debería analizarse preguntando:

```text
¿Qué representa realmente este dato?
```

Existen al menos tres posibilidades:

```text
1. Conocimiento
2. Estado técnico
3. Resultado de una capacidad cognitiva
```

### Conocimiento

Ejemplo:

```text
"Christian decidió utilizar WebRTC."
```

Puede pertenecer a Memory.

### Estado técnico

Ejemplo:

```text
activeAudioStream
pendingImpulse
traceId
```

Pertenece al runtime.

No es cognición.

### Capacidad cognitiva

Ejemplo:

```text
snapshot.self
```

puede estar ocultando una capacidad:

```text
Self UCA

Purpose:
Saber quién soy.
```

---

# 35. CognitiveSnapshot como síntoma arquitectónico

El CognitiveSnapshot puede estar actuando como sustituto de capacidades cognitivas todavía no identificadas.

Por ejemplo:

```text
CognitiveSnapshot.self
        ↓
Self UCA

CognitiveSnapshot.interlocutors
        ↓
UCA responsable de reconocer
con quién interactúa el Agent

CognitiveSnapshot.relationships
        ↓
posible UCA responsable
de comprender relaciones

CognitiveSnapshot.recentDialogs
        ↓
Memory / conversational knowledge
```

Estas correspondencias son hipótesis.

No debe crearse una UCA simplemente porque exista un campo.

El Purpose autónomo debe justificarla.

---

# 36. Posible desaparición de CognitiveSnapshot

El objetivo no debe ser eliminar CognitiveSnapshot arbitrariamente.

Debe ser **desgranarlo conceptualmente**.

Para cada propiedad:

```text
CognitiveSnapshot.property
        ↓
¿conocimiento?
        ↓
Memory

¿estado técnico?
        ↓
Runtime

¿capacidad cognitiva?
        ↓
buscar Purpose
        ↓
posible UCA
```

Si todas sus responsabilidades encuentran un lugar más preciso, CognitiveSnapshot puede terminar desapareciendo de manera natural.

No porque haya sido prohibido.

Sino porque habrá perdido su Purpose.

---

# 37. Estado cognitivo sin Snapshot global

El estado cognitivo del Agent no necesita existir necesariamente como una fotografía global materializada.

Puede emerger de:

```text
UCAs existentes
+
sus Dispositions
+
conocimiento adquirido
+
Outcomes anteriores
+
Context actual
+
cadena causal actual
```

Por tanto, el Agent puede poseer estado cognitivo sin necesitar:

```text
const cognitiveSnapshot = {...todo...}
```

El estado puede estar distribuido en la propia organización cognitiva.

---

# 38. Context como construcción cognitiva

El Context necesario para una UCA puede construirse mediante Outcomes de otras capacidades.

Ejemplo:

```text
Thalamus
   │
   ├── Self UCA
   │      ↓
   │   Outcome
   │
   ├── Memory UCA
   │      ↓
   │   Outcome
   │
   └── Interlocutor UCA
          ↓
       Outcome

          ↓

Context relevante
para la acción actual
```

De esta forma el Context no necesita ser una copia del estado completo del Agent.

---

# 39. Memoria no equivale a cognición

Una memoria perfectamente estructurada y recuperable no constituye por sí misma cognición.

Memory proporciona conocimiento.

Las UCAs proporcionan capacidades cognitivas.

Ejemplo:

```text
Memory:
"Christian es el usuario actual."

vs.

Interlocutor/Social UCA:
"¿Con quién estoy interactuando
y qué significa eso en esta situación?"
```

El almacenamiento proporciona evidencia.

La capacidad cognitiva la utiliza bajo un Purpose.

---

# 40. El dato no sustituye a la capacidad

Principio general:

> Tener almacenado el resultado de una capacidad cognitiva no equivale a poseer esa capacidad cognitiva.

Ejemplo:

```text
{
  "self": "Extensio"
}
```

no equivale a:

```text
Self UCA

Purpose:
Mantener una representación coherente
de quién soy.
```

El primero es información.

El segundo es una capacidad que puede utilizar información, experiencia y contexto para producir Outcomes.

---

# 41. UCA fundamental

Una UCA debería poder representarse mediante una abstracción extremadamente pequeña.

Conceptualmente:

```typescript
class UCA {
  purpose
  disposition
  capabilities

  execute(stimulus)
}
```

Donde:

```text
Stimulus
├── Goal
└── Context
```

y la ejecución produce:

```text
Outcome
```

La infraestructura no debería contaminar la definición cognitiva.

---

# 42. Runtime UCA

El runtime debe encargarse de aspectos técnicos como:

```text
Impulse routing
NervousSystem
storage
reactivity
subscriptions
traceId
serialization
timeouts
execution lifecycle
```

La UCA debería concentrarse en:

```text
Purpose
Disposition
Capabilities
Stimulus
Action
Outcome
```

Esto permite crear nuevas capacidades cognitivas sin volver a implementar infraestructura.

---

# 43. Ejecución mínima

Idealmente definir una UCA debería aproximarse a algo como:

```typescript
const memory = new UCA({
  purpose: 'Provide relevant acquired knowledge',
  disposition: {...},
  capabilities: [...]
});
```

Y ejecutarla debería ser conceptualmente tan simple como:

```typescript
await memory.act(stimulus);
```

La API exacta deberá diseñarse posteriormente.

Lo importante es que la complejidad técnica permanezca en el runtime.

---

# 44. Recursividad

La arquitectura UCA es recursiva.

Una UCA puede utilizar otra UCA.

Esa segunda puede utilizar una tercera.

Ejemplo:

```text
Agent
 ↓
Thalamus
 ↓
Cingulate
 ↓
Diagnosis
 ↓
Memory
 ↓
terminal capabilities
```

La recursión termina cuando desaparecen los nuevos Purposes autónomos y solamente quedan mecanismos.

---

# 45. Agent como sistema de UCAs

El Agent puede entenderse como un sistema compuesto por UCAs especializadas.

No debe asumirse:

```text
1 órgano biológico = 1 UCA
```

Los nombres actuales:

```text
Thalamus
Hippocampus
Cingulate
Ear
Mouth
...
```

son hipótesis arquitectónicas.

Cada uno debe superar la pregunta:

```text
¿Cuál es su Purpose autónomo?
```

Si no puede responderse claramente, quizá:

- no es una UCA;
- contiene varias UCAs;
- es solamente infraestructura;
- es una Capability;
- o pertenece a otro dominio.

---

# 46. Descubrimiento de UCAs

Las UCAs no deberían inventarse desde una taxonomía previa.

Deben descubrirse identificando propósitos cognitivos autónomos.

Proceso:

```text
Necesidad cognitiva
      ↓
¿Existe un Purpose autónomo?
      ↓
     sí
      ↓
    UCA
      ↓
¿qué necesita para cumplirlo?
      ↓
Capabilities
      ↓
¿alguna Capability posee otro Purpose autónomo?
      ↓
     sí
      ↓
 nueva UCA
```

Esto continúa hasta alcanzar mecanismos terminales.

---

# 47. Ejemplo completo: corrección de identidad

Usuario:

```text
"Christian fue quien decidió utilizar WebRTC."
```

Flujo conceptual:

```text
External Stimulus
      ↓
Ear
      ↓
Outcome:
"Christian fue quien decidió utilizar WebRTC."
      ↓
Thalamus
      ↓
Memory / otras UCAs
      ↓
Thalamus
      ↓
Mouth
      ↓
Outcome:
"Marco decidió utilizar WebRTC."
      ↓
Exterior
```

El Agent ha cometido un error.

No necesita autoevaluarse.

El usuario responde:

```text
"No. Te acabo de decir que fue Christian, no Marco."
```

Eso produce:

```text
new External Stimulus
      ↓
Ear
      ↓
Thalamus
```

Ahora existe evidencia contextual de incoherencia:

```text
previous user input:
Christian

previous Agent Outcome:
Marco

current user input:
correction → Christian
```

Thalamus puede, si su Purpose lo justifica, activar Cingulate.

```text
Thalamus
 ↓
Cingulate
 ↓
Diagnosis
 ↓
Outcome:
causa probable de la desviación
 ↓
Adaptation
 ↓
Disposition change
```

Una interacción futura similar puede producir un comportamiento diferente.

---

# 48. Qué NO es una UCA

No es automáticamente una UCA:

```text
un mensaje
un Impulse
un Stimulus
un prompt
un LLM
un parser
una función
una búsqueda
un embedding
un vector store
un algoritmo
un driver
un endpoint
una tabla
un dominio de memoria
un campo del CognitiveSnapshot
```

Cualquiera de ellos podría participar en una UCA.

Pero solamente existe UCA cuando existe un Purpose autónomo.

---

# 49. Principios fundamentales

## Principio de Purpose

> Una UCA existe porque posee un Purpose autónomo.

## Principio de especialización

> Una UCA solamente acepta Goals compatibles con su Purpose.

## Principio de reactividad

> Ninguna UCA se autoactiva; solamente ejecuta ante un Stimulus.

## Principio de causalidad

> Toda cadena cognitiva tiene un origen externo al sistema cognitivo.

## Principio de composición

> Una UCA puede utilizar otra UCA como Capability.

## Principio de terminación

> Cuando desaparecen los propósitos autónomos y solamente quedan mecanismos, termina la descomposición en UCAs.

## Principio de Outcome

> Una UCA produce Outcomes; no necesita autoevaluar globalmente su éxito.

## Principio de Attainment

> El Outcome pertenece a quien ejecuta; el Attainment pertenece a quien estableció el Goal.

## Principio de adaptación

> Una UCA no modifica su propia Disposition; la adaptación procede de otra capacidad cuyo Purpose lo justifica.

## Principio de emergencia

> La cognición no reside en una UCA individual; emerge de la interacción contextual y causal entre UCAs.

## Principio de proactividad

> La autonomía está en el Purpose, la reactividad está en la ejecución y la proactividad emerge de la interacción.

## Principio de representación

> Un dato producido por una capacidad cognitiva no sustituye a la capacidad cognitiva que permite producirlo.

---

# 50. Modelo conceptual mínimo

La definición persistente de una UCA puede reducirse a:

```text
UCA
├── Purpose
├── Disposition
└── Capabilities
```

Una activación:

```text
Stimulus
├── Goal
└── Context

        ↓

Observation

        ↓

Disposition
+
Capabilities

        ↓

Action

        ↓

Outcome
```

El Outcome vuelve al sistema mediante un Impulse.

Quien estableció el Goal puede utilizar dicho Outcome para determinar su propio Attainment y continuar la cadena cognitiva.

---

# 51. Modelo global

```text
                         EXTERIOR
                            │
                         Stimulus
                            │
                            ▼
                    ┌───────────────┐
                    │     AGENT     │
                    │               │
                    │      UCA      │
                    │    /  |  \    │
                    │   UCA UCA UCA │
                    │    \  |  /    │
                    │    Outcomes   │
                    │       │       │
                    │    Context    │
                    │       │       │
                    │   new Actions │
                    └───────┬───────┘
                            │
                         Outcome
                            │
                            ▼
                         EXTERIOR
                            │
                     nueva evidencia
                            │
                            └──────────────►
```

El exterior inicia cadenas causales.

Las UCAs reaccionan de acuerdo con sus Purposes.

Sus Outcomes modifican el contexto de otras UCAs.

El Agent actúa sobre el exterior.

El exterior proporciona nueva evidencia.

La experiencia puede modificar Dispositions.

Y el comportamiento futuro cambia.

---

# 52. Hipótesis arquitectónica

La hipótesis de Extensio es que un comportamiento cognitivo útil puede emerger de la interacción entre unidades cognitivas pequeñas, especializadas y autónomas en Purpose, sin depender de un único modelo central que posea todo el estado y tome todas las decisiones.

Por tanto, el objetivo no es construir:

```text
Input
 ↓
Big Cognitive Snapshot
 ↓
Big Prompt
 ↓
LLM
 ↓
Output
```

El objetivo es construir:

```text
Exterior
   ↓
Stimulus
   ↓
specialized UCAs
   ↕
Outcomes
   ↕
Context
   ↕
Memory
   ↕
Adaptation
   ↓
Exterior
```

donde los LLMs sean capacidades sustituibles y no el lugar donde reside la arquitectura cognitiva.

---

# 53. Consecuencia para Extensio

Antes de continuar creando órganos, módulos o nuevos pipelines cognitivos, debe existir una abstracción UCA mínima y estable.

Después, cada componente actual debe analizarse mediante su Purpose.

Especialmente:

```text
CognitiveSnapshot
Thalamus
Hippocampus
Cingulate
Ear
Mouth
Prefrontal
```

La pregunta para cada uno no será:

```text
¿Qué hace actualmente este código?
```

sino:

```text
¿Qué Purpose cognitivo existe aquí?
```

A partir de esa respuesta podremos determinar si el componente:

```text
es una UCA
contiene varias UCAs
es una Capability
es conocimiento
es runtime
o deja de ser necesario
```

En particular, `CognitiveSnapshot` deberá descomponerse propiedad por propiedad.

Si sus responsabilidades terminan absorbidas por:

```text
UCAs
+
Memory
+
Runtime
```

entonces desaparecerá naturalmente porque habrá dejado de poseer una responsabilidad arquitectónica propia.

---

# 54. Criterio de validación

La arquitectura UCA no debe considerarse validada simplemente porque el código pueda implementarla.

Debe demostrarse que un conjunto pequeño de UCAs puede:

1. recibir un estímulo externo;
2. reaccionar mediante Purposes especializados;
3. colaborar sin compartir un cerebro monolítico;
4. producir un Outcome hacia el exterior;
5. recibir posteriormente evidencia externa sobre ese Outcome;
6. utilizar dicha evidencia para diagnosticar una desviación;
7. adaptar una Disposition;
8. reaccionar de forma diferente ante una situación futura equivalente;
9. hacerlo sin modificar código;
10. hacerlo sin entrenar nuevamente el LLM;
11. hacerlo sin reglas específicas diseñadas para el ejemplo.

Si esto ocurre, el comportamiento adaptativo no estará programado explícitamente para el caso concreto.

Habrá emergido de la arquitectura.

---

# 55. Idea central

La arquitectura puede resumirse finalmente así:

> **Una UCA es una capacidad cognitiva autónoma en Purpose y reactiva en ejecución.**

> **Recibe un Goal dentro de un Context, utiliza sus Dispositions y Capabilities, ejecuta una Action y produce un Outcome.**

> **El Outcome es evaluable respecto al Goal por quien originó esa necesidad.**

> **Las UCAs pueden utilizar otras UCAs cuando existen propósitos autónomos subordinados.**

> **Toda actividad comienza causalmente en el exterior, pero la interacción interna entre UCAs puede producir comportamiento proactivo emergente.**

> **La memoria aporta conocimiento; las UCAs aportan capacidades cognitivas; el runtime aporta infraestructura.**

> **La cognición no reside en una UCA, en un CognitiveSnapshot ni en un LLM: emerge de la interacción entre capacidades cognitivas especializadas, memoria, contexto, experiencia y exterior.**
