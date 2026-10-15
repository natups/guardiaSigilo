import { describe, expect, it } from "vitest";
import { LAB_MAP, PLAYER_START, TILE_SIZE } from "../../src/application/simulation/labLevel";
import {
  cellCenter,
  cellTerrainCost,
  createGridMap,
  isWalkable,
  worldToCell,
} from "../../src/domain/model/grid";

describe("grid map", () => {
  it("keeps the player start cell walkable", () => {
    expect(isWalkable(LAB_MAP, PLAYER_START)).toBe(true);
  });

  it("blocks the level boundary and positions outside the map", () => {
    expect(isWalkable(LAB_MAP, { x: 0, y: 0 })).toBe(false);
    expect(isWalkable(LAB_MAP, { x: -1, y: 2 })).toBe(false);
    expect(isWalkable(LAB_MAP, { x: LAB_MAP.width, y: 2 })).toBe(false);
    expect(isWalkable(LAB_MAP, { x: 1.5, y: 2 })).toBe(false);
  });

  it("converts between cells and world coordinates", () => {
    const cell = { x: 7, y: 4 };

    expect(worldToCell(cellCenter(cell, TILE_SIZE), TILE_SIZE)).toEqual(cell);
  });

  it("rejects blocked cells outside the grid", () => {
    expect(() => createGridMap(2, 2, [{ x: 2, y: 0 }])).toThrow(
      "Blocked cell is outside the grid",
    );
  });

  it("defaults terrain cost to 1 and supports custom terrain costs", () => {
    const map = createGridMap(3, 3, [], { "1,1": 5 });
    expect(cellTerrainCost(map, { x: 0, y: 0 })).toBe(1);
    expect(cellTerrainCost(map, { x: 1, y: 1 })).toBe(5);
  });

  it("rejects invalid terrain costs", () => {
    expect(() => createGridMap(2, 2, [], { "0,0": -1 })).toThrow(
      "Invalid terrain cost",
    );
  });
});
