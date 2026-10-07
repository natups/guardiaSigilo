# Plan de Implementación: Impacto visual extremo de alerta (Upgrade 4)

## Incremento 1: Control de transición de visión y sacudida de cámara en GameScene
- Añadir variable de estado `guardPreviouslyVisible` en `GameScene`.
- Detectar la transición de `false` a `true` en el ciclo de percepción.
- Invocar `this.cameras.main.shake(200, 0.015)`.

## Incremento 2: Validación y revisión final
- Ejecutar validaciones de tipo (`tsc`), pruebas unitarias (`vitest`) y build (`vite`).
- Comprobar que no se modificó ningún archivo de dominio.
