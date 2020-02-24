export type Vector2 = [number, number];

export function isVector2(v: unknown): v is Vector2 {
  return (
    Array.isArray(v) &&
    v.length == 2 &&
    typeof v[0] === "number" &&
    typeof v[1] === "number"
  );
}

export function scl(s: number, [x, y]: Vector2): Vector2 {
  return [s * x, s * y];
}

export function add([x1, y1]: Vector2, [x2, y2]: Vector2): Vector2 {
  return [x1 + x2, y1 + y2];
}

export function sub([x1, y1]: Vector2, [x2, y2]: Vector2): Vector2 {
  return [x1 - x2, y1 - y2];
}

export function norm([x, y]: Vector2): number {
  return Math.sqrt(x * x + y * y);
}

export function normalize(v: Vector2): Vector2 {
  return scl(1 / norm(v), v);
}

export function dist(a: Vector2, b: Vector2): number {
  return norm(sub(a, b));
}

export function shiftToward(v: Vector2, target: Vector2, r: number): Vector2 {
  return add(v, scl(r, normalize(sub(target, v))));
}
