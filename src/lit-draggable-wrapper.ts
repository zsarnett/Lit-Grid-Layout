import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
  CSSResult,
  css,
} from "lit-element";

import { LGLDomEvent, DraggingEvent } from "./types";

import "./lit-draggable";
import { fireEvent } from "./util/fire-event";

@customElement("lit-draggable-wrapper")
export class LitDraggableWrapper extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

  @property() public handle?: string;

  private _startTop?: number;

  private _startLeft?: number;

  protected render(): TemplateResult {
    return html`
      <div class="draggable-wrapper">
        <lit-draggable
          .handle=${this.handle}
          @dragging=${this._drag}
          @dragStart=${this._dragStart}
          @dragEnd=${this._dragEnd}
        >
          <slot></slot>
        </lit-draggable>
      </div>
    `;
  }

  private _dragStart(): void {
    const rect = this.getBoundingClientRect();
    const parentRect = this.offsetParent!.getBoundingClientRect();
    this._startLeft = rect.left - parentRect.left;
    this._startTop = rect.top - parentRect.top;

    fireEvent(this, "dragStart");
  }

  private _drag(ev: LGLDomEvent<DraggingEvent>): void {
    ev.stopPropagation();

    if (this._startLeft === undefined || this._startTop === undefined) {
      return;
    }
    const { deltaX, deltaY } = ev.detail;

    this.style.setProperty(
      "--drag-x",
      `${Math.round(this._startLeft! + deltaX)}px`
    );
    this.style.setProperty(
      "--drag-y",
      `${Math.round(this._startTop! + deltaY)}px`
    );

    fireEvent(this, "dragging", { deltaX, deltaY });
  }

  private _dragEnd(): void {
    this._startLeft = undefined;
    this._startTop = undefined;

    fireEvent(this, "dragStart");
  }

  static get styles(): CSSResult {
    return css`
      .draggable-wrapper {
        position: absolute;
        transform: translate(var(--drag-x), var(--drag-y));
        touch-action: none;
        user-select: none;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-draggable-wrapper": LitDraggableWrapper;
  }
}
