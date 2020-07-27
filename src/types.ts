export interface LayoutItem {
  width: number;
  height: number;
  posX: number;
  posY: number;
  key: string;
  hasMoved?: boolean;
}

export type Layout = Array<LayoutItem>;

export interface LayoutItemElement extends HTMLElement {
  key: string;
  grid: {
    width: number;
    height: number;
    posX: number;
    posY: number;
  };
}
