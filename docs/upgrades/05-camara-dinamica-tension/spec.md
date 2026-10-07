# Especificación: Cámara dinámica de tensión (Upgrade 5)

## Objetivo
Introducir una modificación continua, sutil y reversible del encuadre de la cámara (zoom dinámico) mientras el nivel se mantenga en estado de `PELIGRO` (`vision.visible === true`), regresando al zoom normal al salir de ese estado, diferenciándose del impacto puntual del Upgrade 4.

## Criterios de Aceptación
1. El zoom de la cámara aumenta de forma sutil (hacia 1.06) únicamente cuando el nivel está en estado de peligro (`vision.visible === true`).
2. El zoom regresa a la normalidad (1.0) de forma continua y reversible al salir de dicho estado.
3. No interfiere con el *shake* puntual del Upgrade 4.
4. El dominio permanece intacto.
