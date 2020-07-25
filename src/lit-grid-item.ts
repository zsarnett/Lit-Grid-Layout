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

  @property({ type: Number }) public rowH!: number;

  @property({ type: Number }) public cols!: number;

  @property({ type: Number }) public parentWidth!: number;

  @property() public key!: string;

  protected updated(): void {
    this.style.setProperty(
      "--item-width",
      `${this.width * (this.parentWidth / this.cols)}px`
    );
    this.style.setProperty("--item-height", `${this.height * this.rowH}px`);
    this.style.setProperty(
      "--item-left",
      `${this.posX * (this.parentWidth / this.cols)}px`
    );
    this.style.setProperty("--item-top", `${this.posY * this.rowH}px`);
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: absolute;
        width: var(--item-width);
        height: var(--item-height);
        transform: translate(var(--item-left), var(--item-top));
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-item": LitGridItem;
  }
}
