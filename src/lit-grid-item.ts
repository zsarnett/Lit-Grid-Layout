import {
  css,
  CSSResult,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
  PropertyValues,
  query,
  TemplateResult,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import "./lit-draggable";
import "./lit-resizable";
import type { DraggingEvent, LGLDomEvent, ResizingEvent } from "./types";
import { fireEvent } from "./util/fire-event";

@customElement("lit-grid-item")
export class LitGridItem extends LitElement {
  @property({ type: Number }) public width!: number;

  @property({ type: Number }) public height!: number;

  @property({ type: Number }) public posX!: number;

  @property({ type: Number }) public posY!: number;

  @property({ type: Number }) public rowHeight!: number;

  @property({ type: Number }) public columns!: number;

  @property({ type: Number }) public parentWidth!: number;

  @property({ type: Array }) public margin!: [number, number];

  @property({ type: Array }) public containerPadding!: [number, number];

  @property({ type: Number }) public minWidth = 1;

  @property({ type: Number }) public minHeight = 1;

  @property({ type: Number }) public maxWidth?: number;

  @property({ type: Number }) public maxHeight?: number;

  @property({ type: Boolean }) public isDraggable = true;

  @property({ type: Boolean }) public isResizable = true;

  @property({ type: Boolean }) private _isDragging = false;

  @property({ type: Boolean }) private _isResizing = false;

  @property({ type: Boolean }) private _firstLayoutFinished = false;

  @property({ attribute: false }) public resizeHandle?: HTMLElement;

  @property({ attribute: false }) public dragHandle?: string;

  @property() public key!: string;

  @query(".grid-item-wrapper") private gridItem!: HTMLElement;

  @internalProperty() private _itemTopPX?: number;

  @internalProperty() private _itemLeftPX?: number;

  @internalProperty() private _itemWidthPX?: number;

  @internalProperty() private _itemHeightPX?: number;

  private _startTop?: number;

  private _startLeft?: number;

  private _startPosX?: number;

  private _startPosY?: number;

  private _minWidthPX?: number;

  private _maxWidthPX?: number;

  private _minHeightPX?: number;

  private _maxHeightPX?: number;

  private _fullColumnWidth?: number;

  private _fullRowHeight?: number;

  private _columnWidth?: number;

  protected updated(changedProps: PropertyValues): void {
    // Set up all the calculations that are needed in the drag/resize events
    // No need to calculate them all the time unless they change
    if (
      changedProps.has("parentWidth") ||
      changedProps.has("margin") ||
      changedProps.has("columns") ||
      changedProps.has("containerPadding") ||
      changedProps.has("minHeight") ||
      changedProps.has("minWidth") ||
      changedProps.has("maxWidth") ||
      changedProps.has("maxHeight") ||
      changedProps.has("rowHeight") ||
      changedProps.has("posX") ||
      (changedProps.has("_isDragging") && !this._isDragging)
    ) {
      this._columnWidth =
        (this.parentWidth -
          this.margin[0] * (this.columns - 1) -
          this.containerPadding[0] * 2) /
        this.columns;

      this._fullColumnWidth = this._columnWidth + this.margin[0];
      this._fullRowHeight = this.rowHeight + this.margin[1];

      this._minWidthPX =
        this._fullColumnWidth! * this.minWidth - this.margin[0];
      const maxWidthUnits =
        this.maxWidth !== undefined
          ? Math.min(this.maxWidth, this.columns - this.posX)
          : this.columns - this.posX;
      this._maxWidthPX =
        this._fullColumnWidth! * maxWidthUnits - this.margin[0];
      this._minHeightPX =
        this._fullRowHeight! * this.minHeight - this.margin[1];
      this._maxHeightPX =
        this._fullRowHeight! * (this.maxHeight || Infinity) - this.margin[1];
    }

    if (this._isDragging) {
      return;
    }

    this._itemLeftPX = Math.round(
      this.posX * this._fullColumnWidth! + this.containerPadding[0]
    );

    this._itemTopPX = !this.parentWidth
      ? 0
      : Math.round(this.posY * this._fullRowHeight! + this.containerPadding[1]);

    if (this._isResizing) {
      return;
    }

    this._itemWidthPX =
      this.width * this._columnWidth! +
      Math.max(0, this.width - 1) * this.margin[0];

    this._itemHeightPX =
      this.height * this.rowHeight +
      Math.max(0, this.height - 1) * this.margin[1];

    if (!this._firstLayoutFinished && this.parentWidth > 0) {
      setTimeout(() => (this._firstLayoutFinished = true), 200);
    }
  }

  protected render(): TemplateResult {
    let gridItemHTML = html`<slot></slot>`;

    if (this.isDraggable) {
      gridItemHTML = html`
        <lit-draggable
          .handle=${this.dragHandle}
          @dragStart=${this._dragStart}
          @dragging=${this._drag}
          @dragEnd=${this._dragEnd}
        >
          ${gridItemHTML}
        </lit-draggable>
      `;
    }

    if (this.isResizable) {
      const resizeHandle = this.resizeHandle?.cloneNode(true) as HTMLElement;
      gridItemHTML = html`
        <lit-resizable
          .handle=${resizeHandle}
          @resizeStart=${this._resizeStart}
          @resize=${this._resize}
          @resizeEnd=${this._resizeEnd}
        >
          ${gridItemHTML}
        </lit-resizable>
      `;
    }

    return html`
      <div
        class="grid-item-wrapper ${classMap({
          dragging: this._isDragging,
          resizing: this._isResizing,
          finished: this._firstLayoutFinished,
        })}"
        style="transform: translate(${this._itemLeftPX}px, ${this
          ._itemTopPX}px); width: ${this._itemWidthPX}px; height: ${this
          ._itemHeightPX}px"
      >
        ${gridItemHTML}
      </div>
    `;
  }

  private _resizeStart(): void {
    this.isDraggable = false;
    this._isResizing = true;
    this._isDragging = false;

    fireEvent(this, "resizeStart");
  }

  private _resize(ev: LGLDomEvent<ResizingEvent>): void {
    if (!this._isResizing) {
      return;
    }

    let { width, height } = ev.detail;

    // update width and height to be within contraints
    width = Math.max(this._minWidthPX!, width);
    width = Math.min(this._maxWidthPX!, width);
    height = Math.max(this._minHeightPX!, height);
    height = Math.min(this._maxHeightPX!, height);

    // Go ahead an update the width and height of the element (this won't affect the layout)
    this._itemWidthPX = width;
    this._itemHeightPX = height;

    // Calculate the new width and height in grid units
    const newWidth = Math.round(
      (width + this.margin[0]) / this._fullColumnWidth!
    );
    const newHeight = Math.round(
      (height + this.margin[1]) / this._fullRowHeight!
    );

    // if the grid units don't change, don't send the update to the layout
    if (newWidth === this.width && newHeight === this.height) {
      return;
    }

    fireEvent(this, "resize", { newWidth, newHeight });
  }

  private _resizeEnd(): void {
    this.isDraggable = true;
    this._isResizing = false;
    fireEvent(this, "resizeEnd");
  }

  private _dragStart(): void {
    if (!this.isDraggable) {
      return;
    }

    const rect = this.gridItem.getBoundingClientRect();
    const parentRect = this.offsetParent!.getBoundingClientRect();
    this._startLeft = rect.left - parentRect.left;
    this._startTop = rect.top - parentRect.top;

    this._startPosX = this.posX;
    this._startPosY = this.posY;
    this._isDragging = true;

    fireEvent(this, "dragStart");
  }

  private _drag(ev: LGLDomEvent<DraggingEvent>): void {
    if (
      this._startPosX === undefined ||
      this._startPosY === undefined ||
      this._startLeft === undefined ||
      this._startTop === undefined ||
      !this.isDraggable
    ) {
      return;
    }

    const { deltaX, deltaY } = ev.detail;

    // Go ahead an update the position of the item, this won't affect the layout
    this._itemLeftPX = this._startLeft + deltaX;
    this._itemTopPX = this._startTop + deltaY;

    // Get the change in grid units from the change in pixels
    const deltaCols = Math.round(deltaX / this._fullColumnWidth!);
    const deltaRows = Math.round(deltaY / this._fullRowHeight!);

    // If change in grid units from both axis are 0, no need to go forward
    if (!deltaRows && !deltaCols) {
      return;
    }

    // Add the delta to the orginal, to get the new position
    let newPosX = this._startPosX + deltaCols;
    let newPosY = this._startPosY + deltaRows;

    // Positions have to stay within bounds
    newPosX = Math.max(0, newPosX);
    newPosY = Math.max(0, newPosY);
    newPosX = Math.min(this.columns - this.width, newPosX);

    fireEvent(this, "dragging", { newPosX, newPosY });
  }

  private _dragEnd(): void {
    this._isDragging = false;
    this._startLeft = undefined;
    this._startTop = undefined;
    this._startPosX = undefined;
    this._startPosY = undefined;

    fireEvent(this, "dragEnd");
  }

  static get styles(): CSSResult {
    return css`
      .grid-item-wrapper {
        position: absolute;
        transition: var(--grid-item-transition, all 200ms);
        z-index: 2;
        opacity: 0;
      }

      .grid-item-wrapper.dragging {
        transition: none;
        z-index: 3;
        opacity: var(--grid-item-dragging-opacity, 0.8) !important;
      }

      .grid-item-wrapper.resizing {
        transition-property: transform;
        z-index: 3;
        opacity: var(--grid-item-resizing-opacity, 0.8) !important;
      }

      .grid-item-wrapper.finished {
        opacity: 1;
      }

      :host([placeholder]) .grid-item-wrapper {
        background-color: var(--placeholder-background-color, red);
        opacity: var(--placeholder-background-opacity, 0.2);
        z-index: 1;
      }

      lit-resizable {
        width: 100%;
        height: 100%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-item": LitGridItem;
  }
}
