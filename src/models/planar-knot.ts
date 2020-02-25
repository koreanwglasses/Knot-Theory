import * as PlanarKnotGeneric from "./generics/planar-knot";

/**
 * A crossing with references to anchors
 */
export class Crossing {
  /**
   * Anchor to the upper strand at this crossing
   */
  readonly lower: PlanarKnotGeneric.Anchor<this>;

  /**
   * Anchor to the lower strand at this crossing
   */
  readonly upper: PlanarKnotGeneric.Anchor<this>;

  constructor() {
    const lower: PlanarKnotGeneric.Anchor<this> = {
      strand: "lower",
      crossing: this
    };
    const upper: PlanarKnotGeneric.Anchor<this> = {
      strand: "upper",
      crossing: this
    };
    this.lower = lower;
    this.upper = upper;
  }
}
