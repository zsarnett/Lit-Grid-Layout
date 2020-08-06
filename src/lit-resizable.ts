import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
  svg,
} from "lit-element";

import "./lit-draggable";

import type { LGLDomEvent, DraggingEvent } from "./types";
import { fireEvent } from "./util/fire-event";

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
              ${!this.handle
                ? svg`
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon-tabler-arrows-diagonal-2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <polyline points="16 20 20 20 20 16" />
                      <line x1="14" y1="14" x2="20" y2="20" />
                      <polyline points="8 4 4 4 4 8" />
                      <line x1="4" y1="4" x2="10" y2="10" />
                    </svg>
                  `
                : html`${this.handle}`}
            </lit-draggable>
          `}
    `;
  }

  private _resizeStart(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.startWidth = this.clientWidth;
    this.startHeight = this.clientHeight;

    fireEvent(this, "resizeStart");
  }

  private _resize(ev: LGLDomEvent<DraggingEvent>): void {
    ev.preventDefault();
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

  private _resizeEnd(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();

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

      lit-draggable {
        position: absolute;
        left: var(--resize-handle-position-left, unset);
        top: var(--resize-handle-postion-top, unset);
        bottom: var(--resize-handle-position-bottom, 0);
        right: var(--resize-handle-postion-right, 0);
        width: var(--resize-handle-width, 18px);
        height: var(--resize-handle-height, 18px);
        user-select: none;
      }

      .icon-tabler-arrows-diagonal-2 {
        width: 100%;
        height: 100%;
        stroke-width: 1.5;
        stroke: #607d8b;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
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
