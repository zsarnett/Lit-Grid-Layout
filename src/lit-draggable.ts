import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { fireEvent } from "./util/fire-event";
import { getMouseTouchLocation } from "./util/get-mouse-touch-location";
import { getTouchIdentifier } from "./util/get-touch-identifier";
import { matchesSelectorAndParentsTo } from "./util/match-selector";

@customElement("lit-draggable")
export class LitDraggable extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

  @property({ type: Boolean, reflect: true }) public disabled = false;

  @property() public handle?: string;

  private startX?: number;

  private startY?: number;

  private _dragging = false;

  private _touchIdentifier?: number;

  protected firstUpdated(): void {
    this.addEventListener("mousedown", this._dragStart.bind(this), {
      capture: true,
      passive: false,
    });
    this.addEventListener("touchstart", this._dragStart.bind(this), {
      capture: true,
      passive: false,
    });
    document.addEventListener("mousemove", this._drag.bind(this), {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", this._drag.bind(this), {
      capture: true,
      passive: false,
    });
    document.addEventListener("mouseup", this._dragEnd.bind(this), {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchcancel", this._dragEnd.bind(this), {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchend", this._dragEnd.bind(this), {
      capture: true,
      passive: false,
    });
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  private _dragStart(ev: MouseEvent | TouchEvent): void {
    if (
      (ev.type.startsWith("mouse") && (ev as MouseEvent).button !== 0) ||
      this.disabled
    ) {
      return;
    }

    if (
      this.handle &&
      !matchesSelectorAndParentsTo(
        ev.currentTarget! as Node,
        this.handle,
        this.offsetParent as Node
      )
    ) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    if (ev.type === "touchstart") {
      this._touchIdentifier = getTouchIdentifier(ev as TouchEvent);
    }

    const pos = getMouseTouchLocation(ev, this._touchIdentifier);

    if (!pos) {
      return;
    }

    this.startX = pos.x;
    this.startY = pos.y;

    this._dragging = true;

    fireEvent(this, "dragStart", {
      startX: this.startX,
      startY: this.startY,
    });
  }

  private _drag(ev: MouseEvent | TouchEvent): void {
    if (!this._dragging || this.disabled) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    const pos = getMouseTouchLocation(ev, this._touchIdentifier);

    if (!pos) {
      return;
    }

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
    if (!this._dragging || this.disabled) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    this._touchIdentifier = undefined;
    this._dragging = false;

    fireEvent(this, "dragEnd");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-draggable": LitDraggable;
  }
}
