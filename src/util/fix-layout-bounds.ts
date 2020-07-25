// Make sure all layout items are within the bounds of the cols provided

import type { LayoutItem } from "../types";

// Return LayoutItem Array
export const fixLayoutBounds = (
  layout: LayoutItem[],
  cols: number
): LayoutItem[] => {
  for (const item of layout) {
    // Out of bounds right
    // set the x to be against the right side
    if (item.x + item.w > cols) {
      item.x = cols - item.w;
    }

    // Out of bounds left
    // set x to be against the left side
    if (item.x < 0) {
      item.x = 0;
    }
  }

  return layout;
};
