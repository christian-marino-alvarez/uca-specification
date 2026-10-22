# Normas y Reglas del Dominio Collection (`src/collection/rules.md`)

Este documento define las directrices y normas arquitectónicas para el catálogo **Collection** de la Universal Cognitive Architecture (UCA).

## Política de pruebas manuales y cierre de implementación

* **Las pruebas las realiza manualmente el usuario.** El agente no debe crear ni ejecutar pruebas automáticas salvo petición expresa del usuario.
* Tras implementar, el agente debe detenerse y comunicar los cambios. No debe iniciar revisiones posteriores, inspeccionar logs, probar la aplicación en el navegador, capturar pantallas ni ejecutar comprobaciones de tipos, lint, tests o compilaciones para validar el resultado, salvo petición expresa del usuario.
* No ejecutar validaciones automáticas previas por iniciativa propia, incluidas las de Core. La lectura de las reglas y del código necesaria para implementar sigue siendo obligatoria.
* Una petición de implementar no autoriza por sí misma pruebas o revisiones. Las peticiones expresas de revisión o prueba se limitan al alcance indicado por el usuario.
* Esta política sustituye cualquier obligación anterior de ejecutar validaciones antes o después de modificar el repositorio. No altera las validaciones de datos que forman parte del funcionamiento de la aplicación.

---

## 1. Responsabilidad y Estructura del Dominio Collection
El directorio `src/collection` alberga la biblioteca y catálogo público de componentes reutilizables construidos sobre las primitivas del `Core`:
```
src/collection/
├── capabilities/    # Dominio de capacidades terminales y mecánicas
│   └── rules.md     # Reglas específicas del dominio capabilities
├── ucas/            # Dominio de unidades cognitivas autónomas compuestas
│   └── rules.md     # Reglas específicas del dominio ucas
├── index.ts         # Punto de exportación unificado del catálogo
└── rules.md         # Este documento
```

---

## 2. Invariantes Arquitectónicas de la Colección

1. **Sub-dominios Especializados**:
   * Cada subdirectorio dentro de `src/collection/` representa un dominio funcional estricto:
     * `capabilities/`: Habilidades, herramientas, interacciones con el entorno y mecanismos puros (heredan de `Capability`).
     * `ucas/`: Unidades cognitivas autónomas con propósito y composición fractal (heredan de `Uca`).
2. **Desacoplamiento entre UCAs y Capabilities**:
   * Las UCAs instancian y configuran sus capacidades mediante el patrón declarativo `Cooky`, sin acoplarse rígidamente a implementaciones internas de la capability.
3. **Punto de Re-exportación Unificado (`index.ts`)**:
   * `src/collection/index.ts` debe re-exportar de forma limpia todos los sub-dominios públicos:
     ```typescript
     export * from './capabilities/index.js';
     export * from './ucas/index.js';
     ```
4. **Contrato Universal de Comunicación (Signal, Body como Schema y Actualización de Disposición)**:
   * Toda UCA y Capability en la colección comunica sus interacciones observables exclusivamente a través de la primitiva `Signal`.
   * El `Body` formalizado en `schema.ts` actúa como el esquema de validación estructural (`schema`) de los puertos `inputs` y `outputs`.
   * La coordinación y propagación entre entidades actualiza siempre su `Disposition` (`aim.body`), gobernada por el ciclo idempotente de actualización del Core.

---

## 3. Obligatoriedad de Consulta de Reglas de Sub-dominio

Antes de crear, refactorizar o eliminar cualquier componente dentro de `src/collection/`, los agentes **DEBEN** consultar el fichero de reglas específico del sub-dominio donde operen:
* Para capacidades: consultar [src/collection/capabilities/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/capabilities/rules.md).
* Para UCAs: consultar [src/collection/ucas/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/ucas/rules.md).
