import * as G from "./generics/planar-poly-knot";
import * as D from "./defaults/planar-poly-knot";
import * as PlanarKnot from "./planar-knot";
import { Vector2, dot, Matrix3 } from "../utils/lin";

/**
 * Transform the points of a knot in place by a matrix m
 * @param knot Knot to transform
 * @param m Transformation as an affine matrix
 */
export function transform<
  C extends G.Crossing,
  N extends G.Anchor<C>,
  R extends G.Arc<C, N>,
  K extends G.Knot<C, N, R>
>(knot: K, m: Matrix3): K {
  return PlanarKnot.map(
    knot,
    crossing => {
      crossing.location = dot(m, crossing.location);
      return crossing;
    },
    anchor => anchor,
    arc => {
      arc.path = arc.path.map(v => dot(m, v));
      return arc;
    },
    knot => knot
  );
}

export class Crossing extends PlanarKnot.Crossing implements G.Crossing {
  readonly lower: Anchor;
  readonly upper: Anchor;
  constructor(readonly location: Vector2) {
    super();
  }

  copy(): Crossing {
    return new Crossing(this.location);
  }
}

export class Anchor extends PlanarKnot.Anchor implements G.Anchor<Crossing> {
  constructor(readonly crossing: Crossing, readonly strand: "lower" | "upper") {
    super(crossing, strand);
  }

  copy(crossing: Crossing): Anchor {
    return super.copy(crossing) as Anchor;
  }
}

export class Arc extends PlanarKnot.Arc implements G.Arc<Crossing, Anchor> {
  constructor(
    readonly begin: Anchor,
    readonly end: Anchor,
    readonly path: Vector2[]
  ) {
    super(begin, end);
  }

  copy(begin: Anchor, end: Anchor): Arc {
    return new Arc(begin, end, this.path.slice());
  }
}

export class Knot extends PlanarKnot.Knot
  implements G.Knot<Crossing, Anchor, Arc> {
  constructor(readonly crossings: Crossing[], readonly arcs: Arc[]) {
    super(crossings, arcs);
  }

  copy(crossings: Crossing[], arcs: Arc[]): Knot {
    return new Knot(crossings, arcs);
  }

  clone(): Knot {
    return super.clone() as Knot;
  }

  mergeArcs(arc1: Arc, arc2: Arc, crossing: Crossing): Arc {
    const arc3 = super.mergeArcs(arc1, arc2, crossing) as Arc;

    const newPath =
      arc1 == arc2
        ? [...arc1.path, crossing.location, arc1.path[0]]
        : [
            ...(arc1.end.crossing === crossing
              ? arc1.path
              : arc1.path.slice().reverse()),
            crossing.location,
            ...(arc2.begin.crossing === crossing
              ? arc2.path
              : arc2.path.slice().reverse())
          ];

    return new Arc(arc3.begin, arc3.end, newPath);
  }

  flipArc(arc: Arc): Arc {
    return new Arc(arc.end, arc.begin, arc.path.slice().reverse());
  }

  static fromPlanarPolyKnot<
    C extends G.Crossing,
    N extends G.Anchor<C>,
    R extends G.Arc<C, N>
  >(knot: G.Knot<C, N, R>): Knot {
    return PlanarKnot.map(
      knot,
      crossing => new Crossing(crossing.location),
      (anchor, crossing) => crossing[anchor.strand],
      (arc, begin: Anchor, end: Anchor) => new Arc(begin, end, arc.path),
      (knot, crossings, arcs) => new Knot(crossings, arcs)
    );
  }
}

export const trefoil = (): D.Knot => {
  const crossings: Crossing[] = [
    new Crossing([0, 1]),
    new Crossing([-Math.sqrt(3) / 2, -1 / 2]),
    new Crossing([Math.sqrt(3) / 2, -1 / 2])
  ];

  const arcs: D.Arc[] = [
    {
      begin: crossings[0].lower,
      end: crossings[1].upper,
      path: [[-Math.sqrt(3) / 2, 1 / 2]]
    },
    { begin: crossings[1].upper, end: crossings[2].lower, path: [] },
    {
      begin: crossings[2].lower,
      end: crossings[0].upper,
      path: [[Math.sqrt(3) / 2, 1 / 2]]
    },
    { begin: crossings[0].upper, end: crossings[1].lower, path: [] },
    { begin: crossings[1].lower, end: crossings[2].upper, path: [[0, -1]] },
    { begin: crossings[2].upper, end: crossings[0].lower, path: [] }
  ];

  return { crossings, arcs };
};
