import type { Layout, LayoutItem } from "../types";
import { moveItem } from "./move-item";
import { getItemItersect } from "./get-item-intersect";

export function moveItemAwayFromIntersect(
  layout: Layout,
  intersectItem: LayoutItem,
  itemToMove: LayoutItem,
  cols: number,
  isUserMove: boolean
): Layout {
  if (isUserMove) {
    isUserMove = false;

    const tempItem: LayoutItem = {
      posX: itemToMove.posX,
      posY: Math.max(itemToMove.height - intersectItem.posY, 0),
      width: itemToMove.width,
      height: itemToMove.height,
      key: "-1",
    };

    if (!getItemItersect(layout, tempItem)) {
      return moveItem(
        layout,
        itemToMove,
        undefined,
        tempItem.posY,
        cols,
        isUserMove
      );
    }
  }

  return moveItem(
    layout,
    itemToMove,
    undefined,
    itemToMove.posY + 1,
    cols,
    isUserMove
  );
}
