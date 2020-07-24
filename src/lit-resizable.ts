import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";

@customElement("lit-resizable")
export class LitResizable extends LitElement {
  private startX?: number;
  private startY?: number;
  private startWidth?: number;
  private startHeight?: number;
  private _dragging = false;

  protected firstUpdated(): void {
    document.addEventListener("mousemove", this._mouseMove.bind(this));
    document.addEventListener("mouseup", this._mouseUp.bind(this));
  }

  protected render(): TemplateResult {
    return html`
      <slot></slot>
      <div class="resizer" @mousedown=${this._mouseDown}></div>
    `;
  }

  private _mouseDown(ev: MouseEvent): void {
    console.log("dragstart");

    this.startX = ev.clientX;
    this.startY = ev.clientY;
    this.startWidth = this.clientWidth;
    this.startHeight = this.clientHeight;
    this._dragging = true;
  }

  private _mouseMove(ev: MouseEvent | TouchEvent): void {
    if (!this._dragging) {
      return;
    }

    ev.stopPropagation();

    const pos = this._getPos(ev);

    this.style.width = this.startWidth! + pos.x - this.startX! + "px";
    this.style.height = this.startHeight! + pos.y - this.startY! + "px";
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
        position: relative;
        display: block;
      }

      .resizer {
        width: 10px;
        height: 10px;
        background: blue;
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: se-resize;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-resizable": LitResizable;
  }
}
