import * as G from "../core/generics/planar-poly-knot";
import * as PlanarKnotDefaults from "../core/defaults/planar-knot";
import * as PlanarPolyKnotDefaults from "../core/defaults/planar-poly-knot";
import {
  Vector2,
  normalize,
  sub,
  scl,
  add,
  norm,
  lerp,
  dist
} from "../utils/lin";
import { map, prevArc, nextArc, arcsAtCrossing } from "../core/planar-knot";
import { assert } from "../utils/utils";

class Node {
  location: Vector2 = [0, 0];
  springs: Spring[] = [];
  force: Vector2 = [0, 0];

  private states: { location: Vector2 }[] = [];

  constructor(readonly parent: Crossing | Arc) {}

  computeForce(): void {
    this.force = [0, 0];
    this.springs.forEach(spring => {
      // f = k(|d|-l)(d/|d|)
      const d = sub(spring.target.location, this.location);
      const f = scl(spring.k * (norm(d) - spring.restLength), normalize(d));
      this.force = add(this.force, f);
    });
  }

  // velocity: Vector2 = [0, 0];
  // tick(dt: number): void {
  //   const f = add(this.force, scl(-1, this.velocity));
  //   this.velocity = add(this.velocity, scl(dt, f));
  //   this.location = add(this.location, scl(dt, this.velocity));
  // }

  step(stepSize: number): void {
    this.location = add(this.location, scl(stepSize, this.force));
  }

  energy(): number {
    let energy = 0;
    this.springs.forEach(spring => {
      // e = 1/2 k (|d| - l0)^2
      const d = dist(spring.target.location, this.location);
      energy += 0.5 * spring.k * (d - spring.restLength) ** 2;
    });
    return energy;
  }

  /**
   * Used in optimization
   */
  pushState(): void {
    this.states.push({ location: this.location });
  }

  popState(): void {
    const { location } = this.states.pop();
    this.location = location;
  }

  discardState(): void {
    this.states.pop();
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
  const restLength = 25;
  const structuralK = 1;
  const flexionK = 4;
  const shearK = 4;

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

export class PlanarSpringKnot implements G.Knot<Crossing, Anchor, Arc> {
  private nodes: Node[];

  private constructor(public crossings: Crossing[], public arcs: Arc[]) {
    const crossingNodes = crossings.map(crossing => crossing.node);
    this.nodes = [...crossingNodes];
    arcs.forEach(arc => this.nodes.push(...arc.nodes));

    createSprings(this, this.nodes);
  }

  /**
   * Initialize nodes to random locations
   */
  initialize(): void {
    this.nodes.forEach(
      node => (node.location = [Math.random() * 400, Math.random() * 400])
    );
  }

  perturb(amplitude: number): void {
    const random = (): Vector2 => {
      let x, y: number;
      do {
        x = 2 * Math.random() - 1;
        y = 2 * Math.random() - 1;
      } while (x ** 2 + y ** 2 > 1);
      return [x, y];
    };
    this.nodes.forEach(
      node => (node.location = add(node.location, scl(amplitude, random())))
    );
  }

  recenter(nodes: Node[], center: Vector2): void {
    let centroid: Vector2 = [0, 0];
    nodes.forEach(
      node => (centroid = add(centroid, scl(1 / nodes.length, node.location)))
    );
    nodes.forEach(
      node => (node.location = add(sub(node.location, centroid), center))
    );
  }

  // tick(dt: number): void {
  //   this.nodes.forEach(node => node.computeForce());
  //   this.nodes.forEach(node => node.tick(dt));
  //   recenter(this.nodes, [200, 200]);
  // }

  energy(): number {
    return this.nodes.map(node => node.energy()).reduce((a, b) => a + b, 0);
  }

  step(stepSize: number): void {
    this.nodes.forEach(node => node.computeForce());
    this.nodes.forEach(node => node.step(stepSize));
  }

  pushState(): void {
    this.nodes.forEach(node => node.pushState());
  }
  popState(): void {
    this.nodes.forEach(node => node.popState());
  }
  discardState(): void {
    this.nodes.forEach(node => node.discardState());
  }

  localOptimize(maxIterations = 1000, minStepSize = 1e-3): void {
    let iterations = 0;
    let stepSize = 1;
    while (iterations < maxIterations) {
      let newEnergy: number;
      let energy: number;
      do {
        if (stepSize < minStepSize) {
          return;
        }

        energy = this.energy();
        this.pushState();
        this.step(stepSize);
        newEnergy = this.energy();

        if (newEnergy > energy) this.popState();
        else this.discardState();

        stepSize = stepSize * (newEnergy < energy ? 1.2 : 0.8);
        iterations++;
      } while (newEnergy > energy);
    }
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

  static fromPlanarPolyKnot(
    knot: PlanarPolyKnotDefaults.Knot,
    subdivisions: number
  ): PlanarSpringKnot {
    return map(
      knot,
      crossing => {
        const newCrossing = new Crossing();
        newCrossing.location = crossing.location;
        return newCrossing;
      },
      (anchor, crossing) => ({ ...anchor, crossing }),
      (arc, begin, end) => {
        const newArc = new Arc(
          begin,
          end,
          subdivisions * (arc.path.length + 1) - 1
        );

        const fullPath = [
          arc.begin.crossing.location,
          ...arc.path,
          arc.end.crossing.location
        ];

        // interpolate the nodes along the existing path
        for (let i = 0; i < fullPath.length - 1; i++) {
          for (let j = 0; j < subdivisions; j++) {
            if (i * subdivisions + j < newArc.nodes.length) {
              newArc.nodes[i * subdivisions + j].location = lerp(
                fullPath[i],
                fullPath[i + 1],
                (j + 1) / subdivisions
              );
            }
          }
        }

        return newArc;
      },
      (knot, crossings, arcs) => new PlanarSpringKnot(crossings, arcs)
    );
  }
}
