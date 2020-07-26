import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
} from "lit-element";

@customElement("lit-draggable")
export class LitDraggable extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

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
    const pos = this._getPos(ev);

    this.startX = pos.x;
    this.startY = pos.y;

    this._dragging = true;

    const dragStartEvent = new CustomEvent("dragStart", {
      detail: {
        startX: this.startX,
        startY: this.startY,
      },
    });
    this.dispatchEvent(dragStartEvent);
  }

  private _drag(ev: MouseEvent | TouchEvent): void {
    if (!this._dragging) {
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

    const dragEvent = new CustomEvent("drag", {
      detail: {
        deltaX,
        deltaY,
      },
    });
    this.dispatchEvent(dragEvent);
  }

  private _dragEnd(): void {
    this._dragging = false;

    const dragEndEvent = new CustomEvent("dragEnd");
    this.dispatchEvent(dragEndEvent);
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
