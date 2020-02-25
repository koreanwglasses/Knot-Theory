export interface Anchor<C> {
  crossing: C;
  strand: "lower" | "upper";
}

export interface Arc<C, N extends Anchor<C>> {
  begin: N;
  end: N;
}

export interface Knot<C, N extends Anchor<C>, R extends Arc<C, N>> {
  crossings: C[];
  arcs: R[];
}

export type CrossingType<T> = T extends Anchor<infer C>
  ? C
  : T extends Arc<infer C, infer N>
  ? C
  : T extends Knot<infer C, infer N, infer R>
  ? C
  : never;

export type AnchorType<T> = T extends Arc<infer C, infer N>
  ? N
  : T extends Knot<infer C, infer N, infer R>
  ? N
  : never;

export type ArcType<T> = T extends Knot<infer C, infer N, infer R> ? R : never;
