---
id: practica-navegacion-spec
titulo: Especificación y verificación de navegación - Eje 05 (Variante A: Terreno lento)
tipo: especificacion
audiencia: estudiante
acceso: publico
version: 4
---

# Especificación y Verificación de Navegación (Eje 05)

## 1. Estado Inicial y Contexto
- **Commit base previo a la práctica:** `76d438a3d176ed6c3010e680fcdcbec05cf90b2f` (estado limpio inicial del repositorio).
- **Entorno:** Node.js v24.21.0, TypeScript 5.9.3, Vitest 4.1.10, Vite 6.4.3, Windows / PowerShell.
- **Componentes y firmas de búsqueda existentes (`src/domain/navigation/search.ts` y `src/domain/model/grid.ts`):**
  - `findPathBfs(map: GridMap, start: GridPoint, goal: GridPoint): SearchResult`
  - `findPathAStar(map: GridMap, start: GridPoint, goal: GridPoint): SearchResult`
  - `cellTerrainCost(map: GridMap, point: GridPoint): number`
  - `createGridMap(width: number, height: number, blockedCells: Iterable<GridPoint>, terrainCosts?: ...): GridMap`
  - Estructura `SearchResult`: `{ algorithm, status, path, totalCost, expandedNodes, maximumFrontier, explored }`
  - Tipos de estado (`SearchStatus`): `"success" | "unreachable" | "invalid-start" | "invalid-goal"`

## 2. Especificación Común de los Algoritmos de Búsqueda
- **BFS (Breadth-First Search):**
  - Explora grafos por niveles expandiendo nodos en orden FIFO (cola de frontera).
  - Asume costos uniformes por salto (cada arista cuenta como 1 paso o costo fijo).
  - Garantiza encontrar el camino con menor cantidad de saltos (nodos), pero no es óptimo cuando las transiciones tienen costos ponderados o variables.
- **A\* Search:**
  - Explora utilizando una cola de prioridad basada en la función de costo real acumulado $g(n)$ más una heurística admisible $h(n)$.
  - Función de prioridad: $f(n) = g(n) + h(n)$.
  - Heurística utilizada: Distancia Manhattan (`manhattanDistance`) multiplicada por el costo mínimo de transición del mapa (`minTerrainCost`). Al ser admisible y consistente, garantiza optimalidad en costos ponderados.
- **Representación de la Grilla y Celdas:**
  - Grillas discretas definidas por ancho, alto, conjunto de celdas bloqueadas (`blocked`) y mapa opcional de costos de terreno (`terrainCosts`).
  - Coordenadas enteras $(x, y)$ con origen en la esquina superior izquierda $(0,0)$.
  - Movimientos cardinales de 4 direcciones (arriba, abajo, izquierda, derecha).
- **Reglas de Validez de Inicio y Destino:**
  - Una celda es transitable si está dentro de los límites de la grilla y no pertenece al conjunto de bloqueadas (`isWalkable`).
  - Si el punto de inicio no es transitable, la búsqueda retorna el estado `"invalid-start"`.
  - Si el punto de destino no es transitable, la búsqueda retorna el estado `"invalid-goal"`.

## 3. Trazas Conceptuales Comparativas y Teóricas
- **Traza DFS (Depth-First Search):**
  - Grafo conceptual: $S:[A, B]$, $A:[C]$, $C:[X]$, $X:[G]$, $B:[D, E]$, $D:[G]$, $E:[]$, $G:[]$.
  - Al insertar vecinos en orden inverso en la pila, DFS explora profundamente por la rama de $A$, encontrando el camino $S-A-C-X-G$ en 4 saltos (costo operativo superior en profundidad y sin garantizar optimalidad). En contraste, BFS explora por niveles encontrando $S-B-D-G$ en 3 saltos. Demuestra que DFS no asegura optimalidad ni en pasos ni en costo.
- **Traza completa de Dijkstra:**
  - Supóngase aristas con costos: $S\to A=1$, $A\to G=9$, $S\to B=3$, $B\to G=3$.
  - Dijkstra descubre $G$ inicialmente a través de $S\to A\to G$ con costo $1+9 = 10$.
  - Al continuar evaluando el resto de la cola de prioridad, descubre el camino óptimo $S\to B\to G$ con costo $3+3 = 6$, actualizando el coste de $G$ de 10 a 6. Demuestra por qué **no se debe terminar** prematuramente al descubrir la meta por primera vez en grafos con costos ponderados no uniformes.

## 4. Especificación de la Variante A: "Terreno Lento"
- **Regla de costos de transición:**
  - Celdas de terreno lento: $(1,1)$, $(2,1)$ y $(3,1)$ con costo de entrada = 5.
  - Celdas normales transitables: costo de entrada = 1.
  - Celda inicial: costo 0 (no aporta costo al punto de partida).
- **Comportamiento esperado por algoritmo:**
  - **BFS:** Ignora los costos de terreno; continúa encontrando la ruta directa de menor cantidad de saltos (4 pasos), con costo nominal de saltos.
  - **A\*:** Incorpora los costos de transición reales en $g(n)$. Prefiere desvíos si evitan celdas de alto costo, obteniendo el desvío óptimo de menor costo total.

## 5. Matriz de Casos de Aceptación
| ID | Descripción del Caso | Algoritmo | Entradas / Configuración | Resultado Esperado | Estado de Aprobación |
|---|---|---|---|---|---|
| `BASE-AC1` | Grilla estándar 5x3 | BFS / A* | $S=(0,1)$, $G=(4,1)$, sin terreno especial | Camino óptimo de 4 pasos (costo 4) | Aprobado |
| `BASE-AC2` | Destino inaccesible | BFS / A* | Muro vertical en $x=2$ ($(2,0), (2,1), (2,2)$) | `status: "unreachable"` | Aprobado |
| `BASE-AC3` | Inicio inválido | BFS / A* | $S=(-1,1)$ (fuera de límites) | `status: "invalid-start"` | Aprobado |
| `BASE-AC4` | Destino inválido | BFS / A* | $G=(5,1)$ (fuera de límites) | `status: "invalid-goal"` | Aprobado |
| `BASE-AC5` | Inicio igual a meta | BFS / A* | $S=(1,1), G=(1,1)$ | Camino `[S]`, costo 0 | Aprobado |
| `BASE-AC6` | Consumidor `calculateRoute` | A* | Integración con `navigationDemo.ts` | Retorna ruta válida y costos coherentes | Aprobado |
| `A-AC1` | Terreno lento - Ruta directa | A* | Celdas $(1,1), (2,1), (3,1)$ con costo 5 | Costo total 16 en 4 pasos | Aprobado |
| `A-AC2` | Terreno lento - Desvío óptimo | A* | Mismos costos de terreno, permitiendo desvío | Costo total óptimo 6 en 6 pasos | Aprobado |
| `A-AC3` | Reversibilidad de costos | A* | Retorno a costo uniforme 1 | Recupera ruta directa de 4 pasos y costo 4 | Aprobado |

