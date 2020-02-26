import { Vector2, lerp } from "../../utils/lin";

export function quadraticSegment(
  ctx: CanvasRenderingContext2D,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2
): void {
  ctx.moveTo(...p1);
  ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
}

export function quadraticBSplineSegment(
  ctx: CanvasRenderingContext2D,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  p5: Vector2
): void {
  const q1 = lerp(p1, p2, 0.5);
  const q2 = lerp(p2, p3, 0.5);
  const q3 = lerp(p3, p4, 0.5);
  const q4 = lerp(p4, p5, 0.5);

  const r1 = lerp(q1, q2, 0.5);
  const r2 = lerp(q2, q3, 0.5);
  const r3 = lerp(q3, q4, 0.5);

  const s1 = lerp(r1, r2, 0.5);
  const s2 = lerp(r2, r3, 0.5);

  quadraticSegment(ctx, s1, r2, s2);
}

export function quadraticBSpline(
  ctx: CanvasRenderingContext2D,
  path: Vector2[]
): void {
  const augPath = [
    path[0],
    path[0],
    path[0],
    ...path,
    path[path.length - 1],
    path[path.length - 1],
    path[path.length - 1]
  ];

  for (let i = 0; i + 4 < augPath.length; i++) {
    quadraticBSplineSegment(
      ctx,
      augPath[i],
      augPath[i + 1],
      augPath[i + 2],
      augPath[i + 3],
      augPath[i + 4]
    );
  }
}

export function polyline(ctx: CanvasRenderingContext2D, path: Vector2[]): void {
  ctx.moveTo(...path[0]);
  path.slice(1).forEach(v => ctx.lineTo(...v));
}
