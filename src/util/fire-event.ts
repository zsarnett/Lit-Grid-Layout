export const fireEvent = (
  target: EventTarget,
  event: string,
  detail: any = {}
): void => {
  target.dispatchEvent(new CustomEvent(event, { detail }));
};
