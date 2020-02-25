import * as PlanarKnotGenerics from "./generics/planar-knot";
import * as PlanarKnotDefaults from "./defaults/planar-knot";
import * as PlanarPolyKnotDefaults from "./defaults/planar-poly-knot";
import { Vector2 } from "../utils/lin";
import { map } from "./planar-knot";

class Node {
  location: Vector2;
  springs: Spring[];
}

class Spring {
  neighbor: Node;
  restLength: number;
  k: number;
}

export class Crossing implements PlanarPolyKnotDefaults.Crossing {
  readonly node: Node;

  get location(): Vector2 {
    return this.node.location;
  }
}

type Anchor = PlanarKnotGenerics.Anchor<Crossing>;

export class Arc implements PlanarPolyKnotDefaults.Arc {
  readonly nodes: Node[];

  constructor(
    readonly begin: Anchor,
    readonly end: Anchor,
    readonly subdivisions: number
  ) {}

  get path(): Vector2[] {
    return this.nodes.map(node => node.location);
  }
}

export class PlanarSpringKnot implements PlanarPolyKnotDefaults.Knot {
  private nodes: Node[];

  private constructor(public crossings: Crossing[], public arcs: Arc[]) {
    this.nodes = crossings.map(crossing => crossing.node);
    arcs.forEach(arc => this.nodes.push(...arc.nodes));
  }

  static fromPlanarKnot(
    knot: PlanarKnotDefaults.Knot,
    subdivisions: number
  ): PlanarSpringKnot {
    return map(
      knot,
      () => new Crossing(),
      (anchor, crossing) => ({ ...anchor, crossing }),
      (arc, begin, end) => new Arc(begin, end, subdivisions),
      (knot, crossings, arcs) => new PlanarSpringKnot(crossings, arcs)
    );
  }
}
