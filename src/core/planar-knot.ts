import {
  Anchor,
  Arc,
  Knot,
  CrossingType,
  AnchorType,
  ArcType
} from "./generics/planar-knot";

export function map<
  C1,
  C2,
  N1 extends Anchor<C1>,
  N2 extends Anchor<C2>,
  R1 extends Arc<C1, N1>,
  R2 extends Arc<C2, N2>,
  K1 extends Knot<C1, N1, R1>,
  K2 extends Knot<C2, N2, R2>
>(
  knot: K1,
  crossingFn: (crossing: CrossingType<K1>) => CrossingType<K2>,
  anchorFn: (
    anchor: AnchorType<K1>,
    crossing: CrossingType<K2>
  ) => AnchorType<K2>,
  arcFn: (
    arc: ArcType<K1>,
    begin: AnchorType<K2>,
    end: AnchorType<K2>
  ) => ArcType<K2>,
  knotFn: (knot: K1, crossings: CrossingType<K2>[], arcs: ArcType<K2>[]) => K2
): K2;
export function map<
  C1,
  C2,
  N1 extends Anchor<C1>,
  N2 extends Anchor<C2>,
  R1 extends Arc<C1, N1>,
  R2 extends Arc<C2, N2>,
  K1 extends Knot<C1, N1, R1>,
  K2 extends Knot<C2, N2, R2>
>(
  knot: K1,
  crossingFn: (crossing: C1) => C2,
  anchorFn: (anchor: N1, crossing: C2) => N2,
  arcFn: (arc: R1, begin: N2, end: N2) => R2,
  knotFn: (knot: K1, crossings: C2[], arcs: R2[]) => K2
): K2 {
  const crossings = knot.crossings.map(crossingFn);

  const cloneAnchor = ((): ((anchor: N1) => N2) => {
    const anchors: { [key: string]: N2 } = {};
    return (anchor: N1): N2 => {
      const i = knot.crossings.indexOf(anchor.crossing);
      const key = `${i},${anchor.strand}`;
      if (!(key in anchors)) anchors[key] = anchorFn(anchor, crossings[i]);
      return anchors[key];
    };
  })();

  const arcs: R2[] = knot.arcs.map(arc =>
    arcFn(arc, cloneAnchor(arc.begin), cloneAnchor(arc.end))
  );

  return knotFn(knot, crossings, arcs);
}

/**
 * A crossing with references to anchors
 */
export class Crossing {
  /**
   * Anchor to the upper strand at this crossing
   */
  readonly lower: Anchor<this>;

  /**
   * Anchor to the lower strand at this crossing
   */
  readonly upper: Anchor<this>;

  constructor() {
    const lower: Anchor<this> = {
      strand: "lower",
      crossing: this
    };
    const upper: Anchor<this> = {
      strand: "upper",
      crossing: this
    };
    this.lower = lower;
    this.upper = upper;
  }
}
