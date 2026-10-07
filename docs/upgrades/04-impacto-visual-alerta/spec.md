# Especificación: Impacto visual extremo de alerta (Upgrade 4)

## Objetivo
Aportar un impacto visual cinemático breve y claro (*camera shake*) exclusivamente en el instante exacto en que el guardia detecta por primera vez al jugador (`false` → `true`), asegurando que no se repita en cada frame mientras la detección persista.

## Criterios de Aceptación
1. El efecto de sacudida (`cameras.main.shake`) se activa únicamente ante una nueva transición de detección (`false` a `true`).
2. El efecto no se repite en cada frame mientras `vision.visible` permanezca en `true`.
3. El efecto finaliza y la cámara recupera su posición normal en menos de un segundo (200 ms configurados).
4. Al perder la detección y volver a ser detectado, el impacto visual puede activarse de nuevo.
