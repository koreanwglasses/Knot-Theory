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

export function lerp(a: Vector2, b: Vector2, t: number): Vector2 {
  return add(scl(1 - t, a), scl(t, b));
}

export interface Matrix3 {
  m11: number;
  m12: number;
  m13: number;
  m21: number;
  m22: number;
  m23: number;
  m31: number;
  m32: number;
  m33: number;
}

export function matrix(
  array: [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ]
): Matrix3 {
  return {
    m11: array[0][0],
    m12: array[0][1],
    m13: array[0][2],
    m21: array[1][0],
    m22: array[1][1],
    m23: array[1][2],
    m31: array[2][0],
    m32: array[2][1],
    m33: array[2][2]
  };
}

export const id = (): Matrix3 =>
  matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);

export const scale = (s: number): Matrix3 =>
  matrix([
    [s, 0, 0],
    [0, s, 0],
    [0, 0, 1]
  ]);

export const translate = ([x, y]: Vector2): Matrix3 =>
  matrix([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
  ]);

export function dot(m: Matrix3, v: Vector2): Vector2;
export function dot(a: Matrix3, b: Matrix3): Matrix3;
export function dot(a: Matrix3, b: Vector2 | Matrix3): Vector2 | Matrix3 {
  if (isVector2(b)) {
    const m = a;
    const v = b;

    const w = [
      m.m11 * v[0] + m.m12 * v[1] + m.m13,
      m.m21 * v[0] + m.m22 * v[1] + m.m23,
      m.m31 * v[0] + m.m32 * v[1] + m.m33
    ];

    return [w[0] / w[2], w[1] / w[2]];
  } else {
    return {
      m11: a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31,
      m12: a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32,
      m13: a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33,
      m21: a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31,
      m22: a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32,
      m23: a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33,
      m31: a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31,
      m32: a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32,
      m33: a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33
    };
  }
}
