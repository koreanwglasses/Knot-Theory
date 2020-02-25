import * as PlanarKnotGeneric from "../generics/planar-knot";
import { Vector2, dot, Matrix3 } from "../../core/lin";

export type Anchor = PlanarKnotGeneric.Anchor<Crossing>;

export interface Arc extends PlanarKnotGeneric.Arc<Crossing, Anchor> {
  path: Vector2[];
}

export interface Knot extends PlanarKnotGeneric.Knot<Crossing, Anchor, Arc> {
  crossings: Crossing[];
  arcs: Arc[];
}

export interface Crossing {
  location: Vector2;
}

/**
 * Transform the points of a knot in place by a matrix m
 * @param knot Knot to transform
 * @param m Transformation as an affine matrix
 */
export function transform(knot: Knot, m: Matrix3): Knot {
  return PlanarKnotGeneric.map<Crossing, Anchor, Arc, Knot>(
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
