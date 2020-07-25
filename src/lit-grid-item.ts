import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

@customElement("lit-grid-item")
export class LitGridItem extends LitElement {
  @property({ type: Number }) public width!: number;

  @property({ type: Number }) public height!: number;

  @property({ type: Number }) public posX!: number;

  @property({ type: Number }) public posY!: number;

  @property({ type: Number }) public key!: number;

  @property({ type: Number }) public rowH!: number;

  @property({ type: Number }) public cols!: number;

  @property({ type: Number }) public containerW!: number;

  protected updated(): void {
    this.style.width = `${this.width * (this.containerW / this.cols)}px`;
    this.style.height = `${this.height * this.rowH}px`;
    this.style.top = `${this.posY * this.rowH}px`;
    this.style.left = `${this.posX * (this.containerW / this.cols)}px`;
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: absolute;
      }
      slot {
        width: 100%;
        position: relative;
        height: 100%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-item": LitGridItem;
  }
}
