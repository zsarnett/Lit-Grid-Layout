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

import type {
  LayoutItemElement,
  Layout,
  LayoutItem,
  ItemDraggedEvent,
  LGLItemDomEvent,
  ItemResizedEvent,
} from "./types";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { condenseLayout } from "./util/condense-layout";
import { moveItem } from "./util/move-item";

import "./lit-grid-item";
import { installResizeObserver } from "./util/install-resize-observer";
import { debounce } from "./util/debounce";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: Layout = [];

  @property({ type: Array }) public elements: LayoutItemElement[] = [];

  @property({ type: Array }) public margin: [number, number] = [10, 10];

  @property({ type: Array }) public containerPadding: [number, number] = [
    20,
    20,
  ];

  @property({ type: Number }) public rowHeight = 30;

  @property({ type: Number }) public columns = 12;

  @property({ type: Boolean }) public dragDisabled = false;

  @property({ type: Boolean }) public resizeDisabled = false;

  @property({ attribute: false }) public resizeHandle?: HTMLElement;

  @property({ type: Boolean, attribute: true, reflect: true })
  public resizing?: boolean = false;

  @property({ type: Boolean, attribute: true, reflect: true })
  public dragging?: boolean = false;

  @internalProperty() private _width = 0;

  @internalProperty() private _currentLayout: Layout = [];

  @internalProperty() private _placeholder?: LayoutItem;

  private _resizeObserver?: ResizeObserver;

  // Get items supplied by property and from any children
  get childrenElements(): LayoutItemElement[] {
    return this.elements.concat(
      ...Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("lit-grid-item")
      )
    );
  }

  get layoutHeight(): number {
    const btm = findLayoutBottom(this._currentLayout);
    return (
      btm * this.rowHeight +
      (btm - 1) * this.margin[1] +
      this.containerPadding[1] * 2
    );
  }

  public disconnectedCallback(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.updateComplete.then(() => this._attachObserver());
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (
      changedProps.has("layout") &&
      this.layout.length !== 0 &&
      JSON.stringify(this.layout) === JSON.stringify(this._currentLayout)
    ) {
      return false;
    }

    return true;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("layout") || !this._currentLayout) {
      this.setupLayout();
    }

    this.style.height = `${this.layoutHeight}px`;
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
            .minWidth=${item.minWidth || 1}
            .minHeight=${item.minHeight || 1}
            .maxWidth=${item.maxHeight}
            .maxHeight=${item.maxHeight}
            .key=${item.key}
            .parentWidth=${this._width!}
            .columns=${this.columns}
            .rowHeight=${this.rowHeight}
            .margin=${this.margin}
            .containerPadding=${this.containerPadding}
            .isDraggable=${!this.dragDisabled}
            .isResizable=${!this.resizeDisabled}
            .resizeHandle=${this.resizeHandle}
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

  private _itemResizeStart(ev: LGLItemDomEvent<Event>): void {
    this._placeholder = this._currentLayout.find(
      (item) => item.key === ev.currentTarget.key
    );
  }

  private _itemResize(ev: LGLItemDomEvent<ItemResizedEvent>): void {
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

  private _itemDragStart(ev: LGLItemDomEvent<Event>): void {
    this._placeholder = this._currentLayout.find(
      (item) => item.key === ev.currentTarget.key
    );
  }

  private _itemDrag(ev: LGLItemDomEvent<ItemDraggedEvent>): void {
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
        .containerPadding=${this.containerPadding}
        .isDraggable=${false}
        .isResizable=${false}
        class="placeholder"
      >
      </lit-grid-item>
    `;
  }

  private async _attachObserver(): Promise<void> {
    if (!this._resizeObserver) {
      await installResizeObserver();
      this._resizeObserver = new ResizeObserver(
        debounce(() => this._measure(), 250, false)
      );
    }
    this._resizeObserver.observe(this);
  }

  private _measure(): void {
    // eslint-disable-next-line no-console
    console.log("Offset Parent: ", this.offsetParent);
    // eslint-disable-next-line no-console
    console.log("Parent Element: ", this.parentElement);

    if (this.offsetParent) {
      // eslint-disable-next-line no-console
      console.log(
        "Offset Parent Client Width: ",
        this.offsetParent.clientWidth
      );
      // eslint-disable-next-line no-console
      console.log(
        "Offset Parent Scroll Width: ",
        this.offsetParent.scrollWidth
      );
      this._width = this.offsetParent.clientWidth;
    }

    if (this.parentElement) {
      // eslint-disable-next-line no-console
      console.log(
        "Parent Element Client Width: ",
        this.parentElement.clientWidth
      );
      // eslint-disable-next-line no-console
      console.log(
        "Parent Element Scroll Width: ",
        this.parentElement.scrollWidth
      );
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }

      :host([dragging]),
      :host([resizing]),
      :host([dragging]) lit-grid-item,
      :host([resizing]) lit-grid-item {
        user-select: none;
        touch-action: none;
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
