import type { LayoutItem } from "../types";

export const intersects = (item1: LayoutItem, item2: LayoutItem): boolean => {
  // same element
  if (item1.key === item2.key) {
    return false;
  }

  // item1 is left of item2
  if (item1.posX + item1.width <= item2.posX) {
    return false;
  }

  // item1 is right of item2
  if (item1.posX >= item2.posX + item2.width) {
    return false;
  }

  // item1 is above item2
  if (item1.posY + item1.height <= item2.posY) {
    return false;
  }

  // item1 is below item2
  if (item1.posY >= item2.posY + item2.height) {
    return false;
  }

  return true;
};
