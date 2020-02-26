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

/**
 * Returns arcs in the order [upper-out, upper-in, lower-out, lower in]
 * @param knot Knot
 * @param crossing Crossing within the knot
 */
export function arcsAtCrossing<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, crossing: CrossingType<K>): ArcType<K>[];
export function arcsAtCrossing<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, crossing: CrossingType<K>): R[] {
  const adjacentArcs = knot.arcs.filter(
    arc => arc.end.crossing == crossing || arc.begin.crossing == crossing
  );

  if (adjacentArcs.length != 4) {
    throw new Error(
      "invalid knot: each crossing must have exactly four arcs connected to it"
    );
  }

  const upperOut = adjacentArcs.filter(
    arc => arc.begin.strand == "upper" && arc.begin.crossing == crossing
  );
  if (upperOut.length == 0) {
    throw new Error("invalid knot: no upper-out arc at crossing");
  }
  if (upperOut.length > 1) {
    throw new Error("invalid knot: multiple upper-out arcs at crossing");
  }

  const upperIn = adjacentArcs.filter(
    arc => arc.end.strand == "upper" && arc.end.crossing == crossing
  );
  if (upperIn.length == 0) {
    throw new Error("invalid knot: no upper-in arc at crossing");
  }
  if (upperIn.length > 1) {
    throw new Error("invalid knot: multiple upper-in arcs at crossing");
  }

  const lowerOut = adjacentArcs.filter(
    arc => arc.begin.strand == "lower" && arc.begin.crossing == crossing
  );
  if (lowerOut.length == 0) {
    throw new Error("invalid knot: no lower-out arc at crossing");
  }
  if (lowerOut.length > 1) {
    throw new Error("invalid knot: multiple lower-out arcs at crossing");
  }

  const lowerIn = adjacentArcs.filter(
    arc => arc.end.strand == "lower" && arc.end.crossing == crossing
  );
  if (lowerIn.length == 0) {
    throw new Error("invalid knot: no lower-in arc at crossing");
  }
  if (lowerIn.length > 1) {
    throw new Error("invalid knot: multiple lower-in arcs at crossing");
  }

  return [upperOut[0], upperIn[0], lowerOut[0], lowerIn[0]];
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

export function unlink<C, N extends G.Anchor<C>, R extends G.Arc<C, N>>(
  knot: G.Knot<C, N, R>,
  crossing: C,
  sign: "positive" | "negative",
  mergeArcs: (arc1: R, arc2: R) => R
): void {
  const [upperOut, upperIn, lowerOut, lowerIn] = arcsAtCrossing(knot, crossing);

  const arc1 =
    sign == "positive"
      ? mergeArcs(lowerIn, upperOut)
      : mergeArcs(lowerIn, upperIn);
  const arc2 =
    sign == "positive"
      ? mergeArcs(upperIn, lowerOut)
      : mergeArcs(lowerOut, upperIn);

  knot.arcs.splice(knot.arcs.indexOf(upperOut), 1);
  knot.arcs.splice(knot.arcs.indexOf(upperIn), 1);
  knot.arcs.splice(knot.arcs.indexOf(lowerOut), 1);
  knot.arcs.splice(knot.arcs.indexOf(lowerIn), 1);

  knot.arcs.push(arc1, arc2);

  knot.crossings.splice(knot.crossings.indexOf(crossing), 1);
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
