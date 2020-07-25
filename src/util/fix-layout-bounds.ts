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
    if (item.posX + item.width > cols) {
      item.posX = cols - item.width;
    }

    // Out of bounds left
    // set x to be against the left side
    if (item.posX < 0) {
      item.posX = 0;
    }
  }

  return layout;
};
