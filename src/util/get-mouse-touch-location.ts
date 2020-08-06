import type { MouseTouchLocation } from "../types";

export const getMouseTouchLocation = (
  ev: MouseEvent | TouchEvent,
  touchIdentifier: number | undefined
): MouseTouchLocation | undefined => {
  if (ev.type.startsWith("touch")) {
    if (touchIdentifier === undefined) {
      return;
    }

    const touchEvent = ev as TouchEvent;
    const touchObj = getTouch(touchEvent, touchIdentifier);

    return {
      x: touchObj.x,
      y: touchObj.y,
    };
  }

  return {
    x: (ev as MouseEvent).clientX,
    y: (ev as MouseEvent).clientY,
  };
};

const getTouch = (e: TouchEvent, identifier: number): MouseTouchLocation => {
  const touchObj =
    (e.targetTouches &&
      Array.prototype.find.call(
        e.targetTouches,
        (t) => identifier === t.identifier
      )) ||
    (e.changedTouches &&
      Array.prototype.find.call(
        e.changedTouches,
        (t) => identifier === t.identifier
      ));

  return {
    x: touchObj.clientX,
    y: touchObj.clientY,
  };
};
