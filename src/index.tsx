import * as React from "react";
import * as ReactDOM from "react-dom";
import { PolyKnotDiagramCanvas } from "./renderers/react/poly-knot-diagram-canvas";
import { trefoil } from "./core/planar-poly-knot";
import { transform } from "./core/planar-poly-knot";
import { PlanarSpringKnot } from "./layout/planar-spring-knot";
import { drawKnot } from "./renderers/canvas/poly-knot-diagram";
import { dot, translate, scale, Vector2 } from "./utils/lin";
import { quadraticBSpline } from "./renderers/canvas/utils";
import { arcsAtCrossing } from "./core/planar-knot";
import { Arc, Knot } from "./core/defaults/planar-poly-knot";

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
// drawKnot(ctx, springKnot);

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

const knot2 = springKnot as Knot;
// const knot2 = trefoil();
// transform(knot2, m);

// const crossing = knot2.crossings[0];

// const [upperOut, upperIn, lowerOut, lowerIn] = arcsAtCrossing(knot2, crossing);

// const arc1: Arc = {
//   begin: lowerIn.begin,
//   end: upperOut.end,
//   path: [...lowerIn.path, crossing.location, ...upperOut.path]
// };

// const arc2: Arc = {
//   begin: upperIn.begin,
//   end: lowerOut.end,
//   path: [...upperIn.path, crossing.location, ...lowerOut.path]
// };

// knot2.arcs.splice(knot2.arcs.indexOf(upperOut), 1);
// knot2.arcs.splice(knot2.arcs.indexOf(upperIn), 1);
// knot2.arcs.splice(knot2.arcs.indexOf(lowerOut), 1);
// knot2.arcs.splice(knot2.arcs.indexOf(lowerIn), 1);

// knot2.arcs.push(arc1, arc2);

// knot2.crossings.splice(knot2.crossings.indexOf(crossing), 1);

drawKnot(ctx, knot2);
