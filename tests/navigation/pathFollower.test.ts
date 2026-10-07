import { describe, expect, it } from "vitest";
import { advanceAlongPath, type Waypoint } from "../../src/domain/navigation/pathFollower";

const PATH = [
  { x: 10, y: 0 },
  { x: 10, y: 10 },
];

describe("path follower", () => {
  it("moves partway toward the next waypoint", () => {
    expect(advanceAlongPath({ x: 0, y: 0 }, PATH, 0, 4)).toEqual({
      position: { x: 4, y: 0 },
      nextWaypoint: 0,
      completed: false,
      direction: { x: 1, y: 0 },
    });
  });

  it("consumes multiple waypoints without losing distance", () => {
    expect(advanceAlongPath({ x: 0, y: 0 }, PATH, 0, 15)).toEqual({
      position: { x: 10, y: 5 },
      nextWaypoint: 1,
      completed: false,
      direction: { x: 0, y: 1 },
    });
  });

  it("realigns an in-transit position with the current cell center", () => {
    expect(advanceAlongPath(
      { x: 7, y: 0 },
      [{ x: 10, y: 0 }, { x: 10, y: 10 }],
      0,
      5,
    )).toEqual({
      position: { x: 10, y: 2 },
      nextWaypoint: 1,
      completed: false,
      direction: { x: 0, y: 1 },
    });
  });

  it("reports completion at the final waypoint", () => {
    expect(advanceAlongPath({ x: 0, y: 0 }, PATH, 0, 25)).toEqual({
      position: { x: 10, y: 10 },
      nextWaypoint: 2,
      completed: true,
      direction: { x: 0, y: 1 },
    });
  });

  it("preserves facing when no movement is available", () => {
    expect(advanceAlongPath({ x: 0, y: 0 }, PATH, 0, 0).direction).toBeNull();
  });

  it("rejects invalid movement values", () => {
    expect(() => advanceAlongPath({ x: 0, y: 0 }, PATH, -1, 2)).toThrow(
      "Next waypoint index",
    );
    expect(() => advanceAlongPath({ x: 0, y: 0 }, PATH, 0, Number.NaN)).toThrow(
      "Maximum movement distance",
    );
    expect(() => advanceAlongPath({ x: Number.NaN, y: 0 }, PATH, 0, 1)).toThrow(
      "Vector components",
    );
  });

  it("activates a 1.5 second pause on a PatrolWaypoint and returns configured facing", () => {
    const patrolPath: readonly Waypoint[] = [
      { x: 10, y: 0, isPatrolPoint: true, facing: { x: 0, y: -1 } },
    ];
    const result = advanceAlongPath({ x: 0, y: 0 }, patrolPath, 0, 20);
    expect(result).toEqual({
      position: { x: 10, y: 0 },
      nextWaypoint: 1,
      completed: false,
      direction: { x: 1, y: 0 },
      waiting: true,
      waitTimeRemaining: 1500,
      facing: { x: 0, y: -1 },
    });
  });

  it("does not advance and decreases wait time during pause, resuming afterwards", () => {
    const patrolPath: readonly Waypoint[] = [
      { x: 10, y: 0, isPatrolPoint: true, facing: { x: 0, y: -1 } },
      { x: 10, y: 10 },
    ];

    // During pause with 500ms elapsed
    const paused = advanceAlongPath({ x: 10, y: 0 }, patrolPath, 1, 10, 1500, 500);
    expect(paused).toEqual({
      position: { x: 10, y: 0 },
      nextWaypoint: 1,
      completed: false,
      direction: null,
      waiting: true,
      waitTimeRemaining: 1000,
      facing: { x: 0, y: -1 },
    });

    // After pause completes (remaining wait elapses)
    const resumed = advanceAlongPath({ x: 10, y: 0 }, patrolPath, 1, 5, 1000, 1000);
    expect(resumed).toEqual({
      position: { x: 10, y: 5 },
      nextWaypoint: 1,
      completed: false,
      direction: { x: 0, y: 1 },
    });
  });

  it("does not activate a pause for normal waypoints", () => {
    const normalPath: readonly Waypoint[] = [
      { x: 10, y: 0 },
    ];
    const result = advanceAlongPath({ x: 0, y: 0 }, normalPath, 0, 20);
    expect(result.waiting).toBeFalsy();
    expect(result.completed).toBe(true);
  });
});
