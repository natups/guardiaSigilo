# Plan de Implementación: Cono y feedback visual de percepción reactivo (Upgrade 2)

## Incremento 1: Indicador gráfico de alerta asociado al guardia en GameScene
- Declarar una propiedad `alertIndicator` en `GameScene`.
- Inicializarla en el método `create()` como un círculo con visibilidad inicial en falso.
- Actualizar su visibilidad y posición en el método `drawPerception()` basándose en `vision.visible`.

## Incremento 2: Validación y revisión
- Ejecutar pruebas de tipo (`tsc --noEmit`), tests unitarios (`vitest run`) y build (`vite build`).
- Verificar que la lógica de dominio no fue alterada.
