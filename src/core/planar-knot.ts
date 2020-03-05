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
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(
  knot: K,
  crossingFn: (crossing: C) => C,
  anchorFn: (anchor: N, crossing: C) => N,
  arcFn: (arc: R, begin: N, end: N) => R,
  knotFn: (knot: K, crossings: C[], arcs: R[]) => K
): K;
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
      if (anchor == null) return null;
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
>(knot: K, crossing: C): R[] {
  const adjacentArcs = knot.arcs.filter(
    arc =>
      (arc.end && arc.end.crossing == crossing) ||
      (arc.begin && arc.begin.crossing == crossing)
  );

  if (adjacentArcs.length > 4) {
    throw new Error(
      "invalid knot: each crossing must have at most four arcs connected to it"
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

/**
 * Convert a crossing to an uncrossing.
 * orientation consistency: reorient is required.
 * @param knot Knot to operate on
 * @param crossing Crossing to uncross
 * @param sign Which arcs to merge
 * @param callbackFns Knot mutation strategies
 */
export function uncross<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(
  knot: K,
  crossing: C,
  sign: "positive" | "negative",
  callbackFns: {
    mergeArcs: (arc1: R, arc2: R, crossing: C) => R;
    addArc: (arc: R) => void;
    removeArc: (arc: R) => void;
    removeCrossing: (crossing: C) => void;
  }
): void {
  const { mergeArcs, addArc, removeArc, removeCrossing } = callbackFns;

  const [upperOut, upperIn, lowerOut, lowerIn] = arcsAtCrossing(knot, crossing);

  const arc1 =
    sign == "positive"
      ? mergeArcs(lowerIn, upperOut, crossing)
      : mergeArcs(lowerIn, upperIn, crossing);
  const arc2 =
    sign == "positive"
      ? mergeArcs(upperIn, lowerOut, crossing)
      : mergeArcs(upperOut, lowerOut, crossing);

  [upperOut, upperIn, lowerOut, lowerIn].forEach(arc => removeArc(arc));

  [arc1, arc2].forEach(arc => addArc(arc));

  removeCrossing(crossing);
}

export function reorient<
  C,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(
  knot: K,
  seed: R,
  callbackFns: {
    flipArc: (arc: R) => R;
    addArc: (arc: R) => void;
    removeArc: (arc: R) => void;
  }
): void {
  const { flipArc, addArc, removeArc } = callbackFns;

  const arcsToRemove: R[] = [];
  const arcsToAdd: R[] = [];

  let currentArc = seed;
  let flipped = false;
  do {
    if (currentArc.end == null) break;

    const nextArcs = knot.arcs.filter(
      arc =>
        arc !== currentArc &&
        [arc.begin, arc.end].indexOf(
          flipped ? currentArc.begin : currentArc.end
        ) != -1
    );
    if (nextArcs.length == 0) {
      throw new Error(
        "invalid knot: not enough (1) arcs on upper strand of crossing"
      );
    }
    if (nextArcs.length > 1) {
      throw new Error(
        "invalid knot: too many (3+) arcs on upper strand of crossing"
      );
    }
    const nextArc = nextArcs[0];
    if (nextArc.end == (flipped ? currentArc.begin : currentArc.end)) {
      arcsToRemove.push(nextArc);
      arcsToAdd.push(flipArc(nextArc));
      flipped = true;
    } else {
      flipped = false;
    }
    currentArc = nextArc;
  } while (currentArc !== seed);

  arcsToRemove.forEach(removeArc);
  arcsToAdd.forEach(addArc);
}

export class Anchor implements G.Anchor<Crossing> {
  constructor(
    readonly crossing: Crossing,
    readonly strand: "upper" | "lower"
  ) {}

  copy(crossing: Crossing): Anchor {
    return crossing[this.strand];
  }
}

/**
 * A crossing with references to anchors
 */
export class Crossing {
  /**
   * Anchor to the upper strand at this crossing
   */
  readonly lower: Anchor;

  /**
   * Anchor to the lower strand at this crossing
   */
  readonly upper: Anchor;

  constructor() {
    this.lower = new Anchor(this, "lower");
    this.upper = new Anchor(this, "upper");
  }

  copy(): Crossing {
    return new Crossing();
  }
}

export class Arc implements G.Arc<Crossing, Anchor> {
  constructor(readonly begin: Anchor, readonly end: Anchor) {}

  copy(begin: Anchor, end: Anchor): Arc {
    return new Arc(begin, end);
  }
}

export class Knot implements G.Knot<Crossing, Anchor, Arc> {
  constructor(readonly crossings: Crossing[], readonly arcs: Arc[]) {
    this.mergeArcs = this.mergeArcs.bind(this);
    this.flipArc = this.flipArc.bind(this);
    this.removeCrossing = this.removeCrossing.bind(this);
    this.addArc = this.addArc.bind(this);
    this.removeArc = this.removeArc.bind(this);
  }

  copy(crossings: Crossing[], arcs: Arc[]): Knot {
    return new Knot(crossings, arcs);
  }

  clone(): Knot {
    return map<Crossing, Anchor, Arc, Knot>(
      this,
      crossing => crossing.copy(),
      (anchor, crossing) => anchor.copy(crossing),
      (arc, begin, end) => arc.copy(begin, end),
      (knot, crossings, arcs) => knot.copy(crossings, arcs)
    );
  }

  mergeArcs(arc1: Arc, arc2: Arc, crossing: Crossing): Arc {
    if (arc1 == arc2) {
      return new Arc(null, null); // used to denote an unlink component
    }
    if (arc1.end.crossing == crossing && arc2.begin.crossing == crossing) {
      return new Arc(arc1.begin, arc2.end);
    }
    if (arc1.begin.crossing == crossing && arc2.end.crossing == crossing) {
      return new Arc(arc1.end, arc2.begin);
    }
    if (arc1.end.crossing == crossing && arc2.end.crossing == crossing) {
      return new Arc(arc1.begin, arc2.begin);
    }
    if (arc1.begin.crossing == crossing && arc2.begin.crossing == crossing) {
      return new Arc(arc1.end, arc2.end);
    }
    throw new Error("incompatible arcs");
  }

  flipArc(arc: Arc): Arc {
    return new Arc(arc.end, arc.begin);
  }

  removeCrossing(crossing: Crossing): void {
    if (this.crossings.indexOf(crossing) != -1)
      this.crossings.splice(this.crossings.indexOf(crossing), 1);
  }

  addArc(arc: Arc): void {
    this.arcs.push(arc);
  }

  removeArc(arc: Arc): void {
    if (this.arcs.indexOf(arc) != -1)
      this.arcs.splice(this.arcs.indexOf(arc), 1);
  }

  uncross(crossing: Crossing, sign: "positive" | "negative"): void {
    uncross<Crossing, Anchor, Arc, Knot>(this, crossing, sign, this);
  }

  reorient(seed?: Arc): void {
    reorient(this, seed || this.arcs[0], this);
  }
}
