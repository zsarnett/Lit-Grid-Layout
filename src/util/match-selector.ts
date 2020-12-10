// Credit to react-draggable [https://github.com/STRML/react-draggable]
let matchesSelectorFunc: string | undefined = "";
const matchesSelector = (el: Node, selector: string): boolean => {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = [
      "matches",
      "webkitMatchesSelector",
      "mozMatchesSelector",
      "msMatchesSelector",
      "oMatchesSelector",
    ].find((method) => isFunction(el[method]));
  }

  if (!matchesSelectorFunc || !isFunction(el[matchesSelectorFunc])) {
    return false;
  }

  return el[matchesSelectorFunc](selector);
};

export const matchesSelectorAndParentsTo = (
  ev: MouseEvent | TouchEvent,
  selector: string,
  baseNode: Node
): boolean => {
  const path = ev.composedPath().reverse();

  while (path.length) {
    const node: Node | null = path.pop() as Node;

    if (matchesSelector(node, selector)) {
      return true;
    }

    if (node === baseNode) {
      return false;
    }
  }

  return false;
};

const isFunction = (func: any): boolean => {
  return (
    typeof func === "function" ||
    Object.prototype.toString.call(func) === "[object Function]"
  );
};
