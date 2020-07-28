import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

import type { LGLDomEvent, DraggingEvent } from "./types";
import { fireEvent } from "./util/fire-event";

import "./lit-draggable";

@customElement("lit-resizable")
export class LitResizable extends LitElement {
  @property({ attribute: false }) public handle?: HTMLElement;

  @property({ type: Boolean }) public disabled = false;

  private startWidth?: number;

  private startHeight?: number;

  protected render(): TemplateResult {
    return html`
      <slot></slot>

      ${this.disabled
        ? ""
        : html`
            <lit-draggable
              @dragging=${this._resize}
              @dragStart=${this._resizeStart}
              @dragEnd=${this._resizeEnd}
            >
              ${!this.handle ? "" : html`${this.handle}`}
            </lit-draggable>
          `}
    `;
  }

  private _resizeStart(): void {
    this.startWidth = this.clientWidth;
    this.startHeight = this.clientHeight;

    fireEvent(this, "resizeStart");
  }

  private _resize(ev: LGLDomEvent<DraggingEvent>): void {
    ev.stopPropagation();

    if (this.startWidth === undefined || this.startHeight === undefined) {
      return;
    }

    const { deltaX, deltaY } = ev.detail;

    if (deltaY === 0 && deltaX === 0) {
      return;
    }

    const width = this.startWidth + deltaX;
    const height = this.startHeight + deltaY;

    fireEvent(this, "resize", {
      width,
      height,
      deltaX,
      deltaY,
    });
  }

  private _resizeEnd(): void {
    this.startWidth = undefined;
    this.startHeight = undefined;

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
