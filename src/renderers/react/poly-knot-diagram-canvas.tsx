import * as React from "react";
import * as PlanarPolyKnot from "../../models/generics/planar-poly-knot";
import { drawKnot } from "../canvas/poly-knot-diagram";

interface Props {
  knot: PlanarPolyKnot.Knot;
  gap?: number;

  width: number;
  height: number;
}

export class PolyKnotDiagramCanvas extends React.Component<Props> {
  static defaultProps = {
    gap: 20
  };

  private canvas = React.createRef<HTMLCanvasElement>();

  componentDidMount(): void {
    const { knot, gap } = this.props;
    const ctx = this.canvas.current.getContext("2d");

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    drawKnot(ctx, knot, { gap });
  }

  render(): JSX.Element {
    const { width, height } = this.props;
    return <canvas ref={this.canvas} width={width} height={height} />;
  }
}
