import type { LayoutItem } from "../types";

// Make sure all layout items are within the bounds of the cols provided
export const fixLayoutBounds = (
  layout: LayoutItem[],
  cols: number
): LayoutItem[] => {
  for (const item of layout) {
    // Width is greater than amount of columns
    // set the width to be number of columns
    if (item.width > cols) {
      item.width = cols;
    }

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
