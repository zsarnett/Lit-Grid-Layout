import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";

import "./lit-draggable";
import { fireEvent } from "./util/fire-event";

@customElement("lit-resizable")
export class LitResizable extends LitElement {
  private startWidth?: number;

  private startHeight?: number;

  protected render(): TemplateResult {
    return html`
      <slot></slot>

      <lit-draggable @drag=${this._resize} @dragStart=${this._resizeStart}>
      </lit-draggable>
    `;
  }

  private _resizeStart(): void {
    this.startWidth = this.clientWidth;
    this.startHeight = this.clientHeight;
  }

  private _resize(ev: MouseEvent | TouchEvent): void {
    ev.stopPropagation();

    const { deltaX, deltaY } = ev.detail as any;

    const width = this.startWidth! + deltaX;
    const height = this.startHeight! + deltaY;

    fireEvent(this, "resize", {
      width,
      height,
      deltaX,
      deltaY,
    });
  }

  static get styles(): CSSResult {
    return css`
      :host {
        position: relative;
        display: block;
      }

      lit-draggable {
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
