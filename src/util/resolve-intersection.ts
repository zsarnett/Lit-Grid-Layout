import type { LayoutItem } from "../types";
import { intersects } from "./intersects";

export const resolveIntersection = (
  layout: LayoutItem[],
  item: LayoutItem,
  newYPos: number
): void => {
  item.posY += 1;
  const itemIndex = layout
    .map((layoutItem: LayoutItem) => {
      return layoutItem.key;
    })
    .indexOf(item.key);

  for (let i = itemIndex + 1; i < layout.length; i++) {
    const otherItem = layout[i];

    if (otherItem.posY > item.posY + item.height) {
      break;
    }

    if (intersects(item, otherItem)) {
      resolveIntersection(layout, otherItem, newYPos + item.height);
    }
  }

  item.posY = newYPos;
};
