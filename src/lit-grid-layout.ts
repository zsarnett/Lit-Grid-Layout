import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
  internalProperty,
  PropertyValues,
} from "lit-element";

import type { LayoutItemElement, Layout } from "./types";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { condenseLayout } from "./util/condense-layout";

import "./lit-grid-item";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: Layout = [];

  @property({ type: Array }) public items: LayoutItemElement[] = [];

  public rowHeight = 30;

  public cols = 12;

  @internalProperty() private _currentLayout: Layout = [];

  // Get items supplied by property and from any children
  get childrenElements(): LayoutItemElement[] {
    return this.items.concat(
      ...Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("lit-grid-item")
      )
    );
  }

  private setupLayout(): void {
    let newLayout: Layout = [];

    // Create new Layout
    // Iterate over all children and find item in prev layout or create new item
    for (const element of this.childrenElements) {
      let layoutItem = this.layout.find((item) => item.key === element.key);

      if (!layoutItem) {
        const itemProps = element.grid || {
          width: 1,
          height: 1,
          posX: 0,
          posY: findLayoutBottom(newLayout),
        };

        layoutItem = { ...itemProps, key: element.key };
      }

      newLayout.push(layoutItem);
    }

    newLayout = fixLayoutBounds(newLayout, this.cols);
    this._currentLayout = condenseLayout(newLayout);
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("layout")) {
      this.setupLayout();
      this.style.height = `${findLayoutBottom(this.layout) * this.rowHeight}px`;
    }
  }

  protected render(): TemplateResult {
    if (!this._currentLayout?.length) {
      return html``;
    }

    return html`
      ${this.childrenElements.map((element, idx) => {
        const item = this._currentLayout[idx];
        return html`
          <lit-grid-item
            .width=${item.width}
            .height=${item.height}
            .posY=${item.posY}
            .posX=${item.posX}
            .key=${item.key}
            .containerW=${parseInt(this.style.width, 10) || this.clientWidth}
            .cols=${this.cols}
            .rowH=${this.rowHeight}
          >
            ${element}
          </lit-grid-item>
        `;
      })}
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
