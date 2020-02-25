import * as PlanarKnotGeneric from "./generics/planar-knot";
import * as PlanarPolyKnotGeneric from "./generics/planar-poly-knot";
import { Vector2 } from "../core/lin";

class Node {
  location: Vector2;
  springs: Spring[];
}

class Spring {
  neighbor: Node;
  restLength: number;
  k: number;
}

export class Crossing implements PlanarPolyKnotGeneric.Crossing {
  node: Node;

  get location(): Vector2 {
    return this.node.location;
  }
}

type Anchor = PlanarPolyKnotGeneric.Anchor;

export class Arc implements PlanarPolyKnotGeneric.Arc {
  begin: Anchor;
  end: Anchor;
  nodes: Node[];
  get path(): Vector2[] {
    return this.nodes.map(node => node.location);
  }
}

export class PlanarSpringKnot implements PlanarPolyKnotGeneric.Knot {
  nodes: Node[];
  crossings: Crossing[];
  arcs: Arc[];

  // tick(dt: number): void {

  // }

  // static fromPlanarKnot(knot: PlanarKnotGeneric.Knot) {

  // }
}
