import type { LayoutItem } from "../types";

export const intersects = (item1: LayoutItem, item2: LayoutItem): boolean => {
  // same element
  if (item1.i === item2.i) {
    return false;
  }

  // item1 is left of item2
  if (item1.x + item1.w <= item2.x) {
    return false;
  }

  // item1 is right of item2
  if (item1.x >= item2.x + item2.w) {
    return false;
  }

  // item1 is above item2
  if (item1.y + item1.h <= item2.y) {
    return false;
  }

  // item1 is below item2
  if (item1.y >= item2.y + item2.h) {
    return false;
  }

  return true;
};
