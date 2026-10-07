# Evidencia de Ejecución: Upgrade 2 (Cono y feedback visual de percepción reactivo)

## 1. Estado Inicial y Contexto
- El motor de percepción calcula la visibilidad mediante `evaluateVision()`, y `GameScene` renderiza un cono cuyo color cambia entre azul y verde. Faltaba un indicador directo sobre el guardia.

## 2. Cambios Realizados
- Se añadió un indicador circular (`alertIndicator`) sobre la posición del guardia que se activa y sigue al personaje únicamente cuando `vision.visible` es verdadero.

## 3. Archivos Afectados
- `src/game/scenes/GameScene.ts`

## 4. Validaciones Ejecutadas y Resultados
- `npx tsc --noEmit`: OK (sin errores).
- `npx vitest run`: 42/42 tests pasando con éxito.
- `npx vite build`: Completado correctamente.

## 5. Revisión de Diff
- Se verificó que los cambios se limitan estrictamente a la adición y actualización del objeto gráfico `alertIndicator` en `GameScene.ts`.

## 6. Registro Cronológico
- **Incremento 1**: Creación y posicionamiento dinámico del `alertIndicator` en `GameScene.ts` sujeto a `vision.visible`.
- **Incremento 2**: Verificación mediante typecheck, suite completa de tests y compilación de producción.

## 7. Matriz Criterio → Evidencia
| Criterio de Aceptación | Evidencia |
|---|---|
| Indicador visible al detectar | Propiedad `alertIndicator` vinculada a `vision.visible` en `GameScene.ts` |
| Ocultamiento inmediato al perder visión | Actualización reactiva por frame en `drawPerception` |
| Dominio intacto | Ningún cambio en `src/domain/perception/` y tests unitarios pasando al 100% |

## 7. Estado Final
- Completado y verificado.
