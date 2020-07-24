import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";
import { styleMap } from "lit-html/directives/style-map";

@customElement("lit-grid-item")
export class LitGridItem extends LitElement {
  @property({ type: Number }) public width!: number;

  @property({ type: Number }) public height!: number;

  @property({ type: Number }) public posX!: number;

  @property({ type: Number }) public posY!: number;

  @property({ type: Number }) public index!: number;

  protected render(): TemplateResult {
    return html`
      <slot
        class="wrapper"
        style=${styleMap({
          width: `${this.width}px`,
          height: `${this.height}px`,
          top: `${this.posY}px`,
          left: `${this.posX}px`,
        })}
      ></slot>
    `;
  }

  static get styles(): CSSResult {
    return css`
      slot {
        display: block;
        position: absolute;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-item": LitGridItem;
  }
}
