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
import { fireEvent } from "./util/fire-event";

@customElement("lit-resizable")
export class LitResizable extends LitElement {
  @property({ attribute: false }) public handle?: HTMLElement;

  private startWidth?: number;

  private startHeight?: number;

  protected render(): TemplateResult {
    return html`
      <slot></slot>

      <lit-draggable
        @dragging=${this._resize}
        @dragStart=${this._resizeStart}
        @dragEnd=${this._resizeEnd}
      >
        ${!this.handle ? "" : html`${this.handle}`}
      </lit-draggable>
    `;
  }

  private _resizeStart(): void {
    this.startWidth = this.clientWidth;
    this.startHeight = this.clientHeight;

    fireEvent(this, "resizeStart");
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

  private _resizeEnd(): void {
    fireEvent(this, "resizeEnd");
  }

  static get styles(): CSSResult {
    return css`
      :host {
        position: relative;
        display: block;
      }

      .default-handle {
        background-color: red;
        position: absolute;
        width: 10px;
        height: 10px;
        bottom: 0px;
        right: 0px;
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
