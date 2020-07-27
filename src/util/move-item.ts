import type { Layout, LayoutItem } from "../types";
import { sortLayout } from "./sort-layout";
import { getAllIntersects } from "./get-all-intersects";
import { moveItemAwayFromIntersect } from "./move-item-away-from-intersect";

export function moveItem(
  layout: Layout,
  item: LayoutItem,
  newPosX: number | undefined,
  newPosY: number | undefined,
  columns: number,
  isUserMove: boolean
): Layout {
  if (item.posY === newPosY && item.posX === newPosX) {
    return layout;
  }

  const oldPosY = item.posY;

  if (newPosX !== undefined) {
    item.posX = newPosX;
  }

  if (newPosY !== undefined) {
    item.posY = newPosY;
  }

  item.hasMoved = true;

  let sorted = sortLayout(layout);
  const movingUp = newPosY !== undefined && oldPosY >= newPosY;

  if (movingUp) {
    sorted = sorted.reverse();
  }
  const allIntersects = getAllIntersects(sorted, item);

  const itemIndex = layout.findIndex((i) => i.key === item.key);
  layout[itemIndex] = item;

  // Move each item that intersects away from this element.
  for (let i = 0, len = allIntersects.length; i < len; i++) {
    const intersectItem = allIntersects[i];

    if (intersectItem.hasMoved) {
      continue;
    }

    layout = moveItemAwayFromIntersect(
      [...layout],
      item,
      intersectItem,
      columns,
      isUserMove
    );
  }

  return layout;
}
