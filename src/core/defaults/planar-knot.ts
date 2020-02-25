import * as G from "../generics/planar-knot";

export type Crossing = unknown;
export type Anchor = G.Anchor<Crossing>;
export type Arc = G.Arc<Crossing, Anchor>;
export type Knot = G.Knot<Crossing, Anchor, Arc>;
