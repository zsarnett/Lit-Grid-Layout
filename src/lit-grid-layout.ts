import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
  internalProperty,
  PropertyValues,
} from "lit-element";

import type { LayoutItemElement, Layout } from "./types";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { condenseLayout } from "./util/condense-layout";
import { moveItem } from "./util/move-item";

import "./lit-grid-item";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: Layout = [];

  @property({ type: Array }) public items: LayoutItemElement[] = [];

  public rowHeight = 30;

  public columns = 12;

  public margin: [number, number] = [10, 10];

  @internalProperty() private _currentLayout: Layout = [];

  // Get items supplied by property and from any children
  get childrenElements(): LayoutItemElement[] {
    return this.items.concat(
      ...Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("lit-grid-item")
      )
    );
  }

  get layoutHeight(): number {
    const btm = findLayoutBottom(this.layout);
    return btm * this.rowHeight + (btm - 1) * this.margin[1];
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("layout")) {
      this.setupLayout();
      this.style.height = `${this.layoutHeight}px`;
    }
  }

  protected render(): TemplateResult {
    if (!this._currentLayout?.length) {
      return html``;
    }

    return html`
      ${this.childrenElements.map((element, idx) => {
        const item = this._currentLayout[idx];
        return html`
          <lit-grid-item
            .width=${item.width}
            .height=${item.height}
            .posY=${item.posY}
            .posX=${item.posX}
            .key=${item.key}
            .parentWidth=${this.clientWidth}
            .columns=${this.columns}
            .rowHeight=${this.rowHeight}
            .margin=${this.margin}
            @resize=${this._itemResize}
            @dragging=${this._itemDrag}
          >
            ${element}
          </lit-grid-item>
        `;
      })}
    `;
  }

  private setupLayout(): void {
    let newLayout: Layout = [];

    // Create new Layout
    // Iterate over all children and find item in prev layout or create new item
    for (const element of this.childrenElements) {
      let layoutItem = this.layout.find((item) => item.key === element.key);

      if (!layoutItem) {
        const itemProps = element.grid || {
          width: 1,
          height: 1,
          posX: 0,
          posY: findLayoutBottom(newLayout),
        };

        layoutItem = { ...itemProps, key: element.key };
      }

      newLayout.push(layoutItem);
    }

    newLayout = fixLayoutBounds(newLayout, this.columns);
    this._currentLayout = condenseLayout(newLayout);
  }

  private _itemResize(ev: any): void {
    const { newWidth, newHeight } = ev.detail;

    const itemKey = ev.currentTarget.key;

    const itemIndex = this._currentLayout.findIndex(
      (item) => item.key === itemKey
    );

    const itemLayout = this._currentLayout[itemIndex];

    this._currentLayout[itemIndex] = {
      ...itemLayout,
      width: newWidth,
      height: newHeight,
    };

    this._currentLayout = condenseLayout(this._currentLayout);
  }

  private _itemDrag(ev: any): void {
    ev.stopPropagation();
    const { newPosX, newPosY } = ev.detail;

    const itemKey = ev.currentTarget.key;
    const itemIndex = this._currentLayout.findIndex(
      (item) => item.key === itemKey
    );

    const itemLayout = this._currentLayout[itemIndex];

    const newLayout = moveItem(
      [...this._currentLayout],
      itemLayout,
      newPosX,
      newPosY,
      this.columns,
      true
    );

    this._currentLayout = condenseLayout(newLayout);
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
