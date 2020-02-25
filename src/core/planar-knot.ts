import { CrossingType, AnchorType, ArcType } from "./generics/planar-knot";
import * as D from "./defaults/planar-knot";
import * as G from "./generics/planar-knot";

export function map<
  C1,
  C2,
  N1 extends G.Anchor<C1>,
  N2 extends G.Anchor<C2>,
  R1 extends G.Arc<C1, N1>,
  R2 extends G.Arc<C2, N2>,
  K1 extends G.Knot<C1, N1, R1>,
  K2 extends G.Knot<C2, N2, R2>
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
  N1 extends G.Anchor<C1>,
  N2 extends G.Anchor<C2>,
  R1 extends G.Arc<C1, N1>,
  R2 extends G.Arc<C2, N2>,
  K1 extends G.Knot<C1, N1, R1>,
  K2 extends G.Knot<C2, N2, R2>
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

export function anchorEquals(anchor1: D.Anchor, anchor2: D.Anchor): boolean {
  return (
    anchor1.crossing == anchor2.crossing && anchor1.strand == anchor2.strand
  );
}

export function prevArc<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, arc: ArcType<K>): ArcType<K>;
export function prevArc<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, arc: R): R {
  const matches = knot.arcs.filter(prev => anchorEquals(arc.begin, prev.end));
  if (matches.length == 0) {
    throw new Error("invalid knot: knot is not a closed, well oriented loop");
  }
  if (matches.length > 1) {
    throw new Error(
      "invalid knot: knot has branches i.e. is not a simple loop"
    );
  }
  return matches[0];
}

export function nextArc<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, arc: ArcType<K>): ArcType<K>;
export function nextArc<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, arc: R): R {
  const matches = knot.arcs.filter(next => anchorEquals(arc.end, next.begin));
  if (matches.length == 0) {
    throw new Error("invalid knot: knot is not a closed, well oriented loop");
  }
  if (matches.length > 1) {
    throw new Error(
      "invalid knot: knot has branches i.e. is not a simple loop"
    );
  }
  return matches[0];
}

/**
 * A crossing with references to anchors
 */
export class Crossing {
  /**
   * Anchor to the upper strand at this crossing
   */
  readonly lower: G.Anchor<this>;

  /**
   * Anchor to the lower strand at this crossing
   */
  readonly upper: G.Anchor<this>;

  constructor() {
    const lower: G.Anchor<this> = {
      strand: "lower",
      crossing: this
    };
    const upper: G.Anchor<this> = {
      strand: "upper",
      crossing: this
    };
    this.lower = lower;
    this.upper = upper;
  }
}
