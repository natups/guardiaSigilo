/**
 * Incremento 1 & 2: pathFollower con soporte de pausa en puntos de patrulla.
 */

import { assertFiniteVector, distanceBetween, type Vector2 } from "../model/vector";

export type Waypoint = Vector2 | PatrolWaypoint;

export interface PatrolWaypoint extends Vector2 {
  readonly isPatrolPoint: true;
  readonly facing?: Vector2;
}

export function isPatrolWaypoint(waypoint: Waypoint): waypoint is PatrolWaypoint {
  return typeof waypoint === "object" && waypoint !== null && "isPatrolPoint" in waypoint && (waypoint as PatrolWaypoint).isPatrolPoint === true;
}

export interface PathFollowerResult {
  readonly position: Vector2;
  readonly nextWaypoint: number;
  readonly completed: boolean;
  readonly direction: Vector2 | null;
  readonly waiting?: boolean;
  readonly waitTimeRemaining?: number;
  readonly facing?: Vector2;
}

export function advanceAlongPath(
  position: Vector2,
  waypoints: readonly Waypoint[],
  nextWaypoint: number,
  maximumDistance: number,
  waitTimeRemaining: number = 0,
  deltaTimeMs: number = 0,
): PathFollowerResult {
  assertFiniteVector(position);
  waypoints.forEach((w) => assertFiniteVector({ x: w.x, y: w.y }));
  if (!Number.isInteger(nextWaypoint) || nextWaypoint < 0 || nextWaypoint > waypoints.length) {
    throw new Error("Next waypoint index is outside the path.");
  }
  if (!Number.isFinite(maximumDistance) || maximumDistance < 0) {
    throw new Error("Maximum movement distance must be finite and non-negative.");
  }

  let current = { ...position };
  let index = nextWaypoint;
  let remainingWait = waitTimeRemaining;

  // Si estamos esperando en un punto actual (y aún no hemos avanzado)
  if (remainingWait > 0) {
    remainingWait = Math.max(0, remainingWait - deltaTimeMs);
    const activeTarget = waypoints[index - 1];
    const facing = (activeTarget && isPatrolWaypoint(activeTarget)) ? activeTarget.facing : undefined;
    if (remainingWait > 0) {
      const result: PathFollowerResult = {
        position: current,
        nextWaypoint: index,
        completed: false,
        direction: null,
        waiting: true,
        waitTimeRemaining: remainingWait,
      };
      return facing !== undefined ? { ...result, facing } : result;
    }
    // Si la espera terminó en este frame, continuamos avanzando con el remaining distance disponible
  }

  let remaining = maximumDistance;
  let direction: Vector2 | null = null;
  let waiting = false;

  while (index < waypoints.length) {
    const target = waypoints[index];
    if (!target) {
      throw new Error("Path waypoint invariant failed.");
    }

    const distance = distanceBetween(current, target);
    if (distance <= Number.EPSILON) {
      current = { x: target.x, y: target.y };
      index += 1;
      if (isPatrolWaypoint(target)) {
        waiting = true;
        remainingWait = 1500; // 1.5 seconds global patrol pause
        break;
      }
      continue;
    }
    if (remaining < distance) {
      const proportion = remaining / distance;
      if (remaining > 0) {
        direction = {
          x: (target.x - current.x) / distance,
          y: (target.y - current.y) / distance,
        };
      }
      current = {
        x: current.x + (target.x - current.x) * proportion,
        y: current.y + (target.y - current.y) * proportion,
      };
      remaining = 0;
      break;
    }

    direction = {
      x: (target.x - current.x) / distance,
      y: (target.y - current.y) / distance,
    };
    current = { x: target.x, y: target.y };
    remaining -= distance;
    index += 1;

    if (isPatrolWaypoint(target)) {
      waiting = true;
      remainingWait = 1500; // 1.5 seconds global patrol pause
      break;
    }
  }

  const activeTarget = waypoints[index - 1];
  const activeFacing = (waiting && activeTarget && isPatrolWaypoint(activeTarget)) ? activeTarget.facing : undefined;

  const result: PathFollowerResult = {
    position: current,
    nextWaypoint: index,
    completed: index === waypoints.length && !waiting,
    direction,
  };

  if (waiting) {
    return {
      ...result,
      waiting,
      waitTimeRemaining: remainingWait,
      ...(activeFacing ? { facing: activeFacing } : {}),
    };
  }

  return result;
}
