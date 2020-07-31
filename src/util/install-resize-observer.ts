export const installResizeObserver = async (): Promise<void> => {
  if (typeof ResizeObserver !== "function") {
    window.ResizeObserver = (await import("resize-observer-polyfill")).default;
  }
};
