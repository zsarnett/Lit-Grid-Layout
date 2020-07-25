export interface LayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
}

export interface LayoutItemElement extends HTMLElement {
  key: string;
  grid: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
}
