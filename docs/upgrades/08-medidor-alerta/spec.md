# Especificación: Medidor de alerta y estados del nivel (Upgrade 8)

## Objetivo
Mostrar un indicador de estado de alerta dinámico (`SEGURO`, `ALERTA`, `PELIGRO`) en el HUD de `GameScene` basado en el estado actual de visión, memoria y sonido, reflejando visiblemente las consecuencias del peligro.

## Criterios de Aceptación
1. El HUD muestra un medidor/estado de alerta actualizado en tiempo real (`alerta [SEGURO / ALERTA / PELIGRO]`).
2. El estado clasifica correctamente la situación del nivel basándose en la percepción existente sin modificar el dominio.
3. Las validaciones de tipo, tests y build se completan con éxito.
