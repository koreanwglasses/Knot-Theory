import * as PlanarKnot from "./planar-knot";
import { Vector2 } from "../../core/vector2";
import { Matrix3, dot } from "../../core/matrix3";

export type Anchor = PlanarKnot.Anchor<Crossing>;

export interface Arc extends PlanarKnot.Arc<Crossing, Anchor> {
  path: Vector2[];
}

export interface Knot extends PlanarKnot.Knot<Crossing, Anchor, Arc> {
  crossings: Crossing[];
  arcs: Arc[];
}

export interface Crossing {
  location: Vector2;
}

export function transform<K extends Knot>(knot: K, m: Matrix3): K {
  return PlanarKnot.map<Crossing, Anchor, Arc, K>(
    knot,
    crossing => ({
      ...crossing,
      location: dot(m, crossing.location)
    }),
    (anchor, crossing) => ({ ...anchor, crossing }),
    (arc, begin, end) => ({
      ...arc,
      path: arc.path.map(v => dot(m, v)),
      begin,
      end
    }),
    (knot, crossings, arcs) => ({ ...knot, crossings, arcs })
  );
}
