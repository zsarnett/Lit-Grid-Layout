import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

import "./lit-draggable";
import "./lit-resizable";
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

  @property({ type: Number }) public minWidth = 1;

  @property({ type: Number }) public minHeight = 1;

  @property({ type: Boolean }) public isDraggable = true;

  @property({ type: Boolean }) public isResizable = true;

  @property() public key!: string;

  @property({ attribute: "dragging", reflect: true, type: Boolean })
  private _isDragging = false;

  @property({ attribute: "resizing", reflect: true, type: Boolean })
  private _isResizing = false;

  private _startTop?: number;

  private _startLeft?: number;

  private _startPosX?: number;

  private _startPosY?: number;

  protected updated(): void {
    if (this._isDragging) {
      return;
    }

    this.style.setProperty(
      "--item-left",
      `${Math.round(this.posX * (this._getColumnWidth() + this.margin[0]))}px`
    );
    this.style.setProperty(
      "--item-top",
      `${Math.round(this.posY * (this.rowHeight + this.margin[1]))}px`
    );

    if (this._isResizing) {
      return;
    }

    this.style.setProperty(
      "--item-width",
      `${
        this.width * this._getColumnWidth() +
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

    if (this.isResizable) {
      gridItemHTML = html`
        <lit-resizable
          @resizeStart=${this._resizeStart}
          @resize=${this._resize}
          @resizeEnd=${this._resizeEnd}
        >
          ${gridItemHTML}
        </lit-resizable>
      `;
    }

    if (this.isDraggable) {
      gridItemHTML = html`
        <lit-draggable
          .isDraggable=${this.isDraggable}
          @dragStart=${this._dragStart}
          @dragging=${this._drag}
          @dragEnd=${this._dragEnd}
        >
          ${gridItemHTML}
        </lit-draggable>
      `;
    }
    return gridItemHTML;
  }

  private _resizeStart(): void {
    this.isDraggable = false;
    this._isResizing = true;
    fireEvent(this, "resizeStart");
  }

  private _resize(ev: any): void {
    let { width, height } = ev.detail as any;

    const minWidthPX = this._getColumnWidth() * this.minWidth;
    const maxWidthPX =
      (this._getColumnWidth() + this.margin[0]) * (this.columns - this.posX) -
      this.margin[0];
    const minHeightPX = this.rowHeight * this.minHeight;

    width =
      width < minWidthPX ? minWidthPX : width > maxWidthPX ? maxWidthPX : width;

    height = height < this.rowHeight ? minHeightPX : height;

    this.style.setProperty("--item-width", `${width}px`);
    this.style.setProperty("--item-height", `${height}px`);

    const newWidth = Math.round(
      (width + this.margin[0]) / (this._getColumnWidth() + this.margin[0])
    );
    const newHeight = Math.round(
      (height + this.margin[1]) / (this.rowHeight + this.margin[1])
    );

    const deltaWidth = newWidth - this.width;
    const deltaHeight = newHeight - this.height;

    if (!deltaWidth && !deltaHeight) {
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
    const rect = this.getBoundingClientRect();
    const parentRect = this.offsetParent!.getBoundingClientRect();
    this._startLeft = rect.left - parentRect.left;
    this._startTop = rect.top - parentRect.top;

    this._startPosX = this.posX;
    this._startPosY = this.posY;
    this._isDragging = true;

    fireEvent(this, "dragStart");
  }

  private _drag(ev: any): void {
    ev.stopPropagation();
    if (this._startPosX === undefined || this._startPosY === undefined) {
      return;
    }

    const { deltaX, deltaY } = ev.detail as any;

    this.style.setProperty("--item-left", `${this._startLeft + deltaX}px`);
    this.style.setProperty("--item-top", `${this._startTop + deltaY}px`);

    const deltaCols = Math.round(
      deltaX / (this._getColumnWidth() + this.margin[0])
    );

    const deltaRows = Math.round(deltaY / (this.rowHeight + this.margin[1]));

    if (!deltaRows && !deltaCols) {
      return;
    }

    let newPosX = this._startPosX + deltaCols;
    let newPosY = this._startPosY + deltaRows;

    if (
      newPosX === undefined ||
      isNaN(newPosX) ||
      newPosY === undefined ||
      isNaN(newPosY)
    ) {
      return;
    }

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

  private _getColumnWidth(): number {
    return (
      (this.parentWidth - this.margin[0] * (this.columns - 1)) / this.columns
    );
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
      }

      :host([resizing]) {
        transition-property: transform;
        z-index: 3;
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
