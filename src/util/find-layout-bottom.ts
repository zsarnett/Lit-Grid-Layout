import type { LayoutItem } from "../types";

// Return the bottom y value
export const findLayoutBottom = (layout: LayoutItem[]): number => {
  let layoutYMax = 0;

  for (const item of layout) {
    const itemBottom = item.posY + item.height;
    layoutYMax = itemBottom > layoutYMax ? itemBottom : layoutYMax;
  }

  return layoutYMax;
};
