import * as PlanarKnotGeneric from "../generics/planar-knot";
import { Vector2 } from "../../utils/lin";

export interface Crossing {
  location: Vector2;
}

export type Anchor<C> = C extends Crossing
  ? PlanarKnotGeneric.Anchor<C>
  : never;

export interface Arc<C extends Crossing, N extends PlanarKnotGeneric.Anchor<C>>
  extends PlanarKnotGeneric.Arc<C, N> {
  path: Vector2[];
}

export type Knot<C, N, R> = C extends Crossing
  ? N extends Anchor<C>
    ? R extends Arc<C, N>
      ? PlanarKnotGeneric.Knot<C, N, R>
      : never
    : never
  : never;
