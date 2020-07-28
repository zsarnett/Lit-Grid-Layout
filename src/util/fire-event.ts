export const fireEvent = (
  target: EventTarget,
  event: string,
  detail: Record<string, any> = {}
): void => {
  target.dispatchEvent(new CustomEvent(event, { detail }));
};
