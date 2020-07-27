// Fill in any gaps in the LayoutItem array

import type { LayoutItem, Layout } from "../types";
import { getItemItersect } from "./get-item-intersect";
import { resolveIntersection } from "./resolve-intersection";
import { sortLayout } from "./sort-layout";

// Return LayoutItem Array
export const condenseLayout = (layout: Layout): Layout => {
  const condensedLayout: Layout = [];
  const returnLayout: Layout = [];
  const sortedLayout: Layout = sortLayout(layout);
  for (const item of sortedLayout) {
    // Move up while no intersecting another element
    while (item.posY > 0 && !getItemItersect(condensedLayout, item)) {
      item.posY--;
    }

    // Move down Item down, if it intersects with another item, move it down as well
    let intersectItem: LayoutItem | undefined;
    while ((intersectItem = getItemItersect(condensedLayout, item))) {
      resolveIntersection(
        sortedLayout,
        item,
        intersectItem.posY + intersectItem.height
      );
    }

    item.hasMoved = false;

    condensedLayout.push(item);

    returnLayout[layout.indexOf(item)] = item;
  }

  return returnLayout;
};
