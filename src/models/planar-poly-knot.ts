import * as PlanarPolyKnotInterfaces from "./interfaces/planar-poly-knot";
import * as PlanarKnot from "./planar-knot";
import { Vector2 } from "../core/lin";

export class Crossing extends PlanarKnot.Crossing
  implements PlanarPolyKnotInterfaces.Crossing {
  constructor(public location: Vector2) {
    super();
  }
}

export const trefoil = (): PlanarPolyKnotInterfaces.Knot => {
  const crossings: Crossing[] = [
    new Crossing([0, 1]),
    new Crossing([-Math.sqrt(3) / 2, -1 / 2]),
    new Crossing([Math.sqrt(3) / 2, -1 / 2])
  ];

  const arcs: PlanarPolyKnotInterfaces.Arc[] = [
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
