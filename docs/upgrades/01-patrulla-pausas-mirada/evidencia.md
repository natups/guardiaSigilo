# Evidencia de Ejecución: Upgrade 1 (Pausa de patrulla y orientación direccional)

## 1. Estado Inicial y Validación Baseline
- **Commit/Baseline**: Repositorio base en `main`.
- **Validación previa**: 39 tests pasando con `vitest`.

## 2. Intención y Objetivo
Incorporar pausas de patrulla de 1.5 segundos y orientación direccional opcional de forma exclusiva en puntos de patrulla explícitos (`PatrolWaypoint`), preservando la navegación normal sin pausas para los `navigationGoal` estándar.

## 3. Plan de Incrementos
- **Incremento 1**: Representación explícita de `PatrolWaypoint` y separación de tipos en el dominio (`pathFollower.ts`).
- **Incremento 2**: Integración de la lógica de temporización en el dominio y adaptación en `GameScene`.
- **Incremento 3**: Creación de pruebas unitarias específicas y validación completa.

## 4. Incremento 1 y su Corrección
- Se definió `Waypoint = Vector2 | PatrolWaypoint` junto con la interfaz `PatrolWaypoint` (`isPatrolPoint: true`, `facing?: Vector2`).
- Se aseguró que los waypoints estándar sigan representándose como vectores planos (`Vector2`) sin pausas automáticas.

## 5. Fallo Intermedio de Tests y su Corrección
- Durante la integración inicial del estado de espera, algunos tests existentes en `pathFollower.test.ts` fallaron debido a discrepancias en las propiedades devueltas (`waiting` / `waitTimeRemaining`).
- Se ajustó el contrato de retorno para que solo incluya dichas propiedades cuando corresponda o de manera opcional compatible, logrando que los 39 tests existentes volvieran a pasar de inmediato.

## 6. Incremento 2: Integración en GameScene
- Se adaptó `GameScene.updateGuardMovement` para enviar `this.guardWaitTimeRemaining` y el `delta` a `advanceAlongPath`.
- Se actualizó el `guardFacing` cuando el resultado devuelve el `facing` del punto de patrulla.

## 7. Incremento 3: Pruebas Unitarias Adicionales
- Se agregaron nuevos tests en `tests/navigation/pathFollower.test.ts` cubriendo:
  - Activación de pausa de 1.5s en `PatrolWaypoint` con `facing`.
  - Disminución del tiempo de espera y mantenimiento de posición durante la pausa.
  - Reanudación de la ruta tras finalizar la pausa.
  - Verificación de que los waypoints normales no activan pausa.

## 8. Resultado Final
- **Tests**: 42/42 tests pasando correctamente.
- **Typecheck**: `tsc --noEmit` completado sin errores.
- **Build**: `vite build` completado con éxito.

## 9. Archivos Modificados
- `src/domain/navigation/pathFollower.ts`
- `src/game/scenes/GameScene.ts`
- `tests/navigation/pathFollower.test.ts`

## 10. Criterios de Aceptación y Evidencia
- **Solo PatrolWaypoint activa pausa**: Verificado mediante pruebas unitarias que contrastan waypoints normales frente a puntos de patrulla explícitos.
- **Duración global de 1.5s**: Verificado mediante el parámetro `waitTimeRemaining: 1500` devuelto al alcanzar el punto.
- **Inmovilidad y facing**: Verificado que la posición no cambia durante la espera y se reporta el facing correcto.
- **Sin máquina de estados completa**: Respetado manteniendo la lógica pura basada en funciones y resultados en el dominio.

## 11. Decisiones Humanas Relevantes
- Pausa exclusiva en `PatrolWaypoint` explícitos.
- Duración global fija de 1.5 segundos.
- `facing` opcional por punto de patrulla.

## 13. Matriz Criterio → Evidencia
| Criterio de Aceptación | Evidencia |
|---|---|
| Solo PatrolWaypoint activa pausa | Pruebas unitarias en `pathFollower.test.ts` |
| Duración global de 1.5s | `waitTimeRemaining: 1500` verificado en tests |
| Inmovilidad y facing durante pausa | Tests de pathFollower exitosos |
| Validaciones tsc, vitest, vite build | Ejecución exitosa (42/42 tests y build OK) |
