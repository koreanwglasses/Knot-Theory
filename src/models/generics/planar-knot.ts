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

export function map<
  C,
  N extends Anchor<C>,
  R extends Arc<C, N>,
  K extends Knot<C, N, R>
>(
  knot: K,
  crossingFn: (crossing: C) => C,
  anchorFn: (anchor: N, crossing: C) => N,
  arcFc: (arc: R, begin: N, end: N) => R,
  knotFn: (knot: K, crossing: C[], arcs: R[]) => K
): K;
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

export function clone<
  C,
  N extends Anchor<C>,
  R extends Arc<C, N>,
  K extends Knot<C, N, R>
>(knot: K): K {
  return map<C, N, R, K>(
    knot,
    crossing => ({ ...crossing }),
    (anchor, crossing) => ({ ...anchor, crossing }),
    (arc, begin, end) => ({ ...arc, begin, end }),
    (knot, crossings, arcs) => ({ ...knot, crossings, arcs })
  );
}
