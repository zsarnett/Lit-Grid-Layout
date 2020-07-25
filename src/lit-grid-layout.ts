import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

import "./lit-grid-item";

interface LayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
}

interface LayoutItemElement extends HTMLElement {
  key: string;
  grid: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
}

// Find the y bottom of the LayoutItem array
// Return the bottom y value
const findLayoutBottom = (layout: LayoutItem[]): number => {
  let layoutYMax = 0;

  for (const item of layout) {
    const itemBottom = item.y + item.h;
    layoutYMax = itemBottom > layoutYMax ? itemBottom : layoutYMax;
  }

  return layoutYMax;
};

// Make sure all layout items are within the bounds of the cols provided
// Return LayoutItem Array
const fixLayoutBounds = (layout: LayoutItem[], cols: number): LayoutItem[] => {
  for (const item of layout) {
    // Out of bounds right
    // set the x to be against the right side
    if (item.x + item.w > cols) {
      item.x = cols - item.w;
    }

    // Out of bounds left
    // set x to be against the left side
    if (item.x < 0) {
      item.x = 0;
    }
  }

  return layout;
};

// Fill in any gaps in the LayoutItem array
// Return LayoutItem Array
const condenseLayout = (layout: LayoutItem[]): LayoutItem[] => {
  const condensedLayout: LayoutItem[] = [];
  for (const item of layout) {
    // Move up while no intersecting another element
    while (item.y > 0 && !getItemItersect(condensedLayout, item)) {
      item.y--;
    }

    let collides: LayoutItem | undefined;
    while ((collides = getItemItersect(condensedLayout, item))) {
      resolveCompactionCollision(layout, item, collides.y + collides.h);
    }

    condensedLayout.push(item);
  }
  return condensedLayout;
};

const getItemItersect = (
  layout: LayoutItem[],
  layoutItem: LayoutItem
): LayoutItem | undefined => {
  for (const item of layout) {
    if (intersects(item, layoutItem)) {
      return item;
    }
  }
  return undefined;
};

const intersects = (item1: LayoutItem, item2: LayoutItem): boolean => {
  // same element
  if (item1.i === item2.i) {
    return false;
  }

  // item1 is left of item2
  if (item1.x + item1.w <= item2.x) {
    return false;
  }

  // item1 is right of item2
  if (item1.x >= item2.x + item2.w) {
    return false;
  }

  // item1 is above item2
  if (item1.y + item1.h <= item2.y) {
    return false;
  }

  // item1 is below item2
  if (item1.y >= item2.y + item2.h) {
    return false;
  }

  return true;
};

const resolveCompactionCollision = (
  layout: LayoutItem[],
  item: LayoutItem,
  moveToCoord: number
) => {
  item.y += 1;
  const itemIndex = layout
    .map((layoutItem: LayoutItem) => {
      return layoutItem.i;
    })
    .indexOf(item.i);

  // Go through each item we collide with.
  for (let i = itemIndex + 1; i < layout.length; i++) {
    const otherItem = layout[i];

    // Optimization: we can break early if we know we're past this el
    // We can do this b/c it's a sorted layout
    if (otherItem.y > item.y + item.h) break;

    if (intersects(item, otherItem)) {
      resolveCompactionCollision(layout, otherItem, moveToCoord + item.h);
    }
  }

  item.y = moveToCoord;
};

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: LayoutItem[] = [];

  @property({ type: Array }) public elements?: LayoutItemElement[];

  public rowHeight = 30;

  public cols = 6;

  get childrenElements(): LayoutItemElement[] {
    return (
      this.elements ||
      Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("lit-grid-item")
      )
    );
  }

  private setupLayout(): void {
    let layout: LayoutItem[] = [];

    // Create new Layout
    // Iterate over all children and find item in prev layout or create new item
    for (const element of this.childrenElements) {
      let layoutItem = this.layout.find(
        (item) => item.i === element.key.toString()
      );

      if (!layoutItem) {
        const itemProps = element.grid || {
          w: 1,
          h: 1,
          x: 0,
          y: findLayoutBottom(layout),
        };

        layoutItem = { ...itemProps, i: element.key };
      }

      layout.push(layoutItem);
    }

    layout = fixLayoutBounds(layout, this.cols);
    this.layout = condenseLayout(layout);
  }

  protected firstUpdated(): void {
    this.setupLayout();
    this.style.height = `${findLayoutBottom(this.layout) * this.rowHeight}px`;
  }

  protected render(): TemplateResult {
    if (!this.layout?.length) {
      return html``;
    }
    this.style.width;
    return html`
      ${this.childrenElements.map(
        (element, idx) =>
          html`
            <lit-grid-item
              .width=${this.layout[idx].w}
              .height=${this.layout[idx].h}
              .posY=${this.layout[idx].y}
              .posX=${this.layout[idx].x}
              .key=${this.layout[idx].i}
              .containerW=${parseInt(this.style.width, 10)}
              .cols=${this.cols}
              .rowH=${this.rowHeight}
            >
              ${element}
            </lit-grid-item>
          `
      )}
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-layout": LitGridLayout;
  }
}
