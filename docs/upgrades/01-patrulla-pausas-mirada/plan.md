# Plan de Implementación: Pausa de patrulla y orientación direccional

## Incremento 1: Representación de tipo y contratos en Dominio
- Extender `pathFollower.ts` para soportar `Waypoint` como unión de `Vector2` y `PatrolWaypoint`.
- Definir `PatrolWaypoint` con `isPatrolPoint: true` y opcionalmente `facing?: Vector2`.
- Mantener compatibilidad con vectores planos (waypoints intermedios y `navigationGoal` normales).

## Incremento 2: Lógica de temporización e integración en GameScene
- Actualizar `advanceAlongPath` para gestionar el estado de espera (`waiting`, `waitTimeRemaining`) y el retorno del `facing` configurado en el punto de patrulla tras transcurrir un tiempo global de 1.5 segundos (`1500ms`).
- Adaptar `GameScene` para integrar el delta y gestionar el estado de espera del guardia durante la patrulla.

## Incremento 3: Pruebas Unitarias y Validación
- Añadir tests unitarios específicos en `pathFollower.test.ts` para verificar:
  - Activación de pausa en `PatrolWaypoint`.
  - Inmovilidad y reducción del tiempo restante de pausa con el delta.
  - Reanudación del movimiento tras expirar la pausa.
  - Devolución del `facing` correcto durante la pausa.
  - Comportamiento inalterado en waypoints normales.
