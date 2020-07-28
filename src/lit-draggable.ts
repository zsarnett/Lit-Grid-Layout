import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";
import { fireEvent } from "./util/fire-event";
import { PositionLocation } from "./types";

@customElement("lit-draggable")
export class LitDraggable extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

  @property({ type: Boolean, reflect: true }) public disabled = false;

  private startX?: number;

  private startY?: number;

  private _dragging = false;

  protected firstUpdated(): void {
    this.addEventListener("mousedown", this._dragStart.bind(this), {
      passive: true,
    });
    this.addEventListener("touchstart", this._dragStart.bind(this), {
      passive: true,
    });
    document.addEventListener("mousemove", this._drag.bind(this), {
      passive: true,
    });
    document.addEventListener("touchmove", this._drag.bind(this), {
      passive: true,
    });
    document.addEventListener("mouseup", this._dragEnd.bind(this), {
      passive: true,
    });
    document.addEventListener("touchcancel", this._dragEnd.bind(this), {
      passive: true,
    });
    document.addEventListener("touchend", this._dragEnd.bind(this), {
      passive: true,
    });
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  private _dragStart(ev: MouseEvent | TouchEvent): void {
    if (ev.type.startsWith("mouse") && (ev as MouseEvent).button !== 0) {
      return;
    }

    ev.stopPropagation();

    if (this.disabled) {
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
    ev.stopPropagation();

    if (!this._dragging || this.disabled) {
      return;
    }

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

  private _dragEnd(ev: MouseEvent | TouchEvent): void {
    ev.stopPropagation();

    if (!this._dragging || this.disabled) {
      return;
    }

    this._dragging = false;

    fireEvent(this, "dragEnd");
  }

  private _getPos(ev: MouseEvent | TouchEvent): PositionLocation {
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
