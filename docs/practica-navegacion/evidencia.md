---
id: practica-navegacion-evidencia
titulo: Evidencia de pruebas - Práctica de Navegación Eje 05
tipo: evidencia
audiencia: estudiante
acceso: publico
version: 5
---

# Evidencia de Pruebas (Eje 05)

- **Criterio validado:** Especificación y verificación de navegación (Variante A: Terreno lento).
- **Commit base de referencia (previo a la práctica):** `76d438a3d176ed6c3010e680fcdcbec05cf90b2f` (commit base anterior a los cambios de esta práctica, no un commit final de entrega).
- **Entorno de ejecución:** Node.js v24.21.0, TypeScript 5.9.3, Vitest 4.1.10, Vite 6.4.3, Windows / PowerShell.

## 1. Comparación BFS vs. A* y Métricas Disponibles
- **Escenario:** Grilla fija de 5x3, inicio $S=(0,1)$, objetivo $G=(4,1)$, costos uniformes base (1), movimientos en cuatro direcciones.
- **BFS:** Explora por amplitud en orden FIFO. Encuentra la ruta directa de 4 pasos (5 nodos: $(0,1)\to(1,1)\to(2,1)\to(3,1)\to(4,1)$) con costo nominal 4. Expande nodos en función de la distancia en saltos.
- **A\*:** Utiliza función de prioridad $f(n) = g(n) + h(n)$ con heurística Manhattan admisible. Sobre costos uniformes, encuentra exactamente la misma ruta óptima de 4 pasos y costo 4.
- **Métricas registradas por `SearchResult`:** `path`, `totalCost`, `expandedNodes`, `maximumFrontier`, `explored`. (Disponibles y auditadas automáticamente en cada test).

## 2. Explicación de Optimalidad y Trazas Teóricas
- **Optimalidad:** BFS garantiza optimalidad estrictamente en *número de saltos* (aristas), mientras que A* garantiza optimalidad en *costo acumulado total* siempre que la heurística sea admisible ($h(n) \le \text{costo real restante}$).
- **Traza DFS (Búsqueda en Profundidad):**
  - Grafo conceptual: $S:[A, B]$, $A:[C]$, $C:[X]$, $X:[G]$, $B:[D, E]$, $D:[G]$, $E:[]$, $G:[]$.
  - Al utilizar una pila (LIFO) y vecinos en orden inverso, DFS desciende profundamente por la rama $A \to C \to X \to G$, encontrando una solución en 4 saltos. Sin embargo, ignora la rama lateral más corta $S \to B \to D \to G$ (3 saltos). Demuestra por qué DFS no garantiza optimalidad ni en pasos ni en costo.
- **Traza Completa de Dijkstra:**
  - Supóngase aristas con costos: $S\to A=1$, $A\to G=9$, $S\to B=3$, $B\to G=3$.
  - 1. Inicialización: $dist(S)=0$, cola prioritaria con $S$.
  - 2. Extraer $S$: expande $A$ ($dist(A)=1$) y $B$ ($dist(B)=3$).
  - 3. Extraer $A$ (menor distancia 1): expande $G$ a través de $A$ con costo provisional $1+9 = 10$.
  - 4. Extraer $B$ (menor distancia 3): expande $G$ a través de $B$ con costo $3+3 = 6$. Como $6 < 10$, actualiza el costo óptimo de $G$ a 6.
  - Conclusión: Dijkstra demuestra por qué **no se debe terminar** prematuramente al descubrir la meta por primera vez en grafos con costos no uniformes.

## 3. Casos Límite Verificados
- **Inicio igual al destino ($S=G$):** Retorna `status: "success"`, camino con un solo punto `[S]` y costo total 0.
- **Destino inaccesible:** Al colocar un muro vertical en $x=2$ ($(2,0), (2,1), (2,2)$), la búsqueda agota la frontera sin alcanzar el objetivo y retorna `status: "unreachable"`.
- **Inicio inválido ($S$ fuera de límites o bloqueado):** Retorna `status: "invalid-start"`.
- **Destino inválido ($G$ fuera de límites o bloqueado):** Retorna `status: "invalid-goal"`.

## 4. Resultados de la Variante A (Terreno Lento)
- **Configuración:** Celdas $(1,1)$, $(2,1)$ y $(3,1)$ con costo de entrada 5.
- **Ruta directa forzada:** Atraviesa el terreno lento con costo acumulado $1 + 5 + 5 + 5 = 16$ en 4 pasos.
- **Desvío óptimo con A\*:** A* evalúa rutas alternativas y encuentra un desvío válido de 6 pasos con un costo total óptimo de 6.
- **Reversibilidad:** Al retornar a costo uniforme 1, A* recupera automáticamente la ruta directa de 4 pasos y costo 4.

## 5. Matriz de Aceptación (BASE-AC1 a BASE-AC6 y A-AC1 a A-AC3)
| ID Caso | Descripción | Comando exacto de ejecución | Resultado Esperado | Resultado Real / Evidencia | Estado |
|---|---|---|---|---|---|
| `BASE-AC1` | Grilla estándar 5x3 | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | Camino 4 pasos, costo 4 | Pasó correctamente | Aprobado |
| `BASE-AC2` | Destino inaccesible | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | `status: "unreachable"` | Pasó correctamente | Aprobado |
| `BASE-AC3` | Inicio inválido | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | `status: "invalid-start"` | Pasó correctamente | Aprobado |
| `BASE-AC4` | Destino inválido | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | `status: "invalid-goal"` | Pasó correctamente | Aprobado |
| `BASE-AC5` | Inicio igual a meta | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | Camino `[S]`, costo 0 | Pasó correctamente | Aprobado |
| `BASE-AC6` | Integración `navigationDemo` | `& node ./node_modules/vitest/vitest.mjs run tests/application/navigationDemo.test.ts` | Ruta válida y costos coherentes | Pasó correctamente (3/3) | Aprobado |
| `A-AC1` | Terreno lento - Ruta directa | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | Costo 16 en 4 pasos | Pasó correctamente | Aprobado |
| `A-AC2` | Terreno lento - Desvío óptimo | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | Costo óptimo 6 en 6 pasos | Pasó correctamente | Aprobado |
| `A-AC3` | Reversibilidad de costos | `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` | Retorna a costo 4 en 4 pasos | Pasó correctamente | Aprobado |

## 6. Comandos Ejecutados y Verificaciones Globales
- **Pruebas unitarias de grilla:** `& node ./node_modules/vitest/vitest.mjs run tests/model/grid.test.ts` $\rightarrow$ 6/6 aprobados.
- **Pruebas de búsqueda (BFS y A*):** `& node ./node_modules/vitest/vitest.mjs run tests/navigation/search.test.ts` $\rightarrow$ 12/12 aprobados.
- **Pruebas de integración:** `& node ./node_modules/vitest/vitest.mjs run tests/application/navigationDemo.test.ts` $\rightarrow$ 3/3 aprobados.
- **Batería completa Vitest:** `& node ./node_modules/vitest/vitest.mjs run` $\rightarrow$ 49/49 aprobados (7 test files passed).
- **Verificación de tipos TypeScript:** `& node ./node_modules/typescript/bin/tsc --noEmit` $\rightarrow$ Sin errores.
- **Build de producción Vite:** `& node ./node_modules/vite/bin/vite.js build` $\rightarrow$ Exitoso (`dist/index.html` y bundles generados).

## 7. Limitaciones Reales y Notas de Entorno
- **Política de ejecución de PowerShell:** `npm.ps1` está bloqueado por directiva de seguridad del sistema local, por lo que las ejecuciones se realizan invocando directamente los scripts Node (`& node ./node_modules/...`).
- **Advertencia de tamaño de bundle:** Vite emite una advertencia informativa de chunks mayores a 500 kB (comportamiento estándar del boilerplate de Phaser/Vite sin code-splitting avanzado), la cual no afecta la compilación ni la ejecución.

## 8. Archivos Modificados y Relación con el Alcance
- `src/domain/model/grid.ts` y `tests/model/grid.test.ts`: Soportan el modelo de costos de terreno.
- `src/domain/navigation/search.ts` y `tests/navigation/search.test.ts`: Implementan la lógica ponderada en A*.
- `tests/application/navigationDemo.test.ts`: Verifica el consumidor real.
- No se modificaron componentes de percepción, FSM ni escenas de Phaser, garantizando el acotamiento arquitectónico.

