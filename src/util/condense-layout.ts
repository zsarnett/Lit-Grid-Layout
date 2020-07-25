// Fill in any gaps in the LayoutItem array

import type { LayoutItem } from "../types";
import { getItemItersect } from "./get-item-intersect";
import { resolveIntersection } from "./resolve-intersection";

// Return LayoutItem Array
export const condenseLayout = (layout: LayoutItem[]): LayoutItem[] => {
  const condensedLayout: LayoutItem[] = [];
  for (const item of layout) {
    // Move up while no intersecting another element
    while (item.y > 0 && !getItemItersect(condensedLayout, item)) {
      item.y--;
    }

    // Move down Item down, if it intersects with another item, move it down as well
    let intersectItem: LayoutItem | undefined;
    while ((intersectItem = getItemItersect(condensedLayout, item))) {
      resolveIntersection(layout, item, intersectItem.y + intersectItem.h);
    }

    condensedLayout.push(item);
  }

  return condensedLayout;
};
