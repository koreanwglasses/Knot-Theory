import { Knot } from "../../core/defaults/planar-poly-knot";
import { shiftToward, dist } from "../../utils/lin";
import { quadraticBSpline } from "./utils";

export function drawKnot(
  ctx: CanvasRenderingContext2D,
  knot: Knot,
  opts?: { gap?: number }
): void {
  const { gap } = { gap: 20, ...(opts || {}) };

  knot.arcs.forEach(arc => {
    const fullPath = [
      arc.begin.crossing.location,
      ...arc.path.filter(
        // filter out points in path that are too close to the endpoints
        v =>
          (arc.begin.strand == "upper" ||
            dist(v, arc.begin.crossing.location) >= gap) &&
          (arc.end.strand == "upper" ||
            dist(v, arc.end.crossing.location) >= gap)
      ),
      arc.end.crossing.location
    ];

    const startPoint =
      arc.begin.strand == "lower"
        ? shiftToward(fullPath[0], fullPath[1], gap)
        : fullPath[0];
    const endPoint =
      arc.end.strand == "lower"
        ? shiftToward(
            fullPath[fullPath.length - 1],
            fullPath[fullPath.length - 2],
            gap
          )
        : fullPath[fullPath.length - 1];

    ctx.beginPath();
    ctx.moveTo(...startPoint);
    fullPath.slice(1, -1).forEach(v => ctx.lineTo(...v));
    ctx.lineTo(...endPoint);
    ctx.stroke();
  });
}
