# Especificación: Pausa de patrulla y orientación direccional

## Objetivo
Implementar pausas de patrulla de 1.5 segundos con orientación direccional (`facing`) opcional exclusivamente en puntos de patrulla explícitos (`PatrolWaypoint`), manteniendo intacto el comportamiento sin pausas para waypoints intermedios y `navigationGoal` normales.

## Criterios de Aceptación
1. **Puntos explícitos**: Solo los puntos marcados explícitamente como `PatrolWaypoint` (`isPatrolPoint: true`) deben activar la pausa y orientación.
2. **Sin conversión automática**: Los `navigationGoal` normales y waypoints intermedios no deben convertirse en puntos de patrulla ni disparar pausas.
3. **Duración de pausa**: La pausa tiene una duración global configurable de 1.5 segundos (1500 ms).
4. **Inmovilidad y orientación**: Durante la pausa, el guardia no debe avanzar y debe mantener la orientación (`facing`) configurada en el punto de patrulla.
5. **Separación arquitectónica**: La lógica de temporización y avance debe residir en el dominio (`pathFollower`), mientras que `GameScene` adapta los resultados y el delta sin contener lógica de negocio compleja ni máquina de estados completa.
