import type { Layout, LayoutItem } from "../types";
import { sortLayout } from "./sort-layout";

export const getMasonryLayout = (layout: Layout, columns: number): Layout => {
  const masonryLayout: Layout = [];
  const sortedLayout: Layout = sortLayout(layout);
  const columnHeights: number[] = new Array(columns).fill(0);

  for (const item of sortedLayout) {
    const itemPostion = getMinItemColumn(item, columnHeights, columns);

    const newItem = { ...item, ...itemPostion };

    masonryLayout.push(newItem);

    // Update Columns Heights from new item position
    for (let i = itemPostion.posX; i < itemPostion.posX + item.width; i++) {
      columnHeights[i] += item.height;
    }
  }

  return masonryLayout;
};

// Finds the shortest column the item can fit into
const getMinItemColumn = (
  item: LayoutItem,
  columnHeights: number[],
  columns: number
): { posX: number; posY: number } => {
  // If the item is just 1 column, just find the shortest column and put it there
  if (item.width === 1) {
    const minPosY = Math.min(...columnHeights);
    return { posX: columnHeights.indexOf(minPosY), posY: minPosY };
  }

  const columnHeightGroup: number[] = [];
  // How many spans of columns can the item go
  const columnSpans = columns + 1 - item.width;

  // For each of the spans, find the max Y
  for (let i = 0; i < columnSpans; i++) {
    const groupColumnHeights = columnHeights.slice(i, i + item.width);
    columnHeightGroup[i] = Math.max(...groupColumnHeights);
  }

  // Find the shortest of the spans
  const minPosY = Math.min(...columnHeightGroup);
  return { posX: columnHeightGroup.indexOf(minPosY), posY: minPosY };
};
