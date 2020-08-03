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
import { fireEvent } from "./util/fire-event";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout?: Layout;

  @property({ type: Array }) public items: LayoutItemElement[] = [];

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

  @property({ attribute: false }) public dragHandle?: string;

  @property({ type: Boolean, attribute: true, reflect: true })
  public resizing?: boolean = false;

  @property({ type: Boolean, attribute: true, reflect: true })
  public dragging?: boolean = false;

  @internalProperty() private _width = 0;

  @internalProperty() private _layout: Layout = [];

  @internalProperty() private _placeholder?: LayoutItem;

  private _oldItemLayout?: LayoutItem;

  private _oldItemIndex?: number;

  private _resizeObserver?: ResizeObserver;

  get _childrenElements(): LayoutItemElement[] {
    return this.items.concat(
      ...Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("grid-item")
      )
    );
  }

  get _layoutHeight(): number {
    const btm = findLayoutBottom(this._layout);
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

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("layout")) {
      this.setupLayout();
    }

    this.style.height = `${this._layoutHeight}px`;
  }

  protected render(): TemplateResult {
    if (!this._layout?.length) {
      return html``;
    }

    return html`
      ${this._childrenElements.map((element) => {
        const item = this._layout.find((i) => i.key === element.key);
        if (!item) {
          return html``;
        }

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
            .dragHandle=${this.dragHandle}
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
    for (const element of this._childrenElements) {
      let layoutItem = this.layout!.find((item) => item.key === element.key);

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
    this._layout = condenseLayout(newLayout);
  }

  private _itemResizeStart(ev: LGLItemDomEvent<Event>): void {
    this._oldItemIndex = this._layout.findIndex(
      (item) => item.key === ev.currentTarget.key
    );
    this._placeholder = this._layout[this._oldItemIndex];
    this._oldItemLayout = this._layout[this._oldItemIndex];
  }

  private _itemResize(ev: LGLItemDomEvent<ItemResizedEvent>): void {
    if (!this._oldItemLayout || this._oldItemIndex === undefined) {
      return;
    }

    const { newWidth, newHeight } = ev.detail;

    const newItemLayout = {
      ...this._oldItemLayout,
      width: newWidth,
      height: newHeight,
    };

    this._layout[this._oldItemIndex] = newItemLayout;
    this._placeholder = newItemLayout;

    this._layout = condenseLayout(this._layout);
  }

  private _itemResizeEnd(): void {
    this._placeholder = undefined;
    this._oldItemLayout = undefined;
    this._oldItemIndex = undefined;

    fireEvent(this, "layout-changed", { layout: this._layout });
  }

  private _itemDragStart(ev: LGLItemDomEvent<Event>): void {
    const itemIndex = this._layout.findIndex(
      (item) => item.key === ev.currentTarget.key
    );
    this._placeholder = this._layout[itemIndex];
    this._oldItemLayout = this._layout[itemIndex];
  }

  private _itemDrag(ev: LGLItemDomEvent<ItemDraggedEvent>): void {
    if (!this._oldItemLayout) {
      return;
    }

    ev.stopPropagation();
    ev.preventDefault();

    const { newPosX, newPosY } = ev.detail;

    const newLayout = moveItem(
      [...this._layout],
      this._oldItemLayout,
      newPosX,
      newPosY,
      this.columns,
      true
    );

    this._layout = condenseLayout(newLayout);

    this._oldItemLayout = this._layout.find(
      (item) => item.key === this._oldItemLayout!.key
    );

    this._placeholder = this._oldItemLayout;
  }

  private _itemDragEnd(): void {
    this._placeholder = undefined;
    this._oldItemLayout = undefined;
    this._oldItemIndex = undefined;

    fireEvent(this, "layout-changed", { layout: this._layout });
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
    if (this.offsetParent) {
      this._width = this.offsetParent.clientWidth;
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
