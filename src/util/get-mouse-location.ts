import type { MouseLocation } from "../types";

export const getMouseLocation = (
  ev: MouseEvent | TouchEvent
): MouseLocation => {
  const mouseX = ev.type.startsWith("touch")
    ? (ev as TouchEvent).touches[0].clientX
    : (ev as MouseEvent).clientX;
  const mouseY = ev.type.startsWith("touch")
    ? (ev as TouchEvent).touches[0].clientY
    : (ev as MouseEvent).clientY;

  return {
    x: mouseX,
    y: mouseY,
  };
};
