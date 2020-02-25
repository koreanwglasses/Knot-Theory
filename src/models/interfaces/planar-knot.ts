import * as PlanarKnotGeneric from "../generics/planar-knot";

export type Anchor<C> = PlanarKnotGeneric.Anchor<C>;
export type Arc<C> = PlanarKnotGeneric.Arc<C, Anchor<C>>;
export type Knot<C> = PlanarKnotGeneric.Knot<C, Anchor<C>, Arc<C>>;
