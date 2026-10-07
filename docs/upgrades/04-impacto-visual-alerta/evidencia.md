# Evidencia de Ejecución: Upgrade 4 (Impacto visual extremo de alerta)

## 1. Estado Inicial y Contexto
- El guardia detecta al jugador pero la transición visual carecía de un impacto cinemático de cámara en el momento del avistamiento.

## 2. Cambios Realizados
- Se implementó el control de visibilidad anterior con `guardPreviouslyVisible` y se invocó `this.cameras.main.shake(200, 0.015)` ante una nueva detección.

## 3. Archivos Afectados
- `src/game/scenes/GameScene.ts`

## 4. Validaciones Ejecutadas y Resultados
- `npx tsc --noEmit`: OK.
- `npx vitest run`: 42/42 tests pasando.
- `npx vite build`: OK.

## 5. Revisión de Diff
- Confirmado que el cambio detecta correctamente la transición y ejecuta el shake sin interferir con la lógica de dominio.

## 6. Registro Cronológico
- **Incremento 1**: Adición del control de visibilidad previa `guardPreviouslyVisible` y disparo condicional de `cameras.main.shake(200, 0.015)` ante la transición `false` → `true` de `vision.visible` en `GameScene.ts`.
- **Incremento 2**: Verificación mediante typecheck, suite completa de tests y compilación de producción.

## 7. Matriz Criterio → Evidencia
| Criterio de Aceptación | Evidencia |
|---|---|
| Shake exclusivo ante nueva detección | Condición `!guardPreviouslyVisible && vision.visible` en `GameScene.ts` |
| No se repite cada frame | Actualización de `guardPreviouslyVisible = vision.visible` |
| Duración menor a 1 segundo | Configurado en 200 ms (`shake(200, 0.015)`) |
| Validaciones tsc, vitest, vite build | Ejecución exitosa (42/42 tests y build OK) |

## 7. Estado Final
- Completado y aprobado.
