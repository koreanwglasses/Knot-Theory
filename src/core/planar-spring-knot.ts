import * as PlanarKnotDefaults from "./defaults/planar-knot";
import * as G from "./generics/planar-poly-knot";
import { Vector2, normalize, sub, scl, add, norm } from "../utils/lin";
import { map, prevArc, nextArc, arcsAtCrossing } from "./planar-knot";
import { assert } from "../utils/utils";

class Node {
  location: Vector2 = [0, 0];
  springs: Spring[] = [];
  force: Vector2 = [0, 0];

  constructor(readonly parent: Crossing | Arc) {}

  repellants: Node[] = [];

  computeForce(): void {
    this.force = [0, 0];
    this.springs.forEach(spring => {
      // f = k(|d|-l)(d/|d|)
      const d = sub(spring.target.location, this.location);
      const f = scl(spring.k * (norm(d) - spring.restLength), normalize(d));
      this.force = add(this.force, f);
    });

    this.repellants.forEach(node => {
      // f = kd/|d|^3
      const d = sub(node.location, this.location);
      const f = scl(-1000 / norm(d) ** 3, d);
      this.force = add(this.force, f);
    });
  }

  velocity: Vector2 = [0, 0];
  tick(dt: number): void {
    const f = add(this.force, scl(-1, this.velocity));
    this.velocity = add(this.velocity, scl(dt, f));
    this.location = add(this.location, scl(dt, this.velocity));
  }
}

class Spring {
  constructor(
    readonly target: Node,
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

/**
 * Connect springs between the appropriate nodes
 * @param knot
 * @param nodes
 */
function createSprings(knot: PlanarSpringKnot, nodes: Node[]): void {
  const restLength = 50;
  const structuralK = 1;
  const flexionK = 2;
  const shearK = 3;

  nodes.forEach(node => {
    if (node.parent instanceof Arc) {
      const segment = getSegment(knot, node.parent);
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
    } else {
      const [upperOut, upperIn, lowerOut, lowerIn] = arcsAtCrossing(
        knot,
        node.parent
      );

      const uon = upperOut.nodes[0];
      const uin = upperIn.nodes[upperIn.nodes.length - 1];
      const lon = lowerOut.nodes[0];
      const lin = lowerIn.nodes[lowerIn.nodes.length - 1];

      // connect shear springs
      uon.springs.push(new Spring(lon, Math.SQRT1_2 * restLength, shearK));
      uon.springs.push(new Spring(lin, Math.SQRT1_2 * restLength, shearK));

      uin.springs.push(new Spring(lon, Math.SQRT1_2 * restLength, shearK));
      uin.springs.push(new Spring(lin, Math.SQRT1_2 * restLength, shearK));

      lon.springs.push(new Spring(uon, Math.SQRT1_2 * restLength, shearK));
      lon.springs.push(new Spring(uin, Math.SQRT1_2 * restLength, shearK));

      lin.springs.push(new Spring(uon, Math.SQRT1_2 * restLength, shearK));
      lin.springs.push(new Spring(uin, Math.SQRT1_2 * restLength, shearK));
    }
  });
}

function recenter(nodes: Node[], center: Vector2): void {
  let centroid: Vector2 = [0, 0];
  nodes.forEach(
    node => (centroid = add(centroid, scl(1 / nodes.length, node.location)))
  );
  nodes.forEach(
    node => (node.location = add(sub(node.location, centroid), center))
  );
}

export class PlanarSpringKnot implements G.Knot<Crossing, Anchor, Arc> {
  private nodes: Node[];

  private constructor(public crossings: Crossing[], public arcs: Arc[]) {
    const crossingNodes = crossings.map(crossing => crossing.node);
    this.nodes = [...crossingNodes];
    arcs.forEach(arc => this.nodes.push(...arc.nodes));

    createSprings(this, this.nodes);

    crossingNodes.forEach(node => {
      node.repellants = [...crossingNodes];
      node.repellants.splice(node.repellants.indexOf(node), 1);
    });
  }

  /**
   * Initialize nodes to random locations
   */
  initialize(): void {
    this.nodes.forEach(
      node => (node.location = [Math.random() * 400, Math.random() * 400])
    );
  }

  tick(dt: number): void {
    this.nodes.forEach(node => node.computeForce());
    this.nodes.forEach(node => node.tick(dt));
    recenter(this.nodes, [200, 200]);
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
