# Especificación: Cono y feedback visual de percepción reactivo (Upgrade 2)

## Objetivo
Reforzar el feedback visual de la simulación de percepción en `GameScene` mostrando un indicador estático de alerta sobre el guardia únicamente cuando el jugador se encuentra bajo su línea de visión directa (`vision.visible === true`), complementando el cambio de color del cono de visión.

## Criterios de Aceptación
1. El indicador visual de alerta se muestra de forma inmediata y exclusivamente cuando `vision.visible === true`.
2. El indicador desaparece de inmediato cuando `vision.visible === false`.
3. El indicador sigue dinámicamente la posición del guardia.
4. La lógica de oclusión y evaluación de visión en el dominio permanece completamente intacta.
