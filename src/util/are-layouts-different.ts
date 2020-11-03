import type { Layout } from "../types";

export const areLayoutsDifferent = (a: Layout, b: Layout): boolean => {
  if (a === b) {
    return false;
  }
  return (
    a.length !== b.length ||
    a.some((aItem, itemIndex) => {
      const bItem = b[itemIndex];
      const aItemKeys = Object.keys(aItem);
      return (
        aItemKeys.length !== Object.keys(bItem).length ||
        aItemKeys.some((key) => aItem[key] !== bItem[key])
      );
    })
  );
};
