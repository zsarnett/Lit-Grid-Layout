import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";

import type { LGLDomEvent, ResizingEvent } from "./types";
import { fireEvent } from "./util/fire-event";

import "./lit-resizable";

@customElement("lit-resizable-wrapper")
export class LitResizableWrapper extends LitElement {
  protected render(): TemplateResult {
    return html`
      <lit-resizable
        @resize=${this._resize}
        @resizeStart=${this._resizeStart}
        @resizeEnd=${this._resizeEnd}
      >
        <slot></slot>
      </lit-resizable>
    `;
  }

  private _resizeStart(ev: Event): void {
    ev.stopPropagation();
    ev.preventDefault();

    fireEvent(this, "resizeStart");
  }

  private _resize(ev: LGLDomEvent<ResizingEvent>): void {
    ev.stopPropagation();
    ev.preventDefault();

    const { width, height } = ev.detail;

    this.style.setProperty("--item-width", `${width}px`);
    this.style.setProperty("--item-height", `${height}px`);

    fireEvent(this, "resize", { width, height });
  }

  private _resizeEnd(ev: Event): void {
    ev.stopPropagation();
    ev.preventDefault();

    fireEvent(this, "resizeStart");
  }

  static get styles(): CSSResult {
    return css`
      :host {
        position: absolute;
        width: var(--item-width);
        height: var(--item-height);
      }

      lit-resizable {
        width: 100%;
        height: 100%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-resizable-wrapper": LitResizableWrapper;
  }
}
