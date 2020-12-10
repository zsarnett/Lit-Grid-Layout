import {
  css,
  CSSResult,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from "lit-element";
import { nothing } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import "./lit-grid-item";
import type {
  ItemDraggedEvent,
  ItemRenderer,
  ItemResizedEvent,
  Layout,
  LayoutItem,
  LGLItemDomEvent,
} from "./types";
import { areLayoutsDifferent } from "./util/are-layouts-different";
import { condenseLayout } from "./util/condense-layout";
import { debounce } from "./util/debounce";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fireEvent } from "./util/fire-event";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { getMasonryLayout } from "./util/get-masonry-layout";
import { installResizeObserver } from "./util/install-resize-observer";
import { moveItem } from "./util/move-item";

// TODO: Instead of resize handle being a different draggable element. Why not just add a second handle like the Drag and use that

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout?: Layout;

  @property() public sortStyle: "default" | "masonry" = "masonry";

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

  @property() public itemRenderer?: ItemRenderer;

  @internalProperty() private _width = 0;

  @internalProperty() private _layout: Layout = [];

  @internalProperty() private _placeholder?: LayoutItem;

  private _oldItemLayout?: LayoutItem;

  private _oldItemIndex?: number;

  private _resizeObserver?: ResizeObserver;

  private _prevPosX?: number;

  private _prevPosY?: number;

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
      this._setupLayout();
    } else if (changedProps.has("columns")) {
      this._updateLayout(this._layout);
    }

    this.style.height = `${this._layoutHeight}px`;
  }

  protected render(): TemplateResult {
    if (!this._layout?.length || !this.itemRenderer) {
      return html``;
    }

    return html`
      ${repeat(
        this._layout,
        (item: LayoutItem) => item.key,
        (item) => {
          if (
            !item ||
            !this._layout.some((layoutItem) => layoutItem.key === item.key)
          ) {
            return nothing;
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
              ${this.itemRenderer!(item.key)}
            </lit-grid-item>
          `;
        }
      )}
      ${this._renderPlaceHolder()}
    `;
  }

  private _setupLayout(): void {
    if (!this.layout) {
      throw new Error("Missing layout");
    }

    // Dirty check to avoid endless cycles
    if (areLayoutsDifferent(this.layout, this._layout)) {
      // This is not working
      this._updateLayout(this.layout, true);

      fireEvent(this, "layout-changed", { layout: this._layout });
    }
  }

  private _updateLayout(
    layout: Layout,
    fix = false,
    style = this.sortStyle
  ): void {
    if (style === "masonry") {
      this._layout = getMasonryLayout(layout, this.columns);
    } else {
      const newLayout = fix ? fixLayoutBounds(layout, this.columns) : layout;
      this._layout = condenseLayout(newLayout);
    }
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

    this._updateLayout(this._layout, false, "default");
  }

  private _itemResizeEnd(): void {
    const newItemLayout = this._layout.find(
      (item) => item.key === this._oldItemLayout?.key
    );

    if (!this.layout || this._oldItemLayout === newItemLayout) {
      return;
    }

    fireEvent(this, "item-changed", {
      item: this._placeholder,
      layout: this._layout,
    });

    this._placeholder = undefined;
    this._oldItemLayout = undefined;
    this._oldItemIndex = undefined;
  }

  private _itemDragStart(ev: LGLItemDomEvent<Event>): void {
    const itemIndex = this._layout.findIndex(
      (item) => item.key === ev.currentTarget.key
    );
    this._placeholder = this._layout[itemIndex];
    this._oldItemLayout = this._layout.find(
      (item) => item.key === ev.currentTarget.key
    );
  }

  private _itemDrag(ev: LGLItemDomEvent<ItemDraggedEvent>): void {
    if (!this._oldItemLayout) {
      return;
    }

    ev.stopPropagation();
    ev.preventDefault();

    const { newPosX, newPosY } = ev.detail;

    if (this._prevPosX === newPosX && this._prevPosY === newPosY) {
      return;
    }

    this._prevPosX = newPosX;
    this._prevPosY = newPosY;

    const newLayout = moveItem(
      [...this._layout],
      { ...this._oldItemLayout },
      newPosX,
      newPosY,
      this.columns,
      true
    );

    this._updateLayout(newLayout, false, "default");
    this._placeholder = this._layout.find(
      (item) => item.key === this._oldItemLayout!.key
    );
  }

  private _itemDragEnd(): void {
    const newItemLayout = this._layout.find(
      (item) => item.key === this._oldItemLayout!.key
    );

    if (!this.layout || this._oldItemLayout === newItemLayout) {
      return;
    }

    fireEvent(this, "item-changed", {
      item: this._placeholder,
      layout: this._layout,
    });

    this._placeholder = undefined;
    this._oldItemLayout = undefined;
    this._oldItemIndex = undefined;
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
        placeholder
      >
      </lit-grid-item>
    `;
  }

  private async _attachObserver(): Promise<void> {
    if (!this._resizeObserver) {
      await installResizeObserver();
      this._resizeObserver = new ResizeObserver(
        debounce(() => this._measureLayoutWidth(), 250, false)
      );
    }
    this._resizeObserver.observe(this);
  }

  private _measureLayoutWidth(): void {
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-layout": LitGridLayout;
  }
}
