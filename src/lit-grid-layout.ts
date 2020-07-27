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

import type { LayoutItemElement, Layout, LayoutItem } from "./types";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { condenseLayout } from "./util/condense-layout";
import { moveItem } from "./util/move-item";

import "./lit-grid-item";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: Layout = [];

  @property({ type: Array }) public elements: LayoutItemElement[] = [];

  @property({ type: Number }) public rowHeight = 30;

  @property({ type: Number }) public columns = 12;

  @property({ type: Array }) public margin: [number, number] = [10, 10];

  @property({ attribute: false }) public resizeHandle?: HTMLElement;

  @internalProperty() private _currentLayout: Layout = [];

  @internalProperty() private _placeholder?: LayoutItem;

  // Get items supplied by property and from any children
  get childrenElements(): LayoutItemElement[] {
    return this.elements.concat(
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
    // TODO: Only run SetupLayout if they value of the public layout changes or if the amount of elements changes.
    // TODO: Update the public layout anytime the _currentLayout changes but block the setupLayout if Layout === currentLayout

    if (
      (changedProps.has("resizeHandle") && !this.resizeHandle) ||
      !this.resizeHandle
    ) {
      const handle = document.createElement("div");
      handle.classList.add("default-handle");
      this.resizeHandle = handle;
    }

    if (changedProps.has("layout")) {
      this.setupLayout();
    }

    this.style.height = `${this.layoutHeight}px`;
  }

  protected render(): TemplateResult {
    if (!this._currentLayout?.length || !this.resizeHandle) {
      return html``;
    }

    return html`
      ${this.childrenElements.map((element, idx) => {
        const item = this._currentLayout[idx];
        const handle = this.resizeHandle!.cloneNode(true) as HTMLElement;

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
            .resizeHandle=${handle}
            @resizeStart=${this._itemResizeStart}
            @resize=${this._itemResize}
            @resizeEnd=${this._itemResizeEnd}
            @dragStart=${this._itemDragStart}
            @dragging=${this._itemDrag}
            @dragEnd=${this._itemDragEnd}
          >
            ${element}
          </lit-grid-item>
        `;
      })}
      ${this._renderPlaceHolder()}
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

  private _itemResizeStart(ev: any): void {
    this._placeholder = this._currentLayout.find(
      (item) => item.key === ev.currentTarget.key
    );
  }

  private _itemResize(ev: any): void {
    const { newWidth, newHeight } = ev.detail;

    const itemKey = ev.currentTarget.key;

    const itemIndex = this._currentLayout.findIndex(
      (item) => item.key === itemKey
    );

    const itemLayout = this._currentLayout[itemIndex];

    const newItemLayout = {
      ...itemLayout,
      width: newWidth,
      height: newHeight,
    };

    this._currentLayout[itemIndex] = newItemLayout;
    this._placeholder = newItemLayout;

    this._currentLayout = condenseLayout(this._currentLayout);
  }

  private _itemResizeEnd(): void {
    this._placeholder = undefined;
  }

  private _itemDragStart(ev: any): void {
    this._placeholder = this._currentLayout.find(
      (item) => item.key === ev.currentTarget.key
    );
  }

  // TODO: Create custom Event Types
  private _itemDrag(ev: any): void {
    ev.stopPropagation();
    ev.preventDefault();
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

    this._placeholder = this._currentLayout.find(
      (item) => item.key === itemKey
    );
  }

  private _itemDragEnd(): void {
    this._placeholder = undefined;
  }

  private _renderPlaceHolder(): TemplateResult {
    if (!this._placeholder) {
      return html``;
    }

    return html`
      <lit-grid-item
        .width=${this._placeholder.width}
        .height=${this._placeholder.height}
        .posY=${this._placeholder.posY}
        .posX=${this._placeholder.posX}
        .key=${this._placeholder.key}
        .parentWidth=${this.clientWidth}
        .columns=${this.columns}
        .rowHeight=${this.rowHeight}
        .margin=${this.margin}
        .isDraggable=${false}
        .isResizable=${false}
        class="placeholder"
      >
      </lit-grid-item>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }

      .placeholder {
        background-color: var(--placeholder-background-color, red);
        opacity: var(--placeholder-background-opacity, 0.2);
        z-index: 1;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-layout": LitGridLayout;
  }
}
