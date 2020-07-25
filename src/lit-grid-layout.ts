import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";

import type { LayoutItem, LayoutItemElement } from "./types";
import { findLayoutBottom } from "./util/find-layout-bottom";
import { fixLayoutBounds } from "./util/fix-layout-bounds";
import { condenseLayout } from "./util/condense-layout";

import "./lit-grid-item";

@customElement("lit-grid-layout")
export class LitGridLayout extends LitElement {
  @property({ type: Array }) public layout: LayoutItem[] = [];

  @property({ type: Array }) public elements?: LayoutItemElement[];

  public rowHeight = 30;

  public cols = 12;

  get childrenElements(): LayoutItemElement[] {
    return (
      this.elements ||
      Array.prototype.filter.call(this.children, (e: LayoutItemElement) =>
        e.classList.contains("lit-grid-item")
      )
    );
  }

  private setupLayout(): void {
    let layout: LayoutItem[] = [];

    // Create new Layout
    // Iterate over all children and find item in prev layout or create new item
    for (const element of this.childrenElements) {
      let layoutItem = this.layout.find(
        (item) => item.i === element.key.toString()
      );

      if (!layoutItem) {
        const itemProps = element.grid || {
          w: 1,
          h: 1,
          x: 0,
          y: findLayoutBottom(layout),
        };

        layoutItem = { ...itemProps, i: element.key };
      }

      layout.push(layoutItem);
    }

    layout = fixLayoutBounds(layout, this.cols);
    this.layout = condenseLayout(layout);
  }

  protected firstUpdated(): void {
    this.setupLayout();
    this.style.height = `${findLayoutBottom(this.layout) * this.rowHeight}px`;
  }

  protected render(): TemplateResult {
    if (!this.layout?.length) {
      return html``;
    }
    return html`
      ${this.childrenElements.map(
        (element, idx) =>
          html`
            <lit-grid-item
              .width=${this.layout[idx].w}
              .height=${this.layout[idx].h}
              .posY=${this.layout[idx].y}
              .posX=${this.layout[idx].x}
              .key=${this.layout[idx].i}
              .containerW=${parseInt(this.style.width, 10) || this.clientWidth}
              .cols=${this.cols}
              .rowH=${this.rowHeight}
            >
              ${element}
            </lit-grid-item>
          `
      )}
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
