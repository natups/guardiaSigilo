import { describe, expect, it } from "vitest";
import { createGridMap, isWalkable, type GridPoint } from "../../src/domain/model/grid";
import { findPathAStar, findPathBfs } from "../../src/domain/navigation/search";

const START: GridPoint = { x: 0, y: 0 };
const GOAL: GridPoint = { x: 4, y: 0 };
const DETOUR_MAP = createGridMap(5, 5, [
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
]);

describe.each([
  ["BFS", findPathBfs],
  ["A*", findPathAStar],
] as const)("%s", (_name, findPath) => {
  it("finds an optimal walkable route", () => {
    const result = findPath(DETOUR_MAP, START, GOAL);

    expect(result.status).toBe("success");
    expect(result.totalCost).toBe(12);
    expect(result.path[0]).toEqual(START);
    expect(result.path.at(-1)).toEqual(GOAL);
    expect(result.path.every((point) => isWalkable(DETOUR_MAP, point))).toBe(true);
    expect(result.expandedNodes).toBeGreaterThan(0);
    expect(result.maximumFrontier).toBeGreaterThan(0);
  });

  it("returns a one-cell path when start equals goal", () => {
    const result = findPath(DETOUR_MAP, START, START);

    expect(result.status).toBe("success");
    expect(result.path).toEqual([START]);
    expect(result.totalCost).toBe(0);
    expect(result.explored).toEqual([START]);
    expect(result.expandedNodes).toBe(1);
    expect(result.maximumFrontier).toBe(1);
  });

  it("reports invalid endpoints without exploring", () => {
    const invalidStart = findPath(DETOUR_MAP, { x: -1, y: 0 }, GOAL);
    const invalidGoal = findPath(DETOUR_MAP, START, { x: 2, y: 0 });

    expect(invalidStart.status).toBe("invalid-start");
    expect(invalidGoal.status).toBe("invalid-goal");
    expect(invalidGoal.expandedNodes).toBe(0);
  });

  it("reports an unreachable goal explicitly", () => {
    const splitMap = createGridMap(3, 3, [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ]);
    const result = findPath(splitMap, { x: 0, y: 1 }, { x: 2, y: 1 });

    expect(result.status).toBe("unreachable");
    expect(result.path).toEqual([]);
    expect(result.totalCost).toBeNull();
    expect(result.expandedNodes).toBe(3);
    expect(result.maximumFrontier).toBe(2);
    expect(result.explored).toEqual([
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 0, y: 2 },
    ]);
  });
});

describe("slow terrain variant (A*)", () => {
  it("avoids slow terrain and finds an optimal detour with A*", () => {
    // 5x3 map with slow terrain at (1,1), (2,1), (3,1) costing 5
    const slowTerrainMap = createGridMap(5, 3, [], {
      "1,1": 5,
      "2,1": 5,
      "3,1": 5,
    });
    const start = { x: 0, y: 1 };
    const goal = { x: 4, y: 1 };

    const result = findPathAStar(slowTerrainMap, start, goal);
    expect(result.status).toBe("success");
    // Optimal detour around slow terrain (e.g. via y=0 or y=2) has 6 steps and cost 6
    expect(result.totalCost).toBe(6);
    expect(result.path.length).toBe(7); // 6 steps = 7 points
    // Check that slow terrain cells are avoided in the path
    const avoided = result.path.every(
      (p) => !(p.y === 1 && p.x >= 1 && p.x <= 3)
    );
    expect(avoided).toBe(true);
  });

  it("calculates the correct high cost for the direct path through slow terrain when other paths are blocked", () => {
    // 5x3 map where top and bottom rows are blocked, forcing the path through the middle (slow terrain)
    const blockedCells: GridPoint[] = [];
    for (let x = 0; x < 5; x++) {
      blockedCells.push({ x, y: 0 });
      blockedCells.push({ x, y: 2 });
    }
    const forcedSlowMap = createGridMap(5, 3, blockedCells, {
      "1,1": 5,
      "2,1": 5,
      "3,1": 5,
    });
    const start = { x: 0, y: 1 };
    const goal = { x: 4, y: 1 };

    const result = findPathAStar(forcedSlowMap, start, goal);
    expect(result.status).toBe("success");
    // Direct path: (0,1) -> (1,1)[5] -> (2,1)[5] -> (3,1)[5] -> (4,1)[1] = total cost 16 in 4 steps
    expect(result.totalCost).toBe(16);
    expect(result.path.length).toBe(5);
  });

  it("recovers standard path when slow terrain costs are removed or set to 1", () => {
    const flatMap = createGridMap(5, 3, [], {
      "1,1": 1,
      "2,1": 1,
      "3,1": 1,
    });
    const start = { x: 0, y: 1 };
    const goal = { x: 4, y: 1 };

    const result = findPathAStar(flatMap, start, goal);
    expect(result.status).toBe("success");
    expect(result.totalCost).toBe(4);
    expect(result.path.length).toBe(5);
  });

  it("handles zero cost terrain correctly with admissible heuristic", () => {
    const zeroCostMap = createGridMap(3, 3, [], {
      "1,1": 0,
      "2,1": 0,
    });
    const start = { x: 0, y: 1 };
    const goal = { x: 2, y: 1 };

    const result = findPathAStar(zeroCostMap, start, goal);
    expect(result.status).toBe("success");
    expect(result.totalCost).toBe(0); // (0,1) -> (1,1)[0] -> (2,1)[0] sum is 0
  });
});
