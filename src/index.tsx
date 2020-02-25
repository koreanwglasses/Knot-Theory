import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./core/planar-poly-knot";
import { transform } from "./core/planar-poly-knot";
import { dot, translate, scale, Vector2 } from "./utils/lin";
import { quadraticBSpline } from "./renderers/canvas/utils";

const knot = trefoil();
const m = dot(translate([200, 200]), scale(100));
transform(knot, m);

ReactDOM.render(
  <PolyKnotDiagramCanvas knot={knot} width={400} height={400} />,
  document.getElementById("react-root")
);

const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const n = 10;
const path: Vector2[] = new Array(n).fill(null).map((value, i) => {
  const t = (400 * i) / n;
  return [200 + 100 * Math.cos(t / 50), 200 + 100 * Math.sin(t / 50)];
});

quadraticBSpline(ctx, path);
ctx.stroke();
