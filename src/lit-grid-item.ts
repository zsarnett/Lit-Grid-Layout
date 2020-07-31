import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

import type { LGLDomEvent, DraggingEvent, ResizingEvent } from "./types";
import { fireEvent } from "./util/fire-event";

// TODO: Find out how to import both with out custom elements erroring about draggable already defined
// import "lit-draggable";
import "lit-resizable";

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

  @property({ attribute: false }) public resizeHandle!: HTMLElement;

  @property() public key!: string;

  @property({ attribute: "dragging", reflect: true, type: Boolean })
  private _isDragging = false;

  @property({ attribute: "resizing", reflect: true, type: Boolean })
  private _isResizing = false;

  private _startTop?: number;

  private _startLeft?: number;

  private _startPosX?: number;

  private _startPosY?: number;

  get _columnWidth(): number {
    return (
      (this.parentWidth -
        this.margin[0] * (this.columns - 1) -
        this.containerPadding[0] * 2) /
      this.columns
    );
  }

  protected updated(): void {
    if (this._isDragging) {
      return;
    }

    this.style.setProperty(
      "--item-left",
      `${Math.round(
        this.posX * (this._columnWidth + this.margin[0]) +
          this.containerPadding[0]
      )}px`
    );

    this.style.setProperty(
      "--item-top",
      `${
        !this.parentWidth
          ? 0
          : Math.round(
              this.posY * (this.rowHeight + this.margin[1]) +
                this.containerPadding[1]
            )
      }px`
    );

    if (this._isResizing) {
      return;
    }

    this.style.setProperty(
      "--item-width",
      `${
        !this.parentWidth
          ? 0
          : this.width * this._columnWidth +
            Math.max(0, this.width - 1) * this.margin[0]
      }px`
    );
    this.style.setProperty(
      "--item-height",
      `${
        this.height * this.rowHeight +
        Math.max(0, this.height - 1) * this.margin[1]
      }px`
    );
  }

  protected render(): TemplateResult {
    let gridItemHTML = html`<slot></slot>`;

    if (this.isDraggable) {
      gridItemHTML = html`
        <lit-draggable
          @dragStart=${this._dragStart}
          @dragging=${this._drag}
          @dragEnd=${this._dragEnd}
        >
          ${gridItemHTML}
        </lit-draggable>
      `;
    }

    if (this.isResizable) {
      gridItemHTML = html`
        <lit-resizable
          .handle=${this.resizeHandle}
          @resizeStart=${this._resizeStart}
          @resize=${this._resize}
          @resizeEnd=${this._resizeEnd}
        >
          ${gridItemHTML}
        </lit-resizable>
      `;
    }

    return gridItemHTML;
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

    const minWidthPX =
      (this._columnWidth + this.margin[0]) * this.minWidth - this.margin[0];
    const maxWidthUnits =
      this.maxWidth !== undefined
        ? Math.min(this.maxWidth, this.columns - this.posX)
        : this.columns - this.posX;
    const maxWidthPX =
      (this._columnWidth + this.margin[0]) * maxWidthUnits - this.margin[0];
    const minHeightPX =
      (this.rowHeight + this.margin[1]) * this.minHeight - this.margin[1];
    const maxHeightPX =
      (this.rowHeight + this.margin[1]) * (this.maxHeight || Infinity) -
      this.margin[1];

    // update width and height to be within contraints
    width = Math.max(minWidthPX, width);
    width = Math.min(maxWidthPX, width);
    height = Math.max(minHeightPX, height);
    height = Math.min(maxHeightPX, height);

    // Go ahead an update the width and height of the element (this won't affect the layout)
    this.style.setProperty("--item-width", `${width}px`);
    this.style.setProperty("--item-height", `${height}px`);

    // Calculate the new width and height in grid units
    const newWidth = Math.round(
      (width + this.margin[0]) / (this._columnWidth + this.margin[0])
    );
    const newHeight = Math.round(
      (height + this.margin[1]) / (this.rowHeight + this.margin[1])
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

    const rect = this.getBoundingClientRect();
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
    this.style.setProperty("--item-left", `${this._startLeft + deltaX}px`);
    this.style.setProperty("--item-top", `${this._startTop + deltaY}px`);

    // Get the change in grid units from the change in pixels
    const deltaCols = Math.round(deltaX / (this._columnWidth + this.margin[0]));
    const deltaRows = Math.round(deltaY / (this.rowHeight + this.margin[1]));

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
      :host {
        position: absolute;
        width: var(--item-width);
        height: var(--item-height);
        transform: translate(var(--item-left), var(--item-top));
        transition: var(--grid-item-transition, all 200ms);
        z-index: 2;
      }

      :host([dragging]) {
        transition: none;
        z-index: 3;
        opacity: var(--grid-item-dragging-opacity, 0.8);
      }

      :host([resizing]) {
        transition-property: transform;
        z-index: 3;
        opacity: var(--grid-item-resizing-opacity, 0.8);
      }

      lit-resizable {
        width: 100%;
        height: 100%;
      }

      lit-draggable {
        cursor: move;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-item": LitGridItem;
  }
}
