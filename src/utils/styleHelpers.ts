import { Alignment } from "src/interfaces/common.interfaces";

export const alignmentToTextAlign = (
  alignment?: Alignment,
): "left" | "center" | "right" | undefined => {
  if (!alignment) {
    return undefined;
  }

  switch (alignment) {
    case Alignment.Left:
      return "left";
    case Alignment.Center:
      return "center";
    case Alignment.Right:
      return "right";
    default:
      return undefined;
  }
};
