import { describe, expect, it } from "vitest";
import { createGridMap, type GridPoint } from "../../src/domain/model/grid";
import { calculateRoute } from "../../src/application/simulation/navigationDemo";

describe("navigationDemo integration (Variante A)", () => {
  it("keeps default configuration without slow terrain producing standard path and cost", () => {
    const map = createGridMap(5, 3, []);
    const start: GridPoint = { x: 0, y: 1 };
    const goal: GridPoint = { x: 4, y: 1 };

    const astarResult = calculateRoute(map, start, goal, "astar");
    const bfsResult = calculateRoute(map, start, goal, "bfs");

    expect(astarResult.status).toBe("success");
    expect(astarResult.totalCost).toBe(4);
    expect(astarResult.path.length).toBe(5);

    expect(bfsResult.status).toBe("success");
    expect(bfsResult.totalCost).toBe(4);
    expect(bfsResult.path.length).toBe(5);
  });

  it("avoids slow terrain when enabled via map terrain costs using A*", () => {
    const slowMap = createGridMap(5, 3, [], {
      "1,1": 5,
      "2,1": 5,
      "3,1": 5,
    });
    const start: GridPoint = { x: 0, y: 1 };
    const goal: GridPoint = { x: 4, y: 1 };

    const result = calculateRoute(slowMap, start, goal, "astar");
    expect(result.status).toBe("success");
    expect(result.totalCost).toBe(6);
    expect(result.path.length).toBe(7);
  });

  it("BFS maintains uniform cost semantics even when slow terrain is configured", () => {
    const slowMap = createGridMap(5, 3, [], {
      "1,1": 5,
      "2,1": 5,
      "3,1": 5,
    });
    const start: GridPoint = { x: 0, y: 1 };
    const goal: GridPoint = { x: 4, y: 1 };

    const bfsResult = calculateRoute(slowMap, start, goal, "bfs");
    expect(bfsResult.status).toBe("success");
    expect(bfsResult.totalCost).toBe(4);
    expect(bfsResult.path.length).toBe(5);
  });
});
