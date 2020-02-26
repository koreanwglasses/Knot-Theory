import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./core/planar-poly-knot";
import { transform } from "./core/planar-poly-knot";
import { PlanarSpringKnot } from "./core/planar-spring-knot";
import { drawKnot } from "./renderers/canvas/poly-knot-diagram";
import { dot, translate, scale, Vector2 } from "./utils/lin";
import { quadraticBSpline } from "./renderers/canvas/utils";

const knot = trefoil();
const m = dot(translate([200, 200]), scale(100));
transform(knot, m);

ReactDOM.render(
  <PolyKnotDiagramCanvas knot={knot} width={400} height={400} />,
  document.getElementById("react-root")
);

const knot2 = trefoil();
const springKnot = PlanarSpringKnot.fromPlanarKnot(knot2, 1);
console.log(springKnot);
springKnot.initialize();

const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#000";
ctx.lineWidth = 5;
ctx.lineCap = "round";

setInterval(() => {
  springKnot.tick(0.1);

  ctx.clearRect(0, 0, 400, 400);
  drawKnot(ctx, springKnot);
}, 100);
