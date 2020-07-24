import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";

@customElement("lit-draggable")
export class LitDraggable extends LitElement {
  private startX?: number;
  private startY?: number;
  private startTop?: number;
  private startLeft?: number;

  private _dragging = false;

  protected firstUpdated(): void {
    this.addEventListener("mousedown", this._mouseDown.bind(this));
    this.addEventListener("mousemove", this._mouseMove.bind(this));
    document.addEventListener("mouseup", this._mouseUp.bind(this));
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  private _mouseDown(ev: MouseEvent | TouchEvent): void {
    console.log("dragstart");
    const rect = this.getBoundingClientRect();
    const parentRect = this.parentElement!.getBoundingClientRect();
    const pos = this._getPos(ev);

    this.startX = pos.x;
    this.startY = pos.y;
    this.startLeft = rect.left - parentRect.left;
    this.startTop = rect.top - parentRect.top;

    console.log(this.startTop);
    console.log(this.startLeft);

    this._dragging = true;
  }

  private _mouseMove(ev: MouseEvent | TouchEvent): void {
    if (!this._dragging) {
      return;
    }
    ev.stopPropagation();

    const pos = this._getPos(ev);

    this.style.top = this.startTop! + pos.y - this.startY! + "px";
    this.style.left = this.startLeft! + pos.x - this.startX! + "px";
  }

  private _mouseUp(): void {
    this._dragging = false;
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

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: absolute;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-draggable": LitDraggable;
  }
}
