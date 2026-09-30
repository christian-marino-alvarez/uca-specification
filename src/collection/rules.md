# Normas y Reglas del Dominio Collection (`src/collection/rules.md`)

Este documento define las directrices y normas arquitectónicas para el catálogo **Collection** de la Universal Cognitive Architecture (UCA).

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

---

## 3. Obligatoriedad de Consulta de Reglas de Sub-dominio

Antes de crear, refactorizar o eliminar cualquier componente dentro de `src/collection/`, los agentes **DEBEN** consultar el fichero de reglas específico del sub-dominio donde operen:
* Para capacidades: consultar [src/collection/capabilities/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/capabilities/rules.md).
* Para UCAs: consultar [src/collection/ucas/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/ucas/rules.md).
