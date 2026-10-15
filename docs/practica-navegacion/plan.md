---
id: practica-navegacion-plan
titulo: Plan de trabajo - Práctica de Navegación Eje 05
tipo: plan
audiencia: estudiante
acceso: publico
version: 4
---

# Plan de Trabajo: Variante A (Terreno Lento)

## Incremento 1: Modelar el Costo de Terreno Preservando Compatibilidad [Aprobado]
- **Objetivo:** Extender los modelos de grilla (`src/domain/model/grid.ts`) para soportar costos de transición opcionales por celda sin alterar el comportamiento uniforme por defecto (costo 1).
- **Archivos previstos y afectados:** `src/domain/model/grid.ts`, `tests/model/grid.test.ts`.
- **Cambios realizados:** Adición de la propiedad opcional `terrainCosts` en `GridMap`, función `cellTerrainCost`, y validación de costos no negativos en `createGridMap`.
- **Criterios de aceptación relacionados:** `BASE-AC1`, `A-AC1`.
- **Comando exacto de verificación:** `& node ./node_modules/vitest/vitest.mjs run tests/model/grid.test.ts`
- **Resultado real:** Aprobado (6/6 pruebas superadas).

## Incremento 2: Integración de Costos Reales en A* y Pruebas de la Variante A [Aprobado]
- **Objetivo:** Actualizar `findPathAStar` en `src/domain/navigation/search.ts` para que acumule los costos de transición reales del terreno utilizando `cellTerrainCost` y una heurística admisible basada en el costo mínimo del terreno.
- **Archivos previstos y afectados:** `src/domain/navigation/search.ts`, `tests/navigation/search.test.ts`.
- **Cambios realizados:** Cálculo dinámico de costos acumulados en la frontera de A* y función `minTerrainCost` para asegurar admisibilidad de la heurística.
- **Criterios de aceptación relacionados:** `A-AC1`, `A-AC2`, `A-AC3`.
- **Comando exacto de verificación:** `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts`
- **Resultado real:** Aprobado (12/12 pruebas superadas).

## Incremento 3: Verificación con Consumidor Real y Validación Completa [Aprobado]
- **Objetivo:** Comprobar la integración con el consumidor de navegación (`src/application/simulation/navigationDemo.ts`) mediante pruebas específicas y ejecutar las validaciones globales del proyecto (TypeScript, Vitest y Vite build).
- **Archivos previstos y afectados:** `src/application/simulation/navigationDemo.ts`, `tests/application/navigationDemo.test.ts`.
- **Cambios realizados:** Creación del test de integración del consumidor y ejecución de la batería completa de validación.
- **Criterios de aceptación relacionados:** `BASE-AC1` a `BASE-AC6`, `A-AC1` a `A-AC3`.
- **Comandos exactos de verificación:**
  - `& node ./node_modules/vitest/vitest.mjs run` (49/49 pruebas aprobadas)
  - `& node ./node_modules/typescript/bin/tsc --noEmit` (sin errores de tipos)
  - `& node ./node_modules/vite/bin/vite.js build` (build exitoso)
- **Resultado real:** Aprobado al 100% sin regresiones.

