import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./models/planar-poly-knot";
import { transform } from "./models/generics/planar-poly-knot";
import { dot, translate, scale } from "./core/matrix3";

const knot = trefoil();
const m = dot(translate([200, 200]), scale(100));
transform(knot, m);

ReactDOM.render(
  <PolyKnotDiagramCanvas knot={knot} width={400} height={400} />,
  document.getElementById("react-root")
);
