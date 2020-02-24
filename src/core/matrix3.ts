import { Vector2, isVector2 } from "./vector2";

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
