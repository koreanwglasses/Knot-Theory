import { Knot } from "../../core/defaults/planar-poly-knot";
import { shiftToward, dist } from "../../utils/lin";
import { quadraticBSpline, polyline } from "./utils";

export function drawKnot(
  ctx: CanvasRenderingContext2D,
  knot: Knot,
  opts?: { gap?: number }
): void {
  const { gap } = { gap: 20, ...(opts || {}) };

  knot.arcs.forEach(arc => {
    const fullPath = [
      ...(arc.begin ? [arc.begin.crossing.location] : []),
      ...arc.path.filter(
        // filter out points in path that are too close to the endpoints
        v =>
          !arc.begin ||
          !arc.end ||
          ((arc.begin.strand == "upper" ||
            dist(v, arc.begin.crossing.location) >= gap) &&
            (arc.end.strand == "upper" ||
              dist(v, arc.end.crossing.location) >= gap))
      ),
      ...(arc.end ? [arc.end.crossing.location] : [])
    ];

    const startPoint =
      arc.begin && arc.begin.strand == "lower"
        ? shiftToward(fullPath[0], fullPath[1], gap)
        : fullPath[0];
    const endPoint =
      arc.end && arc.end.strand == "lower"
        ? shiftToward(
            fullPath[fullPath.length - 1],
            fullPath[fullPath.length - 2],
            gap
          )
        : fullPath[fullPath.length - 1];

    const gapPath = [startPoint, ...fullPath.slice(1, -1), endPoint];
    ctx.beginPath();
    quadraticBSpline(ctx, gapPath);
    // polyline(ctx, gapPath);
    // ctx.arc(endPoint[0], endPoint[1], 5, 0, 2 * Math.PI);
    ctx.stroke();
  });
}
