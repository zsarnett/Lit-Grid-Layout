import type { Layout } from "../types";

export function sortLayout(layout: Layout): Layout {
  return layout.slice(0).sort(function (a, b) {
    if (a.posY > b.posY || (a.posY === b.posY && a.posX > b.posX)) {
      return 1;
    } else if (a.posY === b.posY && a.posX === b.posX) {
      return 0;
    }
    return -1;
  });
}
