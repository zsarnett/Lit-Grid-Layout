import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";
import { fireEvent } from "./util/fire-event";

@customElement("lit-draggable")
export class LitDraggable extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

  @property({ type: Boolean, reflect: true }) public isDraggable = true;

  private startX?: number;

  private startY?: number;

  private _dragging = false;

  protected firstUpdated(): void {
    this.addEventListener("mousedown", this._dragStart.bind(this));
    document.addEventListener("mousemove", this._drag.bind(this));
    document.addEventListener("mouseup", this._dragEnd.bind(this));
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  private _dragStart(ev: MouseEvent | TouchEvent): void {
    if (!this.isDraggable) {
      return;
    }

    const pos = this._getPos(ev);

    this.startX = pos.x;
    this.startY = pos.y;

    this._dragging = true;

    fireEvent(this, "dragStart", {
      startX: this.startX,
      startY: this.startY,
    });
  }

  private _drag(ev: MouseEvent | TouchEvent): void {
    if (!this._dragging || !this.isDraggable) {
      return;
    }
    ev.stopPropagation();

    const pos = this._getPos(ev);

    let deltaX = pos.x - this.startX!;
    let deltaY = pos.y - this.startY!;

    if (this.grid) {
      deltaX = Math.round(deltaX / this.grid[0]) * this.grid[0];
      deltaY = Math.round(deltaY / this.grid[1]) * this.grid[1];
    }

    if (!deltaX && !deltaY) {
      return;
    }

    fireEvent(this, "dragging", {
      deltaX,
      deltaY,
    });
  }

  private _dragEnd(): void {
    this._dragging = false;

    fireEvent(this, "dragEnd");
  }

  private _getPos(ev: MouseEvent | TouchEvent): any {
    const mouseX = ev.type.startsWith("touch")
      ? (ev as TouchEvent).touches[0].clientX
      : (ev as MouseEvent).clientX;
    const mouseY = ev.type.startsWith("touch")
      ? (ev as TouchEvent).touches[0].clientY
      : (ev as MouseEvent).clientY;

    return {
      x: mouseX,
      y: mouseY,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-draggable": LitDraggable;
  }
}
