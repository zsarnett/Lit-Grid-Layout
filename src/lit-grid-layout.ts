import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";

import "./lit-grid-item";

interface LayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: number;
}

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  private _layout: LayoutItem[] = [];

  private _row = 1;

  private _currentRowWidth = 0;

  get childrenElements(): HTMLElement[] {
    return Array.prototype.filter.call(this.children, (e: HTMLElement) =>
      e.classList.contains("lit-grid-item")
    );
  }

  private getGridItem(el: HTMLElement, index: number): TemplateResult {
    const layoutItem: LayoutItem = {
      x: 0,
      y: 0,
      w: el.clientWidth || parseInt(el.style.width, 10),
      h: el.clientHeight || parseInt(el.style.height, 10),
      i: index,
    };

    if (this._currentRowWidth + layoutItem.w > this.clientWidth) {
      this._row++;
      this._currentRowWidth = 0;
    }

    layoutItem.x = this._currentRowWidth;
    layoutItem.y = (this._row - 1) * layoutItem.h;
    this._currentRowWidth += layoutItem.w;

    this._layout.push(layoutItem);

    return html`
      <lit-grid-item
        .width=${layoutItem.w}
        .height=${layoutItem.h}
        .posX=${layoutItem.x}
        .posY=${layoutItem.y}
      >
        ${el}
      </lit-grid-item>
    `;
  }

  protected render(): TemplateResult {
    return html`
      ${this.childrenElements.map((el, idx) => this.getGridItem(el, idx))}
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-grid-layout": LitGridLayout;
  }
}
