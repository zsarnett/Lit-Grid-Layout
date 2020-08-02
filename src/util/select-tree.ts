/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Credit to @thomasloven
export const selectTree = async (
  root: any,
  pathArray: [string],
  timeout = 10000
): Promise<any | undefined> => {
  try {
    return Promise.race([
      _selectTree(root, pathArray),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      ),
    ]);
  } catch (err) {
    return undefined;
  }
};

async function _selectTree(
  root: any,
  pathArray: [string]
): Promise<HTMLElement | undefined> {
  let el = root;

  if (!el) {
    return undefined;
  }

  for (const [i, path] of pathArray.entries()) {
    if (el.localName.includes("-")) {
      await customElements.whenDefined(el.localName);
    }

    if (el.updateComplete) {
      await el.updateComplete;
    }

    if (i > 0 && el.shadowRoot) {
      el = el.shadowRoot;
    }

    if (!el) {
      return undefined;
    }

    if (path.trim() !== "." && path.trim() !== "") {
      el = el.querySelector(path.trim());
    }

    if (!el) {
      return undefined;
    }
  }
  return el;
}
