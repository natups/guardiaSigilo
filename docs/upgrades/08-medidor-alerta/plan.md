# Plan de Implementación: Medidor de alerta y estados del nivel (Upgrade 8)

## Incremento 1: Clasificación de estado de alerta en GameScene
- Evaluar `alertLevel` ("PELIGRO", "ALERTA", "SEGURO") utilizando `vision.visible`, `perceptionState.memory.lastKnownPosition` y `perceptionState.soundEvent`.
- Integrar `alerta [${alertLevel}]` en el texto del HUD (`navigationHud`).

## Incremento 2: Validación y revisión final
- Ejecutar typecheck, tests y build.
- Revisar diff.
