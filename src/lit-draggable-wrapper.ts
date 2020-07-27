import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  property,
  CSSResult,
  css,
} from "lit-element";

import "./lit-draggable";

@customElement("lit-draggable-wrapper")
export class LitDraggableWrapper extends LitElement {
  @property({ type: Array }) public grid?: [number, number];

  private startTop?: number;

  private startLeft?: number;

  protected render(): TemplateResult {
    return html`
      <lit-draggable @dragging=${this._drag} @dragStart=${this._dragStart}>
        <slot></slot>
      </lit-draggable>
    `;
  }

  private _dragStart(): void {
    const rect = this.getBoundingClientRect();
    const parentRect = this.parentElement!.getBoundingClientRect();
    this.startLeft = rect.left - parentRect.left;
    this.startTop = rect.top - parentRect.top;
  }

  private _drag(ev: MouseEvent | TouchEvent): void {
    const { deltaX, deltaY } = ev.detail as any;

    this.style.setProperty(
      "--drag-x",
      `${Math.round(this.startLeft! + deltaX)}px`
    );
    this.style.setProperty(
      "--drag-y",
      `${Math.round(this.startTop! + deltaY)}px`
    );
  }

  // private _dragEnd(): void {
  // }

  static get styles(): CSSResult {
    return css`
      :host {
        position: absolute;
        transform: translate(var(--drag-x), var(--drag-y));
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-draggable-wrapper": LitDraggableWrapper;
  }
}
