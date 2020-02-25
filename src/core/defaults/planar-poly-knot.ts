import * as G from "../generics/planar-poly-knot";

export type Crossing = G.Crossing;
export type Anchor = G.Anchor<Crossing>;
export type Arc = G.Arc<Crossing, Anchor>;
export type Knot = G.Knot<Crossing, Anchor, Arc>;
