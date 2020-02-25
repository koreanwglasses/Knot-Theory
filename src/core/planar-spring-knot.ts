import * as PlanarKnotDefaults from "./defaults/planar-knot";
import * as G from "./generics/planar-poly-knot";
import { Vector2 } from "../utils/lin";
import { map, prevArc, nextArc } from "./planar-knot";
import { assert } from "../utils/utils";

class Node {
  location: Vector2 = [0, 0];
  springs: Spring[] = [];
  constructor(readonly parent: Crossing | Arc) {}
}

class Spring {
  constructor(
    readonly neighbor: Node,
    readonly restLength: number,
    readonly k: number
  ) {}
}

export class Crossing implements G.Crossing {
  readonly node: Node = new Node(this);

  get location(): Vector2 {
    return this.node.location;
  }

  set location(v: Vector2) {
    this.node.location = v;
  }
}

type Anchor = G.Anchor<Crossing>;

export class Arc implements G.Arc<Crossing, Anchor> {
  readonly nodes: Node[];

  constructor(
    readonly begin: Anchor,
    readonly end: Anchor,
    readonly subdivisions: number
  ) {
    this.nodes = new Array(subdivisions).fill(null).map(() => new Node(this));
  }

  get path(): Vector2[] {
    return this.nodes.map(node => node.location);
  }
}

/**
 * Gets the nodes on this arc and one from each adjacent arc
 * @param knot Knot
 * @param arc Arc
 */
function getSegment(knot: PlanarSpringKnot, arc: Arc): Node[] {
  const prev = prevArc(knot, arc).nodes;
  const next = nextArc(knot, arc).nodes;
  return [
    prev[prev.length - 1],
    arc.begin.crossing.node,
    ...arc.nodes,
    arc.end.crossing.node,
    next[0]
  ];
}

export class PlanarSpringKnot implements G.Knot<Crossing, Anchor, Arc> {
  private nodes: Node[];

  private constructor(public crossings: Crossing[], public arcs: Arc[]) {
    this.nodes = crossings.map(crossing => crossing.node);
    arcs.forEach(arc => this.nodes.push(...arc.nodes));

    // connect springs to each node
    const restLength = 1;
    const structuralK = 1;
    const flexionK = 1;

    this.nodes.forEach(node => {
      if (node.parent instanceof Arc) {
        const segment = getSegment(this, node.parent);
        const i = segment.indexOf(node);
        assert(2 <= i && i <= segment.length - 3);

        // Connect structural springs
        node.springs.push(new Spring(segment[i - 1], restLength, structuralK));
        node.springs.push(new Spring(segment[i + 1], restLength, structuralK));

        // connect back from crossing nodes
        if (i == 2) {
          segment[1].springs.push(new Spring(node, restLength, structuralK));
        } else if (i == segment.length - 3) {
          segment[segment.length - 2].springs.push(
            new Spring(node, restLength, structuralK)
          );
        }

        // Connect flexion springs
        node.springs.push(new Spring(segment[i - 2], 2 * restLength, flexionK));
        node.springs.push(new Spring(segment[i + 2], 2 * restLength, flexionK));

        // connect back from crossing nodes
        if (i == 3) {
          segment[1].springs.push(new Spring(node, restLength, flexionK));
        } else if (i == segment.length - 4) {
          segment[segment.length - 2].springs.push(
            new Spring(node, restLength, flexionK)
          );
        }
      }
    });
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
