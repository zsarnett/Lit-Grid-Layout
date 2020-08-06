export interface LayoutItem {
  width: number;
  height: number;
  posX: number;
  posY: number;
  key: string;
  hasMoved?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}
export type Layout = Array<LayoutItem>;

export interface LayoutObject {
  [key: string]: LayoutItem;
}

export interface LayoutItemElement extends HTMLElement {
  key: string;
  grid: {
    width: number;
    height: number;
    posX: number;
    posY: number;
  };
}

export interface LGLDomEvent<T> extends Event {
  detail: T;
}

export interface LGLItemDomEvent<T> extends Event {
  detail: T;
  currentTarget: LayoutItemElement;
}

export interface DraggingEvent {
  deltaX: number;
  deltaY: number;
}

export interface ResizingEvent {
  width: number;
  height: number;
}

export interface ItemDraggedEvent {
  newPosX: number;
  newPosY: number;
}

export interface ItemResizedEvent {
  newWidth: number;
  newHeight: number;
}

export interface MouseLocation {
  x: number;
  y: number;
}

export interface MouseTouchLocation {
  x: number;
  y: number;
}

export type EventHandler<T> = (e: T) => void | false;
