import type { LayoutItem } from "../types";
import { intersects } from "./intersects";

export const getItemItersect = (
  layout: LayoutItem[],
  layoutItem: LayoutItem
): LayoutItem | undefined => {
  for (const item of layout) {
    if (intersects(item, layoutItem)) {
      return item;
    }
  }
  return undefined;
};
