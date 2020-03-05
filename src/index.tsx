import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./core/planar-poly-knot";
import { transform } from "./core/planar-poly-knot";
import { PlanarSpringKnot } from "./layout/planar-spring-knot";
import { drawKnot } from "./renderers/canvas/poly-knot-diagram";
import { dot, translate, scale } from "./utils/lin";
import { Knot } from "./core/planar-poly-knot";
import { nextArc } from "./core/planar-knot";

const knot = trefoil();
const m = dot(translate([200, 200]), scale(100));
transform(knot, m);

ReactDOM.render(
  <PolyKnotDiagramCanvas knot={knot} width={400} height={400} />,
  document.getElementById("react-root")
);

const springKnot = PlanarSpringKnot.fromPlanarPolyKnot(knot, 5);
console.log(springKnot);
// springKnot.initialize();

const canvas = document.getElementById("test-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#000";
ctx.lineWidth = 5;
ctx.lineCap = "round";

springKnot.localOptimize();
drawKnot(ctx, springKnot);

// const interval = setInterval(() => {
//   const energy = springKnot.energy();
//   springKnot.pushState();
//   springKnot.perturb(10);
//   springKnot.localOptimize();
//   const newEnergy = springKnot.energy();

//   if (newEnergy > energy) springKnot.popState();
//   else {
//     springKnot.discardState();
//     console.log(energy);
//   }

//   ctx.clearRect(0, 0, 400, 400);
//   drawKnot(ctx, springKnot);
// }, 100);

const nextArcFn = nextArc;

const knot2 = Knot.fromPlanarPolyKnot(springKnot);
knot2.uncross(knot2.crossings[0], "negative");
knot2.reorient();
knot2.uncross(knot2.crossings[0], "positive");
knot2.reorient();
// knot2.uncross(knot2.crossings[0], "positive");
// knot2.reorient();

const canvas2 = document.getElementById("test-canvas2") as HTMLCanvasElement;
const ctx2 = canvas2.getContext("2d");

ctx.strokeStyle = "#000";
ctx.lineWidth = 5;
ctx.lineCap = "round";
drawKnot(ctx2, knot2);
