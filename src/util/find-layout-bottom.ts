// Find the y bottom of the LayoutItem array

import type { LayoutItem } from "../types";

// Return the bottom y value
export const findLayoutBottom = (layout: LayoutItem[]): number => {
  let layoutYMax = 0;

  for (const item of layout) {
    const itemBottom = item.y + item.h;
    layoutYMax = itemBottom > layoutYMax ? itemBottom : layoutYMax;
  }

  return layoutYMax;
};
