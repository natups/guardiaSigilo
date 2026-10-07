# Plan de Implementación: Cámara dinámica de tensión (Upgrade 5)

## Incremento 1: Interpolación de zoom de cámara en GameScene
- Calcular el zoom objetivo (`1.06` si `vision.visible`, `1.0` en caso contrario).
- Aplicar interpolación lineal (`Phaser.Math.Linear`) a `this.cameras.main.zoom`.

## Incremento 2: Validación y revisión final
- Ejecutar typecheck, tests y build.
- Revisar diff.
