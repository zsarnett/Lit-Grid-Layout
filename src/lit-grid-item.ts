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

  @property({ type: Number }) public rowHeight!: number;

  @property({ type: Number }) public columns!: number;

  @property({ type: Number }) public parentWidth!: number;

  @property({ type: Array }) public margin!: [number, number];

  @property() public key!: string;

  protected updated(): void {
    this.style.setProperty(
      "--item-width",
      `${
        this.width * this._getColumnWidth() +
        Math.max(0, this.width - 1) * this.margin[0]
      }px`
    );
    this.style.setProperty(
      "--item-height",
      `${
        this.height * this.rowHeight +
        Math.max(0, this.height - 1) * this.margin[1]
      }px`
    );
    this.style.setProperty(
      "--item-left",
      `${Math.round(this.posX * (this._getColumnWidth() + this.margin[0]))}px`
    );
    this.style.setProperty(
      "--item-top",
      `${Math.round(this.posY * (this.rowHeight + this.margin[1]))}px`
    );
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  private _getColumnWidth(): number {
    return (
      (this.parentWidth - this.margin[0] * (this.columns - 1)) / this.columns
    );
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
