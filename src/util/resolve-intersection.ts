import type { LayoutItem } from "../types";
import { intersects } from "./intersects";

export const resolveIntersection = (
  layout: LayoutItem[],
  item: LayoutItem,
  newYPos: number
): void => {
  item.y += 1;
  const itemIndex = layout
    .map((layoutItem: LayoutItem) => {
      return layoutItem.i;
    })
    .indexOf(item.i);

  for (let i = itemIndex + 1; i < layout.length; i++) {
    const otherItem = layout[i];

    if (otherItem.y > item.y + item.h) {
      break;
    }

    if (intersects(item, otherItem)) {
      resolveIntersection(layout, otherItem, newYPos + item.h);
    }
  }

  item.y = newYPos;
};
