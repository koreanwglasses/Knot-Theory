import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./core/planar-poly-knot";
import { transform } from "./core/planar-poly-knot";
import { dot, translate, scale } from "./utils/lin";
import { PlanarSpringKnot } from "./core/planar-spring-knot";

const knot = trefoil();
const m = dot(translate([200, 200]), scale(100));
transform(knot, m);

ReactDOM.render(
  <PolyKnotDiagramCanvas knot={knot} width={400} height={400} />,
  document.getElementById("react-root")
);

const knot2 = trefoil();
const springKnot = PlanarSpringKnot.fromPlanarKnot(knot2, 3);
console.log(springKnot);
