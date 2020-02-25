import * as G from "./generics/planar-poly-knot";
import * as D from "./defaults/planar-poly-knot";
import * as PlanarKnot from "./planar-knot";
import { Vector2, dot, Matrix3 } from "../utils/lin";

/**
 * Transform the points of a knot in place by a matrix m
 * @param knot Knot to transform
 * @param m Transformation as an affine matrix
 */
export function transform<
  C extends G.Crossing,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, m: Matrix3): K {
  return PlanarKnot.map(
    knot,
    crossing => {
      crossing.location = dot(m, crossing.location);
      return crossing;
    },
    anchor => anchor,
    arc => {
      arc.path = arc.path.map(v => dot(m, v));
      return arc;
    },
    knot => knot
  );
}

export class Crossing extends PlanarKnot.Crossing implements D.Crossing {
  constructor(public location: Vector2) {
    super();
  }
}

export const trefoil = (): D.Knot => {
  const crossings: Crossing[] = [
    new Crossing([0, 1]),
    new Crossing([-Math.sqrt(3) / 2, -1 / 2]),
    new Crossing([Math.sqrt(3) / 2, -1 / 2])
  ];

  const arcs: D.Arc[] = [
    {
      begin: crossings[0].lower,
      end: crossings[1].upper,
      path: [[-Math.sqrt(3) / 2, 1 / 2]]
    },
    { begin: crossings[1].upper, end: crossings[2].lower, path: [] },
    {
      begin: crossings[2].lower,
      end: crossings[0].upper,
      path: [[Math.sqrt(3) / 2, 1 / 2]]
    },
    { begin: crossings[0].upper, end: crossings[1].lower, path: [] },
    { begin: crossings[1].lower, end: crossings[2].upper, path: [[0, -1]] },
    { begin: crossings[2].upper, end: crossings[0].lower, path: [] }
  ];

  return { crossings, arcs };
};
